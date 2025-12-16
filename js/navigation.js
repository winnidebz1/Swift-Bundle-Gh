// ========================================
// SwiftBundle Ghana - Navigation System
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
});

function setupNavigation() {
    // Bottom navigation items
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const viewName = item.dataset.view;
            window.SwiftBundle.switchView(viewName);

            // Add bounce animation
            item.classList.add('bounce');
            setTimeout(() => item.classList.remove('bounce'), 500);
        });
    });

    // Back button in buy view
    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            // If in purchase flow, go back a step
            if (window.SwiftBundle.AppState.purchaseStep > 1) {
                goToPreviousStep();
            } else {
                // Otherwise go back to home
                window.SwiftBundle.switchView('home');
            }
        });
    }
}

function goToPreviousStep() {
    const currentStep = window.SwiftBundle.AppState.purchaseStep;
    if (currentStep > 1) {
        window.SwiftBundle.AppState.purchaseStep = currentStep - 1;
        updatePurchaseStep();
    }
}

function updatePurchaseStep() {
    const steps = document.querySelectorAll('.purchase-step');
    const currentStep = window.SwiftBundle.AppState.purchaseStep;

    steps.forEach((step, index) => {
        step.classList.remove('active');
        if (index + 1 === currentStep) {
            step.classList.add('active');
        }
    });

    // Update continue button text
    updateContinueButton();
}

function updateContinueButton() {
    const continueBtn = document.getElementById('continueBtn');
    const currentStep = window.SwiftBundle.AppState.purchaseStep;

    if (!continueBtn) return;

    switch (currentStep) {
        case 1:
            continueBtn.textContent = 'Select Network';
            break;
        case 2:
            continueBtn.textContent = 'Choose Bundle';
            break;
        case 3:
            continueBtn.textContent = 'Enter Number';
            break;
        case 4:
            continueBtn.textContent = 'Confirm Purchase';
            break;
        default:
            continueBtn.textContent = 'Continue';
    }
}

// Handle browser back button
window.addEventListener('popstate', (e) => {
    if (e.state && e.state.view) {
        window.SwiftBundle.switchView(e.state.view);
    }
});

// Push state when switching views
const originalSwitchView = window.SwiftBundle.switchView;
window.SwiftBundle.switchView = function (viewName) {
    originalSwitchView(viewName);
    history.pushState({ view: viewName }, '', `#${viewName}`);
};

// Initialize from URL hash
window.addEventListener('load', () => {
    const hash = window.location.hash.slice(1);
    if (hash && ['home', 'buy', 'wallet', 'history', 'profile'].includes(hash)) {
        window.SwiftBundle.switchView(hash);
    }
});
