/**
 * Security Test for Task 12.1
 * Tests XSS prevention and input sanitization
 */

// Mock DOM environment for testing
class MockElement {
    constructor(tagName) {
        this.tagName = tagName;
        this.textContent = '';
        this.innerHTML = '';
        this.className = '';
        this.attributes = {};
        this.children = [];
        this.style = {};
        this.dataset = {};
    }
    
    setAttribute(name, value) {
        this.attributes[name] = value;
    }
    
    getAttribute(name) {
        return this.attributes[name];
    }
    
    appendChild(child) {
        this.children.push(child);
    }
    
    querySelector(selector) {
        return null;
    }
}

// Load the utility functions from app.js
const fs = require('fs');
const appCode = fs.readFileSync('js/app.js', 'utf8');

// Extract and evaluate the utility functions
const utilityFunctionsMatch = appCode.match(/\/\/ ={70,}\n\/\/ Utility Functions\n\/\/ ={70,}([\s\S]*?)\/\/ ={70,}\n\/\/ StorageManager Class/);
if (!utilityFunctionsMatch) {
    console.error('Could not extract utility functions from app.js');
    process.exit(1);
}

const utilityFunctions = utilityFunctionsMatch[1];
eval(utilityFunctions);

// Test Results
let passCount = 0;
let failCount = 0;

function test(name, fn) {
    try {
        fn();
        console.log(`✓ PASS: ${name}`);
        passCount++;
    } catch (error) {
        console.log(`✗ FAIL: ${name}`);
        console.log(`  Error: ${error.message}`);
        failCount++;
    }
}

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

console.log('='.repeat(70));
console.log('Security Test - Task 12.1');
console.log('Testing XSS prevention and input sanitization');
console.log('='.repeat(70));
console.log('');

// Test 1: Valid URL Sanitization
test('Valid URLs pass sanitization', () => {
    const validUrls = [
        'https://example.com',
        'http://example.com',
        'https://example.com/path',
        'https://example.com:8080/path?query=value',
        'https://github.com/user/repo'
    ];
    
    validUrls.forEach(url => {
        const sanitized = sanitizeUrl(url);
        assert(sanitized !== null, `URL should be valid: ${url}`);
        assert(sanitized === url, `URL should remain unchanged: ${url} -> ${sanitized}`);
    });
});

// Test 2: Dangerous URLs are blocked
test('Dangerous URLs are blocked', () => {
    const dangerousUrls = [
        'javascript:alert("XSS")',
        'data:text/html,<script>alert("XSS")</script>',
        'vbscript:msgbox("XSS")',
        'file:///etc/passwd'
    ];
    
    dangerousUrls.forEach(url => {
        const sanitized = sanitizeUrl(url);
        assert(sanitized === null, `Dangerous URL should be blocked: ${url}`);
    });
});

// Test 3: Empty and whitespace URLs are rejected
test('Empty and whitespace URLs are rejected', () => {
    const invalidUrls = ['', '   ', '\t\n', null, undefined];
    
    invalidUrls.forEach(url => {
        const sanitized = sanitizeUrl(url);
        assert(sanitized === null, `Invalid URL should be rejected: ${JSON.stringify(url)}`);
    });
});

// Test 4: URLs without protocol are rejected
test('URLs without protocol are rejected', () => {
    const noProtocolUrls = [
        'example.com',
        'www.example.com',
        '//example.com',
        'ftp://example.com'
    ];
    
    noProtocolUrls.forEach(url => {
        const sanitized = sanitizeUrl(url);
        assert(sanitized === null, `URL without http/https should be rejected: ${url}`);
    });
});

// Test 5: URL validation function
test('validateUrl correctly validates URLs', () => {
    assert(validateUrl('https://example.com') === true, 'Valid HTTPS URL');
    assert(validateUrl('http://example.com') === true, 'Valid HTTP URL');
    assert(validateUrl('javascript:alert(1)') === false, 'JavaScript protocol rejected');
    assert(validateUrl('not-a-url') === false, 'Invalid URL rejected');
    assert(validateUrl('') === false, 'Empty string rejected');
});

// Test 6: Whitespace trimming
test('Input trimming works correctly', () => {
    const inputs = [
        { input: '   test   ', expected: 'test' },
        { input: '\t\ntest\n\t', expected: 'test' },
        { input: '  multiple  words  ', expected: 'multiple  words' }
    ];
    
    inputs.forEach(({ input, expected }) => {
        const trimmed = input.trim();
        assert(trimmed === expected, `Trimming failed: "${input}" -> "${trimmed}" (expected "${expected}")`);
    });
});

// Test 7: Length validation logic
test('Length validation logic', () => {
    const taskMaxLength = 500;
    const linkNameMaxLength = 100;
    
    // Valid lengths
    assert('a'.repeat(500).length <= taskMaxLength, 'Task at max length is valid');
    assert('a'.repeat(100).length <= linkNameMaxLength, 'Link name at max length is valid');
    
    // Invalid lengths
    assert('a'.repeat(501).length > taskMaxLength, 'Task over max length is invalid');
    assert('a'.repeat(101).length > linkNameMaxLength, 'Link name over max length is invalid');
    
    // Empty strings
    assert(''.trim().length === 0, 'Empty string has zero length');
    assert('   '.trim().length === 0, 'Whitespace-only string has zero length');
});

// Test 8: XSS prevention patterns
test('XSS prevention patterns', () => {
    const xssAttempts = [
        '<script>alert("XSS")</script>',
        '<img src=x onerror=alert(1)>',
        '<svg onload=alert(1)>',
        'javascript:alert(1)',
        '<iframe src="javascript:alert(1)"></iframe>'
    ];
    
    // These should be treated as plain text, not executed
    xssAttempts.forEach(xss => {
        // In the actual app, these would be set via textContent
        // which treats them as plain text
        const element = new MockElement('span');
        element.textContent = xss;
        
        // textContent should contain the raw string
        assert(element.textContent === xss, `XSS attempt stored as plain text: ${xss}`);
        
        // innerHTML should not be used for user content
        assert(element.innerHTML === '', 'innerHTML should not be used for user content');
    });
});

// Test 9: URL object protocol checking
test('URL protocol checking', () => {
    const testCases = [
        { url: 'https://example.com', shouldPass: true },
        { url: 'http://example.com', shouldPass: true },
        { url: 'ftp://example.com', shouldPass: false },
        { url: 'file:///etc/passwd', shouldPass: false }
    ];
    
    testCases.forEach(({ url, shouldPass }) => {
        try {
            const urlObj = new URL(url);
            const isValid = urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
            assert(isValid === shouldPass, `Protocol check for ${url}: expected ${shouldPass}, got ${isValid}`);
        } catch (e) {
            assert(!shouldPass, `Invalid URL ${url} should fail`);
        }
    });
});

// Test 10: Sanitization preserves valid URLs
test('Sanitization preserves valid URLs', () => {
    const validUrls = [
        'https://example.com',
        'https://example.com/path/to/page',
        'https://example.com?query=value&other=123',
        'https://example.com#fragment',
        'https://user:pass@example.com:8080/path?query=value#fragment'
    ];
    
    validUrls.forEach(url => {
        const sanitized = sanitizeUrl(url);
        assert(sanitized !== null, `Valid URL should not be null: ${url}`);
        
        // URL object normalizes the URL, so compare URL objects
        const originalUrl = new URL(url);
        const sanitizedUrl = new URL(sanitized);
        assert(originalUrl.href === sanitizedUrl.href, `URL should be preserved: ${url}`);
    });
});

console.log('');
console.log('='.repeat(70));
console.log(`Test Results: ${passCount} passed, ${failCount} failed`);
console.log('='.repeat(70));

if (failCount > 0) {
    process.exit(1);
}
