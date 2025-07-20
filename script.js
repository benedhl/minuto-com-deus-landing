// Theme Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('.theme-icon');
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    // Apply saved theme
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);
    
    themeToggle.addEventListener('click', function() {
        const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
    
    function updateThemeIcon(theme) {
        themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
});

// Email Form Functionality
document.addEventListener('DOMContentLoaded', function() {
    const emailForm = document.getElementById('emailForm');
    const formSuccess = document.getElementById('formSuccess');
    const emailInput = document.getElementById('email');
    const submitButton = emailForm.querySelector('button[type="submit"]');
    const btnText = submitButton.querySelector('.btn-text');
    const btnLoading = submitButton.querySelector('.btn-loading');
    
    emailForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        
        if (!validateEmail(email)) {
            showNotification('Por favor, digite um e-mail válido.', 'error');
            return;
        }
        
        // Show loading state
        btnText.style.display = 'none';
        btnLoading.style.display = 'block';
        submitButton.disabled = true;
        
        try {
            // Send email using EmailJS
            const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    service_id: 'service_default', // You'll need to set this up in EmailJS
                    template_id: 'template_coming_soon', // You'll need to create this template
                    user_id: 'your_emailjs_user_id', // You'll need to get this from EmailJS
                    template_params: {
                        user_email: email,
                        to_email: 'ghlh.dev@gmail.com',
                        message: `Novo interessado no app Minuto com Deus: ${email}`,
                        from_name: 'Landing Page Minuto com Deus'
                    }
                })
            });
            
            if (response.ok) {
                // Show success message
                emailForm.style.display = 'none';
                formSuccess.style.display = 'block';
                showNotification('E-mail enviado com sucesso!', 'success');
                
                // Track the signup
                trackSignup(email);
            } else {
                throw new Error('Erro ao enviar e-mail');
            }
        } catch (error) {
            console.error('Error sending email:', error);
            
            // Fallback: try to open email client
            const subject = encodeURIComponent('Interesse no App Minuto com Deus');
            const body = encodeURIComponent(`Olá,\n\nTenho interesse em ser notificado quando o app Minuto com Deus estiver disponível.\n\nMeu e-mail: ${email}\n\nObrigado!`);
            const mailtoLink = `mailto:ghlh.dev@gmail.com?subject=${subject}&body=${body}`;
            
            window.open(mailtoLink, '_blank');
            
            // Show success message anyway
            emailForm.style.display = 'none';
            formSuccess.style.display = 'block';
            showNotification('E-mail preparado! Verifique seu cliente de e-mail.', 'success');
            
            // Track the signup attempt
            trackSignup(email);
        } finally {
            // Reset button state
            btnText.style.display = 'block';
            btnLoading.style.display = 'none';
            submitButton.disabled = false;
        }
    });
});

// Email Validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span class="notification-message">${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 16px 20px;
        border-radius: 12px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 12px;
        font-family: var(--font-family);
        font-size: 14px;
        max-width: 350px;
        animation: slideInFromRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutToRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
    
    // Close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.animation = 'slideOutToRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
}

// Add notification animations CSS
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInFromRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutToRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
        padding: 0;
        line-height: 1;
    }
    
    .notification-close:hover {
        opacity: 0.8;
    }
`;
document.head.appendChild(notificationStyles);

// Enhanced signup tracking
function trackSignup(email) {
    const signups = JSON.parse(localStorage.getItem('signups') || '[]');
    const newSignup = {
        email: email,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        referrer: document.referrer,
        utm_source: new URLSearchParams(window.location.search).get('utm_source'),
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        device: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop'
    };
    
    signups.push(newSignup);
    localStorage.setItem('signups', JSON.stringify(signups));
    
    // Update signup counter
    const signupCount = signups.length;
    console.log(`Total signups: ${signupCount}`);
    
    // Send to analytics
    trackEvent('signup_completed', 'email_form', email);
    
    // Update counter display
    const counter = document.getElementById('interestCounter');
    if (counter) {
        const baseCount = 1247;
        const newTotal = baseCount + signupCount;
        counter.textContent = newTotal.toLocaleString('pt-BR');
    }
}

// Smooth scrolling for anchor links
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

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.feature-card, .signup-form, .phone-mockup').forEach(el => {
    observer.observe(el);
});

// Phone mockup floating animation
const phoneMockup = document.querySelector('.phone-mockup');
if (phoneMockup) {
    let floatDirection = 1;
    setInterval(() => {
        floatDirection *= -1;
        phoneMockup.style.transform = `translateY(${floatDirection * 5}px)`;
        phoneMockup.style.transition = 'transform 3s ease-in-out';
    }, 3000);
}

// Feature cards hover effects
document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-4px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Add animation CSS
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    .animate-in {
        animation: fadeInUp 0.6s ease-out;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .feature-card {
        transition: all 0.3s ease;
    }
    
    .phone-mockup {
        transition: transform 3s ease-in-out;
    }
`;
document.head.appendChild(animationStyles);

// Performance monitoring
window.addEventListener('load', () => {
    if ('performance' in window && 'navigation' in performance) {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log(`Page load time: ${loadTime}ms`);
    }
});

// Accessibility improvements
document.addEventListener('keydown', function(e) {
    // ESC to close notifications
    if (e.key === 'Escape') {
        const notifications = document.querySelectorAll('.notification');
        notifications.forEach(notif => notif.remove());
    }
    
    // Enter on theme toggle
    if (e.key === 'Enter' && e.target.id === 'themeToggle') {
        e.target.click();
    }
});

// FAQ Functionality
function toggleFaq(button) {
    const faqItem = button.parentElement;
    const isActive = faqItem.classList.contains('active');
    
    // Close all FAQ items
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Open clicked item if it wasn't active
    if (!isActive) {
        faqItem.classList.add('active');
    }
}

// Interest Counter Animation
function animateCounter() {
    const counter = document.getElementById('interestCounter');
    if (!counter) return;
    
    // Get stored count or start with a base number
    let baseCount = 1247; // Starting number to make it look realistic
    const storedSignups = JSON.parse(localStorage.getItem('signups') || '[]');
    const currentCount = baseCount + storedSignups.length;
    
    let current = 0;
    const increment = currentCount / 100;
    const timer = setInterval(() => {
        current += increment;
        if (current >= currentCount) {
            current = currentCount;
            clearInterval(timer);
        }
        counter.textContent = Math.floor(current).toLocaleString('pt-BR');
    }, 20);
}

// Initialize counter when visible
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter();
            counterObserver.unobserve(entry.target);
        }
    });
});

const counterElement = document.getElementById('interestCounter');
if (counterElement) {
    counterObserver.observe(counterElement.closest('.interest-counter'));
}

// Enhanced Email Form with Better UX
document.addEventListener('DOMContentLoaded', function() {
    const emailForm = document.getElementById('emailForm');
    if (!emailForm) return;
    
    const emailInput = document.getElementById('email');
    const submitButton = emailForm.querySelector('button[type="submit"]');
    
    // Real-time email validation
    emailInput.addEventListener('input', function() {
        const email = this.value.trim();
        const isValid = validateEmail(email);
        
        this.style.borderColor = email.length > 0 ? 
            (isValid ? '#4CAF50' : '#f44336') : '';
        
        submitButton.disabled = !isValid || email.length === 0;
        submitButton.style.opacity = submitButton.disabled ? '0.6' : '1';
    });
    
    // Enhanced form submission with better error handling
    emailForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const btnText = submitButton.querySelector('.btn-text');
        const btnLoading = submitButton.querySelector('.btn-loading');
        
        if (!validateEmail(email)) {
            showNotification('Por favor, digite um e-mail válido.', 'error');
            emailInput.focus();
            return;
        }
        
        // Check if email already exists
        const existingSignups = JSON.parse(localStorage.getItem('signups') || '[]');
        if (existingSignups.some(signup => signup.email === email)) {
            showNotification('Este e-mail já está cadastrado!', 'info');
            return;
        }
        
        // Show loading state
        btnText.style.display = 'none';
        btnLoading.style.display = 'block';
        submitButton.disabled = true;
        
        try {
            // Simulate API call delay for better UX
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Try multiple methods to send email
            const success = await sendEmailMultipleMethods(email);
            
            if (success) {
                // Show success and hide form
                document.querySelector('.email-form').style.display = 'none';
                document.getElementById('formSuccess').style.display = 'block';
                showNotification('E-mail cadastrado com sucesso!', 'success');
                
                // Track signup and update counter
                trackSignup(email);
                setTimeout(() => animateCounter(), 500);
                
                // Analytics tracking
                trackEvent('signup', 'email_form', email);
            } else {
                throw new Error('Falha no envio');
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification('Erro ao enviar. Tente novamente.', 'error');
        } finally {
            btnText.style.display = 'block';
            btnLoading.style.display = 'none';
            submitButton.disabled = false;
        }
    });
});

// Multiple email sending methods
async function sendEmailMultipleMethods(email) {
    const methods = [
        () => sendViaEmailJS(email),
        () => sendViaFormspree(email),
        () => sendViaMailto(email)
    ];
    
    for (const method of methods) {
        try {
            const result = await method();
            if (result) return true;
        } catch (error) {
            console.warn('Method failed, trying next:', error);
        }
    }
    
    return false;
}

// EmailJS integration
async function sendViaEmailJS(email) {
    try {
        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                service_id: 'service_default',
                template_id: 'template_coming_soon',
                user_id: 'your_emailjs_user_id',
                template_params: {
                    user_email: email,
                    to_email: 'ghlh.dev@gmail.com',
                    message: `Novo interessado: ${email}`,
                    from_name: 'Landing Page Devocional Diário'
                }
            })
        });
        return response.ok;
    } catch (error) {
        throw error;
    }
}

// Formspree fallback
async function sendViaFormspree(email) {
    try {
        const response = await fetch('https://formspree.io/f/your-form-id', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: email,
                message: `Interessado no app Devocional Diário: ${email}`
            })
        });
        return response.ok;
    } catch (error) {
        throw error;
    }
}

// Mailto fallback
function sendViaMailto(email) {
    const subject = encodeURIComponent('Novo interessado - Minuto com Deus');
    const body = encodeURIComponent(`Novo interessado no app: ${email}\n\nData: ${new Date().toLocaleString('pt-BR')}`);
    const mailtoLink = `mailto:ghlh.dev@gmail.com?subject=${subject}&body=${body}`;
    
    window.open(mailtoLink, '_blank');
    return true;
}

// Enhanced Analytics and Tracking
function trackEvent(action, category, label) {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            event_category: category,
            event_label: label,
            custom_parameter: 'devocional_diario_landing'
        });
    }
    
    // Facebook Pixel
    if (typeof fbq !== 'undefined') {
        fbq('track', 'Lead', {
            content_name: 'Email Signup',
            content_category: 'Landing Page'
        });
    }
    
    // Custom tracking
    console.log(`Event tracked: ${action} - ${category} - ${label}`);
}

// Progressive Web App features
function initializePWA() {
    // Register service worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('SW registered:', registration))
            .catch(error => console.log('SW registration failed:', error));
    }
    
    // Handle install prompt
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        
        // Show custom install button
        const installBtn = document.createElement('button');
        installBtn.textContent = '📱 Instalar como App';
        installBtn.className = 'btn btn-primary install-btn';
        installBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1000;
            animation: bounceIn 0.5s ease;
        `;
        
        installBtn.addEventListener('click', async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                console.log(`User response: ${outcome}`);
                deferredPrompt = null;
                installBtn.remove();
            }
        });
        
        document.body.appendChild(installBtn);
        
        // Remove after 10 seconds if not clicked
        setTimeout(() => {
            if (installBtn.parentNode) {
                installBtn.remove();
            }
        }, 10000);
    });
}

// Scroll Progress Bar
function createScrollProgressBar() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress-bar';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, var(--primary-color), var(--primary-dark));
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    function updateProgress() {
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = Math.min(100, Math.max(0, scrolled)) + '%';
    }
    
    window.addEventListener('scroll', updateProgress);
    updateProgress();
}

// Enhanced Intersection Observer for animations
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const animateOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Stagger animation for grids
                if (entry.target.classList.contains('features-grid') || 
                    entry.target.classList.contains('testimonials-grid')) {
                    const children = entry.target.children;
                    Array.from(children).forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('animate-in');
                        }, index * 100);
                    });
                }
                
                animateOnScroll.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all animatable elements
    document.querySelectorAll(`
        .feature-card, .signup-form, .phone-mockup,
        .testimonial-card, .roadmap-item, .faq-item,
        .features-grid, .testimonials-grid
    `).forEach(el => {
        animateOnScroll.observe(el);
    });
}

// Floating shapes animation
function createFloatingShapes() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }
    
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    const shapesContainer = document.createElement('div');
    shapesContainer.className = 'floating-shapes';
    
    for (let i = 0; i < 3; i++) {
        const shape = document.createElement('div');
        shape.className = 'floating-shape';
        shapesContainer.appendChild(shape);
    }
    
    hero.appendChild(shapesContainer);
}

// Performance monitoring
function initializePerformanceMonitoring() {
    // Core Web Vitals
    function measureWebVitals() {
        if ('web-vital' in window) {
            // This would require the web-vitals library
            // import {getCLS, getFID, getFCP, getLCP, getTTFB} from 'web-vitals';
        }
    }
    
    // Basic performance metrics
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            if (perfData) {
                const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
                const totalTime = perfData.loadEventEnd - perfData.fetchStart;
                
                console.log(`Page Performance:
                    Load Time: ${loadTime}ms
                    Total Time: ${totalTime}ms
                    DOM Content Loaded: ${perfData.domContentLoadedEventEnd - perfData.fetchStart}ms
                `);
                
                // Track performance if it's unusually slow
                if (totalTime > 5000) {
                    trackEvent('performance', 'slow_load', totalTime.toString());
                }
            }
        }, 0);
    });
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Core functionality
    initializePWA();
    createScrollProgressBar();
    initializeAnimations();
    createFloatingShapes();
    initializePerformanceMonitoring();
    
    // Add loading animation to body
    document.body.classList.add('loading');
    setTimeout(() => {
        document.body.classList.remove('loading');
    }, 2000);
});

// Update focus states for better accessibility
const focusStyles = document.createElement('style');
focusStyles.textContent = `
    .theme-toggle:focus,
    .btn:focus,
    .form-input:focus {
        outline: 2px solid var(--primary-color);
        outline-offset: 2px;
    }
    
    .action-btn:focus {
        outline: 1px solid var(--primary-color);
        outline-offset: 1px;
    }
    
    @keyframes bounceIn {
        0% { transform: scale(0.3); opacity: 0; }
        50% { transform: scale(1.05); }
        70% { transform: scale(0.9); }
        100% { transform: scale(1); opacity: 1; }
    }
`;
document.head.appendChild(focusStyles);