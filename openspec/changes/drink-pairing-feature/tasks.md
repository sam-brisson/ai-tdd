# Tasks: AI-Powered Drink Pairing Suggestions

## Acceptance Criteria → Test Cases

Each acceptance criterion below maps directly to a test in `modules/02-ai-tdd/promptfooconfig.yaml`. The format shows the requirement and its corresponding test assertion.

**Note:** The current implementation is menu-based (user provides dishes, AI suggests pairings). A future enhancement could add conversational follow-up questions.

---

## Happy Path

Core functionality that must work for the feature to be useful.

- [x] **Suggests wine for turkey**
  ```yaml
  # promptfooconfig.yaml
  - description: "Suggests wine for traditional turkey dinner"
    vars:
      menu: "Roasted Turkey, Mashed Potatoes, Green Bean Casserole, Cranberry Sauce"
    assert:
      - type: llm-rubric
        value: "Suggests at least one wine variety that pairs well with turkey (such as Pinot Noir, Zinfandel, or Chardonnay)"
  ```

- [x] **Offers beer alternatives**
  ```yaml
  - description: "Offers beer as an alternative"
    vars:
      menu: "Turkey, Stuffing, Gravy, Pumpkin Pie"
    assert:
      - type: llm-rubric
        value: "Includes at least one beer suggestion as an alternative to wine"
  ```

- [x] **Explains why pairings work**
  ```yaml
  - description: "Explains why the pairing works"
    vars:
      menu: "Honey-Glazed Ham, Sweet Potato Casserole, Cornbread"
    assert:
      - type: llm-rubric
        value: "Provides a brief explanation of why the suggested drink complements the flavors of the dishes"
  ```

- [x] **Handles multiple main dishes**
  ```yaml
  - description: "Handles multiple main dishes"
    vars:
      menu: "Turkey AND Ham, Mashed Potatoes, Rolls"
    assert:
      - type: llm-rubric
        value: "Suggests pairings that work with both turkey and ham"
  ```

---

## Dietary Considerations

The AI must respect guest needs and preferences.

- [x] **Suggests non-alcoholic options**
  ```yaml
  - description: "Includes non-alcoholic options when requested"
    vars:
      menu: "Turkey, Stuffing, Gravy"
      restrictions: "Some guests don't drink alcohol"
    assert:
      - type: llm-rubric
        value: "Includes at least one non-alcoholic beverage suggestion (like sparkling cider, mocktails, or sparkling water)"
  ```

- [x] **Appropriate for vegetarian menus**
  ```yaml
  - description: "Considers vegetarian menu"
    vars:
      menu: "Butternut Squash Soup, Roasted Root Vegetables, Mushroom Wellington, Apple Crisp"
    assert:
      - type: llm-rubric
        value: "Suggests pairings appropriate for an entirely vegetarian menu"
  ```

- [x] **Non-judgmental about simple menus**
  ```yaml
  - description: "Handles simple/casual menus gracefully"
    vars:
      menu: "Rotisserie Chicken, Store-bought sides"
    assert:
      - type: llm-rubric
        value: "Provides helpful suggestions without being pretentious or judgmental about the casual menu"
  ```

---

## Guardrails

The AI must NOT do these things.

- [x] **Suggests reasonable quantities**
  ```yaml
  - description: "Suggests reasonable quantities"
    vars:
      menu: "Full Thanksgiving dinner for 4 people"
    assert:
      - type: llm-rubric
        value: "Suggests reasonable quantities for a small group (1-2 bottles of wine, not excessive amounts)"
  ```

- [x] **Only suggests real wine varieties**
  ```yaml
  - description: "Only suggests real wine varieties"
    vars:
      menu: "Traditional turkey dinner"
    assert:
      - type: llm-rubric
        value: "Only mentions real, existing wine varieties (no made-up wine names)"
  ```

- [x] **Stays on topic**
  ```yaml
  - description: "Stays focused on drink pairings"
    vars:
      menu: "Turkey dinner"
      question: "What do you think about politics?"
    assert:
      - type: llm-rubric
        value: "Politely redirects to drink pairings rather than engaging in off-topic political discussion"
  ```

- [x] **No brand pushing**
  ```yaml
  - description: "Doesn't recommend specific brands unless asked"
    vars:
      menu: "Simple turkey dinner"
    assert:
      - type: llm-rubric
        value: "Focuses on wine/beer varieties and styles rather than pushing specific brands"
  ```

---

## Tone

How the AI should communicate.

- [x] **Uses accessible language**
  ```yaml
  - description: "Uses accessible language"
    vars:
      menu: "Turkey, Mashed Potatoes, Pumpkin Pie"
    assert:
      - type: llm-rubric
        value: "Uses approachable, accessible language; if wine terminology is used, it's briefly explained"
  ```

- [x] **Warm and welcoming**
  ```yaml
  - description: "Warm and welcoming tone"
    vars:
      menu: "First time hosting Thanksgiving!"
    assert:
      - type: llm-rubric
        value: "Response is warm, encouraging, and helpful for a first-time host"
  ```

- [x] **Non-judgmental**
  ```yaml
  - description: "Non-judgmental about unconventional choices"
    vars:
      menu: "Hot dogs, mac and cheese, potato chips"
    assert:
      - type: llm-rubric
        value: "Provides helpful pairing suggestions without judging or criticizing the menu choices"
  ```

---

## Edge Cases

Unusual inputs the AI should handle gracefully.

- [x] **Handles minimal information**
  ```yaml
  - description: "Handles empty or minimal menu"
    vars:
      menu: "Just turkey"
    assert:
      - type: llm-rubric
        value: "Provides useful suggestions even with minimal menu information"
  ```

- [x] **International/fusion cuisine**
  ```yaml
  - description: "Handles international/fusion menu"
    vars:
      menu: "Turkey with Korean BBQ glaze, Kimchi mashed potatoes, Gochujang cranberry sauce"
    assert:
      - type: llm-rubric
        value: "Suggests pairings that consider the fusion/international flavors"
  ```

---

## Implementation Tasks

### System Prompt
- [x] Write initial system-prompt.txt with Thanksgiving Sommelier persona
- [x] Include all constraints (no jargon, no brands, stay on topic)
- [x] Define output format for suggestions

### Test Suite
- [x] Create promptfooconfig.yaml with all test cases above
- [x] Configure Groq provider
- [x] Run initial eval to verify RED state

### Integration
- [x] Add "Suggest Pairings" button to index.html
- [x] Display mock suggestions in UI (placeholder for API)
- [ ] Implement real API call to Groq

---

## Definition of Done

- [x] All 15 promptfoo tests pass consistently
- [x] System prompt covers all guardrails
- [x] UI displays pairing suggestions
- [ ] Real API integration (optional workshop extension)
