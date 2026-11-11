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

**Goal:** Teams explore the app, run existing tests, and identify bugs/missing features.

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

**2. Run the Existing Tests (10 min)**

**Show the Playwright tests passing:**
```bash
cd modules/01-deterministic-tdd
npm test
```

**Point out:**
> "10 tests, all GREEN. This is our baseline.
> These tests came from the OpenSpec at `openspec/changes/guest-management-feature/tasks.md`."

**Show the OpenSpec → Test connection:**
Open side-by-side:
- `openspec/changes/guest-management-feature/tasks.md` (acceptance criteria)
- `modules/01-deterministic-tdd/tests/dinner-form.spec.ts` (derived tests)

> "See the comment `// OpenSpec: 'Can add a guest...'`?
> Every test traces back to a requirement in the spec."

**3. Find Bugs! (15 min)**

**Challenge the teams:**
> "Play with the app. Try to break it. Find something that DOESN'T work."

**Common discoveries:**
- Data lost on refresh (no persistence)
- Can't delete a dish
- Can't edit a guest name
- "Who's bringing" not linked to guest list

**Capture findings on whiteboard:**

| Bug/Missing Feature | Type |
|---------------------|------|
| Data lost on refresh | Bug |
| Can't delete dishes | Missing feature |

**Key insight:**
> "You just found real issues by exploring.
> Now we'll use OpenSpec to spec the fix BEFORE writing code."

**4. Review the OpenSpec Workflow (10 min)**

**Show the flow:**
```
1. SPEC IT   → Add requirement to tasks.md
2. TEST IT   → Derive test from the spec
3. RED       → Run test, watch it fail
4. GREEN     → Implement the fix
5. REFACTOR  → Clean up if needed
```

**Key point:**
> "The spec comes FIRST. You don't write tests from thin air.
> You don't write code until the test exists.
> Everything traces back to a documented requirement."

---

### Phase 1.5: Spec Your Fix (30 min)

**Goal:** Use OpenSpec to document the bug fix BEFORE writing code.

This is the core TDD workflow: spec → test → implement.

#### Demo: Fix the Persistence Bug

**Walk through as a group:**

**Step 1: Add the requirement to tasks.md (5 min)**

Open `openspec/changes/guest-management-feature/tasks.md` and add:

```markdown
## Data Persistence

- [ ] **Guest data persists after page refresh**
  ```typescript
  test('persists guests after page refresh', async ({ page }) => {
    await page.fill('[data-testid="guest-name-input"]', 'Grandma Rose');
    await page.click('[data-testid="add-guest-button"]');

    await page.reload();

    await expect(page.locator('[data-testid="guest-list"]'))
      .toContainText('Grandma Rose');
  });
  ```
```

**Key point:**
> "The spec now documents WHAT we need. The test code shows HOW we'll verify it."

**Step 2: Derive the test (5 min)**

Copy the test from tasks.md into `dinner-form.spec.ts`:

```typescript
// OpenSpec: "Guest data persists after page refresh"
test('persists guests after page refresh', async ({ page }) => {
  // ... (paste the test)
});
```

**Step 3: Run the test - see RED (5 min)**

```bash
npm test
```

> "11 tests: 10 pass, 1 fails. That failing test PROVES the bug exists."

**Step 4: Implement the fix (10 min)**

Add localStorage to `app/index.html`:
- `saveState()` - save to localStorage on changes
- `loadState()` - restore on page load

**Step 5: Run the test - see GREEN (5 min)**

```bash
npm test
```

> "11 tests: all pass! The bug is fixed AND documented."

#### Teams Practice

**Each team picks ONE bug from their discovery list and:**

1. Adds the requirement to `tasks.md`
2. Derives the test
3. Runs to see RED
4. Implements the fix
5. Runs to see GREEN

**Role Guidance:**
- **Product:** Write the acceptance criterion (what should happen?)
- **Engineering:** Write the test code (how do we verify it?)
- **Design:** Validate the fix makes sense for users

---

### Phase 2: AI Testing with promptfoo (45 min)

**Goal:** Apply the same OpenSpec workflow to AI behavior testing.

**Key transition:**
> "You just did TDD for deterministic features with Playwright.
> Now let's do the same thing for AI features with promptfoo.
>
> Same workflow: Spec → Test → RED → GREEN"

#### Activities

**1. Review the Drink Pairing Spec (10 min)**

**Show the existing OpenSpec:**

Open side-by-side:
- `openspec/changes/drink-pairing-feature/tasks.md`
- `modules/02-ai-tdd/promptfooconfig.yaml`

**Walk through one example:**

```markdown
# In tasks.md:
- [x] **Suggests wine for turkey**
  ```yaml
  - description: "Suggests wine for traditional turkey dinner"
    vars:
      menu: "Roasted Turkey, Mashed Potatoes, Cranberry Sauce"
    assert:
      - type: llm-rubric
        value: "Suggests at least one wine variety that pairs well with turkey"
  ```
```

**Key difference from Playwright:**
> "With Playwright, we assert exact values: `toContainText('Grandma Rose')`
> With promptfoo, we use `llm-rubric` to judge BEHAVIOR, not exact words.
> The AI might say 'Pinot Noir' or 'a nice red wine' - both could be correct."

**2. Run the AI Tests (10 min)**

```bash
cd modules/02-ai-tdd
export GROQ_API_KEY=your_key_here
promptfoo eval
```

**Show the output:** Tests should pass because `system-prompt.txt` is already written.

**Experiment - see RED:**
> "Let's empty the system prompt and see what happens."

```bash
echo "" > system-prompt.txt
promptfoo eval
```

> "Tests fail! The AI doesn't know how to behave without instructions."

**Restore the prompt:**
```bash
git checkout system-prompt.txt
```

**3. Add a New AI Requirement (25 min)**

**Teams add to `tasks.md`:**

```markdown
## Follow-up Questions (Workshop Addition)

- [ ] **AI suggests follow-up questions**
  ```yaml
  - description: "Suggests clickable follow-up questions"
    vars:
      menu: "Turkey, Mashed Potatoes, Pumpkin Pie"
    assert:
      - type: llm-rubric
        value: "Includes 2-3 suggested follow-up questions (e.g., about budget, alternatives, or specific dishes)"
  ```
```

**Derive the test:**
Copy the YAML into `promptfooconfig.yaml` and run:

```bash
promptfoo eval
```

**Expected:** Test FAILS (RED) - system prompt doesn't mention follow-ups.

**Fix the prompt:**
Add to `system-prompt.txt`:
```
After your suggestions, offer 2-3 follow-up questions like:
- "What about a budget-friendly option?"
- "Any white wine alternatives?"
```

**Run again:** Test PASSES (GREEN)

**Key insight:**
> "Same cycle: Spec → Test → RED → GREEN.
> Works for deterministic features AND AI behavior."

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
