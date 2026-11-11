# Design: Data Persistence

## Overview
Use browser localStorage to persist guest and dish data across page refreshes.

## Technical Approach

### Components Affected
- `app/index.html` - main application file

### State Changes
- On load: Check localStorage for saved state, restore if present
- On change: Save state to localStorage after any modification (add guest, add dish)

### Implementation
```javascript
// Save state
function saveState() {
  localStorage.setItem('thanksgiving-planner', JSON.stringify({
    guests: state.guests,
    dishes: state.dishes
  }));
}

// Load state
function loadState() {
  const saved = localStorage.getItem('thanksgiving-planner');
  return saved ? JSON.parse(saved) : { guests: [], dishes: [] };
}
```

## Test Strategy

### Happy Path
- Guest data persists after refresh
- Dish data persists after refresh

### Edge Cases
- Empty state on first visit (no localStorage)
- Corrupted localStorage data (graceful fallback)

## Alternatives Considered

1. **IndexedDB** - More powerful but overkill for this simple use case
2. **Server-side storage** - Would require backend, out of scope
3. **URL state** - Shareable but limited by URL length

**Chosen: localStorage** - Simple, synchronous, sufficient for demo app.
