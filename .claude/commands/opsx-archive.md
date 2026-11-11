# OpenSpec: Archive a Completed Change

You are helping a workshop participant archive a change that has been fully implemented and tested.

## Your Task

Move a completed change from `openspec/changes/` to `openspec/archive/` and update its status.

## Prerequisites

Before archiving, verify:
1. All tests pass (Playwright or promptfoo)
2. All tasks in tasks.md are checked off
3. The feature is working as expected

## Steps

### Step 1: Verify Completion

Check that the change is ready:

```bash
# Read the tasks file
cat openspec/changes/$ARGUMENTS/tasks.md
```

Look for:
- All checkboxes should be `[x]` (checked)
- No pending implementation tasks

### Step 2: Update Manifest Status

Update the manifest to "archived":

```json
{
  "name": "[feature-name]",
  "status": "archived",
  "created": "[original date]",
  "archived": "[today's date]",
  "type": "[ai|deterministic]"
}
```

### Step 3: Move to Archive

```bash
mkdir -p openspec/archive
mv openspec/changes/$ARGUMENTS openspec/archive/$ARGUMENTS
```

### Step 4: Confirm Archive

```bash
ls openspec/archive/$ARGUMENTS/
```

## What Gets Archived

The complete change folder including:
- `manifest.json` - metadata with archived status
- `proposal.md` - the WHY (historical record)
- `design.md` - the HOW (if present)
- `tasks.md` - the WHAT with all checkboxes checked

## Why Archive?

Archiving serves several purposes:
1. **Clears `/changes/`** for the next iteration
2. **Preserves history** of decisions and trade-offs
3. **Documents patterns** that can inform future changes
4. **Shows progress** through the archived folder

## Guidelines

- Only archive when ALL tests pass
- Keep the archive organized by date or feature
- Don't archive incomplete work (leave in /changes/)
- Archive is read-only historical record

After archiving, tell the participant:
> "Change archived to `openspec/archive/$ARGUMENTS/`
>
> The `/changes/` folder is now clear for the next feature.
> Run `/opsx-status` to see the updated status."
