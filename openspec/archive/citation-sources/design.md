# Design: Citation Sources

## Overview

Add instructions to the system prompt telling the AI to include 2 citations from well-known publications at the end of each recommendation.

## Technical Approach

- **File to modify**: `modules/02-ai-tdd/system-prompt.txt`
- **Change type**: Add a new section to the system prompt
- **Publications to cite**: Wine Folly, Food & Wine, Wine Enthusiast, Bon Appétit

### Prompt Addition

Add to the system prompt:
```
### Citations:
- End each recommendation with 2 relevant citations from well-known sources
- Use publications like: Wine Folly, Food & Wine, Wine Enthusiast, Bon Appétit
- Format: "Sources: [Publication 1], [Publication 2]"
```

### Citation Format

Display citations in a separate section at the end:
```
---
📚 Sources: Wine Folly, Food & Wine
```

### Error Handling

If the AI cannot cite a specific source for unusual pairings:
- Still provide the recommendation
- Be honest: "This pairing is based on my general knowledge"

## Test Strategy

### Test Categories
- **Happy path**: Response includes 2 citations at the end
- **Guardrails**: Citations are from real, well-known publications (not made up)

## Alternatives Considered

1. **Inline citations** - Cite throughout the response ("According to Wine Folly...")
   - Rejected: Too verbose, interrupts the flow

2. **URLs** - Include actual links
   - Rejected: LLMs are bad at generating valid URLs

3. **Single citation** - Just one source
   - Rejected: Two sources feels more credible
