# Tasks: Delete Guest

## Acceptance Criteria → Test Cases

Each acceptance criterion maps to a Playwright test in `modules/01-deterministic-tdd/tests/dinner-form.spec.ts`.

---

## Happy Path

- [ ] **Clicking delete and confirming removes the guest**
  ```typescript
  // OpenSpec: "Clicking delete and confirming removes the guest"
  test('can delete a guest after confirmation', async ({ page }) => {
    // Add a guest
    await page.fill('[data-testid="guest-name-input"]', 'Uncle Bob');
    await page.click('[data-testid="add-guest-button"]');

    // Click delete button
    await page.click('[data-testid="delete-guest-Uncle Bob"]');

    // Accept the confirmation dialog
    page.on('dialog', dialog => dialog.accept());

    // Guest should be gone
    await expect(page.locator('[data-testid="guest-list"]'))
      .not.toContainText('Uncle Bob');
  });
  ```

- [ ] **Guest count updates after deletion**
  ```typescript
  // OpenSpec: "Guest count updates after deletion"
  test('guest count decreases after deletion', async ({ page }) => {
    // Add two guests
    await page.fill('[data-testid="guest-name-input"]', 'Mom');
    await page.click('[data-testid="add-guest-button"]');
    await page.fill('[data-testid="guest-name-input"]', 'Dad');
    await page.click('[data-testid="add-guest-button"]');

    // Verify count is 2
    await expect(page.locator('[data-testid="guest-count"]')).toContainText('2');

    // Delete one guest (accept dialog)
    page.on('dialog', dialog => dialog.accept());
    await page.click('[data-testid="delete-guest-Mom"]');

    // Count should be 1
    await expect(page.locator('[data-testid="guest-count"]')).toContainText('1');
  });
  ```

---

## Confirmation Flow

- [ ] **Canceling the confirmation keeps the guest**
  ```typescript
  // OpenSpec: "Canceling the confirmation keeps the guest"
  test('canceling delete keeps the guest', async ({ page }) => {
    // Add a guest
    await page.fill('[data-testid="guest-name-input"]', 'Grandma');
    await page.click('[data-testid="add-guest-button"]');

    // Click delete but cancel
    page.on('dialog', dialog => dialog.dismiss());
    await page.click('[data-testid="delete-guest-Grandma"]');

    // Guest should still be there
    await expect(page.locator('[data-testid="guest-list"]'))
      .toContainText('Grandma');
  });
  ```

---

## Persistence

- [ ] **Deletion persists after page refresh**
  ```typescript
  // OpenSpec: "Deletion persists after page refresh"
  test('deleted guest stays deleted after refresh', async ({ page }) => {
    // Add a guest
    await page.fill('[data-testid="guest-name-input"]', 'Cousin Emma');
    await page.click('[data-testid="add-guest-button"]');

    // Delete with confirmation
    page.on('dialog', dialog => dialog.accept());
    await page.click('[data-testid="delete-guest-Cousin Emma"]');

    // Refresh
    await page.reload();

    // Guest should still be gone
    await expect(page.locator('[data-testid="guest-list"]'))
      .not.toContainText('Cousin Emma');
  });
  ```

---

## Implementation Tasks

- [ ] Add delete button (X) to each guest item in renderGuests()
- [ ] Add click handler that shows confirm() dialog
- [ ] If confirmed, remove guest from state.guests array
- [ ] Call renderGuests() and saveState() after deletion

---

## Definition of Done

- [ ] All 4 delete tests pass
- [ ] Manual testing confirms confirmation works
- [ ] Deletion persists after refresh
