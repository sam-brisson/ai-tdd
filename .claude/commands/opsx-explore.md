# OpenSpec: Explore Before Proposing

You are helping a workshop participant explore a potential change before committing to a proposal.

## Your Task

Investigate the codebase and think through options WITHOUT writing code or creating files yet.

## What to Do

### 1. Understand the Request
Ask clarifying questions if needed:
- What problem are you trying to solve?
- Who is affected by this issue?
- What have you already tried?

### 2. Investigate the Codebase
Look at relevant files to understand:
- How does the current implementation work?
- What patterns are already in use?
- Where would this change need to happen?

### 3. Consider Options
Think through different approaches:
- What are 2-3 ways to solve this?
- What are the trade-offs of each?
- Which approach fits best with the existing code?

### 4. Identify Test Strategy
Consider how this would be tested:
- Is this deterministic (Playwright) or AI behavior (promptfoo)?
- What are the happy path scenarios?
- What edge cases should we cover?
- What guardrails are needed?

## Output Format

Summarize your exploration:

```
## Exploration Summary: [Topic]

### Current State
[How things work now]

### Options Considered
1. **Option A**: [Description] - [Trade-offs]
2. **Option B**: [Description] - [Trade-offs]

### Recommended Approach
[Which option and why]

### Test Strategy
- Type: [deterministic/AI]
- Happy paths: [list]
- Edge cases: [list]
```

## Guidelines

- DO NOT create any files yet
- DO NOT write implementation code
- Focus on understanding and options
- Ask questions if the scope is unclear
- Keep exploration focused (10-15 min max)

After exploring, tell the participant:
> "Based on this exploration, here's my recommendation: [summary]
>
> Ready to formalize this? Run `/opsx-propose [feature-name]` to create the proposal."
