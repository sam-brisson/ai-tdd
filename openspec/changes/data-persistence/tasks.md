# Tasks: Data Persistence

## Acceptance Criteria → Test Cases

Each acceptance criterion below maps directly to a test in `modules/01-deterministic-tdd/tests/dinner-form.spec.ts`.

---

## Guest Persistence

- [ ] **Guest data persists after page refresh**
  ```typescript
  // OpenSpec: "Guest data persists after page refresh"
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

## Dish Persistence

- [ ] **Dish data persists after page refresh**
  ```typescript
  // OpenSpec: "Dish data persists after page refresh"
  test('persists dishes after page refresh', async ({ page }) => {
    // Add a dish
    await page.fill('[data-testid="dish-name-input"]', 'Pumpkin Pie');
    await page.fill('[data-testid="dish-contributor-input"]', 'Mom');
    await page.selectOption('[data-testid="dish-type-select"]', 'dessert');
    await page.click('[data-testid="add-dish-button"]');

    // Refresh the page
    await page.reload();

    // Dish should still be there
    await expect(page.locator('[data-testid="desserts-list"]'))
      .toContainText('Pumpkin Pie');
  });
  ```

---

## Implementation Tasks

- [ ] Add `saveState()` function to persist state to localStorage
- [ ] Add `loadState()` function to restore state on page load
- [ ] Call `saveState()` after adding guests
- [ ] Call `saveState()` after adding dishes
- [ ] Call `saveState()` after saving dietary restrictions
- [ ] Call `loadState()` and render on page initialization

---

## Definition of Done

- [ ] Both persistence tests pass
- [ ] Manual testing confirms data survives refresh
- [ ] No console errors
