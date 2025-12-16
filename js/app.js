// ========================================
// SwiftBundle Ghana - Main Application Logic
// ========================================

// App State
const AppState = {
    currentView: 'home',
    walletBalance: 0,
    selectedNetwork: null,
    selectedBundle: null,
    phoneNumber: '',
    transactions: [],
    purchaseStep: 1,

    // Network data
    networks: {
        mtn: {
            name: 'MTN Ghana',
            color: '#FFCC00',
            bundles: [
                { id: 'mtn-1gb', size: '1GB', price: 5.00, validity: '24 hours', popular: false },
                { id: 'mtn-2gb', size: '2GB', price: 9.00, validity: '3 days', popular: true },
                { id: 'mtn-5gb', size: '5GB', price: 20.00, validity: '7 days', popular: false },
                { id: 'mtn-10gb', size: '10GB', price: 35.00, validity: '30 days', popular: true },
                { id: 'mtn-20gb', size: '20GB', price: 65.00, validity: '30 days', popular: false },
                { id: 'mtn-50gb', size: '50GB', price: 150.00, validity: '30 days', popular: false }
            ]
        },
        telecel: {
            name: 'Telecel Ghana',
            color: '#E74C3C',
            bundles: [
                { id: 'tel-1gb', size: '1GB', price: 4.50, validity: '24 hours', popular: false },
                { id: 'tel-2gb', size: '2GB', price: 8.50, validity: '3 days', popular: true },
                { id: 'tel-5gb', size: '5GB', price: 18.00, validity: '7 days', popular: false },
                { id: 'tel-10gb', size: '10GB', price: 32.00, validity: '30 days', popular: true },
                { id: 'tel-20gb', size: '20GB', price: 60.00, validity: '30 days', popular: false },
                { id: 'tel-50gb', size: '50GB', price: 140.00, validity: '30 days', popular: false }
            ]
        },
        airteltigo: {
            name: 'AirtelTigo',
            color: '#ED1C24',
            bundles: [
                { id: 'at-1gb', size: '1GB', price: 4.80, validity: '24 hours', popular: false },
                { id: 'at-2gb', size: '2GB', price: 8.80, validity: '3 days', popular: true },
                { id: 'at-5gb', size: '5GB', price: 19.00, validity: '7 days', popular: false },
                { id: 'at-10gb', size: '10GB', price: 33.00, validity: '30 days', popular: true },
                { id: 'at-20gb', size: '20GB', price: 62.00, validity: '30 days', popular: false },
                { id: 'at-50gb', size: '50GB', price: 145.00, validity: '30 days', popular: false }
            ]
        }
    }
};

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 SwiftBundle Ghana - Initializing...');

    // Load saved data from localStorage
    loadAppData();

    // Initialize UI
    updateWalletDisplay();
    renderNetworkLogos();
    renderRecentTransactions();

    // Setup event listeners
    setupEventListeners();

    // Add stagger animation to network cards
    document.querySelectorAll('.network-card').forEach((card, index) => {
        card.classList.add('stagger-item');
    });

    console.log('✅ SwiftBundle Ghana - Ready!');
});

// Load data from localStorage
function loadAppData() {
    const savedBalance = localStorage.getItem('swiftbundle_balance');
    const savedTransactions = localStorage.getItem('swiftbundle_transactions');
    const savedPhone = localStorage.getItem('swiftbundle_phone');

    if (savedBalance) {
        AppState.walletBalance = parseFloat(savedBalance);
    }

    if (savedTransactions) {
        AppState.transactions = JSON.parse(savedTransactions);
    }

    if (savedPhone) {
        AppState.phoneNumber = savedPhone;
    }
}

// Save data to localStorage
function saveAppData() {
    localStorage.setItem('swiftbundle_balance', AppState.walletBalance.toString());
    localStorage.setItem('swiftbundle_transactions', JSON.stringify(AppState.transactions));
    if (AppState.phoneNumber) {
        localStorage.setItem('swiftbundle_phone', AppState.phoneNumber);
    }
}

// Update wallet display
function updateWalletDisplay() {
    const balanceElements = document.querySelectorAll('#walletBalance, #balanceAmount');
    balanceElements.forEach(el => {
        el.textContent = `GH₵ ${AppState.walletBalance.toFixed(2)}`;
    });
}

// Render network logos
function renderNetworkLogos() {
    // MTN Logo
    const mtnLogos = document.querySelectorAll('#mtnLogo, #momoMtnLogo, #paymentMtnLogo');
    mtnLogos.forEach(logo => {
        logo.innerHTML = '<img src="assets/images/mtn-logo.png" alt="MTN" style="width: 100%; height: 100%; object-fit: contain;">';
    });

    // Telecel Logo
    const telecelLogos = document.querySelectorAll('#telecelLogo, #momoTelecelLogo, #paymentTelecelLogo');
    telecelLogos.forEach(logo => {
        logo.innerHTML = '<img src="assets/images/telecel-logo.png" alt="Telecel" style="width: 100%; height: 100%; object-fit: contain;">';
    });

    // AirtelTigo Logo
    const airteltigoLogos = document.querySelectorAll('#airteltigoLogo, #momoAirteltigoLogo, #paymentAirteltigoLogo');
    airteltigoLogos.forEach(logo => {
        logo.innerHTML = '<img src="assets/images/airteltigo-logo.png" alt="AirtelTigo" style="width: 100%; height: 100%; object-fit: contain;">';
    });
}

// Render recent transactions
function renderRecentTransactions() {
    const container = document.getElementById('recentTransactions');
    const historyContainer = document.getElementById('historyList');

    if (AppState.transactions.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📊</div>
                <p>No recent transactions</p>
            </div>
        `;
        historyContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📜</div>
                <p>No transaction history yet</p>
            </div>
        `;
        return;
    }

    // Show last 3 transactions on home
    const recentHTML = AppState.transactions.slice(0, 3).map(tx => createTransactionHTML(tx)).join('');
    container.innerHTML = recentHTML;

    // Show all transactions in history
    const historyHTML = AppState.transactions.map(tx => createTransactionHTML(tx)).join('');
    historyContainer.innerHTML = historyHTML;
}

// Create transaction HTML
function createTransactionHTML(tx) {
    return `
        <div class="transaction-item">
            <div class="transaction-icon">${tx.type === 'purchase' ? '📱' : '💰'}</div>
            <div class="transaction-info">
                <div class="transaction-title">${tx.title}</div>
                <div class="transaction-meta">${tx.date} • ${tx.network}</div>
            </div>
            <div class="transaction-amount">
                <div class="transaction-value">GH₵ ${tx.amount.toFixed(2)}</div>
                <div class="transaction-status">${tx.status}</div>
            </div>
        </div>
    `;
}

// Setup event listeners
function setupEventListeners() {
    // Network card clicks (home page)
    document.querySelectorAll('.network-card').forEach(card => {
        card.addEventListener('click', () => {
            const network = card.dataset.network;
            handleNetworkSelection(network);
        });

        // Add ripple effect
        card.addEventListener('click', createRipple);
    });

    // FAB button
    const fabBtn = document.getElementById('fabBtn');
    if (fabBtn) {
        fabBtn.addEventListener('click', () => {
            switchView('buy');
        });
    }

    // Wallet button
    const walletBtn = document.getElementById('walletBtn');
    if (walletBtn) {
        walletBtn.addEventListener('click', () => {
            switchView('wallet');
        });
    }

    // Fund wallet button
    const fundWalletBtn = document.getElementById('fundWalletBtn');
    if (fundWalletBtn) {
        fundWalletBtn.addEventListener('click', openPaymentModal);
    }

    // Payment modal
    setupPaymentModal();

    // Success modal
    setupSuccessModal();
}

// Handle network selection
function handleNetworkSelection(network) {
    AppState.selectedNetwork = network;
    switchView('buy');
    setTimeout(() => {
        renderPurchaseFlow();
    }, 100);
}

// Create ripple effect
function createRipple(e) {
    const button = e.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');

    button.appendChild(ripple);

    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Format phone number
function formatPhoneNumber(value) {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');

    // Limit to 10 digits
    const limited = digits.slice(0, 10);

    // Format as XXX XXX XXXX
    if (limited.length <= 3) {
        return limited;
    } else if (limited.length <= 6) {
        return `${limited.slice(0, 3)} ${limited.slice(3)}`;
    } else {
        return `${limited.slice(0, 3)} ${limited.slice(3, 6)} ${limited.slice(6)}`;
    }
}

// Validate phone number
function validatePhoneNumber(phone) {
    const digits = phone.replace(/\D/g, '');
    return digits.length === 10 && digits.startsWith('0');
}

// Format currency
function formatCurrency(amount) {
    return `GH₵ ${amount.toFixed(2)}`;
}

// Generate transaction ID
function generateTransactionId() {
    return 'TXN' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();
}

// Get current date/time string
function getCurrentDateTime() {
    const now = new Date();
    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return now.toLocaleDateString('en-US', options);
}

// Add transaction to history
function addTransaction(type, title, network, amount) {
    const transaction = {
        id: generateTransactionId(),
        type: type,
        title: title,
        network: network,
        amount: amount,
        status: 'Completed',
        date: getCurrentDateTime()
    };

    AppState.transactions.unshift(transaction);
    saveAppData();
    renderRecentTransactions();
}

// Show toast notification
function showToast(message, type = 'info') {
    // Simple toast implementation
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: calc(var(--bottom-nav-height) + 20px);
        left: 50%;
        transform: translateX(-50%);
        background: var(--black);
        color: var(--white);
        padding: 1rem 1.5rem;
        border-radius: var(--radius-md);
        font-weight: 600;
        z-index: 10000;
        animation: fadeInUp 0.3s ease-out;
        max-width: 90%;
        text-align: center;
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Setup payment modal
function setupPaymentModal() {
    const modal = document.getElementById('paymentModal');
    const closeBtn = document.getElementById('closePaymentModal');
    const overlay = modal.querySelector('.modal-overlay');
    const proceedBtn = document.getElementById('proceedPaymentBtn');
    const fundAmountInput = document.getElementById('fundAmount');

    // Payment options
    const paymentOptions = modal.querySelectorAll('.payment-option');
    let selectedPaymentMethod = null;

    paymentOptions.forEach(option => {
        option.addEventListener('click', () => {
            paymentOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            selectedPaymentMethod = option.dataset.method;
        });
    });

    // Close modal
    const closeModal = () => {
        modal.classList.remove('active');
    };

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);

    // Proceed with payment
    proceedBtn.addEventListener('click', () => {
        const amount = parseFloat(fundAmountInput.value);

        if (!amount || amount <= 0) {
            showToast('Please enter a valid amount', 'error');
            fundAmountInput.classList.add('shake');
            setTimeout(() => fundAmountInput.classList.remove('shake'), 500);
            return;
        }

        if (!selectedPaymentMethod) {
            showToast('Please select a payment method', 'error');
            return;
        }

        // Simulate payment processing
        proceedBtn.textContent = 'Processing...';
        proceedBtn.disabled = true;

        setTimeout(() => {
            // Add funds to wallet
            AppState.walletBalance += amount;
            updateWalletDisplay();

            // Add transaction
            const methodName = selectedPaymentMethod.replace('-', ' ').toUpperCase();
            addTransaction('deposit', `Wallet Funded via ${methodName}`, methodName, amount);

            // Close payment modal
            closeModal();

            // Reset form
            fundAmountInput.value = '';
            paymentOptions.forEach(opt => opt.classList.remove('selected'));
            selectedPaymentMethod = null;
            proceedBtn.textContent = 'Proceed to Payment';
            proceedBtn.disabled = false;

            // Show success
            showToast('Wallet funded successfully!', 'success');
        }, 2000);
    });
}

// Open payment modal
function openPaymentModal() {
    const modal = document.getElementById('paymentModal');
    modal.classList.add('active');
}

// Setup success modal
function setupSuccessModal() {
    const modal = document.getElementById('successModal');
    const closeBtn = document.getElementById('closeSuccessModal');
    const overlay = modal.querySelector('.modal-overlay');

    const closeModal = () => {
        modal.classList.remove('active');
        // Reset purchase flow
        AppState.selectedNetwork = null;
        AppState.selectedBundle = null;
        AppState.purchaseStep = 1;
        switchView('home');
    };

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);
}

// Show success modal
function showSuccessModal(message) {
    const modal = document.getElementById('successModal');
    const messageEl = document.getElementById('successMessage');
    const animationEl = document.getElementById('successAnimation');

    messageEl.textContent = message;

    // Create success checkmark SVG
    animationEl.innerHTML = `
        <svg class="success-checkmark" viewBox="0 0 52 52">
            <circle cx="26" cy="26" r="25" fill="none"/>
            <path fill="none" d="M14 27l7.5 7.5L38 18"/>
        </svg>
    `;

    modal.classList.add('active');

    // Create confetti effect
    createConfetti();
}

// Create confetti effect
function createConfetti() {
    const colors = ['#6C5CE7', '#00D68F', '#FFAA00'];
    const confettiCount = 30;

    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 0.5 + 's';
        confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';

        document.body.appendChild(confetti);

        setTimeout(() => confetti.remove(), 3000);
    }
}

// Switch between views
function switchView(viewName) {
    // Update state
    AppState.currentView = viewName;

    // Update views
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });

    const targetView = document.getElementById(`${viewName}View`);
    if (targetView) {
        targetView.classList.add('active');
    }

    // Update navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.view === viewName) {
            item.classList.add('active');
        }
    });

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Export for use in other modules
window.SwiftBundle = {
    AppState,
    switchView,
    updateWalletDisplay,
    showToast,
    showSuccessModal,
    addTransaction,
    formatCurrency,
    formatPhoneNumber,
    validatePhoneNumber,
    saveAppData
};
