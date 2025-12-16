// ========================================
// SwiftBundle Ghana - Purchase Flow
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    setupPurchaseFlow();
});

function setupPurchaseFlow() {
    const continueBtn = document.getElementById('continueBtn');

    if (continueBtn) {
        continueBtn.addEventListener('click', handleContinue);
    }

    // Phone input formatting
    const phoneInput = document.getElementById('phoneInput');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            e.target.value = window.SwiftBundle.formatPhoneNumber(e.target.value);
        });

        // Load saved phone number
        if (window.SwiftBundle.AppState.phoneNumber) {
            phoneInput.value = window.SwiftBundle.formatPhoneNumber(window.SwiftBundle.AppState.phoneNumber);
        }
    }

    // Save number button
    const saveNumberBtn = document.getElementById('saveNumberBtn');
    if (saveNumberBtn) {
        saveNumberBtn.addEventListener('click', () => {
            const phone = phoneInput.value.replace(/\D/g, '');
            if (window.SwiftBundle.validatePhoneNumber('0' + phone.slice(1))) {
                window.SwiftBundle.AppState.phoneNumber = phone;
                window.SwiftBundle.saveAppData();
                window.SwiftBundle.showToast('Phone number saved!', 'success');
            } else {
                window.SwiftBundle.showToast('Invalid phone number', 'error');
            }
        });
    }
}

function handleContinue() {
    const currentStep = window.SwiftBundle.AppState.purchaseStep;

    switch (currentStep) {
        case 1:
            // Network selection
            if (!window.SwiftBundle.AppState.selectedNetwork) {
                window.SwiftBundle.showToast('Please select a network', 'error');
                return;
            }
            window.SwiftBundle.AppState.purchaseStep = 2;
            renderBundleSelection();
            break;

        case 2:
            // Bundle selection
            if (!window.SwiftBundle.AppState.selectedBundle) {
                window.SwiftBundle.showToast('Please select a bundle', 'error');
                return;
            }
            window.SwiftBundle.AppState.purchaseStep = 3;
            break;

        case 3:
            // Phone number
            const phoneInput = document.getElementById('phoneInput');
            const phone = phoneInput.value.replace(/\D/g, '');

            if (!window.SwiftBundle.validatePhoneNumber(phone)) {
                window.SwiftBundle.showToast('Please enter a valid phone number', 'error');
                phoneInput.classList.add('shake');
                setTimeout(() => phoneInput.classList.remove('shake'), 500);
                return;
            }

            window.SwiftBundle.AppState.phoneNumber = phone;
            window.SwiftBundle.AppState.purchaseStep = 4;
            renderPurchaseSummary();
            break;

        case 4:
            // Confirm purchase
            processPurchase();
            return;
    }

    updatePurchaseStepDisplay();
}

function renderPurchaseFlow() {
    // Reset to step 1
    window.SwiftBundle.AppState.purchaseStep = 1;

    // Render network selection
    renderNetworkSelection();
    updatePurchaseStepDisplay();
}

function renderNetworkSelection() {
    const container = document.getElementById('networkSelection');
    const networks = window.SwiftBundle.AppState.networks;

    let html = '<div class="network-grid">';

    Object.keys(networks).forEach(key => {
        const network = networks[key];
        const isSelected = window.SwiftBundle.AppState.selectedNetwork === key;

        html += `
            <div class="network-card ${key} ${isSelected ? 'selected' : ''}" data-network="${key}">
                <div class="network-badge">Instant Delivery</div>
                <div class="network-logo">
                    <span style="font-weight: 700;">${key === 'mtn' ? 'MTN' : key === 'telecel' ? 'Telecel' : 'AirtelTigo'}</span>
                </div>
                <div class="network-info">
                    <h3 class="network-name">${network.name}</h3>
                    <p class="network-desc">${network.bundles.length} bundles available</p>
                </div>
                <div class="network-arrow">→</div>
            </div>
        `;
    });

    html += '</div>';
    container.innerHTML = html;

    // Add event listeners
    container.querySelectorAll('.network-card').forEach(card => {
        card.addEventListener('click', () => {
            const network = card.dataset.network;
            window.SwiftBundle.AppState.selectedNetwork = network;

            // Update UI
            container.querySelectorAll('.network-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');

            // Auto-advance after selection
            setTimeout(() => {
                window.SwiftBundle.AppState.purchaseStep = 2;
                renderBundleSelection();
                updatePurchaseStepDisplay();
            }, 300);
        });
    });
}

function renderBundleSelection() {
    const container = document.getElementById('bundleSelection');
    const networkKey = window.SwiftBundle.AppState.selectedNetwork;
    const network = window.SwiftBundle.AppState.networks[networkKey];

    if (!network) return;

    let html = '';

    network.bundles.forEach(bundle => {
        const isSelected = window.SwiftBundle.AppState.selectedBundle?.id === bundle.id;

        html += `
            <div class="bundle-card ${isSelected ? 'selected' : ''}" data-bundle-id="${bundle.id}">
                ${bundle.popular ? '<div class="bundle-badge">Popular</div>' : ''}
                <div class="bundle-header">
                    <div class="bundle-size">${bundle.size}</div>
                    <div class="bundle-price">GH₵ ${bundle.price.toFixed(2)}</div>
                </div>
                <div class="bundle-validity">Valid for ${bundle.validity}</div>
            </div>
        `;
    });

    container.innerHTML = html;

    // Add event listeners
    container.querySelectorAll('.bundle-card').forEach(card => {
        card.addEventListener('click', () => {
            const bundleId = card.dataset.bundleId;
            const bundle = network.bundles.find(b => b.id === bundleId);

            window.SwiftBundle.AppState.selectedBundle = bundle;

            // Update UI
            container.querySelectorAll('.bundle-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');

            // Auto-advance after selection
            setTimeout(() => {
                window.SwiftBundle.AppState.purchaseStep = 3;
                updatePurchaseStepDisplay();
            }, 300);
        });
    });
}

function renderPurchaseSummary() {
    const container = document.getElementById('purchaseSummary');
    const network = window.SwiftBundle.AppState.networks[window.SwiftBundle.AppState.selectedNetwork];
    const bundle = window.SwiftBundle.AppState.selectedBundle;
    const phone = window.SwiftBundle.formatPhoneNumber(window.SwiftBundle.AppState.phoneNumber);

    container.innerHTML = `
        <div class="summary-row">
            <span class="summary-label">Network</span>
            <span class="summary-value">${network.name}</span>
        </div>
        <div class="summary-row">
            <span class="summary-label">Bundle</span>
            <span class="summary-value">${bundle.size}</span>
        </div>
        <div class="summary-row">
            <span class="summary-label">Validity</span>
            <span class="summary-value">${bundle.validity}</span>
        </div>
        <div class="summary-row">
            <span class="summary-label">Phone Number</span>
            <span class="summary-value">${phone}</span>
        </div>
        <div class="summary-row">
            <span class="summary-label">Total Amount</span>
            <span class="summary-value">GH₵ ${bundle.price.toFixed(2)}</span>
        </div>
    `;
}

function processPurchase() {
    const bundle = window.SwiftBundle.AppState.selectedBundle;
    const network = window.SwiftBundle.AppState.networks[window.SwiftBundle.AppState.selectedNetwork];

    // Check wallet balance
    if (window.SwiftBundle.AppState.walletBalance < bundle.price) {
        window.SwiftBundle.showToast('Insufficient wallet balance', 'error');

        // Offer to fund wallet
        setTimeout(() => {
            if (confirm('Would you like to fund your wallet?')) {
                window.SwiftBundle.switchView('wallet');
                setTimeout(() => {
                    document.getElementById('fundWalletBtn').click();
                }, 500);
            }
        }, 500);
        return;
    }

    // Show loading
    const continueBtn = document.getElementById('continueBtn');
    continueBtn.textContent = 'Processing...';
    continueBtn.disabled = true;
    continueBtn.classList.add('loading');

    // Simulate purchase processing
    setTimeout(() => {
        // Deduct from wallet
        window.SwiftBundle.AppState.walletBalance -= bundle.price;
        window.SwiftBundle.updateWalletDisplay();

        // Add transaction
        const phone = window.SwiftBundle.formatPhoneNumber(window.SwiftBundle.AppState.phoneNumber);
        window.SwiftBundle.addTransaction(
            'purchase',
            `${bundle.size} Data - ${phone}`,
            network.name,
            bundle.price
        );

        // Reset button
        continueBtn.textContent = 'Confirm Purchase';
        continueBtn.disabled = false;
        continueBtn.classList.remove('loading');

        // Show success
        window.SwiftBundle.showSuccessModal(
            `${bundle.size} data bundle has been sent to ${phone}. You should receive it within seconds!`
        );
    }, 2000);
}

function updatePurchaseStepDisplay() {
    const steps = document.querySelectorAll('.purchase-step');
    const currentStep = window.SwiftBundle.AppState.purchaseStep;

    steps.forEach((step, index) => {
        step.classList.remove('active');
        if (index + 1 === currentStep) {
            step.classList.add('active');
        }
    });

    // Update continue button
    const continueBtn = document.getElementById('continueBtn');
    if (!continueBtn) return;

    switch (currentStep) {
        case 1:
            continueBtn.textContent = 'Continue';
            continueBtn.style.display = 'none'; // Hide until network selected
            break;
        case 2:
            continueBtn.textContent = 'Continue';
            continueBtn.style.display = 'none'; // Hide until bundle selected
            break;
        case 3:
            continueBtn.textContent = 'Continue';
            continueBtn.style.display = 'block';
            break;
        case 4:
            continueBtn.textContent = 'Confirm Purchase';
            continueBtn.style.display = 'block';
            break;
    }
}

// Export
window.renderPurchaseFlow = renderPurchaseFlow;
