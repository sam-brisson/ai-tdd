# Design: Delete Guest

## Overview
Add a delete button to each guest with confirmation dialog to prevent accidental deletions.

## Technical Approach

### Components Affected
- `app/index.html` - renderGuests() function

### User Interaction Flow
1. User clicks "X" button next to guest name
2. Browser shows confirm() dialog: "Delete [name]?"
3. If confirmed: Remove guest from state, re-render, save to localStorage
4. If cancelled: No action

### Implementation
```javascript
// In renderGuests(), add delete button to each guest item
<button data-testid="delete-guest-${guest.name}" class="delete-btn">X</button>

// Add click handler
if (confirm(`Delete ${guestName}?`)) {
  state.guests = state.guests.filter(g => g.name !== guestName);
  renderGuests();
  saveState();
}
```

### Data-testid Convention
- Delete button: `delete-guest-{GuestName}` (e.g., `delete-guest-Uncle Bob`)
- Enables targeted Playwright testing

## Test Strategy

### Happy Path
- Clicking delete + confirm removes the guest
- Guest count updates after deletion

### Confirmation Flow
- Canceling keeps the guest in the list

### Persistence
- Deleted guest stays deleted after page refresh

## Alternatives Considered

1. **Inline editing with delete** - More complex UI, not needed for MVP
2. **Swipe to delete** - Mobile-first pattern, but this is desktop app
3. **Undo instead of confirm** - Better UX but more complex to implement

**Chosen: confirm() dialog** - Simple, native, sufficient for workshop demo.
