# Implementation Plan: Light/Dark Mode

## Overview

This implementation plan breaks down the Light/Dark Mode feature into discrete coding tasks. The approach follows a layered implementation strategy:

1. First, establish the CSS foundation with theme variables and transitions
2. Build the core Theme Manager module with initialization, persistence, and state management
3. Add the Theme Toggle UI component and integrate it with the Theme Manager
4. Wire everything together and ensure all components work cohesively

Each task builds incrementally on previous work, with property-based tests placed strategically to catch errors early. The implementation leverages JavaScript for logic, CSS custom properties for theming, and HTML for the toggle UI.

## Tasks

- [-] 1. Set up CSS theme system with variables and transitions
  - Create CSS custom properties for light theme (default) in `:root`
  - Create CSS custom properties for dark theme scoped to `[data-theme="dark"]`
  - Add transition rules for smooth color changes (300ms ease)
  - Ensure transitions apply to background-color, color, border-color, and box-shadow
  - _Requirements: 2.5, 4.1, 4.2, 4.3_

- [ ]* 1.1 Write property test for CSS variables update
  - **Property 5: CSS Variables Update on Theme Switch**
  - **Validates: Requirements 2.5**

- [ ]* 1.2 Write property test for transition application
  - **Property 10: Transition Application**
  - **Validates: Requirements 4.1, 4.3**

- [ ]* 1.3 Write property test for transition duration
  - **Property 11: Transition Duration**
  - **Validates: Requirements 4.2**

- [ ] 1.4 Write property test for layout stability
  - **Property 12: Layout Stability During Transitions**
  - **Validates: Requirements 4.4**

- [ ]* 1.5 Write property test for contrast ratio compliance
  - **Property 6: Contrast Ratio Compliance**
  - **Validates: Requirements 2.3, 7.1**

- [ ] 2. Implement Theme Manager core module
  - [x] 2.1 Create js/theme-manager.js with module structure
    - Implement `getSystemTheme()` to detect system preference using `prefers-color-scheme` media query
    - Implement `loadSavedTheme()` to retrieve theme from Local Storage with error handling
    - Implement `saveTheme()` to persist theme to Local Storage with try-catch
    - Implement `applyTheme()` to set `data-theme` attribute on `<html>` element
    - _Requirements: 3.1, 3.2, 3.5, 5.1_

  - [ ]* 2.2 Write property test for system preference detection
    - **Property 13: System Preference Detection**
    - **Validates: Requirements 5.1**

  - [ ]* 2.3 Write property test for theme persistence round trip
    - **Property 7: Theme Persistence Round Trip**
    - **Validates: Requirements 3.1, 3.2**

  - [ ]* 2.4 Write property test for Local Storage error handling
    - **Property 9: Local Storage Error Handling**
    - **Validates: Requirements 3.5**

  - [x] 2.5 Implement theme state management functions
    - Implement `getCurrentTheme()` to return current theme state
    - Implement `setTheme(theme)` to apply and save a specific theme
    - Implement `toggleTheme()` to switch between light and dark
    - Implement `isDarkMode()` helper function
    - _Requirements: 1.3, 5.4_

  - [ ]* 2.6 Write property test for theme toggle switches to opposite
    - **Property 2: Theme Toggle Switches to Opposite**
    - **Validates: Requirements 1.3**

  - [ ]* 2.7 Write property test for manual preference override
    - **Property 14: Manual Preference Override**
    - **Validates: Requirements 5.4**

  - [x] 2.8 Implement theme initialization logic
    - Implement `initTheme()` to initialize theme system on page load
    - Check Local Storage for saved preference first
    - Fall back to system preference if no saved preference exists
    - Apply default light theme if neither exists
    - _Requirements: 3.3, 3.4, 5.2, 5.3_

  - [ ]* 2.9 Write property test for saved theme application
    - **Property 8: Saved Theme Application**
    - **Validates: Requirements 3.3**

- [ ] 3. Checkpoint - Ensure Theme Manager tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 4. Create Theme Toggle UI component
  - [ ] 4.1 Add theme toggle button to HTML header
    - Insert button element in `.dashboard-header` with id `theme-toggle`
    - Add icon span with class `theme-icon` and `aria-hidden="true"`
    - Add label span with class `theme-label` for text display
    - Set `aria-label="Toggle theme"` and `aria-pressed="false"` attributes
    - _Requirements: 1.1, 1.5_

  - [ ] 4.2 Style theme toggle button with CSS
    - Add styles for `.theme-toggle` button in css/styles.css
    - Style icon and label for both light and dark themes
    - Ensure button is visible and accessible in dashboard header
    - Add hover and focus states with visible focus indicators
    - _Requirements: 1.1, 7.5_

  - [ ]* 4.3 Write property test for theme state display
    - **Property 1: Theme Toggle State Display**
    - **Validates: Requirements 1.2**

  - [ ]* 4.4 Write property test for focus indicator preservation
    - **Property 16: Focus Indicator Preservation**
    - **Validates: Requirements 7.5**

- [ ] 5. Implement Theme Toggle event handling and integration
  - [ ] 5.1 Wire theme toggle to Theme Manager
    - Add click event listener to theme toggle button
    - Call `toggleTheme()` on click events
    - Update toggle button's `aria-pressed` attribute on theme change
    - Update icon and label text to reflect current theme
    - _Requirements: 1.2, 1.3_

  - [ ] 5.2 Add keyboard accessibility to theme toggle
    - Add keyboard event listeners for Enter and Space keys
    - Trigger `toggleTheme()` on keyboard activation
    - Ensure keyboard focus is maintained after toggle
    - _Requirements: 1.4, 7.2_

  - [ ]* 5.3 Write property test for keyboard accessibility
    - **Property 3: Keyboard Accessibility**
    - **Validates: Requirements 1.4, 7.2**

  - [ ] 5.4 Implement screen reader announcements
    - Create ARIA live region for theme change announcements
    - Implement `announceThemeChange()` function to update live region
    - Call announcement function after each theme change
    - _Requirements: 7.3_

  - [ ]* 5.5 Write property test for screen reader announcements
    - **Property 15: Screen Reader Announcements**
    - **Validates: Requirements 7.3**

- [ ] 6. Apply theme colors to all dashboard elements
  - [ ] 6.1 Update existing CSS to use theme variables
    - Replace hardcoded colors in css/styles.css with CSS custom properties
    - Apply variables to widgets (greeting, timer, todo list, quick links)
    - Apply variables to form inputs, buttons, and interactive elements
    - Apply variables to backgrounds, text, borders, and shadows
    - Ensure empty states and status displays use theme variables
    - _Requirements: 2.1, 2.2, 2.4, 6.1, 6.2, 6.3, 6.4, 6.5_

  - [ ]* 6.2 Write property test for theme color application
    - **Property 4: Theme Color Application**
    - **Validates: Requirements 2.1, 2.2, 2.4, 6.1, 6.2, 6.3, 6.4**

- [ ] 7. Initialize theme system in main application
  - [ ] 7.1 Import and initialize Theme Manager in js/app.js
    - Import theme-manager.js module at top of app.js
    - Call `initTheme()` at the start of application initialization
    - Ensure theme is applied before rendering widgets
    - _Requirements: 3.3, 5.1_

  - [ ] 7.2 Add error handling for theme system failures
    - Wrap theme initialization in try-catch block
    - Log errors to console without breaking application
    - Ensure application continues to function if theme system fails
    - _Requirements: 3.5_

- [ ] 8. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Property tests validate universal correctness properties from the design document
- The implementation uses JavaScript modules, CSS custom properties, and semantic HTML
- All color changes are CSS-driven for performance
- Theme system gracefully degrades if JavaScript fails (defaults to light theme)
- Focus on accessibility throughout: keyboard navigation, ARIA labels, contrast ratios, screen reader support
