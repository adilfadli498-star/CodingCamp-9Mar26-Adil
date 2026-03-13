/**
 * Test script for Task 2.8 - Theme Initialization Logic
 * Tests: initTheme()
 * Requirements: 3.3, 3.4, 5.2, 5.3
 */

// Helper function to reset state
function resetState() {
  localStorage.removeItem('theme-preference');
  document.documentElement.removeAttribute('data-theme');
}

// Helper function to mock system preference
function mockSystemPreference(prefersDark) {
  // Store original matchMedia
  const originalMatchMedia = window.matchMedia;
  
  // Mock matchMedia
  window.matchMedia = function(query) {
    if (query === '(prefers-color-scheme: dark)') {
      return {
        matches: prefersDark,
        media: query,
        addEventListener: function() {},
        removeEventListener: function() {}
      };
    }
    return originalMatchMedia(query);
  };
  
  return function restore() {
    window.matchMedia = originalMatchMedia;
  };
}

// Run tests
console.log('=== Testing Task 2.8: Theme Initialization Logic ===\n');

// Test 1: initTheme applies saved preference (highest priority)
console.log('Test 1: initTheme() applies saved preference from Local Storage');
resetState();
localStorage.setItem('theme-preference', 'dark');
initTheme();
const test1Theme = getCurrentTheme();
console.log(
  test1Theme === 'dark' ? '✓ PASS' : '✗ FAIL',
  `- Expected: 'dark', Got: '${test1Theme}'`
);

// Test 2: initTheme applies system preference when no saved preference
console.log('\nTest 2: initTheme() applies system preference (dark) when no saved preference');
resetState();
const restore2 = mockSystemPreference(true); // System prefers dark
initTheme();
const test2Theme = getCurrentTheme();
restore2();
console.log(
  test2Theme === 'dark' ? '✓ PASS' : '✗ FAIL',
  `- Expected: 'dark', Got: '${test2Theme}'`
);

// Test 3: initTheme applies system preference (light) when no saved preference
console.log('\nTest 3: initTheme() applies system preference (light) when no saved preference');
resetState();
const restore3 = mockSystemPreference(false); // System prefers light
initTheme();
const test3Theme = getCurrentTheme();
restore3();
console.log(
  test3Theme === 'light' ? '✓ PASS' : '✗ FAIL',
  `- Expected: 'light', Got: '${test3Theme}'`
);

// Test 4: initTheme defaults to light when no saved preference and system detection fails
console.log('\nTest 4: initTheme() defaults to light when system detection unavailable');
resetState();
const originalMatchMedia = window.matchMedia;
window.matchMedia = undefined; // Simulate unsupported browser
initTheme();
const test4Theme = getCurrentTheme();
window.matchMedia = originalMatchMedia;
console.log(
  test4Theme === 'light' ? '✓ PASS' : '✗ FAIL',
  `- Expected: 'light', Got: '${test4Theme}'`
);

// Test 5: initTheme prioritizes saved preference over system preference
console.log('\nTest 5: initTheme() prioritizes saved preference over system preference');
resetState();
localStorage.setItem('theme-preference', 'light');
const restore5 = mockSystemPreference(true); // System prefers dark, but saved is light
initTheme();
const test5Theme = getCurrentTheme();
restore5();
console.log(
  test5Theme === 'light' ? '✓ PASS' : '✗ FAIL',
  `- Expected: 'light' (saved preference), Got: '${test5Theme}'`
);

// Test 6: initTheme does not save system preference to Local Storage
console.log('\nTest 6: initTheme() does not save system preference to Local Storage');
resetState();
const restore6 = mockSystemPreference(true); // System prefers dark
initTheme();
const test6Storage = localStorage.getItem('theme-preference');
restore6();
console.log(
  test6Storage === null ? '✓ PASS' : '✗ FAIL',
  `- Expected: null (no storage), Got: '${test6Storage}'`
);

// Test 7: initTheme handles invalid saved preference gracefully
console.log('\nTest 7: initTheme() handles invalid saved preference gracefully');
resetState();
localStorage.setItem('theme-preference', 'invalid');
const restore7 = mockSystemPreference(false); // System prefers light
initTheme();
const test7Theme = getCurrentTheme();
const test7Storage = localStorage.getItem('theme-preference');
restore7();
console.log(
  test7Theme === 'light' && test7Storage === null ? '✓ PASS' : '✗ FAIL',
  `- Expected: 'light' theme and null storage, Got: theme='${test7Theme}', storage='${test7Storage}'`
);

// Test 8: initTheme can be called multiple times safely
console.log('\nTest 8: initTheme() can be called multiple times safely');
resetState();
localStorage.setItem('theme-preference', 'dark');
initTheme();
const test8Theme1 = getCurrentTheme();
initTheme(); // Call again
const test8Theme2 = getCurrentTheme();
console.log(
  test8Theme1 === 'dark' && test8Theme2 === 'dark' ? '✓ PASS' : '✗ FAIL',
  `- Expected: 'dark' both times, Got: '${test8Theme1}' then '${test8Theme2}'`
);

// Test 9: initTheme applies theme to DOM correctly
console.log('\nTest 9: initTheme() sets data-theme attribute on html element');
resetState();
localStorage.setItem('theme-preference', 'dark');
initTheme();
const test9Attr = document.documentElement.getAttribute('data-theme');
console.log(
  test9Attr === 'dark' ? '✓ PASS' : '✗ FAIL',
  `- Expected: 'dark', Got: '${test9Attr}'`
);

// Test 10: initTheme handles Local Storage errors gracefully
console.log('\nTest 10: initTheme() handles Local Storage errors gracefully');
resetState();
const originalGetItem = Storage.prototype.getItem;
Storage.prototype.getItem = function() {
  throw new Error('Storage unavailable');
};
const restore10 = mockSystemPreference(false);
try {
  initTheme();
  const test10Theme = getCurrentTheme();
  console.log(
    test10Theme === 'light' ? '✓ PASS' : '✗ FAIL',
    `- Expected: 'light' (fallback to system), Got: '${test10Theme}'`
  );
} catch (error) {
  console.log('✗ FAIL - initTheme() threw an error:', error.message);
} finally {
  Storage.prototype.getItem = originalGetItem;
  restore10();
}

console.log('\n=== All Tests Complete ===');
