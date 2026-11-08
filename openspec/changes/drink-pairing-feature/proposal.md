# Proposal: AI-Powered Drink Pairing Suggestions

## Why

Thanksgiving hosts face a common dilemma: they've planned the food, but what drinks should they serve? Most people aren't sommeliers. They know they want "something that goes with turkey" but don't know whether that means Pinot Noir, Chardonnay, or just a nice craft beer.

Current solutions fall short:
- **Google searches** return overwhelming, contradictory advice
- **Wine apps** assume expertise and use intimidating terminology
- **Asking friends** gives subjective, inconsistent recommendations

We want to add an AI-powered drink pairing feature to the Thanksgiving Dinner Planner that:
1. Analyzes the specific dishes on your menu
2. Suggests appropriate wine, beer, and non-alcoholic options
3. Explains pairings in accessible, everyday language
4. Respects dietary restrictions and preferences

## What Changes

### AI Drink Pairing Assistant

Add a "Get Drink Suggestions" button to the Thanksgiving Dinner Planner. When clicked, an AI assistant analyzes the current menu and provides personalized recommendations.

**User Flow:**
1. User adds dishes to their Thanksgiving menu
2. User clicks "Get Drink Suggestions"
3. AI reviews the dishes and guest restrictions
4. AI provides 2-3 wine suggestions, 1-2 beer alternatives, and 1-2 non-alcoholic options
5. Each suggestion includes a brief, friendly explanation of why it pairs well

### Technical Approach

- **LLM Provider**: Groq (Llama 3.3 70B) for fast, free inference
- **System Prompt**: Defines the "Thanksgiving Sommelier" personality
- **Testing**: promptfoo with behavioral assertions (llm-rubric)
- **Integration**: Button in existing app UI triggers API call

### Example Interaction

**Menu:**
- Turkey (main)
- Mashed Potatoes (side)
- Green Bean Casserole (side)
- Pumpkin Pie (dessert)

**AI Response:**
> "For your turkey-centered menu, I'd suggest:
>
> **Wine:** A Pinot Noir would be perfect - it's light enough not to overpower the turkey but has enough flavor to stand up to the gravy. Look for one from Oregon or Burgundy.
>
> **Beer:** If you prefer beer, try a brown ale. It has caramel notes that complement the savory dishes without being too heavy.
>
> **Non-alcoholic:** Apple cider (sparkling or still) is a classic choice that pairs beautifully with fall flavors."

## Success Criteria

### Functional Requirements
- [ ] Suggests at least one wine option for any menu
- [ ] Offers beer as an alternative to wine
- [ ] Provides non-alcoholic options when requested or when guests have restrictions
- [ ] Explains why each pairing works (not just what to drink)

### Quality Requirements
- [ ] Uses everyday language (no "oaky tannins" or "hints of terroir")
- [ ] Doesn't judge unconventional menu choices
- [ ] Suggests reasonable quantities (not a case of wine for 4 people)
- [ ] Stays focused on drink pairings (doesn't suggest food changes)

### Guardrails
- [ ] Never invents fake wine varieties
- [ ] Doesn't push specific brands
- [ ] Redirects off-topic questions back to drink pairings
- [ ] Handles edge cases gracefully (minimal info, unusual menus)

## Target Audience

- **Primary**: Home cooks planning Thanksgiving dinner who want drink suggestions
- **Secondary**: Party hosts planning other dinners/events
- **Tertiary**: People learning about food/drink pairings

## Decisions Made

| Question | Decision | Rationale |
|----------|----------|-----------|
| Wine expertise level | Accessible/beginner | Target audience isn't wine experts |
| Include spirits? | No, wine/beer/NA only | Keeps scope focused, spirits pairing is complex |
| Quantity suggestions | Yes, per-person estimates | Practical for shopping |
| Brand recommendations | No specific brands | Avoids perceived advertising |

## Open Questions

1. Should the AI remember previous suggestions in a session?
2. Should we add a "regenerate" button for different suggestions?
