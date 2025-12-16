// ========================================
// SwiftBundle GH - Enhanced Application
// With Wallet, Auth, and Navigation
// ========================================

// App State
const App = {
    wallet: 0,
    selectedNetwork: null,
    selectedBundle: null,
    phoneNumber: '',
    transactions: [],
    currentView: 'home',
    isAuthenticated: false,
    user: null,

    // Network data
    networks: {
        mtn: {
            name: 'MTN Ghana',
            color: '#FFCC00',
            bundles: [
                { id: 'mtn-500mb', size: '500MB', price: 5, validity: '24 hours' },
                { id: 'mtn-1gb', size: '1GB', price: 9, validity: '3 days' },
                { id: 'mtn-2gb', size: '2GB', price: 15, validity: '7 days' },
                { id: 'mtn-3gb', size: '3GB', price: 22, validity: '14 days' },
                { id: 'mtn-5gb', size: '5GB', price: 35, validity: '30 days' },
                { id: 'mtn-10gb', size: '10GB', price: 65, validity: '30 days' }
            ]
        },
        telecel: {
            name: 'Telecel Ghana',
            color: '#E74C3C',
            bundles: [
                { id: 'tel-500mb', size: '500MB', price: 4.50, validity: '24 hours' },
                { id: 'tel-1gb', size: '1GB', price: 8.50, validity: '3 days' },
                { id: 'tel-2gb', size: '2GB', price: 14, validity: '7 days' },
                { id: 'tel-3gb', size: '3GB', price: 20, validity: '14 days' },
                { id: 'tel-5gb', size: '5GB', price: 32, validity: '30 days' },
                { id: 'tel-10gb', size: '10GB', price: 60, validity: '30 days' }
            ]
        },
        airteltigo: {
            name: 'AirtelTigo',
            color: '#ED1C24',
            bundles: [
                { id: 'at-500mb', size: '500MB', price: 4.80, validity: '24 hours' },
                { id: 'at-1gb', size: '1GB', price: 9, validity: '3 days' },
                { id: 'at-2gb', size: '2GB', price: 15, validity: '7 days' },
                { id: 'at-3gb', size: '3GB', price: 21, validity: '14 days' },
                { id: 'at-5gb', size: '5GB', price: 34, validity: '30 days' },
                { id: 'at-10gb', size: '10GB', price: 62, validity: '30 days' }
            ]
        }
    }
};

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 SwiftBundle GH - Initializing...');

    loadAppData();
    updateWalletDisplay();
    setupEventListeners();
    setupNavigation();

    console.log('✅ SwiftBundle GH - Ready!');
});

// Load data from localStorage
function loadAppData() {
    const savedWallet = localStorage.getItem('swiftbundle_wallet');
    const savedTransactions = localStorage.getItem('swiftbundle_transactions');
    const savedUser = localStorage.getItem('swiftbundle_user');

    if (savedWallet) {
        App.wallet = parseFloat(savedWallet);
    }

    if (savedTransactions) {
        App.transactions = JSON.parse(savedTransactions);
    }

    if (savedUser) {
        App.user = JSON.parse(savedUser);
        App.isAuthenticated = true;
    }
}

// Save data to localStorage
function saveAppData() {
    localStorage.setItem('swiftbundle_wallet', App.wallet.toString());
    localStorage.setItem('swiftbundle_transactions', JSON.stringify(App.transactions));
    if (App.user) {
        localStorage.setItem('swiftbundle_user', JSON.stringify(App.user));
    }
}

// Update wallet display
function updateWalletDisplay() {
    const walletElements = document.querySelectorAll('.wallet-amount');
    walletElements.forEach(el => {
        el.textContent = `GH₵ ${App.wallet.toFixed(0)}`;
    });
}

// Setup navigation
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const view = item.dataset.view;
            switchView(view);

            // Update active state
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
        });
    });
}

// Switch views
function switchView(viewName) {
    App.currentView = viewName;

    // Hide all sections
    const mainContent = document.querySelector('.main-content');

    // Clear main content
    mainContent.innerHTML = '';

    // Show appropriate view
    switch (viewName) {
        case 'home':
            showHomeView();
            break;
        case 'buy':
            showBuyView();
            break;
        case 'wallet':
            showWalletView();
            break;
        case 'history':
            showHistoryView();
            break;
        case 'profile':
            showProfileView();
            break;
    }
}

// Show Home View
function showHomeView() {
    const mainContent = document.querySelector('.main-content');
    mainContent.innerHTML = `
        <!-- Hero Section -->
        <section class="hero">
            <div class="hero-content">
                <p class="hero-tagline">⚡ Your Affordable Data Plug</p>
                <h1 class="hero-title">
                    Buy and receive data<br>
                    <span class="gradient-text">instantly!</span>
                </h1>
                <p class="hero-subtitle">Use all your favorite social media apps without worrying about data shortage.</p>
                
                <div class="hero-cta">
                    <button class="btn-primary" id="buyDataBtn">
                        <span>Buy Data Now</span>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </button>
                    <button class="btn-secondary" id="createAccountBtn">
                        Create Account
                    </button>
                </div>
            </div>
            
            <div class="hero-visual">
                <img src="assets/images/hero-image.png" alt="Happy customer using social media" class="hero-image" style="width: 120%; object-fit: cover; object-position: center top; transform: translateY(10%);">
            </div>
        </section>

        <!-- Network Selection -->
        <section class="networks-section">
            <div class="section-header">
                <h2 class="section-title">Choose Your Network</h2>
                <p class="section-subtitle">Select your mobile network to get started</p>
            </div>

            <div class="network-grid">
                <div class="network-card mtn-card" data-network="mtn">
                    <div class="network-badge">Instant Delivery</div>
                    <div class="network-logo-container">
                        <img src="assets/images/mtn-logo.png" alt="MTN Ghana" class="network-logo">
                    </div>
                    <h3 class="network-name">MTN Ghana</h3>
                    <p class="network-desc">Most popular network</p>
                    <div class="network-glow mtn-glow"></div>
                </div>

                <div class="network-card telecel-card" data-network="telecel">
                    <div class="network-badge">Instant Delivery</div>
                    <div class="network-logo-container">
                        <img src="assets/images/telecel-logo.png" alt="Telecel Ghana" class="network-logo">
                    </div>
                    <h3 class="network-name">Telecel Ghana</h3>
                    <p class="network-desc">Reliable & affordable</p>
                    <div class="network-glow telecel-glow"></div>
                </div>

                <div class="network-card airtel-card" data-network="airteltigo">
                    <div class="network-badge">Instant Delivery</div>
                    <div class="network-logo-container">
                        <img src="assets/images/airteltigo-logo.png" alt="AirtelTigo" class="network-logo">
                    </div>
                    <h3 class="network-name">AirtelTigo</h3>
                    <p class="network-desc">Fast & efficient</p>
                    <div class="network-glow airtel-glow"></div>
                </div>
            </div>
        </section>

        <!-- Features -->
        <section class="features-section">
            <div class="feature-card">
                <div class="feature-icon">⚡</div>
                <h3 class="feature-title">Instant Delivery</h3>
                <p class="feature-desc">Get your data in seconds</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">🔒</div>
                <h3 class="feature-title">100% Secure</h3>
                <p class="feature-desc">Safe & encrypted payments</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">💰</div>
                <h3 class="feature-title">Best Prices</h3>
                <p class="feature-desc">Affordable rates guaranteed</p>
            </div>
        </section>
    `;

    // Re-attach event listeners
    setupHomeEventListeners();
}

// Show Buy View
function showBuyView() {
    const mainContent = document.querySelector('.main-content');
    mainContent.innerHTML = `
        <section style="padding: var(--space-2xl) var(--space-lg);">
            <h2 class="section-title">Buy Data</h2>
            <p class="section-subtitle" style="text-align: center; margin-bottom: var(--space-2xl);">Select a network to purchase data</p>
            
            <div class="network-grid">
                ${Object.keys(App.networks).map(key => `
                    <div class="network-card" data-network="${key}">
                        <div class="network-badge">Instant Delivery</div>
                        <div class="network-logo-container">
                            <img src="assets/images/${key}-logo.png" alt="${App.networks[key].name}" class="network-logo">
                        </div>
                        <h3 class="network-name">${App.networks[key].name}</h3>
                        <p class="network-desc">Tap to view bundles</p>
                    </div>
                `).join('')}
            </div>
        </section>
    `;

    // Attach event listeners
    document.querySelectorAll('.network-card').forEach(card => {
        card.addEventListener('click', () => {
            const network = card.dataset.network;
            openPurchaseModal(network);
        });
    });
}

// Show Wallet View
function showWalletView() {
    const mainContent = document.querySelector('.main-content');
    mainContent.innerHTML = `
        <section style="padding: var(--space-2xl) var(--space-lg);">
            <h2 class="section-title">My Wallet</h2>
            
            <div style="background: var(--gradient-purple); border-radius: var(--radius-xl); padding: var(--space-3xl) var(--space-xl); text-align: center; margin-bottom: var(--space-2xl); box-shadow: var(--glow-primary);">
                <p style="color: var(--white); opacity: 0.9; margin-bottom: var(--space-sm);">Available Balance</p>
                <h1 style="font-family: var(--font-display); font-size: 3rem; color: var(--white); margin-bottom: var(--space-lg);">GH₵ ${App.wallet.toFixed(2)}</h1>
                <button class="btn-primary" id="fundWalletBtn" style="width: auto;">
                    <span>Fund Wallet</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M12 5v14m7-7H5" stroke="currentColor" stroke-width="2"/>
                    </svg>
                </button>
            </div>
            
            <h3 style="font-family: var(--font-display); color: var(--white); margin-bottom: var(--space-lg);">Quick Fund Amounts</h3>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-md); margin-bottom: var(--space-2xl);">
                ${[10, 20, 50, 100, 200, 500].map(amount => `
                    <button class="quick-fund-btn" data-amount="${amount}" style="
                        background: rgba(255, 255, 255, 0.05);
                        border: 1px solid rgba(255, 255, 255, 0.2);
                        border-radius: var(--radius-md);
                        padding: var(--space-lg);
                        color: var(--white);
                        font-weight: 600;
                        cursor: pointer;
                        transition: all var(--transition-base);
                    ">GH₵ ${amount}</button>
                `).join('')}
            </div>
        </section>
    `;

    // Attach event listeners
    document.getElementById('fundWalletBtn')?.addEventListener('click', () => {
        const amount = prompt('Enter amount to fund (GH₵):');
        if (amount && !isNaN(amount)) {
            App.wallet += parseFloat(amount);
            saveAppData();
            updateWalletDisplay();
            showWalletView(); // Refresh view
            alert(`Successfully added GH₵${amount} to your wallet!`);
        }
    });

    document.querySelectorAll('.quick-fund-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const amount = parseFloat(btn.dataset.amount);
            App.wallet += amount;
            saveAppData();
            updateWalletDisplay();
            showWalletView(); // Refresh view
            alert(`Successfully added GH₵${amount} to your wallet!`);
        });

        btn.addEventListener('mouseenter', (e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.1)';
            e.target.style.borderColor = 'var(--primary)';
        });

        btn.addEventListener('mouseleave', (e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.05)';
            e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        });
    });
}

// Show History View
function showHistoryView() {
    const mainContent = document.querySelector('.main-content');
    mainContent.innerHTML = `
        <section style="padding: var(--space-2xl) var(--space-lg);">
            <h2 class="section-title">Transaction History</h2>
            
            ${App.transactions.length === 0 ? `
                <div style="text-align: center; padding: var(--space-3xl); color: var(--gray-600);">
                    <div style="font-size: 4rem; margin-bottom: var(--space-md);">📜</div>
                    <p>No transactions yet</p>
                </div>
            ` : `
                <div style="display: flex; flex-direction: column; gap: var(--space-md);">
                    ${App.transactions.map(tx => `
                        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: var(--radius-lg); padding: var(--space-lg);">
                            <div style="display: flex; justify-content: space-between; margin-bottom: var(--space-sm);">
                                <span style="font-weight: 600; color: var(--white);">${tx.network}</span>
                                <span style="color: var(--success); font-weight: 700;">GH₵${tx.amount}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; font-size: 0.875rem; color: var(--gray-300);">
                                <span>${tx.bundle}</span>
                                <span>${tx.date}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `}
        </section>
    `;
}

// Show Profile View
function showProfileView() {
    const mainContent = document.querySelector('.main-content');
    mainContent.innerHTML = `
        <section style="padding: var(--space-2xl) var(--space-lg);">
            <h2 class="section-title">Profile</h2>
            
            ${!App.isAuthenticated ? `
                <div style="text-align: center; padding: var(--space-3xl);">
                    <div style="width: 100px; height: 100px; background: var(--gradient-primary); border-radius: 50%; margin: 0 auto var(--space-xl); display: flex; align-items: center; justify-content: center; font-size: 3rem;">👤</div>
                    <h3 style="color: var(--white); margin-bottom: var(--space-md);">Guest User</h3>
                    <p style="color: var(--gray-300); margin-bottom: var(--space-2xl);">Sign in to access all features</p>
                    <button class="btn-primary" id="loginBtn">Sign In / Register</button>
                </div>
            ` : `
                <div style="text-align: center; padding: var(--space-3xl);">
                    <div style="width: 100px; height: 100px; background: var(--gradient-primary); border-radius: 50%; margin: 0 auto var(--space-xl); display: flex; align-items: center; justify-content: center; font-size: 3rem;">👤</div>
                    <h3 style="color: var(--white); margin-bottom: var(--space-sm);">${App.user.name}</h3>
                    <p style="color: var(--gray-300); margin-bottom: var(--space-2xl);">${App.user.phone}</p>
                    <button class="btn-secondary" id="logoutBtn">Sign Out</button>
                </div>
            `}
        </section>
    `;

    // Attach event listeners
    document.getElementById('loginBtn')?.addEventListener('click', showLoginModal);
    document.getElementById('logoutBtn')?.addEventListener('click', () => {
        App.isAuthenticated = false;
        App.user = null;
        localStorage.removeItem('swiftbundle_user');
        showProfileView();
    });
}

// Show login modal
function showLoginModal() {
    const modal = document.getElementById('purchaseModal');
    const body = document.getElementById('purchaseModalBody');

    body.innerHTML = `
        <div style="padding: var(--space-lg);">
            <h4 style="color: var(--white); margin-bottom: var(--space-lg); font-family: var(--font-display);">Sign In / Register</h4>
            <input type="text" id="loginName" placeholder="Full Name" style="width: 100%; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: var(--radius-md); padding: var(--space-lg); color: var(--white); margin-bottom: var(--space-md);">
            <input type="tel" id="loginPhone" placeholder="Phone Number" style="width: 100%; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: var(--radius-md); padding: var(--space-lg); color: var(--white); margin-bottom: var(--space-lg);">
            <button class="btn-primary" id="submitLoginBtn" style="width: 100%;">Continue</button>
        </div>
    `;

    document.getElementById('submitLoginBtn').addEventListener('click', () => {
        const name = document.getElementById('loginName').value;
        const phone = document.getElementById('loginPhone').value;

        if (name && phone) {
            App.user = { name, phone };
            App.isAuthenticated = true;
            saveAppData();
            closePurchaseModal();
            showProfileView();
        } else {
            alert('Please fill in all fields');
        }
    });

    modal.classList.add('active');
}

// Setup home event listeners
function setupHomeEventListeners() {
    document.querySelectorAll('.network-card').forEach(card => {
        card.addEventListener('click', () => {
            const network = card.dataset.network;
            openPurchaseModal(network);
        });
    });

    document.getElementById('buyDataBtn')?.addEventListener('click', () => {
        switchView('buy');
        document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
        document.querySelector('[data-view="buy"]')?.classList.add('active');
    });

    document.getElementById('createAccountBtn')?.addEventListener('click', showLoginModal);
}

// Setup event listeners
function setupEventListeners() {
    // Wallet button
    document.getElementById('walletBtn')?.addEventListener('click', () => {
        switchView('wallet');
        document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
        document.querySelector('[data-view="wallet"]')?.classList.add('active');
    });

    // FAB button
    document.getElementById('fabBuyBtn')?.addEventListener('click', () => {
        switchView('buy');
        document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
        document.querySelector('[data-view="buy"]')?.classList.add('active');
    });

    // Modal close buttons
    document.getElementById('closePurchaseModal')?.addEventListener('click', closePurchaseModal);
    document.getElementById('closeSuccessModal')?.addEventListener('click', closeSuccessModal);

    // Modal overlays
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', () => {
            closePurchaseModal();
            closeSuccessModal();
        });
    });
}

// Open purchase modal for specific network
function openPurchaseModal(networkKey) {
    App.selectedNetwork = networkKey;
    const network = App.networks[networkKey];
    const modal = document.getElementById('purchaseModal');
    const body = document.getElementById('purchaseModalBody');

    body.innerHTML = `
        <div class="bundle-selection">
            <h4 style="color: var(--white); margin-bottom: var(--space-lg); font-family: var(--font-display);">${network.name} Bundles</h4>
            <div style="display: grid; gap: var(--space-md);">
                ${network.bundles.map(bundle => `
                    <button class="bundle-btn" data-bundle-id="${bundle.id}" style="
                        background: rgba(255, 255, 255, 0.05);
                        border: 1px solid rgba(255, 255, 255, 0.1);
                        border-radius: var(--radius-md);
                        padding: var(--space-lg);
                        color: var(--white);
                        cursor: pointer;
                        transition: all var(--transition-base);
                        text-align: left;
                    ">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <div style="font-size: 1.25rem; font-weight: 700; margin-bottom: var(--space-xs);">${bundle.size}</div>
                                <div style="font-size: 0.875rem; color: var(--gray-300);">Valid for ${bundle.validity}</div>
                            </div>
                            <div style="font-size: 1.5rem; font-weight: 700; color: var(--primary);">GH₵${bundle.price}</div>
                        </div>
                    </button>
                `).join('')}
            </div>
        </div>
    `;

    // Add event listeners to bundle buttons
    body.querySelectorAll('.bundle-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const bundleId = btn.dataset.bundleId;
            const bundle = network.bundles.find(b => b.id === bundleId);
            showPhoneInput(bundle);
        });

        btn.addEventListener('mouseenter', (e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.1)';
            e.target.style.borderColor = 'var(--primary)';
            e.target.style.transform = 'translateX(4px)';
        });

        btn.addEventListener('mouseleave', (e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.05)';
            e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            e.target.style.transform = 'translateX(0)';
        });
    });

    modal.classList.add('active');
}

// Show phone input
function showPhoneInput(bundle) {
    App.selectedBundle = bundle;
    const body = document.getElementById('purchaseModalBody');

    body.innerHTML = `
        <div class="phone-input-section">
            <h4 style="color: var(--white); margin-bottom: var(--space-lg); font-family: var(--font-display);">Enter Phone Number</h4>
            <input 
                type="tel" 
                id="phoneNumberInput" 
                placeholder="0XX XXX XXXX" 
                maxlength="10"
                style="
                    width: 100%;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: var(--radius-md);
                    padding: var(--space-lg);
                    color: var(--white);
                    font-size: 1.125rem;
                    margin-bottom: var(--space-lg);
                "
            >
            <div style="background: rgba(255, 255, 255, 0.05); border-radius: var(--radius-md); padding: var(--space-lg); margin-bottom: var(--space-lg);">
                <div style="display: flex; justify-content: space-between; margin-bottom: var(--space-sm);">
                    <span style="color: var(--gray-300);">Bundle:</span>
                    <span style="color: var(--white); font-weight: 600;">${bundle.size}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: var(--space-sm);">
                    <span style="color: var(--gray-300);">Network:</span>
                    <span style="color: var(--white); font-weight: 600;">${App.networks[App.selectedNetwork].name}</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding-top: var(--space-md); border-top: 1px solid rgba(255, 255, 255, 0.1);">
                    <span style="color: var(--white); font-weight: 700;">Total:</span>
                    <span style="color: var(--primary); font-weight: 700; font-size: 1.25rem;">GH₵${bundle.price}</span>
                </div>
            </div>
            <button id="confirmPurchaseBtn" class="btn-primary" style="width: 100%;">
                <span>Confirm Purchase</span>
            </button>
        </div>
    `;

    // Add event listener to confirm button
    document.getElementById('confirmPurchaseBtn').addEventListener('click', processPurchase);
}

// Process purchase
function processPurchase() {
    const phoneInput = document.getElementById('phoneNumberInput');
    const phone = phoneInput.value.replace(/\s/g, '');

    if (phone.length !== 10 || !phone.startsWith('0')) {
        alert('Please enter a valid Ghana phone number (10 digits starting with 0)');
        return;
    }

    const bundle = App.selectedBundle;

    // Check wallet balance
    if (App.wallet < bundle.price) {
        alert(`Insufficient balance! You need GH₵${bundle.price} but have GH₵${App.wallet.toFixed(2)}`);
        return;
    }

    // Deduct from wallet
    App.wallet -= bundle.price;

    // Add transaction
    const transaction = {
        id: 'TXN' + Date.now(),
        network: App.networks[App.selectedNetwork].name,
        bundle: bundle.size,
        phone: phone,
        amount: bundle.price,
        date: new Date().toLocaleString(),
        status: 'Completed'
    };

    App.transactions.unshift(transaction);

    // Save data
    saveAppData();
    updateWalletDisplay();

    // Close purchase modal
    closePurchaseModal();

    // Show success modal
    showSuccessModal(`${bundle.size} data bundle has been sent to ${phone}!`);
}

// Close purchase modal
function closePurchaseModal() {
    document.getElementById('purchaseModal').classList.remove('active');
}

// Show success modal
function showSuccessModal(message) {
    const modal = document.getElementById('successModal');
    document.getElementById('successMessage').textContent = message;
    modal.classList.add('active');
}

// Close success modal
function closeSuccessModal() {
    document.getElementById('successModal').classList.remove('active');
}

// Export for use in other modules
window.SwiftBundleApp = App;
