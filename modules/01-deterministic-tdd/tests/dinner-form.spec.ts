import { test, expect } from '@playwright/test';

/**
 * Thanksgiving Dinner Planner - Deterministic Features
 *
 * These tests are derived from OpenSpec acceptance criteria.
 * See: openspec/changes/guest-management-feature/tasks.md
 *
 * Each test traces back to a specific acceptance criterion in tasks.md.
 * If you need to understand WHY a test exists, check the spec.
 */
test.describe('Thanksgiving Dinner Planner - Deterministic Features', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // ============================================
  // GUEST MANAGEMENT
  // OpenSpec: guest-management-feature/tasks.md
  // ============================================

  // OpenSpec: "Can add a guest by typing name and clicking button"
  test('can add a guest name', async ({ page }) => {
    // Arrange & Act
    await page.fill('[data-testid="guest-name-input"]', 'Grandma Rose');
    await page.click('[data-testid="add-guest-button"]');

    // Assert
    await expect(page.locator('[data-testid="guest-list"]')).toContainText('Grandma Rose');
  });

  // OpenSpec: "Can add multiple guests in sequence"
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

  // OpenSpec: "Input field clears after adding guest"
  test('clears input after adding guest', async ({ page }) => {
    await page.fill('[data-testid="guest-name-input"]', 'Grandma Rose');
    await page.click('[data-testid="add-guest-button"]');

    await expect(page.locator('[data-testid="guest-name-input"]')).toHaveValue('');
  });

  // OpenSpec: "Guest count badge shows correct number"
  test('displays guest count', async ({ page }) => {
    const guests = ['Mom', 'Dad', 'Sis'];

    for (const guest of guests) {
      await page.fill('[data-testid="guest-name-input"]', guest);
      await page.click('[data-testid="add-guest-button"]');
    }

    await expect(page.locator('[data-testid="guest-count"]')).toContainText('3');
  });

  // ============================================
  // DISH MANAGEMENT
  // OpenSpec: guest-management-feature/tasks.md
  // ============================================

  // OpenSpec: "Can add dish with name, contributor, and type"
  test('can add a dish with contributor', async ({ page }) => {
    await page.fill('[data-testid="dish-name-input"]', 'Mashed Potatoes');
    await page.fill('[data-testid="dish-contributor-input"]', 'Uncle Bob');
    await page.selectOption('[data-testid="dish-type-select"]', 'side');
    await page.click('[data-testid="add-dish-button"]');

    // Dishes are categorized - check the side dishes list
    const sidesList = page.locator('[data-testid="side-dishes-list"]');
    await expect(sidesList).toContainText('Mashed Potatoes');
    await expect(sidesList).toContainText('Uncle Bob');
  });

  // OpenSpec: "Dishes appear in correct category section"
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
    await expect(page.locator('[data-testid="main-dishes"]')).toContainText('Turkey');
    await expect(page.locator('[data-testid="side-dishes"]')).toContainText('Green Beans');
  });

  // ============================================
  // DIETARY RESTRICTIONS
  // OpenSpec: guest-management-feature/tasks.md
  // ============================================

  // OpenSpec: "Can add restriction to any guest"
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

  // OpenSpec: "Warning appears when vegetarian guest + all meat dishes"
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

  // ============================================
  // SERVING CALCULATIONS
  // OpenSpec: guest-management-feature/tasks.md
  // ============================================

  // OpenSpec: "Turkey shows 1.5 lbs per person calculation"
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

  // OpenSpec: "Calculation based on guest count at dish add time"
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

  // ============================================
  // DATA PERSISTENCE
  // OpenSpec: data-persistence/tasks.md
  // ============================================

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

  // ============================================
  // DELETE GUEST
  // OpenSpec: delete-guest/tasks.md
  // ============================================

  // OpenSpec: "Clicking delete and confirming removes the guest"
  test('can delete a guest after confirmation', async ({ page }) => {
    // Add a guest
    await page.fill('[data-testid="guest-name-input"]', 'Uncle Bob');
    await page.click('[data-testid="add-guest-button"]');

    // Set up dialog handler BEFORE clicking
    page.on('dialog', dialog => dialog.accept());

    // Click delete button
    await page.click('[data-testid="delete-guest-Uncle Bob"]');

    // Guest should be gone
    await expect(page.locator('[data-testid="guest-list"]'))
      .not.toContainText('Uncle Bob');
  });

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

});
