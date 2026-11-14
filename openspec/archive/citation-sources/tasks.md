# Citation Sources - Acceptance Criteria

## Happy Path

- [x] **Includes 2 citations at end of recommendation**
  ```yaml
  - description: "Includes 2 citations at end of recommendation"
    vars:
      menu: "Turkey, Mashed Potatoes, Gravy"
    assert:
      - type: llm-rubric
        value: "Response ends with a sources section containing exactly 2 citations from well-known publications (such as Wine Folly, Food & Wine, Wine Enthusiast, or Bon Appétit)"
  ```
