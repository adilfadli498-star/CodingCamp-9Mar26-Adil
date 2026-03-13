# Design Document: Productivity Dashboard

## Overview

The Productivity Dashboard is a client-side web application built with vanilla HTML, CSS, and JavaScript that provides essential productivity tools in a single interface. The application runs entirely in the browser with no backend dependencies, using the browser's Local Storage API for data persistence.

The dashboard consists of four main components:
1. **Greeting Widget** - Displays current time, date, and time-based greeting
2. **Focus Timer** - 25-minute countdown timer for focused work sessions
3. **To-Do List** - Task management with create, edit, complete, and delete operations
4. **Quick Links** - User-configurable website shortcuts

The design prioritizes simplicity, performance, and maintainability while ensuring data persistence and responsive user interactions.

## Architecture

### High-Level Architecture

The application follows a component-based architecture with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────┐
│                    index.html                           │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │ Greeting │ │  Focus   │ │  To-Do   │ │  Quick   │  │
│  │  Widget  │ │  Timer   │ │   List   │ │  Links   │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                   app.js (Main Application)             │
│  ┌─────────────────────────────────────────────────┐   │
│  │           Component Controllers                  │   │
│  │  • GreetingController                           │   │
│  │  • TimerController                              │   │
│  │  • TodoController                               │   │
│  │  • LinksController                              │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │           Storage Manager                        │   │
│  │  • save(key, data)                              │   │
│  │  • load(key)                                    │   │
│  │  • remove(key)                                  │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │           Utility Functions                      │   │
│  │  • formatTime()                                 │   │
│  │  • formatDate()                                 │   │
│  │  • getGreeting()                                │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│              Browser Local Storage API                  │
│  • localStorage.setItem()                               │
│  • localStorage.getItem()                               │
│  • localStorage.removeItem()                            │
└─────────────────────────────────────────────────────────┘
```

### Architectural Principles

1. **Component Isolation**: Each widget operates independently with its own controller
2. **Single Responsibility**: Storage operations are centralized in StorageManager
3. **Event-Driven**: User interactions trigger events handled by component controllers
4. **Stateless UI**: UI is rendered from data state, not maintained separately
5. **Fail-Safe**: Errors in one component don't crash other components

### Technology Stack

- **HTML5**: Semantic markup for structure
- **CSS3**: Styling with flexbox/grid for layout
- **Vanilla JavaScript (ES6+)**: Application logic
- **Local Storage API**: Client-side data persistence

### Browser Compatibility

Target browsers with guaranteed API support:
- Chrome 90+ (April 2021)
- Firefox 88+ (April 2021)
- Edge 90+ (April 2021)
- Safari 14+ (September 2020)

All required APIs (Local Storage, Date, setInterval, addEventListener) are available in these versions.

## Components and Interfaces

### 1. Greeting Widget Component

**Purpose**: Display current time, date, and contextual greeting based on time of day.

**DOM Structure**:
```html
<div id="greeting-widget" class="widget">
  <div class="date-display"></div>
  <div class="time-display"></div>
  <div class="greeting-message"></div>
</div>
```

**GreetingController Interface**:
```javascript
class GreetingController {
  constructor(containerElement)
  init()                    // Initialize and start clock
  updateDisplay()           // Update time, date, and greeting
  getGreeting(hour)         // Return greeting based on hour (5-23)
  formatTime(date)          // Format time as HH:MM:SS
  formatDate(date)          // Format date as "Day, Month DD, YYYY"
  destroy()                 // Clean up interval
}
```

**Update Frequency**: Every 1000ms (1 second)

**Greeting Logic**:
- 05:00 - 11:59: "Good Morning"
- 12:00 - 16:59: "Good Afternoon"
- 17:00 - 20:59: "Good Evening"
- 21:00 - 04:59: "Good Night"

### 2. Focus Timer Component

**Purpose**: Provide a 25-minute countdown timer for focused work sessions.

**DOM Structure**:
```html
<div id="focus-timer" class="widget">
  <div class="timer-display">25:00</div>
  <div class="timer-controls">
    <button id="timer-start">Start</button>
    <button id="timer-stop">Stop</button>
    <button id="timer-reset">Reset</button>
  </div>
  <div class="timer-status"></div>
</div>
```

**TimerController Interface**:
```javascript
class TimerController {
  constructor(containerElement)
  init()                    // Initialize timer UI and event listeners
  start()                   // Begin countdown
  stop()                    // Pause countdown
  reset()                   // Reset to 25:00
  tick()                    // Decrement by 1 second
  updateDisplay()           // Render current time
  onComplete()              // Handle timer completion
  formatTime(seconds)       // Format seconds as MM:SS
}
```

**State**:
```javascript
{
  totalSeconds: 1500,       // 25 minutes = 1500 seconds
  remainingSeconds: 1500,
  isRunning: false,
  intervalId: null
}
```

**Update Frequency**: Every 1000ms (1 second) when running

**Button States**:
- Start: Enabled when stopped/completed, disabled when running
- Stop: Always enabled
- Reset: Always enabled

### 3. To-Do List Component

**Purpose**: Manage task items with create, edit, complete, and delete operations.

**DOM Structure**:
```html
<div id="todo-list" class="widget">
  <form class="todo-form">
    <input type="text" id="todo-input" placeholder="Add a new task...">
    <button type="submit">Add</button>
  </form>
  <ul class="todo-items">
    <!-- Task items rendered here -->
  </ul>
  <div class="empty-state">No tasks yet. Add one above!</div>
</div>
```

**Task Item Structure**:
```html
<li class="todo-item" data-id="unique-id">
  <input type="checkbox" class="todo-checkbox">
  <span class="todo-text">Task description</span>
  <button class="todo-edit">Edit</button>
  <button class="todo-delete">Delete</button>
</li>
```

**TodoController Interface**:
```javascript
class TodoController {
  constructor(containerElement, storageManager)
  init()                    // Load tasks and setup event listeners
  addTask(text)             // Create new task
  editTask(id, newText)     // Update task text
  toggleTask(id)            // Toggle completion status
  deleteTask(id)            // Remove task
  renderTasks()             // Render all tasks to DOM
  saveTasks()               // Persist tasks to storage
  loadTasks()               // Load tasks from storage
  generateId()              // Generate unique task ID
}
```

**TodoController State**:
```javascript
{
  tasks: [
    {
      id: "uuid-string",
      text: "Task description",
      completed: false,
      createdAt: timestamp
    }
  ]
}
```

**Storage Key**: `"productivity-dashboard-tasks"`

### 4. Quick Links Component

**Purpose**: Display and manage user-configurable website shortcuts.

**DOM Structure**:
```html
<div id="quick-links" class="widget">
  <form class="links-form">
    <input type="text" id="link-name" placeholder="Link name...">
    <input type="url" id="link-url" placeholder="https://...">
    <button type="submit">Add</button>
  </form>
  <ul class="link-items">
    <!-- Link items rendered here -->
  </ul>
  <div class="empty-state">No links yet. Add one above!</div>
</div>
```

**Link Item Structure**:
```html
<li class="link-item" data-id="unique-id">
  <a href="url" target="_blank" rel="noopener noreferrer">
    <span class="link-name">Display Name</span>
  </a>
  <button class="link-delete">Delete</button>
</li>
```

**LinksController Interface**:
```javascript
class LinksController {
  constructor(containerElement, storageManager)
  init()                    // Load links and setup event listeners
  addLink(name, url)        // Create new link
  deleteLink(id)            // Remove link
  renderLinks()             // Render all links to DOM
  saveLinks()               // Persist links to storage
  loadLinks()               // Load links from storage
  generateId()              // Generate unique link ID
  validateUrl(url)          // Validate URL format
}
```

**LinksController State**:
```javascript
{
  links: [
    {
      id: "uuid-string",
      name: "Display Name",
      url: "https://example.com",
      createdAt: timestamp
    }
  ]
}
```

**Storage Key**: `"productivity-dashboard-links"`

### 5. Storage Manager

**Purpose**: Centralize all Local Storage operations with error handling.

**StorageManager Interface**:
```javascript
class StorageManager {
  save(key, data)           // Save data to Local Storage (returns boolean)
  load(key)                 // Load data from Local Storage (returns data or null)
  remove(key)               // Remove data from Local Storage (returns boolean)
  clear()                   // Clear all dashboard data
  isAvailable()             // Check if Local Storage is available
}
```

**Error Handling**:
- Catch QuotaExceededError when storage is full
- Catch SecurityError when storage is disabled
- Log errors to console
- Return null/false on failure to allow graceful degradation

**Storage Keys**:
- `productivity-dashboard-tasks`: Array of task objects
- `productivity-dashboard-links`: Array of link objects

## Data Models

### Task Item Model

```javascript
{
  id: String,              // Unique identifier (UUID v4 format)
  text: String,            // Task description (1-500 characters)
  completed: Boolean,      // Completion status
  createdAt: Number        // Unix timestamp (milliseconds)
}
```

**Validation Rules**:
- `id`: Must be unique, non-empty string
- `text`: Required, 1-500 characters, trimmed
- `completed`: Boolean, defaults to false
- `createdAt`: Positive integer timestamp

**Example**:
```javascript
{
  id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  text: "Complete project documentation",
  completed: false,
  createdAt: 1704067200000
}
```

### Link Item Model

```javascript
{
  id: String,              // Unique identifier (UUID v4 format)
  name: String,            // Display name (1-100 characters)
  url: String,             // Valid URL with protocol
  createdAt: Number        // Unix timestamp (milliseconds)
}
```

**Validation Rules**:
- `id`: Must be unique, non-empty string
- `name`: Required, 1-100 characters, trimmed
- `url`: Required, valid URL format, must include protocol (http:// or https://)
- `createdAt`: Positive integer timestamp

**Example**:
```javascript
{
  id: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
  name: "GitHub",
  url: "https://github.com",
  createdAt: 1704067200000
}
```

### Storage Format

Data is stored as JSON strings in Local Storage:

**Tasks Storage**:
```javascript
localStorage.setItem('productivity-dashboard-tasks', JSON.stringify([
  { id: "...", text: "...", completed: false, createdAt: 1704067200000 },
  { id: "...", text: "...", completed: true, createdAt: 1704067300000 }
]))
```

**Links Storage**:
```javascript
localStorage.setItem('productivity-dashboard-links', JSON.stringify([
  { id: "...", name: "...", url: "...", createdAt: 1704067200000 },
  { id: "...", name: "...", url: "...", createdAt: 1704067300000 }
]))
```

## Correctness Properties


*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Date Display Completeness

*For any* date object, when formatted for display, the resulting string should contain the day of week, month name, day number, and year.

**Validates: Requirements 1.1**

### Property 2: Greeting Message Correctness

*For any* hour value (0-23), the greeting function should return:
- "Good Morning" for hours 5-11
- "Good Afternoon" for hours 12-16
- "Good Evening" for hours 17-20
- "Good Night" for hours 21-23 and 0-4

**Validates: Requirements 1.3, 1.4, 1.5, 1.6**

### Property 3: Timer State Transitions

*For any* timer state, the following transitions should work correctly:
- Starting a stopped timer should set isRunning to true and begin countdown
- Stopping a running timer should set isRunning to false and preserve remaining time
- Resetting from any state should restore remainingSeconds to 1500 and set isRunning to false

**Validates: Requirements 2.2, 2.4, 2.5**

### Property 4: Timer Button State Consistency

*For any* timer state, button enabled/disabled states should match the timer's running state:
- When isRunning is true, the start button should be disabled
- When isRunning is false, the start button should be enabled

**Validates: Requirements 2.7, 2.8**

### Property 5: Timer Countdown Decrement

*For any* timer state where remainingSeconds > 0, calling tick() should decrease remainingSeconds by exactly 1.

**Validates: Requirements 2.3**

### Property 6: Task Operations Preserve List Integrity

*For any* list of tasks:
- Adding a task with valid text should increase the list length by 1
- Editing a task should preserve the task count and update only the specified task's text
- Toggling a task should preserve the task count and flip only the specified task's completed status
- Deleting a task should decrease the list length by 1

**Validates: Requirements 3.1, 3.3, 3.5, 3.7**

### Property 7: Task Data Persistence Round-Trip

*For any* list of valid tasks, saving to storage and then loading from storage should produce an equivalent list with all task properties (id, text, completed, createdAt) preserved.

**Validates: Requirements 3.2, 3.4, 3.6, 3.8, 3.9**

### Property 8: Task Text Validation

*For any* string composed entirely of whitespace or exceeding 500 characters, attempting to create or edit a task should be rejected and the task list should remain unchanged.

**Validates: Requirements 3.1, 3.3**

### Property 9: Link Operations Preserve List Integrity

*For any* list of links:
- Adding a link with valid name and URL should increase the list length by 1
- Deleting a link should decrease the list length by 1

**Validates: Requirements 4.1, 4.4**

### Property 10: Link Data Persistence Round-Trip

*For any* list of valid links, saving to storage and then loading from storage should produce an equivalent list with all link properties (id, name, url, createdAt) preserved.

**Validates: Requirements 4.2, 4.5, 4.6**

### Property 11: Link URL Validation

*For any* URL string without a protocol (http:// or https://), attempting to create a link should be rejected and the link list should remain unchanged.

**Validates: Requirements 4.1**

### Property 12: Link Navigation Correctness

*For any* valid link item, the rendered anchor element's href attribute should exactly match the link's stored URL.

**Validates: Requirements 4.3**

### Property 13: Storage Error Handling

*For any* storage operation that fails (throws an error), the system should:
- Return null/false to indicate failure
- Log the error to console
- Continue operating with in-memory data

**Validates: Requirements 5.4**

### Property 14: Browser API Availability Check

*For any* required browser API (localStorage), if the API is unavailable or throws a SecurityError, the system should display an error message and initialize with empty data rather than crashing.

**Validates: Requirements 8.6**

## Error Handling

### Storage Errors

**QuotaExceededError**:
- Occurs when Local Storage is full (typically 5-10MB limit)
- Handler: Log error, show user notification, prevent further saves
- Recovery: User must delete data or clear storage

**SecurityError**:
- Occurs when Local Storage is disabled (private browsing, security settings)
- Handler: Log error, show compatibility warning, operate in memory-only mode
- Recovery: User must enable storage or accept data loss on refresh

**JSON Parse Errors**:
- Occurs when stored data is corrupted
- Handler: Log error, clear corrupted data, initialize with empty state
- Recovery: Automatic - user starts fresh

### Input Validation Errors

**Invalid Task Text**:
- Empty or whitespace-only strings
- Strings exceeding 500 characters
- Handler: Show inline error message, prevent submission, keep form focused

**Invalid Link URL**:
- Missing protocol (http:// or https://)
- Malformed URL structure
- Handler: Show inline error message, prevent submission, highlight URL field

**Invalid Link Name**:
- Empty or whitespace-only strings
- Strings exceeding 100 characters
- Handler: Show inline error message, prevent submission, highlight name field

### Timer Errors

**Invalid State Transitions**:
- Starting an already running timer
- Handler: Ignore duplicate start commands (idempotent operation)

**Interval Cleanup**:
- Ensure clearInterval is called on stop/reset/destroy
- Handler: Store intervalId and always clear before setting new interval

### DOM Errors

**Missing Elements**:
- Required DOM elements not found during initialization
- Handler: Log error, skip component initialization, continue with other components

**Event Listener Failures**:
- Unable to attach event listeners
- Handler: Log error, component becomes non-interactive but doesn't crash app

### Error Logging Strategy

All errors should be logged with:
- Timestamp
- Component name
- Error type
- Error message
- Stack trace (if available)

Format: `[YYYY-MM-DD HH:MM:SS] [ComponentName] ErrorType: message`

## Testing Strategy

### Overview

The testing strategy employs a dual approach combining unit tests for specific examples and edge cases with property-based tests for comprehensive validation of universal properties.

### Unit Testing

**Purpose**: Verify specific examples, edge cases, and error conditions

**Framework**: Jest (or similar JavaScript testing framework)

**Test Categories**:

1. **Component Initialization**
   - Verify each component initializes with correct default state
   - Test DOM element creation and structure
   - Verify event listeners are attached

2. **Edge Cases**
   - Timer completion (reaches zero)
   - Empty state displays (no tasks, no links)
   - Boundary times for greeting (4:59 AM, 5:00 AM, 11:59 AM, 12:00 PM, etc.)
   - Maximum length inputs (500 char tasks, 100 char link names)

3. **Error Conditions**
   - Storage quota exceeded
   - Storage disabled/unavailable
   - Corrupted JSON in storage
   - Invalid input formats
   - Missing DOM elements

4. **Integration Points**
   - Component interaction with StorageManager
   - Event handler triggering and response
   - DOM updates after state changes

**Unit Test Balance**: Focus on specific examples and edge cases. Avoid writing exhaustive input tests—property-based tests handle comprehensive input coverage.

### Property-Based Testing

**Purpose**: Verify universal properties across all inputs through randomization

**Framework**: fast-check (JavaScript property-based testing library)

**Configuration**:
- Minimum 100 iterations per property test
- Each test tagged with reference to design document property
- Tag format: `// Feature: productivity-dashboard, Property {number}: {property_text}`

**Property Test Implementation**:

Each of the 14 correctness properties defined above must be implemented as a property-based test. Examples:

**Property 2 Test**:
```javascript
// Feature: productivity-dashboard, Property 2: Greeting Message Correctness
test('greeting returns correct message for any hour', () => {
  fc.assert(
    fc.property(fc.integer({ min: 0, max: 23 }), (hour) => {
      const greeting = getGreeting(hour);
      if (hour >= 5 && hour <= 11) {
        return greeting === "Good Morning";
      } else if (hour >= 12 && hour <= 16) {
        return greeting === "Good Afternoon";
      } else if (hour >= 17 && hour <= 20) {
        return greeting === "Good Evening";
      } else {
        return greeting === "Good Night";
      }
    }),
    { numRuns: 100 }
  );
});
```

**Property 7 Test**:
```javascript
// Feature: productivity-dashboard, Property 7: Task Data Persistence Round-Trip
test('task data round-trips through storage', () => {
  fc.assert(
    fc.property(
      fc.array(fc.record({
        id: fc.uuid(),
        text: fc.string({ minLength: 1, maxLength: 500 }),
        completed: fc.boolean(),
        createdAt: fc.integer({ min: 0 })
      })),
      (tasks) => {
        const storage = new StorageManager();
        storage.save('test-tasks', tasks);
        const loaded = storage.load('test-tasks');
        return JSON.stringify(tasks) === JSON.stringify(loaded);
      }
    ),
    { numRuns: 100 }
  );
});
```

**Generators Needed**:
- Valid task objects (id, text 1-500 chars, completed boolean, timestamp)
- Valid link objects (id, name 1-100 chars, valid URL, timestamp)
- Hour values (0-23)
- Timer states (remainingSeconds 0-1500, isRunning boolean)
- Invalid inputs (empty strings, whitespace, oversized strings, malformed URLs)

### Test Coverage Goals

- **Line Coverage**: Minimum 80%
- **Branch Coverage**: Minimum 75%
- **Function Coverage**: Minimum 90%
- **Property Coverage**: 100% (all 14 properties must have tests)

### Manual Testing

**Browser Compatibility Testing**:
- Test in Chrome 90+, Firefox 88+, Edge 90+, Safari 14+
- Verify all features work in each browser
- Test with storage enabled and disabled
- Test in private/incognito mode

**Performance Testing**:
- Verify timer updates smoothly at 1-second intervals
- Test with 100+ tasks and links
- Verify no UI blocking during operations
- Check memory usage over extended sessions

**Accessibility Testing**:
- Keyboard navigation works for all interactive elements
- Screen reader compatibility
- Sufficient color contrast
- Focus indicators visible

### Continuous Integration

- Run all tests on every commit
- Fail build if any test fails
- Generate coverage reports
- Run linting and code quality checks

## Implementation Notes

### File Structure

```
productivity-dashboard/
├── index.html
├── css/
│   └── styles.css
└── js/
    └── app.js
```

### Code Organization in app.js

The single JavaScript file should be organized in this order:

1. **Utility Functions** (formatTime, formatDate, getGreeting, generateId, validateUrl)
2. **StorageManager Class**
3. **GreetingController Class**
4. **TimerController Class**
5. **TodoController Class**
6. **LinksController Class**
7. **App Initialization** (DOMContentLoaded event listener, component instantiation)

### Performance Considerations

**Timer Updates**:
- Use `setInterval` with 1000ms delay
- Store interval ID for cleanup
- Use `requestAnimationFrame` for DOM updates if needed for smoothness

**Storage Operations**:
- Debounce rapid changes (e.g., multiple quick edits)
- Use try-catch around all storage operations
- Keep data structures simple for fast JSON serialization

**DOM Manipulation**:
- Batch DOM updates when possible
- Use DocumentFragment for rendering lists
- Minimize reflows by updating classes instead of inline styles

### Security Considerations

**XSS Prevention**:
- Use `textContent` instead of `innerHTML` for user-generated content
- Sanitize URLs before creating links
- Use `rel="noopener noreferrer"` on external links

**Data Validation**:
- Validate all inputs before processing
- Trim whitespace from text inputs
- Enforce length limits on client side

**Storage Safety**:
- Never store sensitive information in Local Storage
- Validate data structure when loading from storage
- Handle corrupted data gracefully

### Accessibility Features

**Keyboard Navigation**:
- All interactive elements accessible via Tab
- Enter key submits forms
- Escape key cancels edit mode

**ARIA Labels**:
- Add `aria-label` to icon buttons
- Use `aria-live` for timer updates
- Mark completed tasks with `aria-checked`

**Visual Feedback**:
- Focus indicators on all interactive elements
- Loading states for async operations
- Success/error messages for user actions

### Browser API Usage

**APIs Required**:
- `localStorage` - Data persistence
- `Date` - Time and date handling
- `setInterval/clearInterval` - Timer functionality
- `addEventListener` - Event handling
- `JSON.parse/JSON.stringify` - Data serialization

**Polyfills**: None required for target browser versions (all APIs available)

**Feature Detection**:
```javascript
function checkBrowserCompatibility() {
  if (typeof Storage === "undefined") {
    displayError("Your browser doesn't support Local Storage. Please use a modern browser.");
    return false;
  }
  return true;
}
```

## Deployment

### Build Process

No build process required - static files can be served directly.

### Hosting Options

- GitHub Pages
- Netlify
- Vercel
- Any static file hosting service

### File Serving

- Serve `index.html` as entry point
- Ensure MIME types are correct (text/html, text/css, application/javascript)
- Enable gzip compression for faster loading
- Set appropriate cache headers for static assets

### Browser Caching

Recommended cache headers:
- HTML: `Cache-Control: no-cache` (always check for updates)
- CSS/JS: `Cache-Control: public, max-age=31536000` (cache for 1 year, use versioning for updates)

## Future Enhancements

Potential features for future versions:

1. **Customizable Timer Duration** - Allow users to set custom focus session lengths
2. **Timer Sound Notification** - Audio alert when timer completes
3. **Task Categories** - Organize tasks into categories or projects
4. **Task Priority** - Mark tasks as high/medium/low priority
5. **Dark Mode** - Toggle between light and dark themes
6. **Export/Import** - Export data as JSON, import from file
7. **Statistics** - Track completed tasks and focus sessions over time
8. **Keyboard Shortcuts** - Quick actions via keyboard commands
9. **Drag and Drop** - Reorder tasks and links
10. **Cloud Sync** - Optional cloud backup (requires backend)

These enhancements would require additional design considerations and may introduce external dependencies.
