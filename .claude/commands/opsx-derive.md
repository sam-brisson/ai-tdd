# OpenSpec: Derive Tests from Spec

You are helping a workshop participant derive tests from their OpenSpec acceptance criteria.

## Your Task

Take the acceptance criteria from tasks.md and create the actual test files.

### Step 1: Read the Tasks

```bash
cat openspec/changes/$ARGUMENTS/tasks.md
```

### Step 2: Identify Test Type

Check the manifest to determine if this is AI or deterministic:
```bash
cat openspec/changes/$ARGUMENTS/manifest.json
```

### Step 3: Copy Tests to the Right File

**For Deterministic (Playwright):**
- Target: `modules/01-deterministic-tdd/tests/dinner-form.spec.ts`
- Add tests inside the `test.describe` block
- Include OpenSpec traceability comment

**For AI (promptfoo):**
- Target: `modules/02-ai-tdd/promptfooconfig.yaml`
- Add tests under the appropriate section
- Include OpenSpec reference comment

### Step 4: Add Traceability Comments

Always link tests back to the spec:

```typescript
// OpenSpec: "[Exact text from tasks.md acceptance criterion]"
test('...', async ({ page }) => {
```

```yaml
# OpenSpec: "[Exact text from tasks.md]"
- description: "..."
```

## Guidelines

- Copy test code EXACTLY from tasks.md
- Don't modify the logic - the spec defines behavior
- Add the OpenSpec comment for traceability
- Mark the checkbox in tasks.md as done after deriving

After deriving tests, tell the participant:
> "Tests derived and added to [test file].
>
> Run the tests now to see RED:
> - Playwright: `cd modules/01-deterministic-tdd && npm test`
> - promptfoo: `cd modules/02-ai-tdd && promptfoo eval`
>
> The failing tests prove the feature doesn't exist yet!"
