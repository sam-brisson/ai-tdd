# Proposal: Guest and Menu Management

## Why

Thanksgiving dinner planning is stressful. Hosts juggle multiple concerns:
- **Who's coming?** Guest counts change constantly as RSVPs roll in
- **What are we eating?** Multiple dishes from different contributors need coordination
- **Who can eat what?** Dietary restrictions must be tracked to avoid embarrassing (or dangerous) oversights
- **How much do we need?** Portion calculations are error-prone and often forgotten

Most hosts use a combination of text messages, mental notes, and sticky pads. This leads to:
- Forgotten dietary needs (Cousin Emma is vegetarian - again)
- Wrong portion sizes (12 lbs of turkey for 4 people, or 2 lbs for 12)
- Lost track of who's bringing what

We want to build the **core management features** for a Thanksgiving Dinner Planner that makes this coordination simple and reliable.

## What Changes

### Guest Management

A simple, fast way to track who's attending:

**Features:**
- Add guest names with a single input field
- See total guest count at a glance
- Click on a guest to add dietary restrictions
- Visual warning when restrictions conflict with menu

**User Flow:**
1. Type guest name → Click "Add" (or press Enter)
2. Guest appears in list, count updates
3. Click guest to open restriction modal
4. Add restriction → Save → Restriction badge appears

### Dish Management

Track what's being served and who's bringing it:

**Features:**
- Add dish name with contributor
- Categorize by type: Main, Side, Dessert, Appetizer
- Mark dishes as containing meat (for restriction checking)
- Dishes organized by category on screen

**User Flow:**
1. Enter dish name and contributor
2. Select category from dropdown
3. Optionally mark as "contains meat"
4. Click "Add" → Dish appears in appropriate category section

### Serving Calculations

Automatic portion recommendations so hosts buy the right amount:

**Features:**
- Automatic calculation based on guest count
- Smart multipliers for different foods:
  - Turkey: 1.5 lbs per person
  - Ham: 0.5 lbs per person
  - Sides: 0.25 lbs per person
- Recommendations update as guest count changes

**Example:**
- 8 guests + Turkey = "Recommended: 12 lbs"
- 8 guests + Mashed Potatoes (side) = "Recommended: 2 lbs"

### Dietary Conflict Detection

Automatic warnings when the menu doesn't accommodate guests:

**Logic:**
- If any guest is vegetarian AND all dishes contain meat → Show warning
- Warning names the affected guests
- Real-time: warning appears/disappears as dishes and restrictions change

## Success Criteria

### Guest Management
- [ ] Can add a guest by typing name and clicking button
- [ ] Guest list displays all added guests
- [ ] Input field clears after adding
- [ ] Guest count badge shows correct number
- [ ] Can add multiple guests in sequence

### Dish Management
- [ ] Can add dish with name, contributor, and type
- [ ] Dishes appear in correct category section
- [ ] Can mark dishes as containing meat
- [ ] All dish types supported: main, side, dessert, appetizer

### Dietary Restrictions
- [ ] Can add restriction to any guest
- [ ] Restriction appears as badge on guest
- [ ] Warning appears when vegetarian guest + all meat dishes
- [ ] Warning shows affected guest names

### Serving Calculations
- [ ] Turkey shows 1.5 lbs per person calculation
- [ ] Other dishes use appropriate multipliers
- [ ] Calculation based on current guest count
- [ ] Recommendation displays clearly with dish

## Target Audience

- **Primary**: Thanksgiving dinner hosts (any experience level)
- **Secondary**: Potluck organizers
- **Tertiary**: Event planners for small gatherings

## Decisions Made

| Question | Decision | Rationale |
|----------|----------|-----------|
| Storage | In-memory (no backend) | Workshop focus is on TDD, not infrastructure |
| Restriction types | Free text | More flexible than predefined options |
| Serving units | Pounds (lbs) | Most familiar for American Thanksgiving context |
| Calculation timing | On dish add | Simpler than real-time recalculation |

## Open Questions

1. Should we support removing guests/dishes?
2. Should serving calculations update when guests are added after dishes?
