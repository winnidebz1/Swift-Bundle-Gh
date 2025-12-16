// ========================================
// SwiftBundle Ghana - Advanced Animations
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    initializeAnimations();
});

function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements with animation classes
    document.querySelectorAll('.stagger-item').forEach(el => {
        observer.observe(el);
    });

    // Add parallax effect to hero illustration
    setupParallax();

    // Add smooth scroll behavior
    setupSmoothScroll();
}

function setupParallax() {
    const heroIllustration = document.getElementById('heroIllustration');

    if (!heroIllustration) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.3;

        if (heroIllustration.getBoundingClientRect().top > -500) {
            heroIllustration.style.transform = `translateY(${rate}px)`;
        }
    });
}

function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));

            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Animate number counting
function animateNumber(element, start, end, duration) {
    let startTime = null;

    function animation(currentTime) {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);

        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value;

        if (progress < 1) {
            requestAnimationFrame(animation);
        }
    }

    requestAnimationFrame(animation);
}

// Create particle effect
function createParticles(x, y, color) {
    const particleCount = 10;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: ${color};
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            left: ${x}px;
            top: ${y}px;
        `;

        document.body.appendChild(particle);

        const angle = (Math.PI * 2 * i) / particleCount;
        const velocity = 2 + Math.random() * 2;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;

        let px = x;
        let py = y;
        let opacity = 1;

        function animate() {
            px += vx;
            py += vy;
            opacity -= 0.02;

            particle.style.left = px + 'px';
            particle.style.top = py + 'px';
            particle.style.opacity = opacity;

            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                particle.remove();
            }
        }

        animate();
    }
}

// Add tap feedback to buttons
document.addEventListener('click', (e) => {
    const button = e.target.closest('button, .network-card, .bundle-card, .payment-card');

    if (button && !button.disabled) {
        const rect = button.getBoundingClientRect();
        const x = e.clientX;
        const y = e.clientY;

        // Create ripple
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.left = (x - rect.left) + 'px';
        ripple.style.top = (y - rect.top) + 'px';

        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    }
});

// Preload animations
function preloadAnimations() {
    // Force browser to calculate animations
    const dummy = document.createElement('div');
    dummy.style.animation = 'fadeInUp 0.01s';
    document.body.appendChild(dummy);
    setTimeout(() => dummy.remove(), 10);
}

preloadAnimations();

// Export utilities
window.SwiftBundleAnimations = {
    animateNumber,
    createParticles
};
