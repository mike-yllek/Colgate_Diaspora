// You can change this to any password you want
const CORRECT_PASSWORD = "colgate2012";

// Check if user is already authenticated
function checkAuthentication() {
    const isAuthenticated = sessionStorage.getItem('authenticated');
    if (isAuthenticated === 'true') {
        showMainContent();
    }
}

function checkPassword() {
    const passwordInput = document.getElementById('passwordInput');
    const errorMessage = document.getElementById('errorMessage');
    
    // Debug logging
    console.log('Entered password:', passwordInput.value);
    console.log('Expected password:', CORRECT_PASSWORD);
    console.log('Lengths - Entered:', passwordInput.value.length, 'Expected:', CORRECT_PASSWORD.length);
    console.log('Are they equal?:', passwordInput.value === CORRECT_PASSWORD);
    
    // Remove any whitespace from the input
    const cleanPassword = passwordInput.value.trim();
    
    if (cleanPassword === CORRECT_PASSWORD) {
        // Store authentication state
        sessionStorage.setItem('authenticated', 'true');
        showMainContent();
    } else {
        errorMessage.style.display = 'block';
        errorMessage.textContent = 'Incorrect password. Please try again.';
        passwordInput.value = '';
    }
}

function showMainContent() {
    document.getElementById('loginOverlay').style.display = 'none';
    document.getElementById('mainContent').style.display = 'block';
}

// Add event listener for Enter key
document.getElementById('passwordInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        checkPassword();
    }
});

// Add event listener for button click
document.addEventListener('DOMContentLoaded', function() {
    const button = document.querySelector('.login-form button');
    if (button) {
        button.addEventListener('click', checkPassword);
    }
    checkAuthentication();
});