# Tasks: Guest and Menu Management

## Acceptance Criteria → Test Cases

Each acceptance criterion below maps directly to a test in `modules/01-deterministic-tdd/tests/dinner-form.spec.ts`. The format shows the requirement and its corresponding Playwright test.

---

## Guest Management

Core functionality for tracking dinner attendees.

- [x] **Can add a guest by typing name and clicking button**
  ```typescript
  // dinner-form.spec.ts
  test('can add a guest name', async ({ page }) => {
    await page.fill('[data-testid="guest-name-input"]', 'Grandma Rose');
    await page.click('[data-testid="add-guest-button"]');

    await expect(page.locator('[data-testid="guest-list"]'))
      .toContainText('Grandma Rose');
  });
  ```

- [x] **Can add multiple guests in sequence**
  ```typescript
  test('can add multiple guests', async ({ page }) => {
    const guests = ['Mom', 'Dad', 'Uncle Bob'];

    for (const guest of guests) {
      await page.fill('[data-testid="guest-name-input"]', guest);
      await page.click('[data-testid="add-guest-button"]');
    }

    const guestList = page.locator('[data-testid="guest-list"]');
    for (const guest of guests) {
      await expect(guestList).toContainText(guest);
    }
  });
  ```

- [x] **Input field clears after adding guest**
  ```typescript
  test('clears input after adding guest', async ({ page }) => {
    await page.fill('[data-testid="guest-name-input"]', 'Grandma Rose');
    await page.click('[data-testid="add-guest-button"]');

    await expect(page.locator('[data-testid="guest-name-input"]'))
      .toHaveValue('');
  });
  ```

- [x] **Guest count badge shows correct number**
  ```typescript
  test('displays guest count', async ({ page }) => {
    const guests = ['Mom', 'Dad', 'Sis'];

    for (const guest of guests) {
      await page.fill('[data-testid="guest-name-input"]', guest);
      await page.click('[data-testid="add-guest-button"]');
    }

    await expect(page.locator('[data-testid="guest-count"]'))
      .toContainText('3');
  });
  ```

---

## Dish Management

Tracking menu items and their contributors.

- [x] **Can add dish with name, contributor, and type**
  ```typescript
  test('can add a dish with contributor', async ({ page }) => {
    await page.fill('[data-testid="dish-name-input"]', 'Mashed Potatoes');
    await page.fill('[data-testid="dish-contributor-input"]', 'Uncle Bob');
    await page.selectOption('[data-testid="dish-type-select"]', 'side');
    await page.click('[data-testid="add-dish-button"]');

    const sidesList = page.locator('[data-testid="side-dishes-list"]');
    await expect(sidesList).toContainText('Mashed Potatoes');
    await expect(sidesList).toContainText('Uncle Bob');
  });
  ```

- [x] **Dishes appear in correct category section**
  ```typescript
  test('can categorize dishes by type', async ({ page }) => {
    // Add a main dish
    await page.fill('[data-testid="dish-name-input"]', 'Turkey');
    await page.fill('[data-testid="dish-contributor-input"]', 'Dad');
    await page.selectOption('[data-testid="dish-type-select"]', 'main');
    await page.click('[data-testid="add-dish-button"]');

    // Add a side dish
    await page.fill('[data-testid="dish-name-input"]', 'Green Beans');
    await page.fill('[data-testid="dish-contributor-input"]', 'Mom');
    await page.selectOption('[data-testid="dish-type-select"]', 'side');
    await page.click('[data-testid="add-dish-button"]');

    // Check categorization
    await expect(page.locator('[data-testid="main-dishes"]'))
      .toContainText('Turkey');
    await expect(page.locator('[data-testid="side-dishes"]'))
      .toContainText('Green Beans');
  });
  ```

---

## Dietary Restrictions

Tracking and warning about guest dietary needs.

- [x] **Can add restriction to any guest**
  ```typescript
  test('can add dietary restriction for a guest', async ({ page }) => {
    // First add a guest
    await page.fill('[data-testid="guest-name-input"]', 'Cousin Emma');
    await page.click('[data-testid="add-guest-button"]');

    // Click on guest to edit
    await page.click('[data-testid="guest-item-Cousin Emma"]');

    // Add restriction
    await page.fill('[data-testid="restriction-input"]', 'Vegetarian');
    await page.click('[data-testid="save-restriction-button"]');

    // Verify restriction is displayed
    await expect(page.locator('[data-testid="guest-item-Cousin Emma"]'))
      .toContainText('Vegetarian');
  });
  ```

- [x] **Warning appears when vegetarian guest + all meat dishes**
  ```typescript
  test('shows dietary warning if dish conflicts with restrictions', async ({ page }) => {
    // Add guest with restriction
    await page.fill('[data-testid="guest-name-input"]', 'Cousin Emma');
    await page.click('[data-testid="add-guest-button"]');
    await page.click('[data-testid="guest-item-Cousin Emma"]');
    await page.fill('[data-testid="restriction-input"]', 'Vegetarian');
    await page.click('[data-testid="save-restriction-button"]');

    // Add meat dish
    await page.fill('[data-testid="dish-name-input"]', 'Turkey');
    await page.fill('[data-testid="dish-contributor-input"]', 'Dad');
    await page.check('[data-testid="contains-meat-checkbox"]');
    await page.click('[data-testid="add-dish-button"]');

    // Should show warning
    await expect(page.locator('[data-testid="dietary-warning"]'))
      .toContainText('Cousin Emma');
  });
  ```

---

## Serving Calculations

Automatic portion recommendations.

- [x] **Turkey shows 1.5 lbs per person calculation**
  ```typescript
  test('calculates turkey serving size based on guest count', async ({ page }) => {
    // Add 8 guests
    const guests = ['Mom', 'Dad', 'Sis', 'Bro', 'Grandma', 'Grandpa', 'Aunt', 'Uncle'];
    for (const guest of guests) {
      await page.fill('[data-testid="guest-name-input"]', guest);
      await page.click('[data-testid="add-guest-button"]');
    }

    // Add turkey
    await page.fill('[data-testid="dish-name-input"]', 'Turkey');
    await page.fill('[data-testid="dish-contributor-input"]', 'Dad');
    await page.selectOption('[data-testid="dish-type-select"]', 'main');
    await page.click('[data-testid="add-dish-button"]');

    // Check serving recommendation (1.5 lbs per person for turkey = 12 lbs)
    await expect(page.locator('[data-testid="serving-recommendation-Turkey"]'))
      .toContainText('12 lbs');
  });
  ```

- [x] **Calculation based on guest count at dish add time**
  ```typescript
  test('serving size is based on guest count at time of dish creation', async ({ page }) => {
    // Add 4 guests first
    for (const guest of ['A', 'B', 'C', 'D']) {
      await page.fill('[data-testid="guest-name-input"]', guest);
      await page.click('[data-testid="add-guest-button"]');
    }

    // Add turkey - should calculate based on 4 guests
    await page.fill('[data-testid="dish-name-input"]', 'Turkey');
    await page.fill('[data-testid="dish-contributor-input"]', 'Dad');
    await page.selectOption('[data-testid="dish-type-select"]', 'main');
    await page.click('[data-testid="add-dish-button"]');

    // Should show 6 lbs (4 guests * 1.5)
    await expect(page.locator('[data-testid="serving-recommendation-Turkey"]'))
      .toContainText('6 lbs');
  });
  ```

---

## Data Persistence

Saving and restoring planner data across page reloads.

- [x] **Guest data persists after page refresh**
  ```typescript
  test('persists guests after page refresh', async ({ page }) => {
    // Add a guest
    await page.fill('[data-testid="guest-name-input"]', 'Grandma Rose');
    await page.click('[data-testid="add-guest-button"]');

    // Refresh the page
    await page.reload();

    // Guest should still be there
    await expect(page.locator('[data-testid="guest-list"]'))
      .toContainText('Grandma Rose');
  });
  ```

---

## Implementation Tasks

### HTML Structure
- [x] Guest input form with data-testid attributes
- [x] Guest list container
- [x] Guest count badge
- [x] Dish input form with type selector
- [x] Category sections (mains, sides, desserts, appetizers)
- [x] Dietary warning container (hidden by default)

### JavaScript Functionality
- [x] addGuest() - adds guest to state and DOM
- [x] addDish() - adds dish with categorization
- [x] setRestriction() - modal and badge display
- [x] calculateServing() - serving size logic
- [x] checkConflicts() - dietary warning logic
- [x] saveState() - persist to localStorage
- [x] loadState() - restore from localStorage on page load

### Styling
- [x] Clean, readable layout
- [x] Clear category separation
- [x] Warning styling (red/orange)
- [x] Restriction badges

---

## Definition of Done

- [x] All 11 Playwright tests pass
- [x] All data-testid attributes in place
- [x] No console errors during operation
- [x] Manual testing confirms smooth UX
- [x] Data persists across page refresh
