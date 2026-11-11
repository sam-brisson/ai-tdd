# OpenSpec: Propose a New Feature

You are helping a workshop participant propose a new feature using the OpenSpec workflow.

## Your Task

Create a new OpenSpec change proposal. Follow these steps:

### Step 1: Create the Change Folder

```bash
mkdir -p openspec/changes/$ARGUMENTS
```

### Step 2: Create proposal.md

Write a proposal.md file with this structure:

```markdown
# [Feature Name]

## Why
[What problem does this solve? Who benefits?]

## What Changes
[Brief description of the feature]

## Success Criteria
- [ ] [High-level outcome 1]
- [ ] [High-level outcome 2]
```

### Step 3: Create manifest.json

```json
{
  "name": "[feature-name]",
  "status": "proposed",
  "created": "[today's date]",
  "type": "[ai|deterministic]"
}
```

## Guidelines

- Keep proposals SHORT (5-10 sentences)
- Focus on the WHY, not implementation details
- Use the feature name from the argument: $ARGUMENTS
- Ask clarifying questions if the feature is unclear

After creating the proposal, tell the participant:
> "Your proposal is ready at `openspec/changes/$ARGUMENTS/proposal.md`
>
> Next steps:
> - For complex/AI features: Run `/opsx-design $ARGUMENTS` to document the technical approach
> - For simple features: Run `/opsx-tasks $ARGUMENTS` to define acceptance criteria"
