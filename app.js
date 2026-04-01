// Knowledge Check System - Mock-up JavaScript
// This is a demo system with hardcoded data and no backend

// Global variables
let currentUser = null;
let currentScore = 0;
let quizAttempts = 0;

// Quiz data with correct answers
const quizData = {
    questions: {
        q1: 'b', // Verify user identity through security questions
        q2: 'a', // User's password (should NOT be collected)
        q3: 'b', // 1 hour for Priority 1 tickets
        q4: 'b', // TeamViewer for remote support
        q5: 'b'  // Escalate to the appropriate team
    }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Check current page and initialize accordingly
    const currentPath = window.location.pathname.split('/').pop();
    
    switch(currentPath) {
        case 'index.html':
        case '':
            initializeLoginPage();
            break;
        case 'agent.html':
            initializeAgentDashboard();
            break;
        case 'quiz.html':
            initializeQuizPage();
            break;
        case 'result.html':
            initializeResultPage();
            break;
        case 'admin.html':
            initializeAdminDashboard();
            break;
    }
});

// Login Page Functions
function initializeLoginPage() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
}

function handleLogin(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const role = document.getElementById('role').value;
    
    if (!name || !role) {
        alert('Please fill in all fields');
        return;
    }
    
    // Store user data in session storage (for demo purposes)
    currentUser = {
        name: name,
        role: role
    };
    
    sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Redirect based on role
    if (role === 'admin') {
        window.location.href = 'admin.html';
    } else {
        window.location.href = 'agent.html';
    }
}

// Agent Dashboard Functions
function initializeAgentDashboard() {
    // Get current user from session storage
    const userData = sessionStorage.getItem('currentUser');
    if (!userData) {
        window.location.href = 'index.html';
        return;
    }
    
    currentUser = JSON.parse(userData);
    
    // Update welcome message
    const welcomeMessage = document.getElementById('welcomeMessage');
    if (welcomeMessage) {
        welcomeMessage.textContent = `Welcome back, ${currentUser.name}!`;
    }
}

function startKnowledgeCheck() {
    window.location.href = 'quiz.html';
}

// Quiz Page Functions
function initializeQuizPage() {
    // Verify user is logged in
    const userData = sessionStorage.getItem('currentUser');
    if (!userData) {
        window.location.href = 'index.html';
        return;
    }
    
    currentUser = JSON.parse(userData);
    
    // Initialize quiz form
    const quizForm = document.getElementById('quizForm');
    if (quizForm) {
        quizForm.addEventListener('submit', handleQuizSubmit);
    }
    
    // Add radio button change listeners for progress tracking
    const radioButtons = document.querySelectorAll('input[type="radio"]');
    radioButtons.forEach(radio => {
        radio.addEventListener('change', updateProgress);
    });
    
    // Initialize progress
    updateProgress();
}

function updateProgress() {
    const totalQuestions = 5;
    let answeredQuestions = 0;
    
    // Count answered questions
    for (let i = 1; i <= totalQuestions; i++) {
        const questionName = `q${i}`;
        const answered = document.querySelector(`input[name="${questionName}"]:checked`);
        if (answered) {
            answeredQuestions++;
        }
    }
    
    // Update progress bar
    const progressFill = document.getElementById('progressFill');
    if (progressFill) {
        const progressPercentage = (answeredQuestions / totalQuestions) * 100;
        progressFill.style.width = `${progressPercentage}%`;
    }
}

function handleQuizSubmit(event) {
    event.preventDefault();
    
    // Check if all questions are answered
    const totalQuestions = 5;
    let answeredQuestions = 0;
    
    for (let i = 1; i <= totalQuestions; i++) {
        const questionName = `q${i}`;
        const answered = document.querySelector(`input[name="${questionName}"]:checked`);
        if (answered) {
            answeredQuestions++;
        }
    }
    
    if (answeredQuestions < totalQuestions) {
        alert('Please answer all questions before submitting.');
        return;
    }
    
    // Calculate score
    let correctAnswers = 0;
    
    for (let i = 1; i <= totalQuestions; i++) {
        const questionName = `q${i}`;
        const selectedAnswer = document.querySelector(`input[name="${questionName}"]:checked`);
        const correctAnswer = quizData.questions[questionName];
        
        if (selectedAnswer && selectedAnswer.value === correctAnswer) {
            correctAnswers++;
        }
    }
    
    currentScore = Math.round((correctAnswers / totalQuestions) * 100);
    quizAttempts++;
    
    // Store results in session storage
    sessionStorage.setItem('quizResults', JSON.stringify({
        score: currentScore,
        attempts: quizAttempts,
        passed: currentScore >= 80
    }));
    
    // Redirect to results page
    window.location.href = 'result.html';
}

// Result Page Functions
function initializeResultPage() {
    // Verify user is logged in
    const userData = sessionStorage.getItem('currentUser');
    if (!userData) {
        window.location.href = 'index.html';
        return;
    }
    
    currentUser = JSON.parse(userData);
    
    // Get quiz results
    const quizResults = sessionStorage.getItem('quizResults');
    if (!quizResults) {
        window.location.href = 'agent.html';
        return;
    }
    
    const results = JSON.parse(quizResults);
    displayResults(results);
}

function displayResults(results) {
    const scoreNumber = document.getElementById('scoreNumber');
    const scoreCircle = document.getElementById('scoreCircle');
    const statusMessage = document.getElementById('statusMessage');
    const detailsSection = document.getElementById('detailsSection');
    const actionSection = document.getElementById('actionSection');
    
    // Update score display
    if (scoreNumber) {
        scoreNumber.textContent = `${results.score}%`;
    }
    
    // Update score circle styling
    if (scoreCircle) {
        if (results.passed) {
            scoreCircle.classList.add('pass');
        } else {
            scoreCircle.classList.add('fail');
        }
    }
    
    // Update status message
    if (statusMessage) {
        if (results.passed) {
            statusMessage.innerHTML = `
                <div class="pass">
                    <h2>🎉 CONGRATULATIONS! YOU PASSED!</h2>
                    <p>You have successfully completed the Knowledge Check with a score of ${results.score}%.</p>
                </div>
            `;
        } else {
            statusMessage.innerHTML = `
                <div class="fail">
                    <h2>❌ KNOWLEDGE CHECK FAILED</h2>
                    <p>You scored ${results.score}%. The passing score is 80%. Retake required.</p>
                </div>
            `;
        }
    }
    
    // Update details section
    if (detailsSection) {
        detailsSection.innerHTML = `
            <h3>Quiz Summary</h3>
            <p><strong>Score:</strong> ${results.score}%</p>
            <p><strong>Status:</strong> ${results.passed ? 'PASSED' : 'FAILED'}</p>
            <p><strong>Attempts:</strong> ${results.attempts}</p>
            <p><strong>Required Score:</strong> 80%</p>
        `;
    }
    
    // Update action buttons
    if (actionSection) {
        if (results.passed) {
            actionSection.innerHTML = `
                <button class="btn btn-success btn-large" onclick="returnToDashboard()">
                    Return to Dashboard
                </button>
            `;
        } else {
            actionSection.innerHTML = `
                <button class="btn btn-danger btn-large" onclick="retakeQuiz()">
                    Retake Knowledge Check
                </button>
                <button class="btn btn-secondary" onclick="returnToDashboard()">
                    Return to Dashboard
                </button>
            `;
        }
    }
}

function returnToDashboard() {
    window.location.href = 'agent.html';
}

function retakeQuiz() {
    window.location.href = 'quiz.html';
}

// Admin Dashboard Functions
function initializeAdminDashboard() {
    // Verify user is admin
    const userData = sessionStorage.getItem('currentUser');
    if (!userData) {
        window.location.href = 'index.html';
        return;
    }
    
    currentUser = JSON.parse(userData);
    
    if (currentUser.role !== 'admin') {
        alert('Access denied. Admin privileges required.');
        window.location.href = 'index.html';
        return;
    }
    
    // Admin dashboard is primarily static in this mock-up
    // In a real application, this would fetch data from a backend
}

// Logout Function
function logout() {
    sessionStorage.clear();
    currentUser = null;
    currentScore = 0;
    quizAttempts = 0;
    window.location.href = 'index.html';
}

// Utility Functions
function getCurrentUser() {
    const userData = sessionStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
}

function isAuthenticated() {
    return sessionStorage.getItem('currentUser') !== null;
}

function isAdmin() {
    const user = getCurrentUser();
    return user && user.role === 'admin';
}

// Form validation helpers
function validateLoginForm() {
    const name = document.getElementById('name').value.trim();
    const role = document.getElementById('role').value;
    
    if (!name) {
        alert('Please enter your name');
        return false;
    }
    
    if (!role) {
        alert('Please select your role');
        return false;
    }
    
    return true;
}

function validateQuizForm() {
    const totalQuestions = 5;
    
    for (let i = 1; i <= totalQuestions; i++) {
        const questionName = `q${i}`;
        const answered = document.querySelector(`input[name="${questionName}"]:checked`);
        if (!answered) {
            alert(`Please answer question ${i}`);
            return false;
        }
    }
    
    return true;
}

// Quiz answer explanations (for educational purposes)
const answerExplanations = {
    q1: "Verifying user identity is the first critical step to ensure security before any password reset.",
    q2: "Never ask for or collect a user's password. This violates security best practices.",
    q3: "Priority 1 tickets require immediate response, typically within 1 hour.",
    q4: "TeamViewer is specifically designed for remote desktop support and troubleshooting.",
    q5: "Escalation to the appropriate team ensures issues are resolved by specialists within SLA."
};

// Function to show answer explanations (for demo purposes)
function showAnswerExplanation(questionNumber) {
    const explanation = answerExplanations[`q${questionNumber}`];
    if (explanation) {
        alert(`Explanation for Question ${questionNumber}:\n\n${explanation}`);
    }
}

// Add keyboard navigation support
document.addEventListener('keydown', function(event) {
    // Ctrl+Enter to submit forms
    if (event.ctrlKey && event.key === 'Enter') {
        const activeElement = document.activeElement;
        if (activeElement && activeElement.form) {
            activeElement.form.dispatchEvent(new Event('submit'));
        }
    }
    
    // Escape to logout
    if (event.key === 'Escape') {
        const confirmLogout = confirm('Do you want to logout?');
        if (confirmLogout) {
            logout();
        }
    }
});

// Add visual feedback for form interactions
document.addEventListener('DOMContentLoaded', function() {
    // Add focus effects to form elements
    const inputs = document.querySelectorAll('input, select, button');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.style.transform = 'scale(1.02)';
        });
        
        input.addEventListener('blur', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // Add hover effects to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});

// Simulate loading states (for demo purposes)
function simulateLoading(element, duration = 1000) {
    const originalText = element.textContent;
    element.textContent = 'Loading...';
    element.disabled = true;
    
    setTimeout(() => {
        element.textContent = originalText;
        element.disabled = false;
    }, duration);
}

// Export functions for global access
window.handleLogin = handleLogin;
window.startKnowledgeCheck = startKnowledgeCheck;
window.returnToDashboard = returnToDashboard;
window.retakeQuiz = retakeQuiz;
window.logout = logout;
window.showAnswerExplanation = showAnswerExplanation;
