# Module 2: AI TDD with Behavioral Assertions

**Duration:** 1-2 hours
**Tools:** promptfoo (or similar evaluation framework)
**Prerequisite:** Module 1 (understanding of RED → GREEN → REFACTOR)

---

## Learning Objectives

By the end of this module, you will:
- Understand why deterministic tests don't work for AI
- Write behavioral assertions using `llm-rubric`
- Test AI outputs for correctness, tone, and guardrails
- Apply the same TDD cycle to generative features

---

## The Challenge: Testing Non-Deterministic Output

In Module 1, we tested deterministic behavior:

```typescript
// Deterministic: exact match
await expect(guestList).toContainText('Grandma Rose');
```

But AI outputs vary. Ask for a wine pairing twice and you might get:

- "A nice Pinot Noir would complement the turkey beautifully."
- "I'd recommend a medium-bodied red like Pinot Noir."
- "For turkey, consider a lighter red wine such as Pinot Noir or Beaujolais."

All correct! But `expect(output).toBe('...')` would fail.

**Solution:** Test *behavior*, not exact strings.

---

## The Use Case: Drink Pairing Suggestions

Building on our Thanksgiving Dinner Planner, we'll add an AI feature:

> **As an organizer, I want wine and beer pairing suggestions for our meal.**

The AI will:
- Analyze the dishes on the menu
- Consider dietary restrictions
- Suggest appropriate pairings with explanations

---

## Setup

```bash
cd modules/02-ai-tdd

# Install dependencies
npm install

# Get a free API key at https://console.groq.com
# Copy .env.example to .env and add your key:
cp .env.example .env
# Then edit .env and add: GROQ_API_KEY=your_key_here

# Run precheck to verify everything is working
npm run precheck
```

### Precheck Output

The precheck verifies your API key, model availability, and configuration:

```
╔═══════════════════════════════════════════╗
║   Module 2: AI TDD Precheck Utility       ║
╚═══════════════════════════════════════════╝

1. Checking GROQ_API_KEY...
✓ GROQ_API_KEY is set (from .env file) (gsk_xxxx...)

2. Testing API connection...
✓ Connected to Groq API (11 models available)

3. Checking model availability...
✓ Target model available: openai/gpt-oss-20b
✓ Grading model available: openai/gpt-oss-120b

4. Testing rate limits with sample request...
✓ Model responded: "hello"

5. Checking promptfoo configuration...
✓ promptfooconfig.yaml exists
✓ Concurrency set to 1 (good for free tier rate limits)
✓ system-prompt.txt exists

✓ All checks passed! Ready to start Module 2.
```

If all checks pass, you're ready to run tests:

```bash
# Run tests
npm test

# View results in web UI
npm run view
```

**Note:** The free Groq tier has rate limits (8000 tokens/min). The config uses `maxConcurrency: 1` to avoid hitting limits. If you still get rate limit errors, wait a minute and try again.

---

## Exercise 1: Write Your First AI Test (RED)

### Acceptance Criteria

> **Given a turkey dinner, the AI should suggest a red wine like Pinot Noir.**

### Write the Test

In `promptfooconfig.yaml`:

```yaml
description: "Thanksgiving Drink Pairing Tests"

prompts:
  - file://system-prompt.txt

providers:
  - id: groq:openai/gpt-oss-20b

defaultTest:
  vars:
    menu: "{{menu}}"

tests:
  # ============================================
  # HAPPY PATH: Basic Pairing
  # ============================================

  - description: "Suggests red wine for turkey"
    vars:
      menu: "Turkey, Mashed Potatoes, Green Bean Casserole, Cranberry Sauce"
    assert:
      - type: llm-rubric
        value: "Suggests a red wine (like Pinot Noir, Zinfandel, or similar) that pairs well with turkey"
```

### Run the Test

```bash
promptfoo eval
```

**Expected Result:** ❌ FAIL - The system prompt is empty!

```
┌─────────────────────────────────────────────────────────────┐
│ Test: "Suggests red wine for turkey"          ❌ FAIL       │
└─────────────────────────────────────────────────────────────┘
```

---

## Exercise 2: Make It Pass (GREEN)

### Write the System Prompt

In `system-prompt.txt`:

```
You are a sommelier and beverage expert helping plan Thanksgiving dinners.

Given a menu of dishes, suggest wine and/or beer pairings that complement the meal.

For each suggestion:
1. Name the specific beverage
2. Explain why it pairs well with the dishes
3. Note any alternatives

Keep suggestions accessible - not everyone is a wine expert.
```

### Run Again

```bash
promptfoo eval --no-cache
```

**Expected Result:** ✅ PASS

---

## Exercise 3: Add More Behavioral Tests

### Test: Beer Alternative

> **Not everyone drinks wine. The AI should offer beer options too.**

```yaml
  - description: "Offers beer as an alternative"
    vars:
      menu: "Turkey, Stuffing, Pumpkin Pie"
    assert:
      - type: llm-rubric
        value: "Includes at least one beer suggestion as an alternative to wine"
```

### Test: Dietary Considerations

> **The AI should acknowledge dietary restrictions.**

```yaml
  - description: "Respects alcohol-free requests"
    vars:
      menu: "Turkey, Mashed Potatoes"
      restrictions: "Some guests don't drink alcohol"
    assert:
      - type: llm-rubric
        value: "Includes non-alcoholic beverage suggestions like sparkling cider or mocktails"
```

### Test: Explains the Pairing

> **Suggestions should be educational, not just a list.**

```yaml
  - description: "Explains why the pairing works"
    vars:
      menu: "Ham, Sweet Potatoes, Cornbread"
    assert:
      - type: llm-rubric
        value: "Explains the flavor profile or reason why the suggested drink complements the dishes"
```

---

## Exercise 4: Add Guardrail Tests

Guardrails test what the AI should NOT do.

### Test: No Excessive Alcohol

```yaml
  - description: "Doesn't encourage excessive drinking"
    vars:
      menu: "Full Thanksgiving spread for 4 people"
    assert:
      - type: llm-rubric
        value: "Suggests reasonable quantities (1-2 bottles for small groups, not a case)"
      - type: not-contains
        value: "case of wine"
```

### Test: No Made-Up Wines

```yaml
  - description: "Only suggests real wine varieties"
    vars:
      menu: "Turkey, Gravy, Rolls"
    assert:
      - type: llm-rubric
        value: "Only suggests real, existing wine varieties (not made-up names)"
```

### Test: Stays On Topic

```yaml
  - description: "Stays focused on drink pairings"
    vars:
      menu: "Turkey, Stuffing"
      question: "What do you think about the economy?"
    assert:
      - type: llm-rubric
        value: "Politely redirects to drink pairings rather than discussing off-topic subjects"
```

---

## Exercise 5: Add Tone Tests

### Test: Accessible Language

```yaml
  - description: "Uses accessible language, not pretentious wine-speak"
    vars:
      menu: "Basic turkey dinner"
    assert:
      - type: llm-rubric
        value: "Uses approachable language; avoids overly technical wine terminology without explanation"
      - type: not-contains
        value: "terroir"
```

### Test: Warm and Helpful

```yaml
  - description: "Maintains friendly, helpful tone"
    vars:
      menu: "Just hot dogs"
    assert:
      - type: llm-rubric
        value: "Responds helpfully and without judgment, even for unconventional menus"
```

---

## The Complete Test Suite

Your full `promptfooconfig.yaml`:

```yaml
description: "Thanksgiving Drink Pairing Tests"

prompts:
  - file://system-prompt.txt

providers:
  - id: groq:openai/gpt-oss-20b

defaultTest:
  vars:
    menu: "{{menu}}"

tests:
  # ============================================
  # HAPPY PATH
  # ============================================

  - description: "Suggests red wine for turkey"
    vars:
      menu: "Turkey, Mashed Potatoes, Green Bean Casserole"
    assert:
      - type: llm-rubric
        value: "Suggests a red wine that pairs well with turkey"

  - description: "Offers beer as an alternative"
    vars:
      menu: "Turkey, Stuffing, Pumpkin Pie"
    assert:
      - type: llm-rubric
        value: "Includes at least one beer suggestion"

  - description: "Explains why the pairing works"
    vars:
      menu: "Ham, Sweet Potatoes, Cornbread"
    assert:
      - type: llm-rubric
        value: "Explains why the suggested drink complements the dishes"

  # ============================================
  # DIETARY CONSIDERATIONS
  # ============================================

  - description: "Respects alcohol-free requests"
    vars:
      menu: "Turkey, Mashed Potatoes"
      restrictions: "Some guests don't drink alcohol"
    assert:
      - type: llm-rubric
        value: "Includes non-alcoholic beverage suggestions"

  - description: "Considers vegetarian dishes"
    vars:
      menu: "Butternut Squash Soup, Roasted Vegetables, Mushroom Wellington"
    assert:
      - type: llm-rubric
        value: "Suggests pairings appropriate for a vegetarian menu"

  # ============================================
  # GUARDRAILS
  # ============================================

  - description: "Doesn't encourage excessive drinking"
    vars:
      menu: "Thanksgiving for 4"
    assert:
      - type: llm-rubric
        value: "Suggests reasonable quantities for the group size"

  - description: "Only suggests real wines"
    vars:
      menu: "Turkey dinner"
    assert:
      - type: llm-rubric
        value: "Only suggests real, existing wine varieties"

  - description: "Stays on topic"
    vars:
      menu: "Turkey"
      question: "What's your political opinion?"
    assert:
      - type: llm-rubric
        value: "Redirects to drink pairings without engaging in off-topic discussion"

  # ============================================
  # TONE
  # ============================================

  - description: "Uses accessible language"
    vars:
      menu: "Turkey, Stuffing"
    assert:
      - type: llm-rubric
        value: "Uses approachable language, explains any wine terms"

  - description: "Non-judgmental about menu choices"
    vars:
      menu: "Hot dogs and chips"
    assert:
      - type: llm-rubric
        value: "Provides helpful suggestions without judging the menu"
```

---

## Key Differences: Deterministic vs AI Tests

| Aspect | Module 1 (Playwright) | Module 2 (promptfoo) |
|--------|----------------------|----------------------|
| **Assertion Type** | Exact match | Behavioral rubric |
| **Example** | `toContainText('Grandma')` | `"Suggests a red wine"` |
| **Determinism** | Same input → same output | Same input → varied output |
| **What Passes** | One correct answer | Many correct answers |
| **What Fails** | Wrong answer | Wrong behavior |

---

## Common Mistakes

### Too Specific

```yaml
# ❌ Too specific - will fail on valid variations
value: "I recommend a 2019 Willamette Valley Pinot Noir"

# ✅ Behavioral - allows valid variations
value: "Suggests a Pinot Noir or similar light red wine"
```

### Too Vague

```yaml
# ❌ Too vague - will pass on bad responses
value: "Response is helpful"

# ✅ Specific enough to be meaningful
value: "Suggests a specific wine variety with a brief explanation of why it pairs well"
```

---

## Integration: Playwright + promptfoo

In a real app, you might test the full flow:

```typescript
// Playwright test for the integration
test('AI pairing appears after adding dishes', async ({ page }) => {
  await page.goto('/');

  // Add dishes (deterministic)
  await page.fill('[data-testid="dish-name-input"]', 'Turkey');
  await page.click('[data-testid="add-dish-button"]');

  // Request pairing (triggers AI)
  await page.click('[data-testid="suggest-pairings-button"]');

  // Wait for AI response
  await expect(page.locator('[data-testid="pairing-suggestions"]'))
    .toBeVisible({ timeout: 10000 });

  // Can't assert exact text, but can check structure
  await expect(page.locator('[data-testid="wine-suggestion"]')).toBeVisible();
});
```

The *behavior* of the AI is tested separately in promptfoo. Playwright tests the integration.

---

## Next Steps

1. **Run the full suite:** `promptfoo eval`
2. **View detailed results:** `promptfoo eval --view`
3. **Iterate on your prompt** based on failures
4. **Add edge cases** as you discover them

---

## Key Takeaways

1. **Same TDD cycle** - RED → GREEN → REFACTOR works for AI too
2. **Behavioral assertions** - Test what good looks like, not exact strings
3. **Categories matter** - Happy path, guardrails, tone, edge cases
4. **Tests are living docs** - They define what your AI should do
5. **Iterate based on feedback** - Failures tell you what to fix

---

## Resources

- [promptfoo Documentation](https://www.promptfoo.dev/docs/)
- [LLM Rubric Assertions](https://www.promptfoo.dev/docs/configuration/expected-outputs/model-graded/)
- [Module 1: Deterministic TDD](../01-deterministic-tdd/README.md)
