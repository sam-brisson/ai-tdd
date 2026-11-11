#!/usr/bin/env node
/**
 * Module 2 Precheck Utility
 *
 * Run this before starting the AI TDD module to verify:
 * 1. GROQ_API_KEY is set
 * 2. API connection works
 * 3. Selected models are available
 * 4. Rate limits are acceptable
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Load .env file if it exists
function loadEnvFile() {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const match = line.match(/^([^#=]+)=(.*)$/);
      if (match && !process.env[match[1].trim()]) {
        process.env[match[1].trim()] = match[2].trim();
      }
    });
    return true;
  }
  return false;
}

const envFileExists = loadEnvFile();
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const TARGET_MODEL = 'openai/gpt-oss-20b';
const GRADING_MODEL = 'openai/gpt-oss-120b';

// Colors for terminal output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(symbol, color, message) {
  console.log(`${color}${symbol}${colors.reset} ${message}`);
}

function pass(message) { log('✓', colors.green, message); }
function fail(message) { log('✗', colors.red, message); }
function warn(message) { log('!', colors.yellow, message); }
function info(message) { log('→', colors.blue, message); }

async function checkApiKey() {
  console.log(`\n${colors.bold}1. Checking GROQ_API_KEY...${colors.reset}`);

  if (!GROQ_API_KEY) {
    fail('GROQ_API_KEY environment variable is not set');
    if (!envFileExists) {
      info('No .env file found');
      info('Copy .env.example to .env and add your key:');
      info('  cp .env.example .env');
    }
    info('Set it with: export GROQ_API_KEY=your-api-key');
    info('Get a free key at: https://console.groq.com');
    return false;
  }

  if (GROQ_API_KEY.length < 20) {
    fail('GROQ_API_KEY appears to be invalid (too short)');
    return false;
  }

  const source = envFileExists ? '(from .env file)' : '(from environment)';
  pass(`GROQ_API_KEY is set ${source} (${GROQ_API_KEY.substring(0, 8)}...)`);
  return true;
}

function makeRequest(path, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.groq.com',
      path: `/openai/v1${path}`,
      method,
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, data: { raw: data } });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function checkApiConnection() {
  console.log(`\n${colors.bold}2. Testing API connection...${colors.reset}`);

  try {
    const response = await makeRequest('/models');

    if (response.status === 401) {
      fail('API key is invalid or expired');
      info('Get a new key at: https://console.groq.com');
      return { success: false, models: [] };
    }

    if (response.status !== 200) {
      fail(`API returned status ${response.status}`);
      return { success: false, models: [] };
    }

    const models = response.data.data || [];
    pass(`Connected to Groq API (${models.length} models available)`);
    return { success: true, models };
  } catch (error) {
    fail(`Connection failed: ${error.message}`);
    return { success: false, models: [] };
  }
}

async function checkModels(availableModels) {
  console.log(`\n${colors.bold}3. Checking model availability...${colors.reset}`);

  const modelIds = availableModels.map(m => m.id);
  let allGood = true;

  // Check target model
  if (modelIds.includes(TARGET_MODEL)) {
    pass(`Target model available: ${TARGET_MODEL}`);
  } else {
    fail(`Target model not found: ${TARGET_MODEL}`);
    info('Available models with "gpt" or "llama":');
    modelIds.filter(m => m.includes('gpt') || m.includes('llama'))
      .slice(0, 5)
      .forEach(m => info(`  - ${m}`));
    allGood = false;
  }

  // Check grading model
  if (modelIds.includes(GRADING_MODEL)) {
    pass(`Grading model available: ${GRADING_MODEL}`);
  } else {
    fail(`Grading model not found: ${GRADING_MODEL}`);
    allGood = false;
  }

  return allGood;
}

async function checkRateLimits() {
  console.log(`\n${colors.bold}4. Testing rate limits with sample request...${colors.reset}`);

  try {
    const response = await makeRequest('/chat/completions', 'POST', {
      model: TARGET_MODEL,
      messages: [
        { role: 'user', content: 'Say "hello" and nothing else.' }
      ],
      max_tokens: 10
    });

    if (response.status === 200) {
      const reply = response.data.choices?.[0]?.message?.content || '';
      pass(`Model responded: "${reply.trim()}"`);

      // Check usage
      const usage = response.data.usage;
      if (usage) {
        info(`Token usage: ${usage.prompt_tokens} prompt + ${usage.completion_tokens} completion`);
      }
      return true;
    }

    if (response.status === 429) {
      warn('Rate limit hit on test request');
      info('This is normal on free tier - tests will retry automatically');
      info('Consider upgrading at: https://console.groq.com/settings/billing');
      return true; // Not a failure, just a warning
    }

    fail(`Unexpected response: ${response.status}`);
    if (response.data.error) {
      info(`Error: ${response.data.error.message}`);
    }
    return false;
  } catch (error) {
    fail(`Request failed: ${error.message}`);
    return false;
  }
}

async function checkPromptfooConfig() {
  console.log(`\n${colors.bold}5. Checking promptfoo configuration...${colors.reset}`);

  const configPath = path.join(__dirname, 'promptfooconfig.yaml');
  const promptPath = path.join(__dirname, 'system-prompt.txt');

  let allGood = true;

  if (fs.existsSync(configPath)) {
    pass('promptfooconfig.yaml exists');

    const config = fs.readFileSync(configPath, 'utf8');
    if (config.includes('maxConcurrency: 1')) {
      pass('Concurrency set to 1 (good for free tier rate limits)');
    } else if (config.includes('maxConcurrency')) {
      warn('Concurrency > 1 may cause rate limit issues on free tier');
    }
  } else {
    fail('promptfooconfig.yaml not found');
    allGood = false;
  }

  if (fs.existsSync(promptPath)) {
    pass('system-prompt.txt exists');
  } else {
    fail('system-prompt.txt not found');
    allGood = false;
  }

  return allGood;
}

async function main() {
  console.log(`${colors.bold}${colors.blue}`);
  console.log('╔═══════════════════════════════════════════╗');
  console.log('║   Module 2: AI TDD Precheck Utility       ║');
  console.log('╚═══════════════════════════════════════════╝');
  console.log(colors.reset);

  let allPassed = true;

  // Step 1: Check API key
  if (!await checkApiKey()) {
    console.log(`\n${colors.red}${colors.bold}Precheck failed. Please set GROQ_API_KEY and try again.${colors.reset}\n`);
    process.exit(1);
  }

  // Step 2: Test API connection
  const { success: apiWorks, models } = await checkApiConnection();
  if (!apiWorks) {
    console.log(`\n${colors.red}${colors.bold}Precheck failed. Cannot connect to Groq API.${colors.reset}\n`);
    process.exit(1);
  }

  // Step 3: Check models
  if (!await checkModels(models)) {
    allPassed = false;
  }

  // Step 4: Test rate limits
  if (!await checkRateLimits()) {
    allPassed = false;
  }

  // Step 5: Check config files
  if (!await checkPromptfooConfig()) {
    allPassed = false;
  }

  // Summary
  console.log(`\n${colors.bold}${'─'.repeat(45)}${colors.reset}`);

  if (allPassed) {
    console.log(`${colors.green}${colors.bold}`);
    console.log('✓ All checks passed! Ready to start Module 2.');
    console.log(colors.reset);
    console.log('Next steps:');
    console.log('  1. Run tests:    npm test');
    console.log('  2. View results: npm run view');
    console.log('');
  } else {
    console.log(`${colors.yellow}${colors.bold}`);
    console.log('! Some checks had warnings. Module may still work.');
    console.log(colors.reset);
    console.log('Review the issues above before proceeding.\n');
  }
}

main().catch(err => {
  console.error(`${colors.red}Unexpected error: ${err.message}${colors.reset}`);
  process.exit(1);
});
