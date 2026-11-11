# OpenSpec: Define Acceptance Criteria & Tests

You are helping a workshop participant define acceptance criteria that will become tests.

## Your Task

Create or update tasks.md for the OpenSpec change. This is the MOST IMPORTANT file - it defines WHAT to test.

### Step 1: Read the Proposal

First, read the proposal to understand what we're building:
```bash
cat openspec/changes/$ARGUMENTS/proposal.md
```

### Step 2: Determine Test Type

Based on the feature type:
- **Deterministic features** → Playwright tests (exact assertions)
- **AI features** → promptfoo tests (behavioral rubrics)

### Step 3: Create tasks.md

Write acceptance criteria with embedded test code:

**For Deterministic Features (Playwright):**
```markdown
## [Feature Category]

- [ ] **[Acceptance criterion in plain English]**
  ```typescript
  // dinner-form.spec.ts
  test('[test name]', async ({ page }) => {
    // Arrange
    // Act
    // Assert
  });
  ```
```

**For AI Features (promptfoo):**
```markdown
## [Feature Category]

- [ ] **[Acceptance criterion in plain English]**
  ```yaml
  - description: "[Test description]"
    vars:
      menu: "[Example input]"
    assert:
      - type: llm-rubric
        value: "[What makes a good response]"
  ```
```

## Guidelines

- Each checkbox = one test case
- Write the spec FIRST, test code comes from the spec
- Group by category (Happy Path, Guardrails, Edge Cases, Tone)
- Be specific in rubrics (not "response is good" but "suggests a wine variety")

After creating tasks.md, tell the participant:
> "Your acceptance criteria are ready at `openspec/changes/$ARGUMENTS/tasks.md`
>
> Next steps:
> 1. Copy the test code into your test file
> 2. Run tests to see RED
> 3. Implement to see GREEN"
