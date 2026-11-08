# OpenSpec: Change Management for This Project

This folder contains **OpenSpec changes** - structured artifacts that capture the "what" and "why" of features before tests are written.

## The Big Idea

**Tests don't come from thin air.** Before writing test cases, you need to know:
- What problem are we solving? (proposal.md)
- How will we solve it? (design.md)
- What exactly needs to work? (tasks.md)

OpenSpec captures these answers as artifacts. Then **tests are derived from tasks.md**, not invented ad-hoc.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          OPENSPEC → TDD FLOW                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   TEAM CONVERSATION              OPENSPEC ARTIFACTS                     │
│   ─────────────────              ─────────────────                      │
│   "We need drink                 proposal.md                            │
│    pairing suggestions"  ───►    ├── Why this feature                   │
│                                  ├── What it does                       │
│                                  └── Success criteria                   │
│                                           │                             │
│                                           ▼                             │
│                                  design.md                              │
│                                  ├── System architecture                │
│                                  ├── Technical approach                 │
│                                  └── Test strategy                      │
│                                           │                             │
│                                           ▼                             │
│                                  tasks.md                               │
│                                  ├── Acceptance Criteria                │
│                                  │   ↓                                  │
│                                  │   TEST CASES                         │
│                                  │   • Playwright (deterministic)       │
│                                  │   • promptfoo (AI behavior)          │
│                                  └── Implementation tasks               │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## Folder Structure

```
openspec/
└── changes/
    ├── drink-pairing-feature/        # AI feature example
    │   ├── manifest.json             # Change metadata
    │   ├── proposal.md               # Why this feature
    │   ├── design.md                 # How it works
    │   └── tasks.md                  # Acceptance criteria → tests
    │
    └── guest-management-feature/     # Deterministic feature example
        ├── manifest.json
        ├── proposal.md
        ├── design.md
        └── tasks.md
```

## The Three Artifacts

### proposal.md - The "Why"
- What problem does this solve?
- Who benefits?
- What are the success criteria?

**Example from drink-pairing-feature:**
> "Thanksgiving hosts face a common dilemma: they've planned the food, but what drinks should they serve? Most people aren't sommeliers..."

### design.md - The "How"
- System architecture
- Technical approach
- Test strategy and assertion types

**Example from guest-management-feature:**
> "We use data-testid attributes for test targeting. Each component has specific attributes like `data-testid='guest-name-input'`..."

### tasks.md - The "What" (Test Specifications)

This is where **acceptance criteria become test cases**:

```markdown
## Acceptance Criteria → Tests

- [x] **Can add a guest name**
  ```typescript
  test('can add a guest name', async ({ page }) => {
    await page.fill('[data-testid="guest-name-input"]', 'Grandma Rose');
    await page.click('[data-testid="add-guest-button"]');
    await expect(page.locator('[data-testid="guest-list"]'))
      .toContainText('Grandma Rose');
  });
  ```
```

## How It Works in This Workshop

### For Deterministic Features (Module 1)
1. Read `guest-management-feature/tasks.md`
2. See acceptance criteria with Playwright test code
3. Tests in `modules/01-deterministic-tdd/tests/dinner-form.spec.ts` implement these
4. Comments in test file reference the OpenSpec source

### For AI Features (Module 2)
1. Read `drink-pairing-feature/tasks.md`
2. See acceptance criteria with promptfoo assertions
3. Tests in `modules/02-ai-tdd/promptfooconfig.yaml` implement these
4. Comments in YAML reference the OpenSpec source

## Creating Your Own Change

During the workshop, you'll create your own OpenSpec change:

### Step 1: Create the folder
```bash
mkdir -p openspec/changes/my-chatbot
```

### Step 2: Write proposal.md
Answer: Why does this chatbot need to exist?

```markdown
# My Chatbot

## Why
[Problem statement]

## What Changes
[Solution overview]

## Success Criteria
- [ ] [What must work]
```

### Step 3: Write tasks.md with acceptance criteria
Each criterion becomes a test:

```markdown
## Acceptance Criteria → Tests

### Happy Path
- [ ] **[Behavior 1]**
  - Test: `llm-rubric: "[Expected behavior]"`

### Guardrails
- [ ] **[What it should NOT do]**
  - Test: `llm-rubric: "[Expected rejection]"`

### Tone
- [ ] **[How it should sound]**
  - Test: `llm-rubric: "[Expected tone]"`
```

### Step 4: Derive tests
Copy your `llm-rubric` assertions into `promptfooconfig.yaml`:

```yaml
tests:
  - description: "Behavior 1"
    vars:
      query: "User input that triggers this behavior"
    assert:
      - type: llm-rubric
        value: "Expected behavior"
```

## Why OpenSpec + TDD?

| Without OpenSpec | With OpenSpec |
|------------------|---------------|
| Tests invented ad-hoc | Tests derived from spec |
| "What should we test?" | "Here's what we agreed to test" |
| Knowledge in heads | Knowledge in artifacts |
| Hard to onboard | Self-documenting |

**The discipline:** Write the spec first. Derive tests from the spec. Implement to pass the tests.

## Learn More

- [drink-pairing-feature/](changes/drink-pairing-feature/) - Complete AI feature example
- [guest-management-feature/](changes/guest-management-feature/) - Complete deterministic example
- [Module 1: Deterministic TDD](../modules/01-deterministic-tdd/) - Playwright testing
- [Module 2: AI TDD](../modules/02-ai-tdd/) - promptfoo testing
