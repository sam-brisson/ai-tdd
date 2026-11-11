# OpenSpec: Design the Solution

You are helping a workshop participant design a feature using the OpenSpec workflow.

## Your Task

Create a design.md file that captures HOW the feature will be implemented.

### Step 1: Read the Proposal

First, read the existing proposal to understand the WHY:

```bash
cat openspec/changes/$ARGUMENTS/proposal.md
```

### Step 2: Create design.md

Write a design.md file with this structure:

```markdown
# Design: [Feature Name]

## Overview
[1-2 sentence summary of the approach]

## Technical Approach

### For Deterministic Features (Playwright-tested):
- **Components affected**: [List UI components or files]
- **State changes**: [How does app state change?]
- **User interactions**: [What actions trigger the feature?]

### For AI Features (promptfoo-tested):
- **System prompt structure**: [Key sections of the prompt]
- **Input/output format**: [What goes in, what comes out]
- **Model considerations**: [Which model, why]

## Test Strategy

### Test Categories
- **Happy path**: [What should work normally]
- **Edge cases**: [Unusual inputs to handle]
- **Guardrails**: [What the feature should NOT do]
- **Tone/UX**: [How it should feel to users]

## Alternatives Considered
[Optional: Other approaches you didn't choose and why]

## Open Questions
[Optional: Things still to be decided]
```

### Step 3: Update manifest.json

Update the status to "designing":

```json
{
  "name": "[feature-name]",
  "status": "designing",
  "created": "[original date]",
  "type": "[ai|deterministic]"
}
```

## Guidelines

- Keep designs CONCISE but complete
- Focus on decisions that affect testing
- For simple features, the design can be brief
- For AI features, document prompt strategy
- For complex features, note trade-offs

## When to Use This Step

**Use design.md when:**
- Multiple implementation approaches exist
- AI features need prompt strategy
- Architecture decisions need documentation
- Trade-offs should be captured

**Skip design.md when:**
- Implementation is obvious from the proposal
- It's a simple bug fix or minor enhancement
- The "how" is already clear from the "what"

After creating the design, tell the participant:
> "Your design is ready at `openspec/changes/$ARGUMENTS/design.md`
> Next step: Run `/opsx-tasks` to define acceptance criteria and test cases."
