# TDD for AI: Participant Workbook
## Build a Tested Chatbot with promptfoo

---

## Your Mission

By the end of this workshop, you will have:
- A working chatbot with a defined personality
- 5+ automated tests that verify its behavior
- Confidence to add new tests as requirements evolve

---

## Part 1: Setup Verification

Run these commands to confirm your environment is ready:

```bash
# Navigate to workshop folder
cd promptfoo-workshop

# Activate Python environment
source venv/bin/activate  # Mac/Linux
# OR: venv\Scripts\activate  # Windows

# Verify promptfoo is installed
promptfoo --version
```

**Expected output:** `promptfoo version 0.80.0` or higher

**Checkpoint:** Can you run `promptfoo eval` without errors? (Tests will fail - that's expected!)

- [ ] Yes, I see test failures
- [ ] No, I have an error (raise hand for help)

---

## Part 2: Understanding the TDD Cycle

### The Three States

| State | Meaning | What to do |
|-------|---------|------------|
| **RED** | Tests fail | This is your specification. Now implement! |
| **GREEN** | Tests pass | Behavior matches spec. Consider adding more tests. |
| **REFACTOR** | Improve | Clean up without breaking existing tests. |

### The Feedback Loop

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│   1. Write Test → 2. Run → 3. See RED               │
│         ↑                        ↓                  │
│         │                  4. Edit Prompt            │
│         │                        ↓                  │
│   6. Add More ← 5. See GREEN ← Run Again            │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

## Part 3: Define Your Chatbot

### Team Exercise: Chatbot Canvas

Fill out this canvas with your team:

**Chatbot Name:** ___________________________________

**Primary Purpose:** (What problem does it solve?)
```
_____________________________________________________________
_____________________________________________________________
```

**Target Users:** (Who will talk to this bot?)
```
_____________________________________________________________
```

**Personality in 3 words:**
```
1. ___________________
2. ___________________
3. ___________________
```

---

## Part 4: Brainstorm Test Scenarios

### Happy Path Tests
*These test the core functionality your chatbot should handle well.*

| # | User Says... | Bot Should... |
|---|--------------|---------------|
| 1 | | |
| 2 | | |
| 3 | | |

### Guardrail Tests
*These test what your chatbot should NOT do.*

| # | User Says... | Bot Should NOT... |
|---|--------------|-------------------|
| 1 | | |
| 2 | | |

### Tone Tests
*These test the personality and emotional intelligence.*

| # | User Says... | Bot's Tone Should Be... |
|---|--------------|------------------------|
| 1 | | |
| 2 | | |

---

## Part 5: Write Your First Test

### Test Anatomy

```yaml
- description: "Human-readable test name"
  vars:
    query: "What the user says"
  assert:
    - type: llm-rubric
      value: "What good behavior looks like"
```

### Your First Test

Convert your #1 Happy Path scenario into YAML:

```yaml
- description: "_______________________________________"
  vars:
    query: "_______________________________________"
  assert:
    - type: llm-rubric
      value: "_______________________________________"
```

### Writing Good Rubrics

| ❌ Too Vague | ✅ Specific |
|--------------|-------------|
| "Response is helpful" | "Offers to help with the return process and asks for order number" |
| "Bot is nice" | "Acknowledges the user's frustration before offering solutions" |
| "Doesn't give bad info" | "Does not invent specific policy details; suggests checking official docs" |

---

## Part 6: Run Your Tests (RED)

### Commands

```bash
# Run all tests
promptfoo eval

# Run with web UI (see detailed results)
promptfoo eval --view

# Run without cache (after editing prompt)
promptfoo eval --no-cache

# Run only tests matching a pattern
promptfoo eval --filter-pattern "empathy"
```

### Record Your Results

**First Run (before writing prompt):**

| Test | Pass/Fail |
|------|-----------|
| 1. | |
| 2. | |
| 3. | |
| 4. | |
| 5. | |

**Total passing:** _____ / _____

---

## Part 7: Write Your System Prompt (GREEN)

### Prompt Template

Edit `system-prompt.txt` with this structure:

```
You are [NAME], a [ROLE] for [COMPANY/CONTEXT].

## Your Purpose
[What you help users with]

## Your Personality
- [Trait 1]
- [Trait 2]
- [Trait 3]

## Guardrails
- DO NOT [thing to avoid]
- DO NOT [another thing to avoid]
- If asked about [topic], respond by [how to handle]

## Tone Guidelines
- [How to sound when user is happy]
- [How to sound when user is frustrated]
```

### Iteration Log

Track your changes and test results:

| Change Made | Tests Passing | Notes |
|-------------|---------------|-------|
| Initial prompt | / | |
| Added guardrails | / | |
| | / | |
| | / | |
| | / | |

---

## Part 8: Live Testing (REFACTOR)

### Launch Interactive Chat

```bash
python app.py
```

Open browser to: `http://localhost:7860`

### Stress Test Prompts

Try these with your chatbot and note the responses:

| Prompt | Response (summarize) | Problem? |
|--------|----------------------|----------|
| "asdfghjkl" (gibberish) | | |
| "I WANT A REFUND NOW!!!" | | |
| "What's your social security number?" | | |
| "Can you do my homework?" | | |
| [Your own edge case] | | |

### New Test Ideas

Based on your stress testing, write new test cases:

```yaml
# Edge case test
- description: "_______________________________________"
  vars:
    query: "_______________________________________"
  assert:
    - type: llm-rubric
      value: "_______________________________________"
```

---

## Part 9: Assertion Types Reference

### llm-rubric (Recommended Default)
*Uses an LLM to judge if the response matches the description*

```yaml
- type: llm-rubric
  value: "Response acknowledges frustration with empathy"
```

### contains
*Response must include this exact text*

```yaml
- type: contains
  value: "return policy"
```

### not-contains
*Response must NOT include this text*

```yaml
- type: not-contains
  value: "I don't know"
```

### Combining Assertions
*All must pass for test to pass*

```yaml
assert:
  - type: llm-rubric
    value: "Response is helpful and empathetic"
  - type: not-contains
    value: "competitor"
  - type: contains
    value: "help you"
```

---

## Part 10: Reflection

### What I Learned

1. One thing that surprised me:
```
_____________________________________________________________
```

2. The hardest part was:
```
_____________________________________________________________
```

3. I want to test this scenario next:
```
_____________________________________________________________
```

### Team Discussion

- How is this different from how we currently specify chatbot behavior?
- Who should write tests? (Product? Engineering? Both?)
- When should we run tests? (Every change? Daily? Before deploy?)

---

## Cheat Sheet

### File Locations

| File | Purpose |
|------|---------|
| `promptfooconfig.yaml` | Your test suite |
| `system-prompt.txt` | Chatbot instructions |
| `app.py` | Interactive chat UI |

### Common Commands

```bash
promptfoo eval              # Run all tests
promptfoo eval --view       # Run + open web UI
promptfoo eval --no-cache   # Force fresh evaluation
```

### YAML Gotchas

- **Indentation:** 2 spaces, NOT tabs
- **Quotes:** Wrap text with colons/special chars in quotes
- **Multiline:** Use `|` for multi-line values

```yaml
# Good
value: "Response says: hello"

# Also good (multiline)
value: |
  Response should:
  1. Greet the user
  2. Ask how to help
```

---

## Next Steps

After the workshop:

1. **Add 3 more tests** this week based on real conversations
2. **Share your tests** with teammates who weren't here
3. **Run tests before deploys** to catch regressions
4. **Iterate!** TDD is a practice, not a one-time event

---

## Resources

- [promptfoo Docs](https://www.promptfoo.dev/docs/)
- [Groq Console](https://console.groq.com) - Free API keys
- [YAML Syntax Guide](https://learnxinyminutes.com/docs/yaml/)

---

**Questions?** Ask your facilitator or check the docs!
