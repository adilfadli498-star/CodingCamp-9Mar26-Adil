/**
 * Test script for Task 2.5 - Theme State Management Functions
 * Tests: getCurrentTheme(), setTheme(), toggleTheme(), isDarkMode()
 */

// Mock DOM and localStorage for Node.js environment
global.document = {
  documentElement: {
    _attributes: {},
    setAttribute(name, value) {
      this._attributes[name] = value;
    },
    getAttribute(name) {
      return this._attributes[name] || null;
    },
    removeAttribute(name) {
      delete this._attributes[name];
    }
  }
};

global.window = {
  matchMedia: (query) => ({
    matches: false,
    media: query
  })
};

global.localStorage = {
  _data: {},
  setItem(key, value) {
    this._data[key] = value;
  },
  getItem(key) {
    return this._data[key] || null;
  },
  removeItem(key) {
    delete this._data[key];
  },
  clear() {
    this._data = {};
  }
};

global.console = {
  warn: () => {},
  error: () => {},
  log: console.log
};

// Load the theme-manager.js file
const fs = require('fs');
const themeManagerCode = fs.readFileSync('js/theme-manager.js', 'utf8');
eval(themeManagerCode);

// Test utilities
let testsPassed = 0;
let testsFailed = 0;

function assert(condition, testName, details = '') {
  if (condition) {
    console.log(`✓ ${testName}`);
    if (details) console.log(`  ${details}`);
    testsPassed++;
  } else {
    console.log(`✗ ${testName}`);
    if (details) console.log(`  ${details}`);
    testsFailed++;
  }
}

function resetState() {
  localStorage.clear();
  document.documentElement.removeAttribute('data-theme');
}

// Run tests
console.log('=== Testing Task 2.5: Theme State Management Functions ===\n');

// Test 1: getCurrentTheme returns default when no theme is set
console.log('Test 1: getCurrentTheme() returns default (light)');
resetState();
const defaultTheme = getCurrentTheme();
assert(
  defaultTheme === 'light',
  'getCurrentTheme() returns "light" by default',
  `Expected: 'light', Got: '${defaultTheme}'`
);

// Test 2: getCurrentTheme returns current theme from DOM
console.log('\nTest 2: getCurrentTheme() reads from DOM attribute');
resetState();
document.documentElement.setAttribute('data-theme', 'dark');
const currentTheme = getCurrentTheme();
assert(
  currentTheme === 'dark',
  'getCurrentTheme() returns theme from DOM',
  `Expected: 'dark', Got: '${currentTheme}'`
);

// Test 3: getCurrentTheme handles invalid DOM attribute
console.log('\nTest 3: getCurrentTheme() handles invalid values');
resetState();
document.documentElement.setAttribute('data-theme', 'invalid');
const invalidTheme = getCurrentTheme();
assert(
  invalidTheme === 'light',
  'getCurrentTheme() returns default for invalid value',
  `Expected: 'light', Got: '${invalidTheme}'`
);

// Test 4: setTheme applies light theme
console.log('\nTest 4: setTheme("light") works correctly');
resetState();
setTheme('light');
const lightTheme = getCurrentTheme();
const lightAttr = document.documentElement.getAttribute('data-theme');
const lightStorage = localStorage.getItem('theme-preference');
assert(
  lightTheme === 'light' && lightAttr === 'light' && lightStorage === 'light',
  'setTheme("light") updates DOM and storage',
  `Theme: ${lightTheme}, DOM: ${lightAttr}, Storage: ${lightStorage}`
);

// Test 5: setTheme applies dark theme
console.log('\nTest 5: setTheme("dark") works correctly');
resetState();
setTheme('dark');
const darkTheme = getCurrentTheme();
const darkAttr = document.documentElement.getAttribute('data-theme');
const darkStorage = localStorage.getItem('theme-preference');
assert(
  darkTheme === 'dark' && darkAttr === 'dark' && darkStorage === 'dark',
  'setTheme("dark") updates DOM and storage',
  `Theme: ${darkTheme}, DOM: ${darkAttr}, Storage: ${darkStorage}`
);

// Test 6: setTheme validates input
console.log('\nTest 6: setTheme() validates input');
resetState();
setTheme('light');
setTheme('invalid');
const afterInvalid = getCurrentTheme();
const afterInvalidStorage = localStorage.getItem('theme-preference');
assert(
  afterInvalid === 'light' && afterInvalidStorage === 'light',
  'setTheme() rejects invalid values',
  `Theme remains 'light', Got: '${afterInvalid}'`
);

// Test 7: toggleTheme switches from light to dark
console.log('\nTest 7: toggleTheme() switches from light to dark');
resetState();
setTheme('light');
toggleTheme();
const afterToggle1 = getCurrentTheme();
assert(
  afterToggle1 === 'dark',
  'toggleTheme() switches light to dark',
  `Expected: 'dark', Got: '${afterToggle1}'`
);

// Test 8: toggleTheme switches from dark to light
console.log('\nTest 8: toggleTheme() switches from dark to light');
toggleTheme();
const afterToggle2 = getCurrentTheme();
assert(
  afterToggle2 === 'light',
  'toggleTheme() switches dark to light',
  `Expected: 'light', Got: '${afterToggle2}'`
);

// Test 9: Multiple toggles work correctly
console.log('\nTest 9: Multiple toggles work correctly');
resetState();
setTheme('light');
toggleTheme(); // -> dark
toggleTheme(); // -> light
toggleTheme(); // -> dark
const afterMultipleToggles = getCurrentTheme();
assert(
  afterMultipleToggles === 'dark',
  'Multiple toggles work correctly',
  `Expected: 'dark' after 3 toggles from light, Got: '${afterMultipleToggles}'`
);

// Test 10: isDarkMode returns true when dark
console.log('\nTest 10: isDarkMode() returns true for dark theme');
resetState();
setTheme('dark');
const isDarkWhenDark = isDarkMode();
assert(
  isDarkWhenDark === true,
  'isDarkMode() returns true for dark theme',
  `Expected: true, Got: ${isDarkWhenDark}`
);

// Test 11: isDarkMode returns false when light
console.log('\nTest 11: isDarkMode() returns false for light theme');
resetState();
setTheme('light');
const isDarkWhenLight = isDarkMode();
assert(
  isDarkWhenLight === false,
  'isDarkMode() returns false for light theme',
  `Expected: false, Got: ${isDarkWhenLight}`
);

// Test 12: isDarkMode returns false by default
console.log('\nTest 12: isDarkMode() returns false by default');
resetState();
const isDarkByDefault = isDarkMode();
assert(
  isDarkByDefault === false,
  'isDarkMode() returns false by default',
  `Expected: false, Got: ${isDarkByDefault}`
);

// Test 13: toggleTheme persists to storage
console.log('\nTest 13: toggleTheme() persists to storage');
resetState();
setTheme('light');
toggleTheme();
const storageAfterToggle = localStorage.getItem('theme-preference');
assert(
  storageAfterToggle === 'dark',
  'toggleTheme() saves to localStorage',
  `Expected: 'dark', Got: '${storageAfterToggle}'`
);

// Test 14: setTheme overwrites previous value
console.log('\nTest 14: setTheme() overwrites previous value');
resetState();
setTheme('dark');
setTheme('light');
const overwrittenTheme = getCurrentTheme();
const overwrittenStorage = localStorage.getItem('theme-preference');
assert(
  overwrittenTheme === 'light' && overwrittenStorage === 'light',
  'setTheme() overwrites previous value',
  `Theme: ${overwrittenTheme}, Storage: ${overwrittenStorage}`
);

// Summary
console.log('\n=== Test Summary ===');
console.log(`Passed: ${testsPassed}`);
console.log(`Failed: ${testsFailed}`);
console.log(`Total: ${testsPassed + testsFailed}`);

if (testsFailed === 0) {
  console.log('\n✓ All tests passed!');
  process.exit(0);
} else {
  console.log(`\n✗ ${testsFailed} test(s) failed`);
  process.exit(1);
}
