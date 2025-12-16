// ========================================
// SwiftBundle Ghana - Wallet Management
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    setupWalletFeatures();
});

function setupWalletFeatures() {
    // Payment method cards
    const paymentCards = document.querySelectorAll('.payment-card');

    paymentCards.forEach(card => {
        card.addEventListener('click', () => {
            // Open fund wallet modal
            document.getElementById('fundWalletBtn').click();
        });
    });
}

// Quick fund amounts
function addQuickFundButtons() {
    const modalBody = document.querySelector('#paymentModal .modal-body');

    if (!modalBody) return;

    const quickAmountsHTML = `
        <div class="quick-amounts" style="margin-bottom: var(--space-xl);">
            <label style="display: block; font-size: 0.875rem; font-weight: 600; color: var(--black); margin-bottom: var(--space-sm);">
                Quick Amounts
            </label>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-sm);">
                <button class="quick-amount-btn" data-amount="10">GH₵ 10</button>
                <button class="quick-amount-btn" data-amount="20">GH₵ 20</button>
                <button class="quick-amount-btn" data-amount="50">GH₵ 50</button>
                <button class="quick-amount-btn" data-amount="100">GH₵ 100</button>
                <button class="quick-amount-btn" data-amount="200">GH₵ 200</button>
                <button class="quick-amount-btn" data-amount="500">GH₵ 500</button>
            </div>
        </div>
    `;

    // Insert before amount input
    const amountContainer = modalBody.querySelector('.amount-input-container');
    if (amountContainer) {
        amountContainer.insertAdjacentHTML('beforebegin', quickAmountsHTML);

        // Add event listeners
        document.querySelectorAll('.quick-amount-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const amount = btn.dataset.amount;
                document.getElementById('fundAmount').value = amount;

                // Visual feedback
                btn.classList.add('bounce');
                setTimeout(() => btn.classList.remove('bounce'), 500);
            });
        });
    }
}

// Add quick amount button styles
function addQuickAmountStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .quick-amount-btn {
            background: var(--white);
            border: 2px solid var(--gray-200);
            border-radius: var(--radius-md);
            padding: var(--space-md);
            font-size: 0.875rem;
            font-weight: 600;
            color: var(--black);
            cursor: pointer;
            transition: all var(--transition-base);
        }
        
        .quick-amount-btn:active {
            transform: scale(0.95);
            border-color: var(--primary);
            background: var(--primary-glow);
        }
        
        .quick-amount-btn:hover {
            border-color: var(--primary);
        }
    `;
    document.head.appendChild(style);
}

// Initialize wallet enhancements
setTimeout(() => {
    addQuickFundButtons();
    addQuickAmountStyles();
}, 100);
