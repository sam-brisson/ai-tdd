# Tasks: AI-Powered Drink Pairing Suggestions

## Acceptance Criteria → Test Cases

Each acceptance criterion below maps directly to a test in `modules/02-ai-tdd/promptfooconfig.yaml`.

---

## Core Functionality

- [x] **Suggests wine for turkey**
  ```yaml
  - description: "Suggests wine for traditional turkey dinner"
    vars:
      menu: "Roasted Turkey, Mashed Potatoes, Cranberry Sauce"
    assert:
      - type: llm-rubric
        value: "Suggests at least one wine variety (such as Pinot Noir or Chardonnay)"
  ```

- [x] **Offers beer alternatives**
  ```yaml
  - description: "Offers beer as an alternative"
    vars:
      menu: "Turkey, Stuffing, Pumpkin Pie"
    assert:
      - type: llm-rubric
        value: "Includes at least one beer suggestion"
  ```

- [x] **Suggests non-alcoholic options**
  ```yaml
  - description: "Includes non-alcoholic options when requested"
    vars:
      menu: "Turkey, Stuffing, Gravy"
      restrictions: "Some guests don't drink alcohol"
    assert:
      - type: llm-rubric
        value: "Includes at least one non-alcoholic beverage suggestion"
  ```

- [x] **Explains why pairings work**
  ```yaml
  - description: "Explains why the pairing works"
    vars:
      menu: "Honey-Glazed Ham, Sweet Potatoes"
    assert:
      - type: llm-rubric
        value: "Provides a brief explanation of why the suggested drink complements the food"
  ```

- [x] **Warm and welcoming tone**
  ```yaml
  - description: "Warm and welcoming tone"
    vars:
      menu: "Turkey dinner - first time hosting!"
    assert:
      - type: llm-rubric
        value: "Response is warm and encouraging"
  ```

---

## Definition of Done

- [x] All 5 promptfoo tests pass
- [x] System prompt covers core functionality
- [x] UI displays pairing suggestions
