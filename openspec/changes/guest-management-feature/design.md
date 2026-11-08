# Design: Guest and Menu Management

## Overview

This design specifies the deterministic features of the Thanksgiving Dinner Planner and demonstrates how TDD principles apply to traditional web application testing with Playwright.

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    GUEST MANAGEMENT FEATURE                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────────┐ │
│  │  Dinner Planner │    │  State (JS)     │    │  Playwright Tests   │ │
│  │  (index.html)   │    │  (in-memory)    │    │  (exact assertions) │ │
│  └────────┬────────┘    └────────┬────────┘    └──────────┬──────────┘ │
│           │                      │                        │            │
│           ▼                      ▼                        ▼            │
│  ┌─────────────────────────────────────────────────────────────────────┐│
│  │                    DOM + Event Handlers                             ││
│  │            (data-testid attributes for test targeting)              ││
│  └─────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────┘
```

## Component Structure

### Guest Section

```
┌─────────────────────────────────────────────────────────────────┐
│  Guests                                              [3 guests] │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────┐  ┌───────────┐          │
│  │ Guest name...                      │  │ Add Guest │          │
│  └────────────────────────────────────┘  └───────────┘          │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────────┐│
│  │  • Mom                                                       ││
│  │  • Dad                                                       ││
│  │  • Cousin Emma  [Vegetarian]  ← Restriction badge            ││
│  └──────────────────────────────────────────────────────────────┘│
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Data Attributes (for testing):**
- `data-testid="guest-name-input"` - Name input field
- `data-testid="add-guest-button"` - Add button
- `data-testid="guest-list"` - Container for guest items
- `data-testid="guest-count"` - Count badge
- `data-testid="guest-item-{name}"` - Individual guest (click to edit)

### Dish Section

```
┌─────────────────────────────────────────────────────────────────┐
│  Menu                                                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────┐ ┌─────────────────┐ ┌──────────┐           │
│  │ Dish name...    │ │ Contributor...  │ │ Type ▼   │           │
│  └─────────────────┘ └─────────────────┘ └──────────┘           │
│                                                                  │
│  ☐ Contains meat                        [Add Dish]              │
│                                                                  │
│  MAINS                                                          │
│  ┌──────────────────────────────────────────────────────────────┐│
│  │  • Turkey (Dad)                     [Recommended: 12 lbs]   ││
│  └──────────────────────────────────────────────────────────────┘│
│                                                                  │
│  SIDES                                                          │
│  ┌──────────────────────────────────────────────────────────────┐│
│  │  • Mashed Potatoes (Mom)            [Recommended: 2 lbs]    ││
│  │  • Green Beans (Uncle Bob)          [Recommended: 2 lbs]    ││
│  └──────────────────────────────────────────────────────────────┘│
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Data Attributes:**
- `data-testid="dish-name-input"` - Dish name field
- `data-testid="dish-contributor-input"` - Contributor field
- `data-testid="dish-type-select"` - Type dropdown
- `data-testid="contains-meat-checkbox"` - Meat checkbox
- `data-testid="add-dish-button"` - Add button
- `data-testid="main-dishes"` - Main dishes container
- `data-testid="side-dishes"` - Sides container
- `data-testid="serving-recommendation-{dish}"` - Serving calc display

### Dietary Warning

```
┌─────────────────────────────────────────────────────────────────┐
│  ⚠️ Dietary Warning                                              │
│  Cousin Emma is vegetarian but all dishes contain meat.         │
└─────────────────────────────────────────────────────────────────┘
```

**Data Attributes:**
- `data-testid="dietary-warning"` - Warning container

## Test Strategy

We use TDD to specify expected UI behavior BEFORE implementing features.

### Test Categories

```
┌──────────────────────────────────────────────────────────────────┐
│                      TEST CATEGORIES                              │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  GUEST MANAGEMENT              DISH MANAGEMENT                   │
│  ────────────────              ───────────────                   │
│  • Add single guest            • Add dish with contributor       │
│  • Add multiple guests         • Categorize by type              │
│  • Input clears after add      • Mark as contains meat           │
│  • Guest count displays                                          │
│                                                                  │
│  DIETARY RESTRICTIONS          SERVING CALCULATIONS              │
│  ────────────────────          ────────────────────              │
│  • Add restriction to guest    • Turkey: 1.5 lbs/person          │
│  • Restriction badge shows     • Calculation at dish add time    │
│  • Conflict warning appears                                      │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Assertion Types

| Playwright Method | Use Case | Example |
|-------------------|----------|---------|
| `toContainText()` | Element includes text | Guest name in list |
| `toHaveValue()` | Input field value | Empty after clearing |
| `toHaveCount()` | Number of elements | Guest count |
| `toBeVisible()` | Element is shown | Warning display |

### Test Structure

```typescript
test('can add a guest name', async ({ page }) => {
  // Arrange - Navigate to app
  await page.goto('/');

  // Act - Add a guest
  await page.fill('[data-testid="guest-name-input"]', 'Grandma Rose');
  await page.click('[data-testid="add-guest-button"]');

  // Assert - Guest appears in list
  await expect(page.locator('[data-testid="guest-list"]'))
    .toContainText('Grandma Rose');
});
```

### Test-to-Requirement Mapping

Each test in `dinner-form.spec.ts` maps to an acceptance criterion in `tasks.md`:

```typescript
// tasks.md says: "Can add a guest by typing name and clicking button"
// ↓ becomes this test:
test('can add a guest name', async ({ page }) => {
  await page.fill('[data-testid="guest-name-input"]', 'Grandma Rose');
  await page.click('[data-testid="add-guest-button"]');
  await expect(page.locator('[data-testid="guest-list"]'))
    .toContainText('Grandma Rose');
});
```

## State Management

### In-Memory Data Model

```javascript
const state = {
  guests: [
    { name: 'Mom', restriction: null },
    { name: 'Dad', restriction: null },
    { name: 'Cousin Emma', restriction: 'Vegetarian' }
  ],
  dishes: [
    { name: 'Turkey', contributor: 'Dad', type: 'main', containsMeat: true, servingRecommendation: '12 lbs' },
    { name: 'Mashed Potatoes', contributor: 'Mom', type: 'side', containsMeat: false, servingRecommendation: '2 lbs' }
  ]
};
```

### Serving Calculation Logic

```javascript
const SERVING_MULTIPLIERS = {
  turkey: 1.5,  // lbs per person
  ham: 0.5,
  default: 0.25
};

function calculateServing(dishName, guestCount) {
  const lowerName = dishName.toLowerCase();
  let multiplier = SERVING_MULTIPLIERS.default;

  if (lowerName.includes('turkey')) multiplier = SERVING_MULTIPLIERS.turkey;
  else if (lowerName.includes('ham')) multiplier = SERVING_MULTIPLIERS.ham;

  return `${guestCount * multiplier} lbs`;
}
```

### Dietary Conflict Detection

```javascript
function checkDietaryConflicts(guests, dishes) {
  const vegetarians = guests.filter(g =>
    g.restriction?.toLowerCase().includes('vegetarian')
  );

  const allMeat = dishes.length > 0 && dishes.every(d => d.containsMeat);

  if (vegetarians.length > 0 && allMeat) {
    return {
      hasConflict: true,
      affectedGuests: vegetarians.map(g => g.name)
    };
  }

  return { hasConflict: false };
}
```

## Development Workflow

### TDD Cycle for Deterministic Features

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│   1. WRITE TEST (RED)                                          │
│      Add test case to dinner-form.spec.ts                      │
│      Run: npx playwright test → See FAIL                       │
│                                                                │
│   2. IMPLEMENT (GREEN)                                         │
│      Add HTML elements with data-testid                        │
│      Add JavaScript event handlers                             │
│      Run: npx playwright test → See PASS                       │
│                                                                │
│   3. REFINE (REFACTOR)                                         │
│      Clean up code, add edge cases                             │
│      Run: npx playwright test → Confirm no regression          │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

## Files

| File | Purpose |
|------|---------|
| `app/index.html` | Main application UI |
| `modules/01-deterministic-tdd/tests/dinner-form.spec.ts` | Test specifications |
| `modules/01-deterministic-tdd/playwright.config.ts` | Test configuration |

## Success Metrics

### Technical
- All Playwright tests pass on CI
- Tests run in under 30 seconds
- No flaky tests (100% consistent)

### User Experience
- All interactions feel responsive
- Form clears correctly after each add
- Warnings appear immediately when conditions are met
