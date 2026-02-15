# Specification

## Summary
**Goal:** Move the Home page AdSense block to an above-content position (directly under the sticky header) and ensure only a single ad placement is shown.

**Planned changes:**
- Update the HomePage layout to render the AdSense ad unit directly below the sticky header and above the main content/controls.
- Ensure the Home page renders exactly one AdSense placement and remove/disable any other Home page ad placements.
- Preserve the existing fallback UI (“Ad space” / “Advertisement”) and reserved spacing when AdSense is not configured or the slot is empty, keeping the layout stable.

**User-visible outcome:** On the Home page, a single ad appears directly under the sticky header before the main controls/content, without breaking existing table/panel interactions.
