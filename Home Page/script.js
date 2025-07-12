// DOM Elements
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const loginModal = document.getElementById('loginModal');
const signupModal = document.getElementById('signupModal');
const switchToSignup = document.getElementById('switchToSignup');
const switchToLogin = document.getElementById('switchToLogin');
const askQuestionBtn = document.getElementById('askQuestionBtn');
const responseBtn = document.getElementById('responseBtn');
const responseForm = document.getElementById('responseForm');
const submitResponseBtn = document.getElementById('submitResponse');
const cancelResponseBtn = document.getElementById('cancelResponse');
const searchInput = document.getElementById('searchInput');
const themeToggle = document.getElementById('themeToggle');

// State
let currentUser = null;
let questions = [];
let responses = [];
let currentTheme = localStorage.getItem('theme') || 'light';

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    loadSampleData();
    updateUI();
    initializeTheme();
});

function initializeEventListeners() {
    // Auth buttons
    loginBtn.addEventListener('click', () => showModal(loginModal));
    signupBtn.addEventListener('click', () => showModal(signupModal));
    
    // Modal switching
    switchToSignup.addEventListener('click', (e) => {
        e.preventDefault();
        hideModal(loginModal);
        setTimeout(() => showModal(signupModal), 150);
    });
    
    switchToLogin.addEventListener('click', (e) => {
        e.preventDefault();
        hideModal(signupModal);
        setTimeout(() => showModal(loginModal), 150);
    });
    
    // Modal close buttons
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modalId = e.target.closest('button').getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            hideModal(modal);
        });
    });
    
    // Modal overlay clicks
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            hideModal(modal);
        });
    });
    
    // Form submissions
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('signupForm').addEventListener('submit', handleSignup);
    document.getElementById('askQuestionForm').addEventListener('submit', handleAskQuestion);
    
    // Question actions
    askQuestionBtn.addEventListener('click', handleAskQuestionClick);
    responseBtn.addEventListener('click', showResponseForm);
    submitResponseBtn.addEventListener('click', submitResponse);
    cancelResponseBtn.addEventListener('click', hideResponseForm);
    
    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);
    
    // Voting system
    document.addEventListener('click', handleVoting);
    
    // Modal controls
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // Search functionality
    searchInput.addEventListener('input', debounce(handleSearch, 300));
    
    // Form submissions
    // (Removed duplicate form submission handler)
    
    // Category links
    document.addEventListener('click', handleCategoryClick);
}

// Theme Functions
function initializeTheme() {
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon();
}

function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    updateThemeIcon();
    
    // Add animation class
    themeToggle.classList.add('pulse');
    setTimeout(() => themeToggle.classList.remove('pulse'), 500);
    
    showNotification(`Switched to ${currentTheme} theme`, 'success');
}

function updateThemeIcon() {
    const icon = themeToggle.querySelector('i');
    if (currentTheme === 'dark') {
        icon.className = 'fas fa-sun';
        themeToggle.setAttribute('aria-label', 'Switch to light theme');
    } else {
        icon.className = 'fas fa-moon';
        themeToggle.setAttribute('aria-label', 'Switch to dark theme');
    }
}

// Modal Functions
function showModal(modal) {
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        // Focus first input after animation
        setTimeout(() => {
            const firstInput = modal.querySelector('input');
            if (firstInput) firstInput.focus();
        }, 300);
    }
}

function hideModal(modal) {
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
        
        // Clear form data
        const form = modal.querySelector('form');
        if (form) form.reset();
    }
}

// Keyboard shortcuts and modal handling
function handleKeyboardShortcuts(e) {
    // ESC to close modals
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.show').forEach(modal => {
            hideModal(modal);
        });
        
        if (responseForm.style.display === 'block') {
            hideResponseForm();
        }
    }
    
    // Ctrl/Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInput.focus();
    }
}

// Voting System
function handleVoting(e) {
    if (e.target.closest('.vote-btn')) {
        e.preventDefault();
        const button = e.target.closest('.vote-btn');
        const action = button.getAttribute('data-action');
        const countElement = button.querySelector('.vote-count');
        
        if (!currentUser) {
            showNotification('Please login to vote', 'warning');
            return;
        }
        
        // Toggle vote
        if (button.classList.contains('voted')) {
            button.classList.remove('voted');
            if (countElement) {
                const currentCount = parseInt(countElement.textContent);
                countElement.textContent = action === 'upvote' ? currentCount - 1 : currentCount + 1;
            }
        } else {
            // Remove vote from opposite button if exists
            const parentElement = button.parentElement;
            const oppositeButton = parentElement.querySelector(`.vote-btn:not([data-action="${action}"])`);
            if (oppositeButton && oppositeButton.classList.contains('voted')) {
                oppositeButton.classList.remove('voted');
            }
            
            button.classList.add('voted');
            if (countElement) {
                const currentCount = parseInt(countElement.textContent);
                countElement.textContent = action === 'upvote' ? currentCount + 1 : currentCount - 1;
            }
        }
        
        // Add animation
        button.classList.add('pulse');
        setTimeout(() => button.classList.remove('pulse'), 500);
    }
}

// Response Form Functions
function showResponseForm() {
    if (!currentUser) {
        showNotification('Please login to add a response', 'warning');
        return;
    }
    
    responseForm.style.display = 'block';
    responseForm.scrollIntoView({ behavior: 'smooth' });
    document.getElementById('responseText').focus();
}

function hideResponseForm() {
    responseForm.style.display = 'none';
    document.getElementById('responseText').value = '';
}

function submitResponse() {
    const responseText = document.getElementById('responseText').value.trim();
    
    if (!responseText) {
        showNotification('Please enter a response', 'error');
        return;
    }
    
    if (!currentUser) {
        showNotification('Please login to submit a response', 'warning');
        return;
    }
    
    // Create new response
    const newResponse = {
        id: Date.now(),
        text: responseText,
        author: currentUser.username,
        date: new Date(),
        votes: 0
    };
    
    // Add to responses array
    responses.push(newResponse);
    
    // Add to DOM
    addResponseToDOM(newResponse);
    
    // Hide form and show success message
    hideResponseForm();
    showNotification('Response added successfully!', 'success');
}

function addResponseToDOM(response) {
    const responsesSection = document.querySelector('.responses-section');
    const responseCard = createResponseElement(response);
    
    // Insert before the response form
    responsesSection.insertBefore(responseCard, responseForm);
    
    // Update response count
    const responseCountElement = responsesSection.querySelector('h3');
    const currentCount = responses.length;
    responseCountElement.textContent = `${currentCount} Response${currentCount !== 1 ? 's' : ''}`;
}

function createResponseElement(response) {
    const responseCard = document.createElement('div');
    responseCard.className = 'response-card fade-in';
    responseCard.innerHTML = `
        <div class="response-header">
            <span class="author">@${response.author}</span>
            <span class="date">${formatDate(response.date)}</span>
        </div>
        <div class="response-body">
            <p>${response.text}</p>
        </div>
        <div class="response-actions">
            <button class="vote-btn upvote" data-action="upvote">
                <i class="fas fa-chevron-up"></i>
                <span class="vote-count">${response.votes}</span>
            </button>
            <button class="vote-btn downvote" data-action="downvote">
                <i class="fas fa-chevron-down"></i>
            </button>
            <button class="btn btn-outline btn-sm">Reply</button>
        </div>
    `;
    return responseCard;
}

// Search Functions
function handleSearch(e) {
    const query = e.target.value.toLowerCase().trim();
    
    if (query.length < 2) {
        showNotification('Please enter at least 2 characters to search', 'info');
        return;
    }
    
    // Simple search simulation
    console.log(`Searching for: ${query}`);
    showNotification(`Searching for "${query}"...`, 'info');
    
    // In a real application, this would make an API call
    setTimeout(() => {
        showNotification(`Found results for "${query}"`, 'success');
    }, 1000);
}

// Authentication Handlers
function handleLogin(e) {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;
    const remember = form.remember.checked;

    if (!email || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
    submitBtn.disabled = true;
    
    // Simulate login
    setTimeout(() => {
        currentUser = {
            id: 1,
            username: email.split('@')[0],
            email: email
        };
        
        hideModal(loginModal);
        updateUI();
        showNotification(`Welcome back, ${currentUser.username}!`, 'success');
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 1500);
}

function handleSignup(e) {
    e.preventDefault();
    const form = e.target;
    const username = form.username.value;
    const email = form.email.value;
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;
    const termsAccepted = form.terms.checked;
    
    if (!username || !email || !password || !confirmPassword) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }
    
    if (password.length < 6) {
        showNotification('Password must be at least 6 characters long', 'error');
        return;
    }
    
    if (!termsAccepted) {
        showNotification('Please accept the terms of service', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';
    submitBtn.disabled = true;
    
    // Simulate signup
    setTimeout(() => {
        currentUser = {
            id: Date.now(),
            username: username,
            email: email
        };
        
        hideModal(signupModal);
        updateUI();
        showNotification(`Welcome, ${currentUser.username}! Your account has been created.`, 'success');
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

// Ask Question Functions
function handleAskQuestionClick() {
    if (!currentUser) {
        showNotification('Please login to ask a question', 'warning');
        setTimeout(() => showModal(loginModal), 500);
        return;
    }
    
    showModal(document.getElementById('askQuestionModal'));
}

function handleAskQuestion(e) {
    e.preventDefault();
    const form = e.target;
    const title = form.title.value.trim();
    const body = form.body.value.trim();
    const tags = form.tags.value.trim();
    
    if (!title || !body) {
        showNotification('Please fill in the title and description', 'error');
        return;
    }
    
    if (!currentUser) {
        showNotification('Please login to ask a question', 'warning');
        return;
    }
    
    if (title.length < 10) {
        showNotification('Question title must be at least 10 characters long', 'error');
        return;
    }
    
    if (body.length < 20) {
        showNotification('Question description must be at least 20 characters long', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Posting question...';
    submitBtn.disabled = true;
    
    const newQuestion = {
        id: Date.now(),
        title: title,
        body: body,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        author: currentUser.username,
        date: new Date(),
        votes: 0,
        views: 0
    };
    
    // Simulate posting question
    setTimeout(() => {
        questions.push(newQuestion);
        hideModal(document.getElementById('askQuestionModal'));
        showNotification('Question posted successfully!', 'success');
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // In a real app, you'd redirect to the new question page
        console.log('New question:', newQuestion);
    }, 1500);
}

// Category Navigation
function handleCategoryClick(e) {
    if (e.target.classList.contains('category-link')) {
        e.preventDefault();
        
        // Remove active class from all category links
        document.querySelectorAll('.category-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to clicked link
        e.target.classList.add('active');
        
        const category = e.target.textContent;
        showNotification(`Showing ${category}`, 'info');
    }
}

// Utility Functions
function updateUI() {
    if (currentUser) {
        loginBtn.textContent = currentUser.username;
        loginBtn.onclick = logout;
        signupBtn.style.display = 'none';
    } else {
        loginBtn.textContent = 'Login';
        loginBtn.onclick = () => showModal('loginModal');
        signupBtn.style.display = 'inline-flex';
    }
}

function logout() {
    currentUser = null;
    updateUI();
    
    // Close any open modals
    document.querySelectorAll('.modal.show').forEach(modal => {
        hideModal(modal);
    });
    
    showNotification('Logged out successfully', 'success');
}

function formatDate(date) {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 60) {
        return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else if (hours < 24) {
        return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else {
        return `${days} day${days !== 1 ? 's' : ''} ago`;
    }
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '500',
        zIndex: '1001',
        opacity: '0',
        transform: 'translateX(100%)',
        transition: 'all 0.3s ease'
    });
    
    // Set background color based on type
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    notification.style.backgroundColor = colors[type] || colors.info;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function loadSampleData() {
    // Sample questions data
    questions = [
        {
            id: 1,
            title: "How to implement user authentication in a React application?",
            body: "I'm building a React application and need to implement user authentication...",
            tags: ["react", "authentication", "jwt", "security"],
            author: "developer123",
            date: new Date(Date.now() - 7200000), // 2 hours ago
            votes: 12,
            views: 156
        }
    ];
    
    // Sample responses data
    responses = [
        {
            id: 1,
            questionId: 1,
            text: "For React authentication, I recommend using a combination of JWT tokens with httpOnly cookies...",
            author: "react_expert",
            date: new Date(Date.now() - 3600000), // 1 hour ago
            votes: 8
        },
        {
            id: 2,
            questionId: 1,
            text: "Building on the previous answer, here are some additional security considerations...",
            author: "security_dev",
            date: new Date(Date.now() - 2700000), // 45 minutes ago
            votes: 5
        }
    ];
}

// Add some interactive features for better UX
document.addEventListener('mouseover', function(e) {
    if (e.target.classList.contains('response-card')) {
        e.target.style.transform = 'translateX(5px)';
    }
});

document.addEventListener('mouseout', function(e) {
    if (e.target.classList.contains('response-card')) {
        e.target.style.transform = 'translateX(0)';
    }
});

// Smooth scrolling for anchor links
document.addEventListener('click', function(e) {
    if (e.target.tagName === 'A' && e.target.getAttribute('href').startsWith('#')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    }
});

// Place this in your script.js or at the bottom of your HTML inside <script>
function checkValidation(){
  const signupForm = document.getElementById("signupForm");

  signupForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("signupUsername").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const termsCheckbox = signupForm.querySelector("input[name='terms']");

    let hasError = false;

    // Reset all field borders
    signupForm.querySelectorAll("input").forEach((input) => {
      input.style.borderColor = "#ccc";
    });
    termsCheckbox.closest(".checkbox-label").style.outline = "none";

    if (!username || !email || !password || !confirmPassword) {
      alert("Please fill in all fields.");
      if (!username) document.getElementById("signupUsername").style.borderColor = "red";
      if (!email) document.getElementById("signupEmail").style.borderColor = "red";
      if (!password) document.getElementById("signupPassword").style.borderColor = "red";
      if (!confirmPassword) document.getElementById("confirmPassword").style.borderColor = "red";
      return;
    }

    if (password !== confirmPassword) {
      Toastify({
        text: "Passwords do not match!",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#f44336",
      }).showToast();
      document.getElementById("confirmPassword").style.borderColor = "red";
      return;
    }

    if (!termsCheckbox.checked) {
      termsCheckbox.closest(".checkbox-label").style.outline = "2px solid red";
      alert("You must agree to the terms of service.");
      return;
    }

    // If all validations pass, submit the form
    signupForm.submit();
  });
};