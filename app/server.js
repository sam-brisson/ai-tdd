#!/usr/bin/env node
/**
 * Simple Express server for the Thanksgiving Dinner Planner
 *
 * Serves static files and proxies AI requests to Groq API
 * so we don't expose the API key in the browser.
 */

const express = require('express');
const path = require('path');
const fs = require('fs');

// Load .env from module 02-ai-tdd
const envPath = path.join(__dirname, '..', 'modules', '02-ai-tdd', '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match && !process.env[match[1].trim()]) {
      process.env[match[1].trim()] = match[2].trim();
    }
  });
}

const app = express();
const DEFAULT_PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(__dirname));

// Load the system prompt from module 02
function getSystemPrompt() {
  const promptPath = path.join(__dirname, '..', 'modules', '02-ai-tdd', 'system-prompt.txt');
  if (fs.existsSync(promptPath)) {
    return fs.readFileSync(promptPath, 'utf8');
  }
  return 'You are a helpful sommelier. Suggest drink pairings for the given menu.';
}

// API endpoint for drink pairing suggestions
app.post('/api/suggest-pairings', async (req, res) => {
  const { dishes, restrictions } = req.body;

  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({
      error: 'GROQ_API_KEY not configured',
      message: 'Please set up your API key in modules/02-ai-tdd/.env'
    });
  }

  if (!dishes || dishes.length === 0) {
    return res.status(400).json({
      error: 'No dishes provided',
      message: 'Please add at least one dish to get pairing suggestions'
    });
  }

  const systemPrompt = getSystemPrompt();
  const menuText = dishes.join(', ');

  let userMessage = `Menu: ${menuText}`;
  if (restrictions) {
    userMessage += `\nDietary notes: ${restrictions}`;
  }
  userMessage += '\n\nPlease suggest drink pairings for this meal.';

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-20b',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        max_tokens: 1000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Groq API error:', error);
      return res.status(response.status).json({
        error: 'AI service error',
        message: error.error?.message || 'Failed to get pairing suggestions'
      });
    }

    const data = await response.json();
    const suggestion = data.choices?.[0]?.message?.content || 'No suggestions available';

    res.json({ suggestion });
  } catch (error) {
    console.error('Request error:', error);
    res.status(500).json({
      error: 'Request failed',
      message: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: !!process.env.GROQ_API_KEY,
    systemPromptLoaded: fs.existsSync(path.join(__dirname, '..', 'modules', '02-ai-tdd', 'system-prompt.txt'))
  });
});

// Get system prompt endpoint
app.get('/api/system-prompt', (req, res) => {
  const prompt = getSystemPrompt();
  res.json({ prompt });
});

// Try to start server, fall back to next port if in use
function startServer(port) {
  const server = app.listen(port)
    .on('listening', () => {
      const apiKeyStatus = process.env.GROQ_API_KEY ? '✓ Loaded from .env' : '✗ Not found';
      const promptStatus = fs.existsSync(path.join(__dirname, '..', 'modules', '02-ai-tdd', 'system-prompt.txt')) ? '✓ Loaded' : '✗ Not found';
      const portStr = String(port).padEnd(4);

      console.log(`
╔═══════════════════════════════════════════════════════════╗
║   Thanksgiving Dinner Planner                             ║
║   http://localhost:${portStr}                                  ║
╠═══════════════════════════════════════════════════════════╣
║   API Key: ${apiKeyStatus.padEnd(20)}                       ║
║   System Prompt: ${promptStatus.padEnd(15)}                             ║
╚═══════════════════════════════════════════════════════════╝
      `);
    })
    .on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`Port ${port} in use, trying ${port + 1}...`);
        startServer(port + 1);
      } else {
        console.error('Server error:', err);
        process.exit(1);
      }
    });
}

startServer(DEFAULT_PORT);
