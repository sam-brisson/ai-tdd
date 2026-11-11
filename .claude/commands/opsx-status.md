# OpenSpec: Check Status

Show the current status of all OpenSpec changes in this project.

## Your Task

List all changes and their status.

### Step 1: List All Changes

```bash
ls -la openspec/changes/
```

### Step 2: Show Status of Each

For each change folder, read the manifest and summarize:

```bash
for dir in openspec/changes/*/; do
  echo "=== $(basename $dir) ==="
  cat "$dir/manifest.json" 2>/dev/null || echo "No manifest"
  echo ""
done
```

### Step 3: Count Tests

Show how many tests are passing/failing:

**Playwright:**
```bash
cd modules/01-deterministic-tdd && npm test 2>&1 | tail -5
```

**promptfoo:**
```bash
cd modules/02-ai-tdd && promptfoo eval 2>&1 | tail -10
```

## Output Format

Present a summary table:

| Change | Status | Type | Tests |
|--------|--------|------|-------|
| guest-management-feature | complete | deterministic | 11/11 ✓ |
| drink-pairing-feature | in-progress | ai | 15/15 ✓ |

Then show any changes that need attention (failing tests, missing artifacts).
