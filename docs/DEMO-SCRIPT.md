# Live Demo Script
## TDD Feedback Loop with promptfoo

This script walks through a complete RED → GREEN → REFACTOR cycle for live demonstration.

---

## Setup Before Demo

```bash
# Ensure you're in a clean state
cd /path/to/promptfoo-workshop

# Clear the system prompt (to show RED state)
echo "" > system-prompt.txt

# Activate environment
source venv/bin/activate
```

---

## Demo Part 1: The RED State

### Talking Points

> "Let's start with an empty prompt. Our tests define what we WANT the chatbot to do.
> Watch what happens when we run tests against... nothing."

### Commands

```bash
# Show the empty prompt
cat system-prompt.txt

# Run tests
promptfoo eval
```

### Expected Output

```
Running evaluation...

┌─────────────────────────────────────────────────────────────────────────┐
│ promptfooconfig.yaml                                                    │
├─────────────────────────────────────────────────────────────────────────┤
│ Test                                │ groq:llama-3.3-70b-versatile     │
├─────────────────────────────────────┼───────────────────────────────────┤
│ Responds to greeting                │ ❌ FAIL                          │
│ Handles primary use case            │ ❌ FAIL                          │
│ Declines off-topic requests         │ ❌ FAIL                          │
│ Admits limitations                  │ ❌ FAIL                          │
│ Shows empathy                       │ ❌ FAIL                          │
│ Maintains appropriate tone          │ ❌ FAIL                          │
└─────────────────────────────────────┴───────────────────────────────────┘

Ran 6 tests in 4.2s

6 failed
```

### Talking Points

> "Everything is RED. That's CORRECT!
>
> This isn't a bug - it's a feature. We've defined our specification,
> and the chatbot doesn't meet it yet.
>
> RED tells us: 'Here's what you need to build.'"

---

## Demo Part 2: Minimal GREEN

### Talking Points

> "Now let's write the simplest possible prompt and see what happens."

### Commands

```bash
# Write minimal prompt
cat > system-prompt.txt << 'EOF'
You are a helpful assistant.
EOF

# Run tests again
promptfoo eval --no-cache
```

### Expected Output

```
┌─────────────────────────────────────┬───────────────────────────────────┐
│ Responds to greeting                │ ✅ PASS                          │
│ Handles primary use case            │ ✅ PASS                          │
│ Declines off-topic requests         │ ❌ FAIL                          │
│ Admits limitations                  │ ❌ FAIL                          │
│ Shows empathy                       │ ❌ FAIL                          │
│ Maintains appropriate tone          │ ✅ PASS                          │
└─────────────────────────────────────┴───────────────────────────────────┘

3 passed, 3 failed
```

### Talking Points

> "Look! 3 tests now pass. We're making progress!
>
> But 3 still fail. What are they testing?
> - 'Declines off-topic requests' - our generic assistant will talk about anything
> - 'Admits limitations' - it might make things up
> - 'Shows empathy' - we haven't told it to be empathetic
>
> Let's fix them one at a time."

---

## Demo Part 3: Iterative Improvement

### Talking Points

> "TDD means small changes, frequent tests. Let's tackle the guardrails first."

### Commands

```bash
# Add guardrails to prompt
cat > system-prompt.txt << 'EOF'
You are a helpful customer support assistant for Acme Co.

Help customers with returns, orders, and product questions.

GUARDRAILS:
- Stay focused on customer support topics
- If asked about unrelated topics (politics, opinions, etc.), politely redirect
- If you don't know specific details, say so - don't make things up
EOF

# Run tests
promptfoo eval --no-cache
```

### Expected Output

```
┌─────────────────────────────────────┬───────────────────────────────────┐
│ Responds to greeting                │ ✅ PASS                          │
│ Handles primary use case            │ ✅ PASS                          │
│ Declines off-topic requests         │ ✅ PASS                          │
│ Admits limitations                  │ ✅ PASS                          │
│ Shows empathy                       │ ❌ FAIL                          │
│ Maintains appropriate tone          │ ✅ PASS                          │
└─────────────────────────────────────┴───────────────────────────────────┘

5 passed, 1 failed
```

### Talking Points

> "5 of 6! One more to go: empathy.
>
> Let's look at what the test expects..."

### Commands

```bash
# Run with view to see details
promptfoo eval --view --filter-pattern "empathy"
```

> "The rubric says: 'Acknowledges the user's frustration with empathy before offering solutions'
>
> Let's add that to our prompt."

```bash
# Add empathy instructions
cat > system-prompt.txt << 'EOF'
You are a helpful customer support assistant for Acme Co.

Help customers with returns, orders, and product questions.

TONE:
- Be warm and professional
- When users express frustration, acknowledge their feelings FIRST
- Show empathy before jumping to solutions

GUARDRAILS:
- Stay focused on customer support topics
- If asked about unrelated topics (politics, opinions, etc.), politely redirect
- If you don't know specific details, say so - don't make things up
EOF

# Final test run
promptfoo eval --no-cache
```

### Expected Output

```
┌─────────────────────────────────────┬───────────────────────────────────┐
│ Responds to greeting                │ ✅ PASS                          │
│ Handles primary use case            │ ✅ PASS                          │
│ Declines off-topic requests         │ ✅ PASS                          │
│ Admits limitations                  │ ✅ PASS                          │
│ Shows empathy                       │ ✅ PASS                          │
│ Maintains appropriate tone          │ ✅ PASS                          │
└─────────────────────────────────────┴───────────────────────────────────┘

✅ All 6 tests passed!
```

### Talking Points

> "ALL GREEN!
>
> We now have a chatbot that:
> 1. Greets users warmly
> 2. Helps with their problems
> 3. Stays on topic
> 4. Admits when it doesn't know
> 5. Shows empathy
> 6. Maintains professional tone
>
> And we have PROOF - automated tests that verify all of this."

---

## Demo Part 4: The REFACTOR Phase

### Talking Points

> "But wait - are we done? Let's stress test with real conversations."

### Commands

```bash
# Launch interactive chat
python app.py
```

### Live Testing Prompts

Try these in the Gradio interface:

1. **"asdfghjkl"** (gibberish)
   > "Hmm, how does it handle nonsense input?"

2. **"GIVE ME A REFUND RIGHT NOW!!!"** (angry customer)
   > "Does empathy still work when they're REALLY upset?"

3. **"What's your return policy? How many days do I have?"** (specific question)
   > "Watch closely - does it make up a specific number?"

### Talking Points (if bot makes up policy)

> "Interesting! It said '30 days' but we never told it our return policy.
>
> This is a problem - it's making things up!
>
> Let's add a test to catch this."

### Add New Test

```bash
# Stop the Gradio app (Ctrl+C)

# Add new test to promptfooconfig.yaml
cat >> promptfooconfig.yaml << 'EOF'

  # New test from live testing
  - description: "Doesn't invent policy details"
    vars:
      query: "How many days do I have to return something?"
    assert:
      - type: llm-rubric
        value: "Does not state a specific number of days; suggests checking official policy"
EOF

# Run tests - this should fail!
promptfoo eval --no-cache
```

### Expected Output

```
┌─────────────────────────────────────┬───────────────────────────────────┐
│ ... (previous tests)                │ ✅ PASS                          │
│ Doesn't invent policy details       │ ❌ FAIL                          │
└─────────────────────────────────────┴───────────────────────────────────┘

6 passed, 1 failed
```

### Talking Points

> "We found a bug through exploratory testing, wrote a test for it,
> and now we're back in RED.
>
> This is the REFACTOR phase: we discovered new requirements
> and captured them as tests.
>
> Now we fix the prompt and go back to GREEN."

### Fix and Verify

```bash
# Update prompt
cat > system-prompt.txt << 'EOF'
You are a helpful customer support assistant for Acme Co.

Help customers with returns, orders, and product questions.

TONE:
- Be warm and professional
- When users express frustration, acknowledge their feelings FIRST
- Show empathy before jumping to solutions

GUARDRAILS:
- Stay focused on customer support topics
- If asked about unrelated topics (politics, opinions, etc.), politely redirect
- If you don't know specific details, say so - don't make things up
- NEVER invent specific policy details (prices, days, percentages)
- For policy questions, offer to help them find the right information
EOF

# Run all tests
promptfoo eval --no-cache
```

### Final Output

```
✅ All 7 tests passed!
```

---

## Key Demo Moments

### Moment 1: RED is Good
When all tests fail initially, emphasize that this is the specification working correctly.

### Moment 2: Incremental Progress
Show the test count going from 0 → 3 → 5 → 6 passing. Each iteration adds confidence.

### Moment 3: Tests Catch Regressions
If you have time, show what happens if you remove a line from the prompt - previously passing tests fail!

### Moment 4: Tests Document Decisions
Point out that the YAML file is now documentation:
> "Anyone on the team can read these tests and understand what the bot should do."

---

## Backup: Pre-Recorded Screenshots

If live demo fails, show these screenshots in order:

1. `screenshots/01-red-all-fail.png` - Initial state
2. `screenshots/02-partial-green.png` - After minimal prompt
3. `screenshots/03-all-green.png` - After full prompt
4. `screenshots/04-new-test-red.png` - After adding edge case test
5. `screenshots/05-final-green.png` - After fixing edge case

---

## Time Estimates

| Section | Duration |
|---------|----------|
| Part 1: RED State | 3 min |
| Part 2: Minimal GREEN | 3 min |
| Part 3: Iterative Improvement | 5 min |
| Part 4: REFACTOR | 5 min |
| **Total** | **~15 min** |

---

## Troubleshooting During Demo

### "API key not found"
```bash
export GROQ_API_KEY="your-key-here"
```

### "Rate limit exceeded"
Wait 60 seconds, or switch to backup provider in config.

### "Tests are flaky"
Run with `--repeat 2` to show it passes consistently.

### "Gradio won't start"
Port might be in use. Try:
```bash
python app.py --port 7861
```
