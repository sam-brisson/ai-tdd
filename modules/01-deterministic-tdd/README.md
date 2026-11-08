# Module 1: Deterministic TDD with Playwright

**Duration:** 1-2 hours
**Tools:** Playwright, TypeScript/JavaScript
**Prerequisite:** None

---

## Learning Objectives

By the end of this module, you will:
- Understand the RED → GREEN → REFACTOR cycle
- Write acceptance criteria as executable tests
- Use Playwright to test a web form
- Experience the feedback loop: test fails → implement → test passes

---

## The Use Case: Thanksgiving Dinner Planner

We're building a form where people can plan a shared Thanksgiving dinner. In this module, we'll implement the **deterministic** parts:

- Enter guest names
- Add dishes (with who's bringing what)
- Specify dietary restrictions
- Calculate serving sizes

These are all testable with exact assertions - no AI needed (yet).

---

## The TDD Cycle

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│   1. Write Test → 2. Run → 3. See RED (fail)        │
│         ↑                        ↓                   │
│         │                  4. Write Code             │
│         │                        ↓                   │
│   6. Refactor ← 5. See GREEN ← Run Again            │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

## Setup

### Install Dependencies

```bash
cd modules/01-deterministic-tdd

# Install Playwright and dependencies
npm install
npx playwright install
```

### Project Structure

```
01-deterministic-tdd/
├── tests/
│   ├── dinner-form.spec.ts    # Your test file
│   └── fixtures/              # Test data
├── playwright.config.ts       # Playwright configuration
├── package.json
└── README.md
```

---

## Exercise 1: Write Your First Failing Test (RED)

### Acceptance Criteria

> **As a dinner organizer, I want to add a guest name so that I can track who's coming.**

### Write the Test

Create `tests/dinner-form.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Thanksgiving Dinner Planner', () => {

  test('can add a guest name', async ({ page }) => {
    // Arrange: Go to the app
    await page.goto('/');

    // Act: Add a guest
    await page.fill('[data-testid="guest-name-input"]', 'Grandma Rose');
    await page.click('[data-testid="add-guest-button"]');

    // Assert: Guest appears in the list
    await expect(page.locator('[data-testid="guest-list"]')).toContainText('Grandma Rose');
  });

});
```

### Run the Test

```bash
npx playwright test
```

**Expected Result:** ❌ FAIL - The page doesn't exist yet!

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/
```

**This is correct!** You've written your specification. Now implement it.

---

## Exercise 2: Make It Pass (GREEN)

The app code lives in `/app`. Open it and implement:

1. A form with a guest name input
2. An "Add Guest" button
3. A list that displays added guests

### Minimal Implementation

In `app/index.html`:

```html
<input data-testid="guest-name-input" type="text" placeholder="Guest name">
<button data-testid="add-guest-button">Add Guest</button>
<ul data-testid="guest-list"></ul>

<script>
  const input = document.querySelector('[data-testid="guest-name-input"]');
  const button = document.querySelector('[data-testid="add-guest-button"]');
  const list = document.querySelector('[data-testid="guest-list"]');

  button.addEventListener('click', () => {
    const li = document.createElement('li');
    li.textContent = input.value;
    list.appendChild(li);
    input.value = '';
  });
</script>
```

### Run the Test Again

```bash
npx playwright test
```

**Expected Result:** ✅ PASS

```
✓ can add a guest name (1.2s)

1 passed
```

---

## Exercise 3: Add More Tests

Now that you understand the cycle, add tests for these acceptance criteria:

### Test 2: Add a Dish

> **As an organizer, I want to add a dish with who's bringing it.**

```typescript
test('can add a dish with contributor', async ({ page }) => {
  await page.goto('/');

  await page.fill('[data-testid="dish-name-input"]', 'Mashed Potatoes');
  await page.fill('[data-testid="dish-contributor-input"]', 'Uncle Bob');
  await page.click('[data-testid="add-dish-button"]');

  const dishList = page.locator('[data-testid="dish-list"]');
  await expect(dishList).toContainText('Mashed Potatoes');
  await expect(dishList).toContainText('Uncle Bob');
});
```

### Test 3: Dietary Restrictions

> **As an organizer, I want to note dietary restrictions so no one goes hungry.**

```typescript
test('can add dietary restriction for a guest', async ({ page }) => {
  await page.goto('/');

  // First add a guest
  await page.fill('[data-testid="guest-name-input"]', 'Cousin Emma');
  await page.click('[data-testid="add-guest-button"]');

  // Then add their restriction
  await page.click('[data-testid="guest-Cousin Emma"]');
  await page.fill('[data-testid="restriction-input"]', 'Vegetarian');
  await page.click('[data-testid="save-restriction-button"]');

  await expect(page.locator('[data-testid="guest-Cousin Emma"]')).toContainText('Vegetarian');
});
```

### Test 4: Calculate Servings

> **As an organizer, I want serving size recommendations based on guest count.**

```typescript
test('calculates serving sizes based on guest count', async ({ page }) => {
  await page.goto('/');

  // Add 8 guests
  const guests = ['Mom', 'Dad', 'Sis', 'Bro', 'Grandma', 'Grandpa', 'Aunt', 'Uncle'];
  for (const guest of guests) {
    await page.fill('[data-testid="guest-name-input"]', guest);
    await page.click('[data-testid="add-guest-button"]');
  }

  // Add turkey
  await page.fill('[data-testid="dish-name-input"]', 'Turkey');
  await page.selectOption('[data-testid="dish-type-select"]', 'main');
  await page.click('[data-testid="add-dish-button"]');

  // Check serving recommendation (1.5 lbs per person for turkey)
  await expect(page.locator('[data-testid="serving-recommendation-Turkey"]'))
    .toContainText('12 lbs');
});
```

---

## Exercise 4: Refactor

Once all tests pass, look for improvements:

- Extract repeated setup into `beforeEach`
- Add page object pattern for cleaner tests
- Improve error messages

**Key Rule:** Only refactor when tests are GREEN. Run tests after each change.

```typescript
// Before: Repeated setup
test('test 1', async ({ page }) => {
  await page.goto('/');
  await page.fill('[data-testid="guest-name-input"]', 'Guest 1');
  // ...
});

test('test 2', async ({ page }) => {
  await page.goto('/');
  await page.fill('[data-testid="guest-name-input"]', 'Guest 1');
  // ...
});

// After: Shared setup
test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('test 1', async ({ page }) => {
  await page.fill('[data-testid="guest-name-input"]', 'Guest 1');
  // ...
});
```

---

## Key Takeaways

1. **Write the test BEFORE the code** - The test is your specification
2. **Start with RED** - If tests pass before you write code, they're not testing anything
3. **Minimal implementation** - Write just enough code to pass the test
4. **Refactor only when GREEN** - Never refactor failing tests
5. **Tests are documentation** - Anyone can read them and understand the requirements

---

## What's Next?

In **Module 2**, we'll add an AI-powered feature:

> **As an organizer, I want wine and beer pairing suggestions for our meal.**

This introduces non-deterministic output - you can't assert exact strings. You'll learn how to test AI behavior using promptfoo's `llm-rubric` assertions.

**[Continue to Module 2 →](../02-ai-tdd/README.md)**
