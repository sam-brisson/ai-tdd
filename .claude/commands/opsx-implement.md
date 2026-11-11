# OpenSpec: Implement Feature

You are helping a workshop participant implement a feature to make failing tests pass.

## Your Task

Implement the minimum code needed to make the RED tests turn GREEN.

### Step 1: Identify Failing Tests

First, understand what's failing:

**Playwright:**
```bash
cd modules/01-deterministic-tdd && npm test 2>&1 | grep -A 5 "FAIL\|Error"
```

**promptfoo:**
```bash
cd modules/02-ai-tdd && promptfoo eval 2>&1 | grep -A 3 "FAIL\|❌"
```

### Step 2: Read the Spec

Understand what the test expects:
```bash
cat openspec/changes/$ARGUMENTS/tasks.md
```

### Step 3: Implement the Minimum

**For Deterministic Features:**
- Edit `app/index.html`
- Add only what's needed to pass the test
- Don't over-engineer

**For AI Features:**
- Edit `modules/02-ai-tdd/system-prompt.txt`
- Add instructions that will make the LLM behave correctly
- Be specific and clear

### Step 4: Run Tests Again

Verify GREEN:

**Playwright:**
```bash
cd modules/01-deterministic-tdd && npm test
```

**promptfoo:**
```bash
cd modules/02-ai-tdd && promptfoo eval
```

## Guidelines

- Implement the MINIMUM needed to pass
- Don't add extra features
- Don't refactor yet (that's the next step)
- If tests still fail, read the error carefully

After implementation, tell the participant:
> "Implementation complete! Tests should now pass.
>
> If GREEN: Great! Consider if any refactoring would help.
> If still RED: Let's look at the specific failure and fix it."
