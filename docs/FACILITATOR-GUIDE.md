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
- [ ] **API Key Strategy** (choose one):
  - **Option A: Participants get their own** - Include signup link in invite email
  - **Option B: Shared workshop key** - Create temporary key, share in-room only, revoke after
  - **Option C: Org-provided** - Use company's existing OpenAI/Anthropic keys
- [ ] Test the starter repo on multiple OS (Mac, Windows, Linux)
- [ ] Prepare example chatbot scenario (customer support recommended)
- [ ] Set up screen sharing for terminal demos

### Day Before

- [ ] Run through the full workshop yourself
- [ ] Test internet connectivity in workshop room
- [ ] Prepare backup: pre-recorded terminal output screenshots
- [ ] Print quick reference cards (YAML syntax, common commands)
- [ ] **If using shared key**: Generate temporary Groq API key for workshop

### 1 Hour Before

- [ ] Clone starter repo to fresh directory for live demo
- [ ] Open terminal windows: one for demo, one for backup
- [ ] **Run Module 2 precheck:** `cd modules/02-ai-tdd && npm run precheck`
- [ ] Test `promptfoo eval` runs successfully
- [ ] Have example system prompts ready to paste

---

## API Key Setup

### Option A: Participants Get Their Own Key (Recommended)

Include in pre-workshop email:
> **Before the workshop, please:**
> 1. Go to https://console.groq.com/keys
> 2. Create a free account (no credit card required)
> 3. Generate an API key
> 4. Save it somewhere safe - you'll need it during the workshop

**Pros:** No key sharing, participants keep access after
**Cons:** Requires 5 min setup per person

### Option B: Shared Workshop Key

1. Create a temporary key at https://console.groq.com/keys
2. Share verbally or on a slide during Phase 0 (NOT in repo/chat)
3. **Revoke immediately after workshop**

**Facilitator script:**
> "I'm sharing a temporary API key for today's workshop.
> Please don't share this outside this room.
> It will be revoked at the end of the session."

```bash
# Have participants run:
export GROQ_API_KEY=<your-temporary-key>
```

**Pros:** Fast, no participant setup
**Cons:** Must remember to revoke, key visible during workshop

### Option C: Use Existing Org Keys

If your organization already has OpenAI, Anthropic, or other LLM keys:

1. Update `promptfooconfig.yaml` provider to match:
   ```yaml
   providers:
     - id: openai:gpt-4o-mini  # or anthropic:claude-3-haiku, etc.
   ```

2. Have participants export the appropriate key:
   ```bash
   export OPENAI_API_KEY=your-org-key
   # or
   export ANTHROPIC_API_KEY=your-org-key
   ```

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
```

> **Facilitator tip:** Remind participants to look for the URL in their terminal output:
> ```
> Server running at http://localhost:3000
> ```
> They can **Cmd/Ctrl + click** the URL to open it in a browser.

**Walk through the app features:**

| Feature | Test Framework | Where Tested |
|---------|----------------|--------------|
| **Guest Management** | Playwright (deterministic) | Module 1 |
| **Menu/Dish Management** | Playwright (deterministic) | Module 1 |
| **Drink Pairing Suggestions** | promptfoo (AI behavioral) | Module 2 |

**Facilitator tips:**
- Click "Suggest Pairings" to show the AI feature they'll be testing - this calls the real Groq API using the system prompt from `modules/02-ai-tdd/system-prompt.txt`
- Point out the two buttons in the bottom-right corner:
  - **"View System Prompt"** - Shows the current AI system prompt (updates live when you edit the file)
  - **"OpenSpec Cheat Sheet"** - Quick reference for all `/opsx-*` commands with examples

**2. Run the Existing Tests (10 min)**

**Show the Playwright tests in UI mode:**
```bash
cd modules/01-deterministic-tdd
npx playwright test --ui
```

This opens the interactive Playwright Test UI where participants can:
- See all tests in a sidebar
- Watch tests run in a mini-browser
- Click to re-run individual tests
- See screenshots and traces

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

> **Before moving on:** "Once you've found a gap, open the **OpenSpec Cheat Sheet** (button in the app) and review the `/opsx-explore` step. That's where we'll start next!"

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

**Show the full flow:**
```
1. PROPOSE   → Why does this need to exist? (proposal.md)
2. DESIGN    → How will we build it? (design.md)
3. TASKS     → What are the acceptance criteria? (tasks.md)
4. DERIVE    → Turn criteria into tests
5. RED       → Run tests, watch them fail
6. GREEN     → Implement to make tests pass
7. REFACTOR  → Clean up if needed
```

**Explain each artifact:**
- **proposal.md**: The WHY - problem statement, who benefits
- **design.md**: The HOW - technical approach, trade-offs, test strategy
- **tasks.md**: The WHAT - acceptance criteria that become test cases

**Key point:**
> "The spec comes FIRST. You don't write tests from thin air.
> You don't write code until the test exists.
> Everything traces back to a documented requirement."

**IMPORTANT - Always use the full flow in this workshop:**

> **Facilitator note:** Even for simple features, we ALWAYS go through ALL steps:
> explore → propose → design → tasks → derive → implement → archive
>
> Our goal is to TEACH participants the complete workflow. Skipping steps
> (even when they could be skipped in practice) defeats the purpose.
> We want them to learn the full flow with concrete examples.

---

### Phase 1.5: Spec Your Fix (30 min)

**Goal:** Use the FULL OpenSpec workflow to document the bug fix BEFORE writing code.

> **Facilitator note:** We go through ALL steps here to teach the complete workflow.
> Participants need to see the full flow with a real example.

#### Demo: Fix the Persistence Bug

**Walk through as a group using the full OpenSpec workflow:**

**Step 1: Explore (3 min)**

Have participants describe their gap in plain language:
```
/opsx-explore I don't want to lose what I typed in when I hit refresh
```

Claude will research whether this is feasible and suggest an approach.

**Step 2: Propose (3 min)**
```
/opsx-propose data-persistence
```

Creates `openspec/changes/data-persistence/proposal.md`:
```markdown
# Data Persistence

## Why
Users lose all their guests and dishes when they refresh the page.
This is frustrating and makes the app feel unreliable.

## What Changes
Save data to localStorage so it persists across page refreshes.

## Success Criteria
- [ ] Guest data persists after page refresh
- [ ] Dish data persists after page refresh
```

**Step 3: Design (3 min)**
```
/opsx-design data-persistence
```

Creates `openspec/changes/data-persistence/design.md`:
```markdown
# Data Persistence - Design

## Technical Approach
Use browser localStorage to save and restore app state.

## Implementation
- Add `saveState()` function to save on changes
- Add `loadState()` function to restore on page load
- Call saveState() whenever guests or dishes change

## Test Strategy
- Type: Deterministic (Playwright)
- Add guest → refresh → verify guest still exists
```

**Step 4: Tasks (5 min)**
```
/opsx-tasks data-persistence
```

Creates `openspec/changes/data-persistence/tasks.md`:
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

**Step 5: Derive → RED (5 min)**
```
/opsx-derive data-persistence
```

Copy the test from tasks.md into `dinner-form.spec.ts` and run:

```bash
npm test
```

> "11 tests: 10 pass, 1 fails. That failing test PROVES the bug exists."

**Step 6: Implement → GREEN (8 min)**
```
/opsx-implement data-persistence
```

Add localStorage to `app/index.html`:
- `saveState()` - save to localStorage on changes
- `loadState()` - restore on page load

Run tests again:
```bash
npm test
```

> "11 tests: all pass! The bug is fixed AND documented."

**Step 7: Archive (3 min)**
```
/opsx-archive data-persistence
```

Moves the completed change to `openspec/archive/`.

#### Teams Practice

**Each team picks ONE bug from their discovery list and follows the FULL workflow:**

1. `/opsx-explore` - Describe the gap in plain language
2. `/opsx-propose` - Create the proposal
3. `/opsx-design` - Document the approach
4. `/opsx-tasks` - Define acceptance criteria
5. `/opsx-derive` - Copy tests, see RED
6. `/opsx-implement` - Write code, see GREEN
7. `/opsx-archive` - Clean up

**Role Guidance:**
- **Product:** Write the acceptance criterion (what should happen?)
- **Engineering:** Write the test code (how do we verify it?)
- **Design:** Validate the fix makes sense for users

---

### Phase 2: AI Testing with promptfoo (45 min)

**Goal:** Apply the same OpenSpec workflow to AI behavior testing.

**Key transition:**
> "You just did TDD for deterministic features with Playwright.
> Now let's do the EXACT same thing for AI features with promptfoo.
>
> Same workflow: Run tests → All pass → Find gap → Explore → Propose → Tasks → Derive (RED) → Implement (GREEN) → Archive"

#### Step 1: Precheck - Verify API Setup (5 min)

```bash
cd modules/02-ai-tdd
npm run precheck
```

**Expected:** All checks pass. If not:

| Issue | Solution |
|-------|----------|
| `GROQ_API_KEY not set` | Copy `.env.example` to `.env` and add your key |
| `API key invalid` | Get a new key at https://console.groq.com |
| `Rate limit hit` | Normal on free tier - tests will retry automatically |

#### Terminal Management

> **Facilitator tip:** Participants will need a free terminal to run promptfoo commands:
>
> **Option A:** Click `+` in VS Code's terminal panel for a second terminal
> **Option B:** Press `Ctrl+C` to stop the app, run tests, then `npm run dev` to restart

#### Step 2: Run Baseline Tests (5 min)

Just like Module 1, we start by running the existing tests:

```bash
npm test
```

**Expected output:** 5 tests, all passing (GREEN baseline)

```
✔ Suggests wine for traditional turkey dinner
✔ Offers beer as an alternative
✔ Includes non-alcoholic options when requested
✔ Explains why the pairing works
✔ Warm and welcoming tone

Successes: 5
Failures: 0
```

> "Just like Playwright in Module 1 - we have a working baseline. All tests pass."

#### Step 3: Explore the App (5 min)

Have participants try the AI feature:

```bash
npm run dev
```

> **Reminder:** Look for `Server running at http://localhost:3000` and **Cmd/Ctrl + click** to open.

1. Add some dishes (Turkey, Mashed Potatoes, Pumpkin Pie)
2. Click **"Suggest Pairings"**
3. Click **"View System Prompt"** to see the AI instructions

**Discussion prompt:**
> "The suggestions are good, but notice something missing?
> How do you know if these pairing recommendations are trustworthy?
> There are no sources or citations!"

> **Before moving on:** "Once you've identified a gap, open the **OpenSpec Cheat Sheet** (button in the app) and review the `/opsx-explore` step. That's where we'll start next!"

#### Step 4: OpenSpec Workflow for Citations (25 min)

Now we follow the EXACT same flow as Module 1:

**4a. Explore** (required - start here!)

> **Facilitator tip:** Encourage participants to express their idea in plain language first.
> The explore step helps Claude understand what they want to achieve before formalizing it.

Have participants describe their gap in plain text:
```
/opsx-explore I want the AI to cite real sources so I know the recommendations aren't just made up
```

Claude will research whether this is feasible and suggest an approach.

**4b. Propose**
```
/opsx-propose citation-sources
```

Creates `openspec/changes/citation-sources/proposal.md`:
```markdown
# Citation Sources

## Why
When the AI suggests drink pairings, users have no way to verify
the recommendations. Adding citations builds trust and lets users
learn more if they're interested.

## What Changes
The AI should cite at least one source when making recommendations
(e.g., "According to Wine Folly..." or "Food & Wine suggests...").

## Success Criteria
- [ ] AI includes 2 relevant citations at the end of its recommendation
```

**4c. Design**
```
/opsx-design citation-sources
```

Creates `openspec/changes/citation-sources/design.md`:
```markdown
# Citation Sources - Design

## Technical Approach
Update the system prompt to instruct the AI to include 2 citations
at the end of each recommendation.

## Implementation
- Modify `system-prompt.txt` to add citation instructions
- Reference well-known publications: Wine Folly, Food & Wine, Wine Enthusiast

## Test Strategy
- Type: AI behavioral (promptfoo with llm-rubric)
- Verify citations appear at end of response
```

> **Facilitator note:** Even though the design is simple here, we ALWAYS include
> this step to teach the full workflow. Participants need to see all the steps.

**4e. Tasks**
```
/opsx-tasks citation-sources
```

Creates `openspec/changes/citation-sources/tasks.md`:
```markdown
# Citation Sources - Acceptance Criteria

- [ ] **Includes citation for recommendations**
  ```yaml
  - description: "Includes citation for pairing recommendations"
    vars:
      menu: "Turkey, Stuffing, Cranberry Sauce"
    assert:
      - type: llm-rubric
        value: "Includes at least one citation or reference to a source for the pairing recommendation"
  ```
```

**4f. Derive → RED**
```
/opsx-derive citation-sources
```

This copies the test to `promptfooconfig.yaml`. Run tests:

```bash
npm test
```

**Expected:** 5 pass, 1 fails (RED!) - The citation test fails because the system prompt doesn't mention citations.

> "RED! Just like Module 1. The test proves the feature doesn't exist yet."

**4g. Implement → GREEN (3 iterations)**
```
/opsx-implement citation-sources
```

> **Facilitator note:** This is where participants learn that prompt engineering is iterative!
> Guide them through 3 attempts. Let them experience the "failing" iterations.

**Iteration 1 - Too weak (FAILS):**
```
### Citations
When recommending pairings, cite at least one source to build trust.
For example: "According to Wine Folly..." or "Food & Wine magazine suggests..."
```
Run `npm run test:nocache` → Still fails. The model ignores the instruction.

> "Hmm, the model didn't follow our instruction. Let's be more explicit."

**Iteration 2 - Stronger but inconsistent (FAILS):**
```
### Citations (REQUIRED):
- You MUST end EVERY response with exactly 2 citations from well-known sources
- Use publications like: Wine Folly, Food & Wine, Wine Enthusiast, Bon Appétit
- Format: "📚 Sources: Wine Folly, Food & Wine"
```
Run `npm run test:nocache` → Still inconsistent. Sometimes works, sometimes doesn't.

> "Better, but the model is inconsistent. We need to show it an example."

**Iteration 3 - With example (PASSES):**

Replace the entire system prompt with this simplified version:
```
# Thanksgiving Drink Pairing Assistant

You are a friendly sommelier helping people plan Thanksgiving dinner drinks.

## What You Do

Given a menu, suggest wine, beer, AND non-alcoholic pairings. For each:
1. Name the specific beverage (e.g., "Pinot Noir" not just "red wine", "Amber Ale" not just "beer")
2. Briefly explain why it pairs well

## Important Rules

- NEVER ask clarifying questions - just give recommendations based on what you're given
- Even minimal info like "turkey" is enough - make suggestions immediately
- READ the actual menu and tailor suggestions to those SPECIFIC dishes
- If dietary restrictions mention "no alcohol" or similar, you MUST include non-alcoholic options
- Be warm and encouraging, especially for first-time hosts
- Stay focused on drink pairings only

## Citations (REQUIRED)

You MUST end every response with a sources line:
- For Western dishes: "📚 Sources: Wine Folly, Food & Wine"
- For non-Western cuisines (Chinese, Szechuan, etc.): "📚 Based on my general knowledge as a sommelier"

## Example

"For your turkey dinner, I'd suggest a **Pinot Noir** - its bright acidity cuts through the richness of gravy.

For beer lovers, try an **Amber Ale** - its caramel notes complement roasted flavors.

For non-drinkers, **sparkling apple cider** pairs wonderfully with fall flavors!

📚 Sources: Wine Folly, Food & Wine"

**FINAL REMINDER**: Your response MUST end with "📚 Sources: ..." or "📚 Based on my general knowledge..." - this is required for EVERY response!
```

Run `npm run test:nocache` → **All pass!**

> "GREEN! Notice what it took:
> 1. Clear, explicit instructions (MUST, REQUIRED)
> 2. A concrete example showing the exact format
> 3. A reminder at the end
>
> This is prompt engineering - iterating until behavior is consistent."

**4h. Archive**
```
/opsx-archive citation-sources
```

Moves completed change to `openspec/archive/`.

#### Key Insight

> "Notice the workflow was IDENTICAL to Module 1:
>
> | Module 1 (Deterministic) | Module 2 (AI) |
> |--------------------------|---------------|
> | Playwright tests | promptfoo tests |
> | Edit `index.html` | Edit `system-prompt.txt` |
> | Exact assertions | Behavioral rubrics |
>
> Same OpenSpec workflow. Same TDD cycle. Different test framework."

---

### Phase 3: Debrief & Reflect (15 min)

**Goal:** Reinforce the key concepts.

#### Discussion Questions

1. "What's the difference between testing deterministic code vs AI behavior?"
2. "Why do we use `llm-rubric` instead of exact string matching for AI?"
3. "When would you use Playwright vs promptfoo in your own projects?"

#### Key Takeaways

- **Specs come first** - Don't write tests from thin air
- **Tests define behavior** - The test IS the requirement
- **Same workflow** - OpenSpec works for both deterministic and AI features
- **RED then GREEN** - Failing tests prove the feature doesn't exist yet

---

### Phase 4: Extended Practice (Optional, 30 min)

If time permits, teams can add more AI features:

**Suggested enhancements:**
- Budget-friendly recommendations
- Seasonal availability notes
- Serving temperature suggestions

Each follows the same flow: `/opsx-propose` → `/opsx-tasks` → `/opsx-derive` → `/opsx-implement`

---

### Backup: If Tests Are Flaky

AI tests can occasionally be non-deterministic. If a test fails randomly:

```bash
# Run with no cache to get fresh responses
npm run test:nocache
```

If still flaky, the rubric may be too strict. Make it more forgiving:
- "Should generally include..." instead of "Must include..."
- "Suggests at least one..." instead of "Suggests exactly three..."

---

### Phase 5: Demo & Wrap-up (15 min)

**Goal:** Celebrate and share learnings.

#### Activities

**1. Quick Demos (10 min)**

Each team shows:
- Their citation feature working in the app
- The GREEN test output

**2. Final Reflection (5 min)**

> "You now have a complete workflow for testing ANY software:
> - Deterministic features → Playwright
> - AI features → promptfoo
> - Both use OpenSpec for specs → tests → implementation
>
> The tools change. The workflow stays the same."

---

### Facilitator Cheat Sheet: Module 2 Commands

```bash
# Setup
cd modules/02-ai-tdd
npm run precheck

# Run tests
npm test                    # Run all tests
npm run test:nocache        # Force fresh API calls
npm run view                # Open web UI to see results

# Start app (works from either module folder)
npm run dev

# OpenSpec workflow
/opsx-explore "description"     # Investigate
/opsx-propose citation-sources  # Create proposal
/opsx-tasks citation-sources    # Define acceptance criteria
/opsx-derive citation-sources   # Copy tests (RED)
/opsx-implement citation-sources # Make tests pass (GREEN)
/opsx-archive citation-sources  # Move to archive
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
│  View results:  promptfoo view                  │
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

### OpenSpec
- [OpenSpec Quickstart](https://openspec.dev/docs/quickstart) - Official 5-phase workflow
- [OpenSpec Workflow](../openspec/README.md) - How specs become tests (local)
- [OpenSpec Example: Drink Pairing](../openspec/changes/drink-pairing-feature/) - AI feature spec
- [OpenSpec Example: Guest Management](../openspec/changes/guest-management-feature/) - Deterministic spec
- [OpenSpec Example: Data Persistence](../openspec/changes/data-persistence/) - Simple bug fix spec
- [OpenSpec Example: Delete Guest](../openspec/changes/delete-guest/) - Deterministic feature spec

### Testing Tools
- [promptfoo Documentation](https://www.promptfoo.dev/docs/)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Groq API Console](https://console.groq.com) - Free API keys

### Workshop Materials
- [Workshop Participant Workbook](./PARTICIPANT-WORKBOOK.md)
- [Demo Script](./DEMO-SCRIPT.md)

### In-App Help
> **Tip:** The Thanksgiving Dinner Planner app includes two helpful buttons in the bottom-right corner:
> - **"View System Prompt"** - See the current AI system prompt (live updates when you edit the file)
> - **"OpenSpec Cheat Sheet"** - Quick reference for all `/opsx-*` commands with examples

---

## Quick Reference: OpenSpec + TDD Flow

Based on the [OpenSpec workflow](https://openspec.dev/docs/quickstart), adapted for TDD:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  0. EXPLORE (/opsx-explore) [Start here!]                               │
│     - Investigate the codebase before committing to a plan              │
│     - Think through options and trade-offs                              │
│     - (Describe in plain language what you want and why)                │
│     - Example: "/opsx-explore I don't want to lose what I typed         │
│       in when I hit refresh"                                            │
│                                                                         │
│  1. PROPOSE (/opsx-propose feature-name)                                │
│     - Create openspec/changes/feature-name/                             │
│     - Write proposal.md: WHY does this need to exist?                   │
│     - Create manifest.json with status: "proposed"                      │
│                                                                         │
│  2. DESIGN (/opsx-design feature-name) [Optional for simple features]   │
│     - Write design.md: HOW will we build it?                            │
│     - Document technical approach and trade-offs                        │
│     - Define test strategy (happy path, edge cases, guardrails)         │
│                                                                         │
│  3. TASKS (/opsx-tasks feature-name)                                    │
│     - Write tasks.md: WHAT are the acceptance criteria?                 │
│     - Each criterion includes its test case                             │
│     - Deterministic → Playwright assertions                             │
│     - AI features → llm-rubric assertions                               │
│                                                                         │
│  4. DERIVE (/opsx-derive feature-name) → RED                            │
│     - Copy tests from tasks.md → test files                             │
│     - Run tests → See FAIL (proves tests work)                          │
│                                                                         │
│  5. IMPLEMENT (/opsx-implement feature-name) → GREEN                    │
│     - Write code/prompts to make tests pass                             │
│     - Run tests → See PASS                                              │
│     - (This is "Apply" in standard OpenSpec)                            │
│                                                                         │
│  6. REFINE → REFACTOR                                                   │
│     - Add edge cases to tasks.md                                        │
│     - Derive new tests                                                  │
│     - Confirm no regressions                                            │
│                                                                         │
│  7. ARCHIVE (/opsx-archive feature-name)                                │
│     - Move completed change to openspec/archive/                        │
│     - Clear /changes/ for the next iteration                            │
│                                                                         │
│  8. STATUS (/opsx-status)                                               │
│     - Check progress across all changes                                 │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### OpenSpec Slash Commands

| Command | Purpose | OpenSpec Phase |
|---------|---------|----------------|
| `/opsx-explore` | Investigate before proposing | Explore |
| `/opsx-propose <name>` | Create new change with proposal.md | Propose |
| `/opsx-design <name>` | Add design.md with technical approach | Propose |
| `/opsx-tasks <name>` | Define acceptance criteria and test cases | Propose |
| `/opsx-derive <name>` | Copy tests from tasks.md to test files | (TDD addition) |
| `/opsx-implement <name>` | Implement feature to make tests pass | Apply |
| `/opsx-archive <name>` | Move completed change to archive | Archive |
| `/opsx-status` | View status of all changes | (Utility) |

### Mapping to Standard OpenSpec

| Standard OpenSpec | Our TDD Workflow | Notes |
|-------------------|------------------|-------|
| Explore | `/opsx-explore` | Same - investigate first |
| Propose | `/opsx-propose` + `/opsx-design` + `/opsx-tasks` | We split into explicit steps |
| Review | (Human reviews between steps) | Implicit in workshop flow |
| Apply | `/opsx-implement` | Renamed for TDD clarity |
| Archive | `/opsx-archive` | Same - clean up when done |

---

## Tips from Experience

### Things That Work Well

1. **Start with a real bug** - Let participants discover issues (like "refresh clears data") before introducing OpenSpec. The "aha moment" is stronger when they see the problem first.

2. **Show regression protection** - When implementing delete-guest, we accidentally broke the dietary restriction test. This perfectly demonstrates why TDD matters!

3. **Use the in-app cheat sheet** - Participants forget command syntax. The "OpenSpec Cheat Sheet" button in the app gives them instant reference without leaving context.

4. **Plain text proposals work** - When a participant says "I want to delete a guest if I added in error!", capture that verbatim in proposal.md. It's more authentic than formal requirements.

5. **Skip design for simple fixes** - Data persistence and delete-guest don't need elaborate design docs. Save `/opsx-design` for AI features and complex changes.

### Common Issues

| Issue | Solution |
|-------|----------|
| **Module 2 setup issues** | Run `npm run precheck` first - it catches most problems |
| promptfoo `llm-rubric` JSON parse errors | Use a larger model for grading (e.g., `gpt-oss-120b` instead of `gpt-oss-20b`) |
| Groq model not found | Run precheck to see available models, or `curl -s https://api.groq.com/openai/v1/models -H "Authorization: Bearer $GROQ_API_KEY"` |
| Rate limit errors (429) | Normal on free tier - config has `maxConcurrency: 1` to help. Wait and retry. |
| `promptfoo view` not working | It's a separate command, not `--view` flag. Run `promptfoo eval` first, then `promptfoo view` |
| Playwright tests break after UI changes | Check `data-testid` attributes and click handlers - small changes can break selectors |
| App not connecting to AI | Make sure server is running (`npm run dev` from Module 1) and `.env` has `GROQ_API_KEY` |

### When to Use Each OpenSpec Step

| Situation | Steps to Use |
|-----------|--------------|
| Simple bug fix | propose → tasks → derive → implement |
| New deterministic feature | propose → tasks → derive → implement |
| New AI feature | propose → **design** → tasks → derive → implement |
| Complex architectural change | **explore** → propose → **design** → tasks → derive → implement |
| Uncertain about approach | **explore** first, then decide |

---

**Good luck facilitating!**
