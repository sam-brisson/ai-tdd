# Design: AI-Powered Drink Pairing Suggestions

## Overview

This design specifies how the AI drink pairing feature integrates with the Thanksgiving Dinner Planner and how we'll test the AI behavior using TDD principles.

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    DRINK PAIRING FEATURE                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────────┐ │
│  │  Dinner Planner │    │  System Prompt  │    │  promptfoo Tests    │ │
│  │  (index.html)   │    │  (sommelier)    │    │  (behavior specs)   │ │
│  └────────┬────────┘    └────────┬────────┘    └──────────┬──────────┘ │
│           │                      │                        │            │
│           ▼                      ▼                        ▼            │
│  ┌─────────────────────────────────────────────────────────────────────┐│
│  │                         Groq API                                    ││
│  │                    (Llama 3.3 70B Versatile)                        ││
│  └─────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────┘
```

## System Prompt Design

The AI's personality is defined in `system-prompt.txt`. Key characteristics:

### Persona: "Thanksgiving Sommelier"

**Tone:**
- Warm and welcoming, like a knowledgeable friend
- Uses everyday language (no wine jargon)
- Non-judgmental about food choices
- Enthusiastic but not pushy

**Capabilities:**
- Analyzes menu items to suggest pairings
- Explains why pairings work (flavor profiles, weight, etc.)
- Offers wine, beer, and non-alcoholic alternatives
- Estimates reasonable quantities based on guest count

**Constraints:**
- Only suggests real wine varieties (no invented names)
- Doesn't recommend specific brands
- Stays focused on drink pairings (no food criticism)
- Keeps suggestions practical (available at typical stores)

### Prompt Structure

```
[Role Definition]
You are a friendly Thanksgiving sommelier...

[Capabilities]
- Analyze menus and suggest pairings
- Explain in accessible language
- Offer alternatives for all preferences

[Constraints]
- No wine jargon
- No brand names
- Stay on topic
- Reasonable quantities only

[Output Format]
Structure suggestions as:
- Wine: [suggestion + explanation]
- Beer: [alternative + explanation]
- Non-alcoholic: [option + explanation]
```

## Test Strategy

We use TDD to specify expected AI behavior BEFORE implementing the system prompt.

### Test Categories

```
┌──────────────────────────────────────────────────────────────────┐
│                      TEST CATEGORIES                              │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  HAPPY PATH                    GUARDRAILS                        │
│  ───────────                   ──────────                        │
│  • Wine for turkey             • No fake wines                   │
│  • Beer alternatives           • No brand pushing                │
│  • Explains pairings           • Stays on topic                  │
│  • Multiple mains              • Reasonable quantities           │
│  • Non-alcoholic options                                         │
│                                                                  │
│  DIETARY CONSIDERATIONS        TONE                              │
│  ──────────────────────        ────                              │
│  • Handles restrictions        • Accessible language             │
│  • Vegetarian menus            • Warm, welcoming                 │
│  • Casual/simple dishes        • Non-judgmental                  │
│                                                                  │
│  EDGE CASES                                                      │
│  ──────────                                                      │
│  • Minimal menu info                                             │
│  • International cuisine                                         │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Assertion Types

| Type | Use Case | Example |
|------|----------|---------|
| `llm-rubric` | Behavioral expectations | "Suggests a light red wine for turkey" |
| `contains` | Must include specific text | Response includes "wine" |
| `not-contains` | Must exclude text | No brand names |

### Test-to-Requirement Mapping

Each test case in `promptfooconfig.yaml` maps directly to an acceptance criterion in `tasks.md`:

```yaml
# tasks.md says: "Suggests wine for turkey"
# ↓ becomes this test:
- description: "Suggests wine for turkey"
  vars:
    query: "What wine goes with my turkey dinner?"
  assert:
    - type: llm-rubric
      value: "Suggests a Pinot Noir or similar light red wine appropriate for poultry"
```

## Integration Points

### UI Integration (index.html)

```
┌─────────────────────────────────────────────────────────────────┐
│  Thanksgiving Dinner Planner                                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  [Guest Section]                                                 │
│  [Dish Section]                                                  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────────┐│
│  │  🍷 Drink Pairings                                           ││
│  │  ──────────────────                                          ││
│  │                                                              ││
│  │  [Get Drink Suggestions]  ← Button triggers API call         ││
│  │                                                              ││
│  │  ┌────────────────────────────────────────────────────────┐  ││
│  │  │  AI suggestions appear here                            │  ││
│  │  │  after button click                                    │  ││
│  │  └────────────────────────────────────────────────────────┘  ││
│  └──────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

### API Integration

```javascript
// Collect menu context
const dishes = collectDishesFromDOM();
const guests = collectGuestsWithRestrictions();

// Build prompt
const userPrompt = `
Menu:
${dishes.map(d => `- ${d.name} (${d.type})`).join('\n')}

Guests: ${guests.length}
Dietary restrictions: ${guests.filter(g => g.restriction).map(g => g.restriction).join(', ') || 'None'}

What drinks would you suggest?
`;

// Call Groq API
const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${GROQ_API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ]
  })
});
```

## Development Workflow

### TDD Cycle for AI Features

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│   1. WRITE TEST (RED)                                          │
│      Add test case to promptfooconfig.yaml                     │
│      Run: promptfoo eval → See FAIL                            │
│                                                                │
│   2. IMPLEMENT (GREEN)                                         │
│      Edit system-prompt.txt                                    │
│      Run: promptfoo eval → See PASS                            │
│                                                                │
│   3. REFINE (REFACTOR)                                         │
│      Add edge cases to promptfooconfig.yaml                    │
│      Run: promptfoo eval → Confirm no regression               │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

## Files

| File | Purpose |
|------|---------|
| `modules/02-ai-tdd/system-prompt.txt` | Thanksgiving Sommelier prompt |
| `modules/02-ai-tdd/promptfooconfig.yaml` | Test specifications |
| `app/index.html` | UI with drink pairing section |

## Success Metrics

### Technical
- All promptfoo tests pass consistently (>95% on repeated runs)
- Response latency under 3 seconds
- No API errors in normal operation

### User Experience
- Non-wine-experts understand suggestions
- Suggestions feel personalized to the menu
- Users report feeling "helped, not judged"
