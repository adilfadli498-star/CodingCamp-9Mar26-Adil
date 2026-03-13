/**
 * Theme Manager Module
 * Handles theme detection, persistence, and application for light/dark mode
 */

const THEME_STORAGE_KEY = 'theme-preference';
const VALID_THEMES = ['light', 'dark'];

/**
 * Detects the system theme preference using prefers-color-scheme media query
 * @returns {'light' | 'dark'} The system's preferred theme
 */
function getSystemTheme() {
  // Check if matchMedia is supported
  if (!window.matchMedia) {
    return 'light';
  }
  
  try {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  } catch (error) {
    console.warn('Failed to detect system theme:', error);
    return 'light';
  }
}

/**
 * Loads the saved theme preference from Local Storage
 * @returns {'light' | 'dark' | null} The saved theme or null if not found/error
 */
function loadSavedTheme() {
  try {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    
    // Validate the saved theme
    if (savedTheme && VALID_THEMES.includes(savedTheme)) {
      return savedTheme;
    }
    
    // If invalid, clear it and return null
    if (savedTheme) {
      console.warn('Invalid theme value in storage:', savedTheme);
      localStorage.removeItem(THEME_STORAGE_KEY);
    }
    
    return null;
  } catch (error) {
    console.warn('Failed to load theme preference:', error);
    return null;
  }
}

/**
 * Saves the theme preference to Local Storage
 * @param {'light' | 'dark'} theme - The theme to save
 */
function saveTheme(theme) {
  // Validate theme before saving
  if (!VALID_THEMES.includes(theme)) {
    console.error('Invalid theme value:', theme);
    return;
  }
  
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (error) {
    console.warn('Failed to save theme preference:', error);
    // Continue with in-memory state - graceful degradation
  }
}

/**
 * Applies the theme to the DOM by setting the data-theme attribute
 * @param {'light' | 'dark'} theme - The theme to apply
 */
function applyTheme(theme) {
  // Validate theme before applying
  if (!VALID_THEMES.includes(theme)) {
    console.warn('Invalid theme value:', theme);
    theme = getSystemTheme();
  }
  
  // Set the data-theme attribute on the html element
  document.documentElement.setAttribute('data-theme', theme);
}

/**
 * Gets the current active theme
 * @returns {'light' | 'dark'} The current theme
 */
function getCurrentTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  
  // If no theme is set yet, return the default
  if (!currentTheme || !VALID_THEMES.includes(currentTheme)) {
    return 'light';
  }
  
  return currentTheme;
}

/**
 * Sets a specific theme and saves it to Local Storage
 * @param {'light' | 'dark'} theme - The theme to set
 */
function setTheme(theme) {
  // Validate theme
  if (!VALID_THEMES.includes(theme)) {
    console.error('Invalid theme value:', theme);
    return;
  }
  
  // Apply the theme to the DOM
  applyTheme(theme);
  
  // Save the theme preference
  saveTheme(theme);
}

/**
 * Toggles between light and dark themes
 */
function toggleTheme() {
  const currentTheme = getCurrentTheme();
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
}

/**
 * Checks if dark mode is currently active
 * @returns {boolean} True if dark mode is active, false otherwise
 */
function isDarkMode() {
  return getCurrentTheme() === 'dark';
}

/**
 * Initializes the theme system on page load
 * Priority: 1) Saved preference, 2) System preference, 3) Default (light)
 */
function initTheme() {
  // First, try to load saved theme preference
  const savedTheme = loadSavedTheme();
  
  if (savedTheme) {
    // Apply saved preference (highest priority)
    applyTheme(savedTheme);
    return;
  }
  
  // No saved preference, check system preference
  const systemTheme = getSystemTheme();
  
  // Apply system preference (or default light if detection fails)
  applyTheme(systemTheme);
  
  // Note: We don't save the system preference to Local Storage
  // This allows the system preference to be respected until the user
  // makes an explicit choice via the toggle
}
