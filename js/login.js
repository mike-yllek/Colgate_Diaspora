// You can change this to any password you want
const CORRECT_PASSWORD = "colgate2018";

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
    
    if (passwordInput.value === CORRECT_PASSWORD) {
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

// Check authentication when page loads
document.addEventListener('DOMContentLoaded', checkAuthentication);