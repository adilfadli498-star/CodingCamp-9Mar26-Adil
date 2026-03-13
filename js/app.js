// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Format time as HH:MM:SS
 * @param {Date} date - Date object to format
 * @returns {string} Formatted time string
 */
function formatTime(date) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}

/**
 * Format date as "Day, Month DD, YYYY"
 * @param {Date} date - Date object to format
 * @returns {string} Formatted date string
 */
function formatDate(date) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'];
    
    const dayName = days[date.getDay()];
    const monthName = months[date.getMonth()];
    const dayNumber = date.getDate();
    const year = date.getFullYear();
    
    return `${dayName}, ${monthName} ${dayNumber}, ${year}`;
}

/**
 * Get greeting message based on hour of day
 * @param {number} hour - Hour in 24-hour format (0-23)
 * @returns {string} Greeting message
 */
function getGreeting(hour) {
    if (hour >= 5 && hour <= 11) {
        return "Good Morning";
    } else if (hour >= 12 && hour <= 16) {
        return "Good Afternoon";
    } else if (hour >= 17 && hour <= 20) {
        return "Good Evening";
    } else {
        return "Good Night";
        
    }
}

function rubahNama(input){
    let name = document.getElementById('name')
    name.innerText = input
}
rubahNama("Adil Fadli")

/**
 * Generate unique ID using timestamp and random number
 * @returns {string} Unique identifier
 */
function generateId() {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Validate URL format (must include http:// or https://)
 * @param {string} url - URL string to validate
 * @returns {boolean} True if valid, false otherwise
 */
function validateUrl(url) {
    try {
        const urlObj = new URL(url);
        return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch (e) {
        return false;
    }
}

/**
 * Sanitize URL to prevent XSS attacks
 * Removes javascript:, data:, and other dangerous protocols
 * @param {string} url - URL string to sanitize
 * @returns {string|null} Sanitized URL or null if invalid
 */
function sanitizeUrl(url) {
    if (!url || typeof url !== 'string') {
        return null;
    }
    
    // Trim whitespace
    const trimmed = url.trim();
    
    if (trimmed.length === 0) {
        return null;
    }
    
    // Validate URL format
    if (!validateUrl(trimmed)) {
        return null;
    }
    
    try {
        const urlObj = new URL(trimmed);
        
        // Only allow http and https protocols
        if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
            return null;
        }
        
        // Return the sanitized URL
        return urlObj.href;
    } catch (e) {
        return null;
    }
}

/**
 * Show feedback message to user
 * @param {string} message - Message to display
 * @param {string} type - Message type ('success' or 'error')
 */
function showFeedback(message, type = 'success') {
    // Create feedback element
    const feedback = document.createElement('div');
    feedback.className = `feedback-message ${type}`;
    feedback.textContent = message;
    
    // Add to document
    document.body.appendChild(feedback);
    
    // Remove after animation completes (3 seconds)
    setTimeout(() => {
        feedback.remove();
    }, 3000);
}

/**
 * Show loading overlay on a widget
 * @param {HTMLElement} container - Widget container element
 * @returns {HTMLElement} Loading overlay element
 */
function showLoading(container) {
    const overlay = document.createElement('div');
    overlay.className = 'loading-overlay';
    
    const spinner = document.createElement('div');
    spinner.className = 'loading-spinner';
    
    overlay.appendChild(spinner);
    container.appendChild(overlay);
    
    return overlay;
}

/**
 * Hide loading overlay
 * @param {HTMLElement} overlay - Loading overlay element to remove
 */
function hideLoading(overlay) {
    if (overlay && overlay.parentNode) {
        overlay.remove();
    }
}
// ============================================================================
// StorageManager Class
// ============================================================================

/**
 * Centralized Local Storage management with error handling
 */
class StorageManager {
    /**
     * Save data to Local Storage
     * @param {string} key - Storage key
     * @param {*} data - Data to save (will be JSON stringified)
     * @returns {boolean} True if successful, false on failure
     */
    save(key, data) {
        try {
            const jsonString = JSON.stringify(data);
            localStorage.setItem(key, jsonString);
            return true;
        } catch (error) {
            this._logError('save', error);
            return false;
        }
    }

    /**
     * Load data from Local Storage
     * @param {string} key - Storage key
     * @returns {*} Parsed data or null on failure
     */
    load(key) {
        try {
            const jsonString = localStorage.getItem(key);
            if (jsonString === null) {
                return null;
            }
            return JSON.parse(jsonString);
        } catch (error) {
            this._logError('load', error);
            return null;
        }
    }

    /**
     * Remove data from Local Storage
     * @param {string} key - Storage key
     * @returns {boolean} True if successful, false on failure
     */
    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            this._logError('remove', error);
            return false;
        }
    }

    /**
     * Clear all dashboard data from Local Storage
     * @returns {boolean} True if successful, false on failure
     */
    clear() {
        try {
            localStorage.removeItem('productivity-dashboard-tasks');
            localStorage.removeItem('productivity-dashboard-links');
            return true;
        } catch (error) {
            this._logError('clear', error);
            return false;
        }
    }

    /**
     * Check if Local Storage is available
     * @returns {boolean} True if available, false otherwise
     */
    isAvailable() {
        try {
            const testKey = '__storage_test__';
            localStorage.setItem(testKey, 'test');
            localStorage.removeItem(testKey);
            return true;
        } catch (error) {
            this._logError('isAvailable', error);
            return false;
        }
    }

    /**
     * Log error to console with timestamp and component name
     * @private
     * @param {string} operation - Operation that failed
     * @param {Error} error - Error object
     */
    _logError(operation, error) {
        const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
        const errorType = error.name || 'Error';
        const message = error.message || 'Unknown error';
        console.error(`[${timestamp}] [StorageManager] ${errorType} in ${operation}(): ${message}`);
    }
}

// ============================================================================
// GreetingController Class
// ============================================================================

/**
 * Manages the greeting widget with time, date, and time-based greeting
 */
class GreetingController {
    /**
     * Initialize GreetingController
     * @param {HTMLElement} containerElement - The greeting widget container
     */
    constructor(containerElement) {
        this.container = containerElement;
        this.dateDisplay = containerElement.querySelector('.date-display');
        this.timeDisplay = containerElement.querySelector('.time-display');
        this.greetingMessage = containerElement.querySelector('.greeting-message');
        this.intervalId = null;
    }

    /**
     * Initialize and start the clock
     */
    init() {
        // Update display immediately
        this.updateDisplay();
        
        // Set up 1-second interval for clock updates
        this.intervalId = setInterval(() => {
            this.updateDisplay();
        }, 1000);
    }

    /**
     * Update time, date, and greeting display
     */
    updateDisplay() {
        const now = new Date();
        
        // Update date display
        if (this.dateDisplay) {
            this.dateDisplay.textContent = formatDate(now);
        }
        
        // Update time display
        if (this.timeDisplay) {
            this.timeDisplay.textContent = formatTime(now);
        }
        
        // Update greeting message
        if (this.greetingMessage) {
            const hour = now.getHours();
            this.greetingMessage.textContent = getGreeting(hour);
        }
    }

    /**
     * Clean up interval
     */
    destroy() {
        if (this.intervalId !== null) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
}

// ============================================================================
// TimerController Class
// ============================================================================

/**
 * Manages the focus timer widget with countdown functionality
 */
class TimerController {
    /**
     * Initialize TimerController
     * @param {HTMLElement} containerElement - The timer widget container
     */
    constructor(containerElement) {
        this.container = containerElement;
        this.display = containerElement.querySelector('.timer-display');
        this.startButton = containerElement.querySelector('#timer-start');
        this.stopButton = containerElement.querySelector('#timer-stop');
        this.resetButton = containerElement.querySelector('#timer-reset');
        this.statusDisplay = containerElement.querySelector('.timer-status');
        
        // Timer state
        this.totalSeconds = 1500; // 25 minutes = 1500 seconds
        this.remainingSeconds = 1500;
        this.isRunning = false;
        this.intervalId = null;
    }

    /**
     * Initialize timer UI and event listeners
     */
    init() {
        // Set initial display
        this.updateDisplay();
        
        // Set up event listeners
        if (this.startButton) {
            this.startButton.addEventListener('click', () => this.start());
            // Add keyboard support for Space and Enter keys
            this.startButton.addEventListener('keydown', (e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    this.start();
                }
            });
        }
        
        if (this.stopButton) {
            this.stopButton.addEventListener('click', () => this.stop());
            // Add keyboard support for Space and Enter keys
            this.stopButton.addEventListener('keydown', (e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    this.stop();
                }
            });
        }
        
        if (this.resetButton) {
            this.resetButton.addEventListener('click', () => this.reset());
            // Add keyboard support for Space and Enter keys
            this.resetButton.addEventListener('keydown', (e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    this.reset();
                }
            });
        }
    }

    /**
     * Begin countdown
     */
    start() {
        // Prevent starting if already running
        if (this.isRunning) {
            return;
        }
        
        this.isRunning = true;
        this.updateButtonStates();
        
        // Clear status message when starting
        if (this.statusDisplay) {
            this.statusDisplay.textContent = '';
        }
        
        // Show feedback
        showFeedback('Timer started', 'success');
        
        // Set up interval to tick every second
        this.intervalId = setInterval(() => {
            this.tick();
        }, 1000);
    }

    /**
     * Pause countdown
     */
    stop() {
        if (!this.isRunning) {
            return;
        }
        
        this.isRunning = false;
        this.updateButtonStates();
        
        // Clear the interval
        if (this.intervalId !== null) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        
        // Show feedback
        showFeedback('Timer paused', 'success');
    }

    /**
     * Reset to 25:00
     */
    reset() {
        // Stop the timer if running
        if (this.isRunning) {
            this.stop();
        }
        
        // Reset to initial state
        this.remainingSeconds = this.totalSeconds;
        this.isRunning = false;
        
        // Clear status message
        if (this.statusDisplay) {
            this.statusDisplay.textContent = '';
        }
        
        // Update display and button states
        this.updateDisplay();
        this.updateButtonStates();
        
        // Show feedback
        showFeedback('Timer reset', 'success');
    }

    /**
     * Decrement by 1 second
     */
    tick() {
        if (this.remainingSeconds > 0) {
            this.remainingSeconds--;
            this.updateDisplay();
            
            // Check if timer completed
            if (this.remainingSeconds === 0) {
                this.onComplete();
            }
        }
    }

    /**
     * Render current time
     */
    updateDisplay() {
        if (this.display) {
            // Use requestAnimationFrame for smooth 60fps updates
            requestAnimationFrame(() => {
                this.display.textContent = this.formatTime(this.remainingSeconds);
            });
        }
    }

    /**
     * Handle timer completion
     */
    onComplete() {
        // Stop the timer
        this.stop();
        
        // Display completion indicator
        if (this.statusDisplay) {
            this.statusDisplay.textContent = '✓ Focus session complete!';
        }
    }

    /**
     * Format seconds as MM:SS
     * @param {number} seconds - Total seconds to format
     * @returns {string} Formatted time string
     */
    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    }

    /**
     * Update button enabled/disabled states based on timer state
     */
    updateButtonStates() {
        if (this.startButton) {
            // Disable start button when running, enable when stopped
            this.startButton.disabled = this.isRunning;
        }
    }
}

// ============================================================================
// TodoController Class
// ============================================================================

/**
 * Manages the to-do list widget with task operations
 */
class TodoController {
    /**
     * Initialize TodoController
     * @param {HTMLElement} containerElement - The todo list widget container
     * @param {StorageManager} storageManager - Storage manager instance
     */
    constructor(containerElement, storageManager) {
        this.container = containerElement;
        this.storageManager = storageManager;
        this.form = containerElement.querySelector('.todo-form');
        this.input = containerElement.querySelector('#todo-input');
        this.tasksList = containerElement.querySelector('.todo-items');
        this.emptyState = containerElement.querySelector('.empty-state');
        
        // Task state
        this.tasks = [];
        
        // Storage key
        this.storageKey = 'productivity-dashboard-tasks';
    }

    /**
     * Initialize todo list - load tasks and setup event listeners
     */
    init() {
        // Load tasks from storage
        this.loadTasks();
        
        // Render initial state
        this.renderTasks();
        
        // Set up form submission event listener
        if (this.form) {
            this.form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAddTask();
            });
            
            // Add Enter key support for input field
            if (this.input) {
                this.input.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        this.handleAddTask();
                    }
                });
            }
        }
    }

    /**
     * Handle form submission to add a new task
     */
    handleAddTask() {
        if (!this.input) return;
        
        const text = this.input.value.trim();
        
        // Validate input (1-500 characters, no whitespace-only)
        if (text.length === 0) {
            this.input.classList.add('error');
            showFeedback('Task cannot be empty', 'error');
            setTimeout(() => this.input.classList.remove('error'), 300);
            return;
        }
        
        if (text.length > 500) {
            this.input.classList.add('error');
            showFeedback('Task is too long (max 500 characters)', 'error');
            setTimeout(() => this.input.classList.remove('error'), 300);
            return;
        }
        
        // Show loading state
        const submitButton = this.form.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.classList.add('loading');
            submitButton.disabled = true;
        }
        
        // Add the task (simulate async operation with setTimeout for visual feedback)
        setTimeout(() => {
            this.addTask(text);
            
            // Clear input
            this.input.value = '';
            
            // Remove loading state
            if (submitButton) {
                submitButton.classList.remove('loading');
                submitButton.disabled = false;
            }
            
            // Show success feedback
            showFeedback('Task added successfully', 'success');
        }, 50); // 50ms to ensure visual feedback is visible
    }

    /**
     * Create new task
     * @param {string} text - Task description
     */
    addTask(text) {
        const task = {
            id: this.generateId(),
            text: text,
            completed: false,
            createdAt: Date.now()
        };
        
        this.tasks.push(task);
        this.saveTasks();
        this.renderTasks();
    }

    /**
     * Update task text
     * @param {string} id - Task ID
     * @param {string} newText - New task description
     */
    editTask(id, newText) {
        // Validate new text (1-500 characters, no whitespace-only)
        const trimmedText = newText.trim();
        
        if (trimmedText.length === 0 || trimmedText.length > 500) {
            showFeedback('Invalid task text', 'error');
            return;
        }
        
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.text = trimmedText;
            this.saveTasks();
            this.renderTasks();
            showFeedback('Task updated', 'success');
        }
    }

    /**
     * Toggle completion status
     * @param {string} id - Task ID
     */
    toggleTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.renderTasks();
            showFeedback(task.completed ? 'Task completed' : 'Task reopened', 'success');
        }
    }

    /**
     * Remove task
     * @param {string} id - Task ID
     */
    deleteTask(id) {
        this.tasks = this.tasks.filter(t => t.id !== id);
        this.saveTasks();
        this.renderTasks();
        showFeedback('Task deleted', 'success');
    }

    /**
     * Render all tasks to DOM
     */
    renderTasks() {
        if (!this.tasksList) return;
        
        // Clear current list
        this.tasksList.innerHTML = '';
        
        // Show/hide empty state
        if (this.emptyState) {
            if (this.tasks.length === 0) {
                this.emptyState.classList.add('visible');
            } else {
                this.emptyState.classList.remove('visible');
            }
        }
        
        // Render each task
        this.tasks.forEach(task => {
            const taskItem = this.createTaskElement(task);
            this.tasksList.appendChild(taskItem);
        });
    }

    /**
     * Create DOM element for a task
     * @param {Object} task - Task object
     * @returns {HTMLElement} Task list item element
     */
    createTaskElement(task) {
        const li = document.createElement('li');
        li.className = 'todo-item';
        if (task.completed) {
            li.classList.add('completed');
        }
        li.dataset.id = task.id;
        li.setAttribute('role', 'listitem');
        
        // Checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'todo-checkbox';
        checkbox.checked = task.completed;
        checkbox.setAttribute('aria-checked', task.completed ? 'true' : 'false');
        checkbox.setAttribute('aria-label', `Mark task "${task.text}" as ${task.completed ? 'incomplete' : 'complete'}`);
        checkbox.addEventListener('change', () => {
            this.toggleTask(task.id);
        });
        
        // Task text
        const textSpan = document.createElement('span');
        textSpan.className = 'todo-text';
        textSpan.textContent = task.text; // Use textContent to prevent XSS
        
        // Edit button
        const editButton = document.createElement('button');
        editButton.className = 'btn btn-secondary todo-edit';
        editButton.textContent = 'Edit';
        editButton.setAttribute('aria-label', `Edit task "${task.text}"`);
        editButton.addEventListener('click', () => {
            this.handleEditTask(task.id, textSpan);
        });
        
        // Delete button
        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-danger todo-delete';
        deleteButton.textContent = 'Delete';
        deleteButton.setAttribute('aria-label', `Delete task "${task.text}"`);
        deleteButton.addEventListener('click', () => {
            this.deleteTask(task.id);
        });
        
        // Assemble task item
        li.appendChild(checkbox);
        li.appendChild(textSpan);
        li.appendChild(editButton);
        li.appendChild(deleteButton);
        
        return li;
    }

    /**
     * Handle edit task interaction
     * @param {string} id - Task ID
     * @param {HTMLElement} textSpan - Text span element to replace with input
     */
    handleEditTask(id, textSpan) {
        const task = this.tasks.find(t => t.id === id);
        if (!task) return;
        
        // Create input element
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'todo-text';
        input.value = task.text;
        input.maxLength = 500;
        input.setAttribute('aria-label', 'Edit task text');
        
        // Replace text span with input
        textSpan.replaceWith(input);
        input.focus();
        input.select();
        
        // Handle save on blur or Enter key
        const saveEdit = () => {
            const newText = input.value.trim();
            if (newText.length > 0 && newText.length <= 500) {
                this.editTask(id, newText);
            } else {
                // Invalid input, just re-render to restore original
                this.renderTasks();
            }
        };
        
        input.addEventListener('blur', saveEdit);
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                saveEdit();
            } else if (e.key === 'Escape') {
                e.preventDefault();
                // Cancel edit, restore original
                this.renderTasks();
            }
        });
    }

    /**
     * Persist tasks to storage
     */
    saveTasks() {
        this.storageManager.save(this.storageKey, this.tasks);
    }

    /**
     * Load tasks from storage
     */
    loadTasks() {
        const loaded = this.storageManager.load(this.storageKey);
        if (Array.isArray(loaded)) {
            this.tasks = loaded;
        } else {
            this.tasks = [];
        }
    }

    /**
     * Generate unique task ID
     * @returns {string} Unique identifier
     */
    generateId() {
        return generateId();
    }
}

// ============================================================================
// LinksController Class
// ============================================================================

/**
 * Manages the quick links widget with link operations
 */
class LinksController {
    /**
     * Initialize LinksController
     * @param {HTMLElement} containerElement - The quick links widget container
     * @param {StorageManager} storageManager - Storage manager instance
     */
    constructor(containerElement, storageManager) {
        this.container = containerElement;
        this.storageManager = storageManager;
        this.form = containerElement.querySelector('.links-form');
        this.nameInput = containerElement.querySelector('#link-name');
        this.urlInput = containerElement.querySelector('#link-url');
        this.linksList = containerElement.querySelector('.link-items');
        this.emptyState = containerElement.querySelector('.empty-state');
        
        // Links state
        this.links = [];
        
        // Storage key
        this.storageKey = 'productivity-dashboard-links';
    }

    /**
     * Initialize quick links - load links and setup event listeners
     */
    init() {
        // Load links from storage
        this.loadLinks();
        
        // Render initial state
        this.renderLinks();
        
        // Set up form submission event listener
        if (this.form) {
            this.form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAddLink();
            });
            
            // Add Enter key support for input fields
            if (this.nameInput) {
                this.nameInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        // Move to URL input if name is filled
                        if (this.nameInput.value.trim()) {
                            this.urlInput.focus();
                        }
                    }
                });
            }
            
            if (this.urlInput) {
                this.urlInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        this.handleAddLink();
                    }
                });
            }
        }
    }

    /**
     * Handle form submission to add a new link
     */
    handleAddLink() {
        if (!this.nameInput || !this.urlInput) return;
        
        const name = this.nameInput.value.trim();
        const url = this.urlInput.value.trim();
        
        // Validate name (1-100 characters, no whitespace-only)
        if (name.length === 0 || name.length > 100) {
            this.nameInput.classList.add('error');
            showFeedback('Link name must be 1-100 characters', 'error');
            setTimeout(() => this.nameInput.classList.remove('error'), 300);
            return;
        }
        
        // Sanitize and validate URL
        const sanitizedUrl = sanitizeUrl(url);
        if (!sanitizedUrl) {
            this.urlInput.classList.add('error');
            showFeedback('Invalid URL (must start with http:// or https://)', 'error');
            setTimeout(() => this.urlInput.classList.remove('error'), 300);
            return;
        }
        
        // Show loading state
        const submitButton = this.form.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.classList.add('loading');
            submitButton.disabled = true;
        }
        
        // Add the link (simulate async operation with setTimeout for visual feedback)
        setTimeout(() => {
            this.addLink(name, sanitizedUrl);
            
            // Clear inputs
            this.nameInput.value = '';
            this.urlInput.value = '';
            
            // Remove loading state
            if (submitButton) {
                submitButton.classList.remove('loading');
                submitButton.disabled = false;
            }
            
            // Show success feedback
            showFeedback('Link added successfully', 'success');
        }, 50); // 50ms to ensure visual feedback is visible
    }

    /**
     * Create new link
     * @param {string} name - Link display name
     * @param {string} url - Link URL
     */
    addLink(name, url) {
        const link = {
            id: this.generateId(),
            name: name,
            url: url,
            createdAt: Date.now()
        };
        
        this.links.push(link);
        this.saveLinks();
        this.renderLinks();
    }

    /**
     * Remove link
     * @param {string} id - Link ID
     */
    deleteLink(id) {
        this.links = this.links.filter(l => l.id !== id);
        this.saveLinks();
        this.renderLinks();
        showFeedback('Link deleted', 'success');
    }

    /**
     * Render all links to DOM
     */
    renderLinks() {
        if (!this.linksList) return;
        
        // Clear current list
        this.linksList.innerHTML = '';
        
        // Show/hide empty state
        if (this.emptyState) {
            if (this.links.length === 0) {
                this.emptyState.classList.add('visible');
            } else {
                this.emptyState.classList.remove('visible');
            }
        }
        
        // Render each link
        this.links.forEach(link => {
            const linkItem = this.createLinkElement(link);
            this.linksList.appendChild(linkItem);
        });
    }

    /**
     * Create DOM element for a link
     * @param {Object} link - Link object
     * @returns {HTMLElement} Link list item element
     */
    createLinkElement(link) {
        const li = document.createElement('li');
        li.className = 'link-item';
        li.dataset.id = link.id;
        li.setAttribute('role', 'listitem');
        
        // Sanitize URL before creating anchor
        const sanitizedUrl = sanitizeUrl(link.url);
        
        // Anchor element
        const anchor = document.createElement('a');
        // Use sanitized URL, or fallback to '#' if invalid
        anchor.href = sanitizedUrl || '#';
        anchor.target = '_blank';
        anchor.rel = 'noopener noreferrer';
        anchor.setAttribute('aria-label', `Open ${link.name} in new tab`);
        
        // If URL is invalid, disable the link
        if (!sanitizedUrl) {
            anchor.style.pointerEvents = 'none';
            anchor.style.opacity = '0.5';
            anchor.setAttribute('aria-disabled', 'true');
        }
        
        // Link name span
        const nameSpan = document.createElement('span');
        nameSpan.className = 'link-name';
        nameSpan.textContent = link.name; // Use textContent to prevent XSS
        
        anchor.appendChild(nameSpan);
        
        // Delete button
        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-danger link-delete';
        deleteButton.textContent = 'Delete';
        deleteButton.setAttribute('aria-label', `Delete link "${link.name}"`);
        deleteButton.addEventListener('click', () => {
            this.deleteLink(link.id);
        });
        
        // Assemble link item
        li.appendChild(anchor);
        li.appendChild(deleteButton);
        
        return li;
    }

    /**
     * Persist links to storage
     */
    saveLinks() {
        this.storageManager.save(this.storageKey, this.links);
    }

    /**
     * Load links from storage
     */
    loadLinks() {
        const loaded = this.storageManager.load(this.storageKey);
        if (Array.isArray(loaded)) {
            this.links = loaded;
        } else {
            this.links = [];
        }
    }

    /**
     * Generate unique link ID
     * @returns {string} Unique identifier
     */
    generateId() {
        return generateId();
    }

    /**
     * Validate URL format (must include http:// or https://)
     * @param {string} url - URL string to validate
     * @returns {boolean} True if valid, false otherwise
     */
    validateUrl(url) {
        return validateUrl(url);
    }
}


// ============================================================================
// App Initialization
// ============================================================================

/**
 * Check browser compatibility
 * @returns {boolean} True if browser is compatible, false otherwise
 */
function checkBrowserCompatibility() {
    if (typeof Storage === "undefined") {
        displayError("Your browser doesn't support Local Storage. Please use a modern browser.");
        return false;
    }
    return true;
}

/**
 * Display error message to user
 * @param {string} message - Error message to display
 */
function displayError(message) {
    const errorBanner = document.getElementById('error-message');
    if (errorBanner) {
        errorBanner.textContent = message;
        errorBanner.style.display = 'block';
    }
    console.error(`[App] ${message}`);
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Check browser compatibility
    if (!checkBrowserCompatibility()) {
        return;
    }

    // Initialize StorageManager
    const storageManager = new StorageManager();
    
    // Verify Local Storage is actually available
    if (!storageManager.isAvailable()) {
        displayError("Local Storage is not available. Data will not be saved.");
    }
    
    // Initialize Greeting Widget with error handling
    try {
        const greetingWidget = document.getElementById('greeting-widget');
        if (greetingWidget) {
            const greetingController = new GreetingController(greetingWidget);
            greetingController.init();
        } else {
            console.warn('[App] Greeting widget container not found');
        }
    } catch (error) {
        console.error('[App] Failed to initialize Greeting Widget:', error);
    }
    
    // Initialize Focus Timer with error handling
    try {
        const focusTimer = document.getElementById('focus-timer');
        if (focusTimer) {
            const timerController = new TimerController(focusTimer);
            timerController.init();
        } else {
            console.warn('[App] Focus timer container not found');
        }
    } catch (error) {
        console.error('[App] Failed to initialize Focus Timer:', error);
    }
    
    // Initialize To-Do List with error handling
    try {
        const todoList = document.getElementById('todo-list');
        if (todoList) {
            const todoController = new TodoController(todoList, storageManager);
            todoController.init();
        } else {
            console.warn('[App] To-Do list container not found');
        }
    } catch (error) {
        console.error('[App] Failed to initialize To-Do List:', error);
    }
    
    // Initialize Quick Links with error handling
    try {
        const quickLinks = document.getElementById('quick-links');
        if (quickLinks) {
            const linksController = new LinksController(quickLinks, storageManager);
            linksController.init();
        } else {
            console.warn('[App] Quick links container not found');
        }
    } catch (error) {
        console.error('[App] Failed to initialize Quick Links:', error);
    }
});
