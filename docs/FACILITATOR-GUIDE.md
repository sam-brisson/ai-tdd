# Chatbot Workshop Facilitator Guide
## OpenSpec + TDD for AI

**Duration:** 4-5 hours
**Audience:** Cross-functional teams (Product, Engineering, Design)
**Core Tools:** OpenSpec (specifications) + promptfoo (testing)

---

## Workshop Overview

This workshop teaches the **full workflow from specification to tested implementation**:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          WORKSHOP FLOW                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Phase 0: Setup          Phase 1: Discover       Phase 1.5: Spec        │
│  ─────────────          ───────────────          ─────────────          │
│  Environment +          Choose scenario,         Create OpenSpec        │
│  Philosophy             brainstorm behaviors     change folder          │
│                                                                         │
│         │                      │                        │               │
│         ▼                      ▼                        ▼               │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                                                                  │   │
│  │  Phase 2: Specify (RED)    Phase 3: Implement (GREEN)           │   │
│  │  ──────────────────────    ─────────────────────────            │   │
│  │  Derive tests from         Write system prompt to               │   │
│  │  tasks.md acceptance       make tests pass                      │   │
│  │  criteria                                                       │   │
│  │                                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│         │                                                               │
│         ▼                                                               │
│  Phase 4: Refine (REFACTOR)   Phase 5: Demo & Reflect                  │
│  ─────────────────────────    ────────────────────────                  │
│  Add edge cases,              Share learnings,                          │
│  update tasks.md              trace tests to specs                      │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Key insight:** Tests don't come from thin air. They're derived from specifications.

### Learning Objectives

By the end, participants will:
- Create OpenSpec artifacts (proposal.md, tasks.md)
- Derive test cases from acceptance criteria
- Understand the TDD cycle: RED → GREEN → REFACTOR
- Write behavioral tests using `llm-rubric` assertions
- Interpret promptfoo evaluation output
- Iterate on system prompts based on test feedback
- Trace tests back to specifications

### Success Metrics

- All teams create an OpenSpec change folder
- Tests are explicitly derived from tasks.md acceptance criteria
- All teams have 5+ passing tests
- Tests cover happy paths, guardrails, and tone
- Teams can explain "spec → test → implementation" flow

---

## Pre-Workshop Checklist

### 1 Week Before

- [ ] Send setup instructions to participants
- [ ] Confirm all participants have Groq API keys
- [ ] Test the starter repo on multiple OS (Mac, Windows, Linux)
- [ ] Prepare example chatbot scenario (customer support recommended)
- [ ] Set up screen sharing for terminal demos

### Day Before

- [ ] Run through the full workshop yourself
- [ ] Test internet connectivity in workshop room
- [ ] Prepare backup: pre-recorded terminal output screenshots
- [ ] Print quick reference cards (YAML syntax, common commands)

### 1 Hour Before

- [ ] Clone starter repo to fresh directory for live demo
- [ ] Open terminal windows: one for demo, one for backup
- [ ] Test `promptfoo eval` runs successfully
- [ ] Have example system prompts ready to paste

---

## Workshop Phases

### Phase 0: Setup & Introduction (30 min)

**Goal:** Everyone has a working environment and understands the TDD philosophy.

#### Activities

**1. Environment Check (10 min)**
```bash
# Ask participants to run in their terminal:
cd promptfoo-workshop
source venv/bin/activate
promptfoo --version
```

Expected output: `promptfoo version 0.80.0+`

**Troubleshooting on the spot:**
- No promptfoo? → `pip install -r requirements.txt`
- No API key? → Share backup OpenRouter key for workshop
- Python issues? → Pair with neighbor who has working setup

**2. TDD Philosophy (10 min)**

**Demo Script:**
> "Traditional software: Write code, then test it.
> TDD: Write tests first, THEN make them pass.
>
> Why? Tests become your specification. If tests pass, you're done.
> No ambiguity, no 'it works on my machine.'"

**Show on screen:**
```
❌ RED   → Tests fail (expected behavior not met)
✅ GREEN → Tests pass (behavior matches spec)
♻️ REFACTOR → Improve without breaking tests
```

**3. The promptfoo Feedback Loop (10 min)**

**Live Terminal Demo:**

Open `promptfooconfig.yaml` side-by-side with terminal.

**Point to the file:**
> "This file defines our chatbot's specification. See these `tests` entries?
> Each one describes expected behavior."

**Run the first eval:**
```bash
promptfoo eval
```

**Pause on the output:**
```
┌─────────────────────────────────────────────────────────────┐
│ Evaluation Results                                          │
├─────────────────────────────────────────────────────────────┤
│ Test 1: "Responds to greeting"              ❌ FAIL         │
│ Test 2: "Handles primary use case"          ❌ FAIL         │
│ Test 3: "Declines off-topic requests"       ❌ FAIL         │
│ Test 4: "Admits limitations"                ❌ FAIL         │
│ Test 5: "Shows empathy"                     ❌ FAIL         │
│ Test 6: "Maintains appropriate tone"        ❌ FAIL         │
└─────────────────────────────────────────────────────────────┘
```

**Explain:**
> "We're in RED. All tests fail. That's CORRECT!
> Our system-prompt.txt is empty. The chatbot has no instructions.
>
> Now watch: I'll write a minimal prompt and run tests again."

**Edit `system-prompt.txt`:**
```
You are a helpful assistant.
```

**Re-run:**
```bash
promptfoo eval
```

**New output:**
```
┌─────────────────────────────────────────────────────────────┐
│ Test 1: "Responds to greeting"              ✅ PASS         │
│ Test 2: "Handles primary use case"          ✅ PASS         │
│ Test 3: "Declines off-topic requests"       ❌ FAIL         │
│ Test 4: "Admits limitations"                ❌ FAIL         │
│ Test 5: "Shows empathy"                     ❌ FAIL         │
│ Test 6: "Maintains appropriate tone"        ❌ FAIL         │
└─────────────────────────────────────────────────────────────┘
```

**Explain:**
> "2 tests now pass! But 4 still fail.
> This feedback tells us EXACTLY what to fix next."

---

### Phase 1: Discover (45 min)

**Goal:** Teams explore the app and understand the two testing approaches.

**Format:** Whole group demo, then exploration in pairs

#### Activities

**1. Explore the Sample App (10 min)**

**Open the Thanksgiving Dinner Planner:**
```bash
cd modules/01-deterministic-tdd
npm run dev
# Opens http://localhost:3000
```

**Walk through the app features:**

| Feature | Test Framework | Where Tested |
|---------|----------------|--------------|
| **Guest Management** | Playwright (deterministic) | Module 1 |
| **Menu/Dish Management** | Playwright (deterministic) | Module 1 |
| **Drink Pairing Suggestions** | promptfoo (AI behavioral) | Module 2 |

**Facilitator tip:** Click "Suggest Pairings" to show the AI feature they'll be testing.

**2. Review the Drink Pairing Example (20 min)**

**Show the existing OpenSpec + test connection:**

Open side-by-side:
- `openspec/changes/drink-pairing-feature/tasks.md` (acceptance criteria)
- `modules/02-ai-tdd/promptfooconfig.yaml` (derived tests)

**Walk through the categories:**

| Category | Example Requirement | Example Test |
|----------|--------------------|--------------|
| **Happy Path** | "Suggests wine for turkey" | `llm-rubric: "Suggests a red wine..."` |
| **Guardrails** | "Stays on topic" | `llm-rubric: "Redirects off-topic..."` |
| **Tone** | "Uses accessible language" | `llm-rubric: "No pretentious wine terminology"` |

**Key insight:**
> "See how each test traces back to an acceptance criterion?
> The spec tells you WHAT to test. promptfoo validates it works."

**3. Run the Tests (15 min)**

```bash
cd modules/02-ai-tdd
export GROQ_API_KEY=your_key_here
promptfoo eval
```

**Show the output.** If system-prompt.txt is good, tests pass. If empty, they fail (RED state).

**Teams experiment:** Delete the system-prompt.txt content, run tests, see failures.

---

### Phase 1.5: Spec Your Change (30 min) - NEW

**Goal:** Extend the drink pairing feature with new requirements and tests.

This phase bridges exploration and implementation. Teams add new acceptance criteria to the existing spec and derive tests from them.

#### Why This Phase?

**Demo Script:**
> "You've seen how the drink pairing tests work.
> Now you'll add your own requirements.
>
> Maybe you want the AI to suggest dessert wines?
> Or handle guests who are pregnant?
> Or recommend specific pairings for vegan dishes?
>
> First, you'll add the requirement to tasks.md.
> Then, you'll derive a test from it."

#### Activities

**1. Review the Existing Spec (5 min)**

Open `openspec/changes/drink-pairing-feature/tasks.md` on screen.

**Point out the structure:**
> "See how each acceptance criterion has the actual test code right next to it?
> This is the connection: spec → test.
>
> Now you'll ADD a new requirement to this spec."

**2. Brainstorm New Requirements (10 min)**

Give teams this prompt:

```
What ELSE should the drink pairing assistant handle?

HAPPY PATH ideas:
- Dessert wine pairings?
- Champagne/sparkling for toasts?
- Pairings for specific cuisines (Southern, Mexican, etc.)?

GUARDRAIL ideas:
- Handle questions about underage drinking?
- Not recommend drinks that interact with medications?
- Handle pregnancy/breastfeeding considerations?

TONE ideas:
- Be extra reassuring for budget-conscious hosts?
- Handle cultural/religious considerations sensitively?
```

**Each team picks ONE new requirement to add.**

**3. Add to tasks.md (10 min)**

Teams add their requirement to the existing `tasks.md`:

```markdown
# Add under appropriate section:

- [ ] **[Your new requirement]**
  ```yaml
  - description: "[Test description]"
    vars:
      menu: "[Example menu]"
    assert:
      - type: llm-rubric
        value: "[What makes a good response]"
  ```
```

**Example:**
```markdown
- [ ] **Suggests dessert wines for pie**
  ```yaml
  - description: "Suggests dessert wine for pumpkin pie"
    vars:
      menu: "Pumpkin Pie, Apple Crisp"
    assert:
      - type: llm-rubric
        value: "Suggests a dessert wine (like late harvest Riesling or Moscato) for the sweet dishes"
  ```
```

**Key coaching:**
> "Notice you're writing the spec FIRST, before the test exists.
> The test will be derived from this requirement."

**4. Derive the Test (5 min)**

Teams copy their new requirement into `promptfooconfig.yaml`:
- Copy the YAML from tasks.md
- Paste into the appropriate section of promptfooconfig.yaml
- Run `promptfoo eval` to see it fail (RED)

**Role Guidance:**
- **Product:** Define what the feature MUST do (happy paths)
- **Design:** Define HOW it should feel (tone)
- **Engineering:** Define what it must NOT do (guardrails)

---

### Phase 2: Specify (RED) (45 min)

**Goal:** Derive promptfoo tests directly from tasks.md acceptance criteria.

**Key transition:**
> "You've written your specs. Now we DERIVE tests from them.
> Notice: you're not inventing tests. You're implementing your spec."

#### Activities

**1. From Spec to Test (10 min)**

**Show the connection:**

Open `openspec/changes/my-chatbot/tasks.md` side-by-side with `promptfooconfig.yaml`.

> "Your tasks.md says: 'Suggests wine for turkey'
> with rubric: 'Suggests a Pinot Noir or similar light red wine'
>
> That becomes this test:"

**Live Demo:** Open `promptfooconfig.yaml` and walk through one test:

```yaml
- description: "Helps with returns"
  vars:
    query: "I want to return my order"
  assert:
    - type: llm-rubric
      value: "Offers to help with the return process and asks for order details"
```

**Explain each part:**
- `description`: Human-readable name (shows up in test output)
- `vars.query`: What the user says
- `assert.type: llm-rubric`: Judge behavior, not exact wording
- `assert.value`: Describe GOOD behavior in plain English

**2. Derive Your First Test (15 min)**

**Exercise:** Teams copy their first acceptance criterion from tasks.md into promptfooconfig.yaml.

**Facilitator circulates and helps with:**
- YAML indentation (2 spaces, not tabs!)
- Making rubrics specific enough (not just "response is good")
- Avoiding exact string matching (use `llm-rubric`, not `contains`)

**Common mistake:**
```yaml
# ❌ Too vague
value: "Response is helpful"

# ✅ Specific
value: "Offers to help with the return process and asks for order details"
```

**3. Run Tests and Embrace RED (20 min)**

**Each team runs:**
```bash
promptfoo eval
```

**Expected result:** All tests FAIL (system-prompt.txt still empty)

**Facilitator emphasizes:**
> "RED is not bad! RED is your specification.
> These failures tell you exactly what you need to build."

**Optional:** Run with `--view` flag to open web UI:
```bash
promptfoo eval --view
```

Show teams how to click on failing tests to see:
- What the LLM actually responded
- Why the rubric grader failed it

---

### Phase 3: Implement (GREEN) (60 min)

**Goal:** Write system prompts that make tests pass.

#### Activities

**1. Write Minimal Prompt (20 min)**

**Live Demo First:**

Start with empty `system-prompt.txt`, run tests (all fail).

Then add minimal prompt:
```
You are a customer support assistant for Acme Co.

Help customers with returns, orders, and product questions.
Be friendly and professional.
```

Run tests again. Some pass! Some still fail.

**Show the feedback loop:**
```bash
# Edit system-prompt.txt
# Save
promptfoo eval --no-cache  # Force fresh eval
# Check results
# Repeat
```

**Then: Teams work independently**

**2. Iterate Based on Feedback (30 min)**

**Strategy:** Fix one failing test at a time.

**Example iteration:**

**Test fails:** "Declines off-topic requests"
**Failing output:** Chatbot discusses politics

**Fix in system-prompt.txt:**
```
GUARDRAILS:
- Do not discuss politics, religion, or competitors
- Politely redirect off-topic questions to how you can help
```

**Re-run:**
```bash
promptfoo eval --filter-pattern "off-topic"
```

Test now passes!

**Facilitator Tips:**
- Encourage small changes between test runs
- Remind teams: tests are the spec, not their intuition
- If stuck, use `--view` to see LLM's actual responses

**3. Reach GREEN (10 min)**

**Goal:** All 5+ tests passing.

When a team reaches all GREEN:
```
┌─────────────────────────────────────────────────────────────┐
│ ✅ All tests passed!                                        │
└─────────────────────────────────────────────────────────────┘
```

**Celebrate!** Ring a bell, give stickers, whatever.

Then ask:
> "Great! But is it done?
> Let's test it with REAL conversations."

---

### Phase 4: Refine (REFACTOR) (45 min)

**Goal:** Discover edge cases and add a new feature using the full OpenSpec → Test → Implement cycle.

#### Activities

**1. Interactive Testing (15 min)**

**Open the app:**
```bash
cd modules/01-deterministic-tdd
npm run dev
# Opens http://localhost:3000
```

**Exercise:** Add dishes and click "Suggest Pairings". Try edge cases:
- Empty menu (no dishes added)
- All desserts, no main course
- Unusual dishes ("Pizza", "Sushi")

**Take notes:** What would be helpful that the AI doesn't currently do?

**2. Identify a Missing Feature (5 min)**

**Common discovery:** After getting pairing suggestions, users often want to ask follow-up questions like:
- "What about a budget-friendly option?"
- "Do you have a white wine alternative?"
- "What pairs with the dessert specifically?"

**Facilitator prompt:**
> "The current app is one-shot: you get suggestions, that's it.
> What if the AI suggested follow-up questions you could click?
>
> Let's add this feature using OpenSpec!"

**3. Spec the Enhancement (10 min)**

**Teams add to `openspec/changes/drink-pairing-feature/tasks.md`:**

```markdown
## Follow-up Questions (Workshop Enhancement)

- [ ] **AI suggests follow-up questions**
  ```yaml
  - description: "Suggests clickable follow-up questions"
    vars:
      menu: "Turkey, Mashed Potatoes, Pumpkin Pie"
    assert:
      - type: llm-rubric
        value: "Includes 2-3 suggested follow-up questions the user could ask (e.g., about budget, alternatives, or specific dishes)"
  ```

- [ ] **Answers budget follow-up**
  ```yaml
  - description: "Handles budget question"
    vars:
      menu: "Turkey dinner"
      question: "What are some budget-friendly options?"
    assert:
      - type: llm-rubric
        value: "Suggests affordable wine/beer options, mentioning price range or value"
  ```
```

**4. Derive and Run Tests (10 min)**

**Copy tests to promptfooconfig.yaml** and run:

```bash
cd modules/02-ai-tdd
promptfoo eval --no-cache
```

**Expected:** New tests FAIL (RED) because system prompt doesn't mention follow-ups yet.

**5. Update System Prompt (5 min)**

**Add to system-prompt.txt:**
```
## Follow-up Questions
After your suggestions, offer 2-3 follow-up questions the user might want to ask, formatted as:

**Want to know more?**
- "What about a budget-friendly option?"
- "Any white wine alternatives?"
- "What pairs specifically with [dish]?"
```

**Run tests again:** New tests should PASS (GREEN).

**Key insight:**
> "You just completed the full cycle:
> Spec → Test (RED) → Implement (GREEN)
>
> The UI change (clickable buttons) would come next,
> but the AI behavior is already tested!"

---

### Phase 5: Demo & Reflect (30 min)

**Goal:** Share learnings and establish TDD habits.

#### Activities

**1. Team Demos (15 min)**

Each team shows (3 min each):
1. Their chatbot scenario
2. One interesting test case
3. Terminal output showing GREEN tests
4. Live chat demo (1-2 exchanges)

**Facilitator asks:**
> "What surprised you during testing?
> What behavior did you NOT expect?"

**2. Reflection Circle (10 min)**

**Discussion prompts:**

- "Before this workshop, how did you specify chatbot behavior?"
- "What's easier about TDD? What's harder?"
- "Who should write tests in your team?"
- "When would you run these tests? (After every change? Daily? Before deploy?)"

**3. Next Steps (5 min)**

**Give teams:**
- Link to starter repo
- Facilitator's contact for questions
- Suggested homework: "Add 3 more tests this week"

**Optional:** Set up Slack channel for sharing test cases

---

## Facilitator Talking Points

### On "Why not just test manually?"

> "You could! But:
> 1. Manual testing doesn't scale (what if you have 50 test cases?)
> 2. Manual testing is subjective (is this response 'empathetic enough'?)
> 3. Manual testing has no memory (did we already test this scenario?)
>
> Automated tests run in 30 seconds and never forget."

### On "Why RED first?"

> "If your tests pass BEFORE you write the prompt...
> your tests are useless.
>
> They're not actually checking anything!
>
> RED first proves your tests work."

### On "llm-rubric seems expensive"

> "Yes, each rubric test calls an LLM to grade your LLM.
> Cost per test: ~$0.0001-0.0005
> Running 10 tests: ~$0.005
>
> Compare that to one bad user experience..."

### On "What if tests are flaky?"

> "LLM tests can be non-deterministic.
> If a test fails 1/10 times, your rubric may be too strict.
>
> Solutions:
> - Make rubric more forgiving ('should generally...', 'typically...')
> - Use exact string matching for critical phrases
> - Run tests multiple times: `promptfoo eval --repeat 3`"

---

## Backup Plans

### If promptfoo is slow/breaks

**Fallback:** Use pre-captured screenshots of test output

**Prepare in advance:**
- Screenshot of failing tests (RED)
- Screenshot of passing tests (GREEN)
- Screenshot of mixed results (during iteration)

**Modified workshop flow:**
- Show screenshots instead of live demos
- Teams still edit `promptfooconfig.yaml` and `system-prompt.txt`
- Facilitator runs evals backstage and shares results

### If participants can't install locally

**Fallback:** Share a Replit or Google Colab workspace

**Prepare:**
- Fork the starter repo to Replit
- Pre-install dependencies
- Each team gets a unique Replit fork

### If teams finish early

**Bonus exercises:**

1. **Advanced Assertions:**
   ```yaml
   assert:
     - type: llm-rubric
       value: "Response is empathetic"
     - type: contains
       value: "return policy"
     - type: not-contains
       value: "I don't know"
   ```

2. **Compare Models:**
   Add a second provider and compare results:
   ```yaml
   providers:
     - groq:llama-3.3-70b-versatile
     - openai:gpt-4o-mini
   ```

---

## Quick Reference Card

Print and distribute to participants:

```
┌─────────────────────────────────────────────────┐
│  PROMPTFOO QUICK REFERENCE                      │
├─────────────────────────────────────────────────┤
│                                                 │
│  Run tests:     promptfoo eval                  │
│  With web UI:   promptfoo eval --view           │
│  No cache:      promptfoo eval --no-cache       │
│  Filter:        promptfoo eval --filter "name"  │
│                                                 │
├─────────────────────────────────────────────────┤
│  TEST STRUCTURE                                 │
│                                                 │
│  - description: "Test name"                     │
│    vars:                                        │
│      query: "User input"                        │
│    assert:                                      │
│      - type: llm-rubric                         │
│        value: "Expected behavior"               │
│                                                 │
├─────────────────────────────────────────────────┤
│  ASSERTION TYPES                                │
│                                                 │
│  llm-rubric    → Behavioral (recommended)       │
│  contains      → Must include text              │
│  not-contains  → Must NOT include text          │
│  javascript    → Custom JS evaluation           │
│                                                 │
├─────────────────────────────────────────────────┤
│  TDD CYCLE                                      │
│                                                 │
│  ❌ RED   → Write failing test                  │
│  ✅ GREEN → Make it pass                        │
│  ♻️ REFACTOR → Add edge cases                   │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## Resources

- [OpenSpec Workflow](../openspec/README.md) - How specs become tests
- [OpenSpec Example: Drink Pairing](../openspec/changes/drink-pairing-feature/) - AI feature spec
- [OpenSpec Example: Guest Management](../openspec/changes/guest-management-feature/) - Deterministic spec
- [promptfoo Documentation](https://www.promptfoo.dev/docs/)
- [Groq API Console](https://console.groq.com) - Free API keys
- [Workshop Participant Workbook](./PARTICIPANT-WORKBOOK.md)
- [Demo Script](./DEMO-SCRIPT.md)

---

## Quick Reference: OpenSpec + TDD Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  1. CREATE OPENSPEC FOLDER                                              │
│     mkdir -p openspec/changes/my-chatbot                                │
│                                                                         │
│  2. WRITE PROPOSAL.MD (Why)                                             │
│     - Problem statement                                                 │
│     - Solution overview                                                 │
│     - Success criteria                                                  │
│                                                                         │
│  3. WRITE TASKS.MD (What)                                               │
│     - Acceptance criteria with llm-rubric assertions                    │
│     - Happy paths, guardrails, tone                                     │
│                                                                         │
│  4. DERIVE TESTS (RED)                                                  │
│     - Copy rubrics from tasks.md → promptfooconfig.yaml                 │
│     - Run: promptfoo eval → See FAIL                                    │
│                                                                         │
│  5. IMPLEMENT (GREEN)                                                   │
│     - Write system-prompt.txt                                           │
│     - Run: promptfoo eval → See PASS                                    │
│                                                                         │
│  6. REFINE (REFACTOR)                                                   │
│     - Add edge cases to tasks.md                                        │
│     - Derive new tests                                                  │
│     - Confirm no regressions                                            │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

**Good luck facilitating!**
