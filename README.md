# AI-TDD: Test-Driven Development for AI

Learn TDD principles by building a real app - starting with deterministic tests, then extending to AI behavior testing.

**The discipline:** Specify first. Derive tests from specs. Make them pass. Repeat.

---

## The Full Workflow

This workshop demonstrates the complete cycle from **specification to tests to implementation**:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│   OPENSPEC                         TDD                                  │
│   ────────                         ───                                  │
│                                                                         │
│   ┌─────────────┐                                                       │
│   │ proposal.md │ ──► Why this feature                                  │
│   └──────┬──────┘                                                       │
│          ▼                                                              │
│   ┌─────────────┐                                                       │
│   │ design.md   │ ──► How it works                                      │
│   └──────┬──────┘                                                       │
│          ▼                                                              │
│   ┌─────────────┐     ┌────────────────────────────────────────────┐   │
│   │ tasks.md    │ ──► │ Acceptance Criteria → TEST CASES           │   │
│   └─────────────┘     │                                            │   │
│                       │  • Playwright (deterministic features)     │   │
│                       │  • promptfoo (AI features)                 │   │
│                       └──────────────────┬─────────────────────────┘   │
│                                          ▼                              │
│                              ┌──────────────────────┐                   │
│                              │  RED → GREEN → REFACTOR                  │
│                              └──────────────────────┘                   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Key insight:** Tests don't come from thin air. They're derived from specifications. OpenSpec captures those specifications as artifacts.

---

## Workshop Overview

This workshop teaches TDD through a practical use case: a **Thanksgiving Dinner Planner**.

You'll start with familiar, deterministic testing (Playwright), then extend the same principles to test AI-powered features (promptfoo or similar).

### The Use Case

Build an app where people can:
1. **Add guests and dishes** (deterministic - Module 1)
2. **Get AI-powered drink pairing suggestions** (generative - Module 2)

Same app. Same TDD cycle. Different types of assertions.

---

## Modules

| Module | Focus | Tools | Duration |
|--------|-------|-------|----------|
| **[Module 1](modules/01-deterministic-tdd/)** | Deterministic TDD | Playwright | 1-2 hours |
| **[Module 2](modules/02-ai-tdd/)** | AI Behavior Testing | promptfoo | 1-2 hours |

### Module 1: Deterministic TDD

Learn the RED → GREEN → REFACTOR cycle with exact assertions:

```typescript
// Deterministic: exact match
await expect(guestList).toContainText('Grandma Rose');
```

**What you'll test:**
- Adding guests to the dinner
- Adding dishes with contributors
- Dietary restriction tracking
- Serving size calculations

### Module 2: AI Behavior Testing

Apply the same TDD cycle to non-deterministic AI outputs:

```yaml
# Behavioral: describe good behavior
- type: llm-rubric
  value: "Suggests a red wine that pairs well with turkey"
```

**What you'll test:**
- Wine/beer pairing suggestions
- Handling dietary restrictions
- Guardrails (staying on topic, reasonable quantities)
- Tone (accessible language, non-judgmental)

---

## The TDD Cycle

The same cycle applies to both modules:

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│   1. Write Test → 2. Run → 3. See RED               │
│         ↑                        ↓                   │
│         │                  4. Implement              │
│         │                        ↓                   │
│   6. Add More ← 5. See GREEN ← Run Again            │
│                                                      │
└──────────────────────────────────────────────────────┘
```

| State | Meaning | What to do |
|-------|---------|------------|
| **RED** | Tests fail | Implement the feature |
| **GREEN** | Tests pass | Consider adding more tests |
| **REFACTOR** | Improve | Clean up without breaking tests |

---

## Project Structure

```
ai-tdd/
├── README.md                          # You are here
├── app/                               # Shared sample application
│   └── index.html                     # Thanksgiving Dinner Planner
├── openspec/                          # Change specifications
│   ├── README.md                      # OpenSpec workflow explanation
│   └── changes/
│       ├── drink-pairing-feature/     # AI feature spec → promptfoo tests
│       │   ├── proposal.md
│       │   ├── design.md
│       │   └── tasks.md               # Acceptance criteria with test code
│       └── guest-management-feature/  # Deterministic spec → Playwright tests
│           ├── proposal.md
│           ├── design.md
│           └── tasks.md
├── modules/
│   ├── 01-deterministic-tdd/          # Module 1: Playwright
│   │   ├── README.md
│   │   ├── tests/
│   │   │   └── dinner-form.spec.ts    # Tests derived from OpenSpec
│   │   ├── playwright.config.ts
│   │   └── package.json
│   └── 02-ai-tdd/                     # Module 2: promptfoo
│       ├── README.md
│       ├── promptfooconfig.yaml       # Tests derived from OpenSpec
│       ├── system-prompt.txt
│       └── requirements.txt
├── docs/                              # Workshop facilitation
│   ├── FACILITATOR-GUIDE.md
│   ├── PARTICIPANT-WORKBOOK.md
│   └── DEMO-SCRIPT.md
└── examples/                          # Additional examples
    ├── customer-support/
    ├── onboarding-buddy/
    └── product-recommender/
```

---

## Quick Start

### Module 1 (Playwright)

```bash
cd modules/01-deterministic-tdd
npm install
npx playwright install

# Run tests (will fail - RED)
npx playwright test

# Start the app to implement features
npm run dev
```

### Module 2 (promptfoo)

```bash
cd modules/02-ai-tdd
pip install -r requirements.txt

# Configure API key
cp .env.example .env
# Edit .env and add your GROQ_API_KEY

# Run tests (will fail if system-prompt.txt is empty - RED)
promptfoo eval
```

---

## Why Two Modules?

Most teams understand deterministic TDD but struggle with AI testing because:

1. **AI outputs vary** - You can't assert exact strings
2. **"Correct" is fuzzy** - Many responses might be acceptable
3. **Behavior matters more than format** - Is it helpful? On-topic? Appropriate?

By starting with familiar Playwright tests, then transitioning to AI behavioral tests, you'll see that **the TDD cycle is the same** - only the assertion style changes.

---

## Key Concepts

### Deterministic Tests (Module 1)

```typescript
// Assert exact values
expect(count).toBe(8);
expect(element).toContainText('Turkey');
expect(list).toHaveCount(3);
```

### Behavioral Tests (Module 2)

```yaml
# Assert behavior in natural language
- type: llm-rubric
  value: "Suggests a wine variety appropriate for poultry"

- type: llm-rubric
  value: "Explains why the pairing works"

- type: llm-rubric
  value: "Uses accessible language without jargon"
```

### Test Categories (Both Modules)

| Category | Purpose | Module 1 Example | Module 2 Example |
|----------|---------|------------------|------------------|
| **Happy Path** | Core functionality works | Guest appears in list | Wine suggestion returned |
| **Guardrails** | Prevents bad behavior | Empty input ignored | Stays on topic |
| **Edge Cases** | Handles unusual input | Many guests added | Unconventional menu |
| **Tone/UX** | Good experience | Form clears after submit | Non-judgmental response |

---

## Tools

This workshop uses specific tools, but the principles transfer:

### Deterministic Testing
- **Playwright** (used here)
- Cypress, Puppeteer, Selenium
- Jest, pytest, etc.

### AI Behavior Testing
- **promptfoo** (used here)
- Evalite (TypeScript-native)
- DeepEval (Python-native)
- LangSmith (LangChain ecosystem)

---

## Learning Objectives

By the end of this workshop, you will:

1. ✅ Understand the full workflow: Spec → Tests → Implementation
2. ✅ Create OpenSpec artifacts (proposal, design, tasks)
3. ✅ Derive test cases from acceptance criteria
4. ✅ Apply the RED → GREEN → REFACTOR cycle
5. ✅ Use Playwright for deterministic web testing
6. ✅ Use promptfoo for AI behavior testing
7. ✅ Recognize when to use exact vs behavioral assertions
8. ✅ Apply test categories: happy path, guardrails, tone, edge cases

---

## OpenSpec + TDD

This workshop combines two complementary practices:

| Practice | Purpose | Artifacts |
|----------|---------|-----------|
| **OpenSpec** | Capture what needs to be built | proposal.md, design.md, tasks.md |
| **TDD** | Ensure it works correctly | Test files (Playwright, promptfoo) |

**The connection:** Acceptance criteria in `tasks.md` become test cases in your test files. Tests aren't invented - they're derived.

See [openspec/README.md](openspec/README.md) for the full workflow explanation.

---

## Resources

- [OpenSpec Workflow](openspec/README.md) - How specs become tests
- [Module 1: Deterministic TDD](modules/01-deterministic-tdd/README.md)
- [Module 2: AI Behavior Testing](modules/02-ai-tdd/README.md)
- [Playwright Documentation](https://playwright.dev/)
- [promptfoo Documentation](https://www.promptfoo.dev/docs/)
- [Groq API Console](https://console.groq.com) - Free API keys

---

## License

MIT
