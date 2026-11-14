# Data Persistence - Acceptance Criteria

> **Test Type:** Deterministic (Playwright)
> **Test File:** `modules/01-deterministic-tdd/tests/dinner-form.spec.ts`

---

## Guest Persistence

- [x] **Guests persist after page refresh**
  ```typescript
  test('guests persist after page refresh', async ({ page }) => {
    // Add a guest
    await page.getByTestId('guest-name-input').fill('Grandma Rose');
    await page.getByTestId('add-guest-button').click();

    // Verify guest was added
    await expect(page.getByTestId('guest-list')).toContainText('Grandma Rose');

    // Refresh the page
    await page.reload();

    // Guest should still be there
    await expect(page.getByTestId('guest-list')).toContainText('Grandma Rose');
  });
  ```

## Dish Persistence

- [x] **Dishes persist after page refresh**
  ```typescript
  test('dishes persist after page refresh', async ({ page }) => {
    // Add a dish (default type is "main")
    await page.getByTestId('dish-name-input').fill('Roasted Turkey');
    await page.getByTestId('dish-contributor-input').fill('Mom');
    await page.getByTestId('add-dish-button').click();

    // Verify dish was added (dishes appear in category lists)
    await expect(page.getByTestId('main-dishes-list')).toContainText('Roasted Turkey');

    // Refresh the page
    await page.reload();

    // Dish should still be there
    await expect(page.getByTestId('main-dishes-list')).toContainText('Roasted Turkey');
  });
  ```

## Edge Cases

- [x] **Empty state loads correctly** (no localStorage yet)
  ```typescript
  test('app loads correctly with no saved data', async ({ page }) => {
    // Clear any existing data
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    // App should show empty state
    await expect(page.getByTestId('guest-count')).toContainText('0');
    await expect(page.getByTestId('guest-list')).toBeEmpty();
  });
  ```
