// DOM Elements
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const themeToggle = document.getElementById('theme-toggle');
const progressBar = document.getElementById('progress-bar');
const contactForm = document.getElementById('contact-form');
const toast = document.getElementById('toast');

// Theme Management
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 
            (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        this.init();
    }

    init() {
        this.setTheme(this.currentTheme);
        themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-color-scheme', theme);
        document.body.setAttribute('data-theme', theme);
        
        const icon = themeToggle.querySelector('i');
        
        if (theme === 'dark') {
            icon.className = 'fas fa-sun';
            document.documentElement.classList.add('dark');
        } else {
            icon.className = 'fas fa-moon';
            document.documentElement.classList.remove('dark');
        }
        
        this.currentTheme = theme;
        localStorage.setItem('theme', theme);
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }
}

// Navigation Management
class NavigationManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupMobileNavigation();
        this.setupSmoothScrolling();
        this.setupActiveLinks();
    }

    setupMobileNavigation() {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    }

    setupSmoothScrolling() {
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 70; // Account for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Handle CTA buttons
        const ctaButtons = document.querySelectorAll('a[href^="#"]');
        ctaButtons.forEach(button => {
            if (!button.classList.contains('nav-link')) {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetId = button.getAttribute('href').substring(1);
                    const targetElement = document.getElementById(targetId);
                    
                    if (targetElement) {
                        const offsetTop = targetElement.offsetTop - 70;
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });
                    }
                });
            }
        });
    }

    setupActiveLinks() {
        const sections = document.querySelectorAll('section[id]');
        
        const observerCallback = (entries) => {
            entries.forEach(entry => {
                const navLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
                
                if (entry.isIntersecting && navLink) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    navLink.classList.add('active');
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, {
            rootMargin: '-100px 0px -70% 0px'
        });

        sections.forEach(section => observer.observe(section));
    }
}

// Scroll Progress Bar
class ProgressBarManager {
    constructor() {
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => this.updateProgress());
    }

    updateProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        progressBar.style.width = Math.min(scrollPercent, 100) + '%';
    }
}

// Scroll Animations
class ScrollAnimationManager {
    constructor() {
        this.animatedElements = [];
        this.init();
    }

    init() {
        this.setupAnimationElements();
        this.setupIntersectionObserver();
        this.animateProjectCards();
    }

    setupAnimationElements() {
        // Add fade-in animation to various elements
        const fadeElements = document.querySelectorAll('.section-title, .hero-text, .skill-category, .achievement-card, .timeline-item');
        fadeElements.forEach((el, index) => {
            el.classList.add('fade-in');
            el.style.transitionDelay = `${index * 0.1}s`;
        });

        // Add slide animations to specific elements
        const slideLeftElements = document.querySelectorAll('.contact-info');
        slideLeftElements.forEach(el => el.classList.add('slide-in-left'));

        const slideRightElements = document.querySelectorAll('.contact-form-container');
        slideRightElements.forEach(el => el.classList.add('slide-in-right'));
    }

    setupIntersectionObserver() {
        const observerCallback = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        const animateElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
        animateElements.forEach(el => observer.observe(el));
    }

    animateProjectCards() {
        // Ensure project cards are visible first
        const projectCards = document.querySelectorAll('.project-card');
        
        // Make sure cards are visible
        projectCards.forEach(card => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        });
        
        const cardObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('animate');
                    }, index * 200);
                }
            });
        }, {
            threshold: 0.1
        });

        projectCards.forEach(card => cardObserver.observe(card));
    }
}

// Toast Notification System
class ToastManager {
    constructor() {
        this.isVisible = false;
    }

    show(message, type = 'success') {
        if (this.isVisible) {
            this.hide();
            setTimeout(() => this.show(message, type), 300);
            return;
        }

        const toastIcon = toast.querySelector('.toast-icon');
        const toastMessage = toast.querySelector('.toast-message');
        
        // Set message
        toastMessage.textContent = message;
        
        // Reset classes
        toast.className = 'toast';
        
        // Set icon and class based on type
        if (type === 'success') {
            toastIcon.className = 'toast-icon fas fa-check-circle';
            toast.classList.add('success');
        } else if (type === 'error') {
            toastIcon.className = 'toast-icon fas fa-exclamation-circle';
            toast.classList.add('error');
        }
        
        // Show toast
        requestAnimationFrame(() => {
            toast.classList.add('show');
            this.isVisible = true;
        });
        
        // Auto hide after 4 seconds
        setTimeout(() => {
            this.hide();
        }, 4000);
    }
    
    hide() {
        toast.classList.remove('show');
        this.isVisible = false;
    }
}

// Contact Form Management
class ContactFormManager {
    constructor(toastManager) {
        this.toastManager = toastManager;
        this.init();
    }

    init() {
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');
        
        // Basic validation
        if (!name || !email || !message) {
            this.toastManager.show('Please fill in all fields', 'error');
            return;
        }

        if (!this.isValidEmail(email)) {
            this.toastManager.show('Please enter a valid email address', 'error');
            return;
        }

        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        try {
            // Simulate email sending
            await this.simulateEmailSend({
                from_name: name,
                from_email: email,
                message: message,
                to_email: 'pratyushtiwary2404@gmail.com'
            });

            this.toastManager.show('Message sent successfully! I\'ll get back to you soon.', 'success');
            contactForm.reset();
        } catch (error) {
            console.error('Error sending email:', error);
            this.toastManager.show('Failed to send message. Please try again.', 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    async simulateEmailSend(templateParams) {
        // Simulate API call delay
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate success (90% success rate for demo)
                const success = Math.random() > 0.1;
                if (success) {
                    resolve();
                } else {
                    reject(new Error('Network error'));
                }
            }, 1500);
        });
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

// Utility Functions
class Utils {
    static debounce(func, wait) {
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

    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }
}

// Global variables for managers
let themeManager, navigationManager, progressBarManager, scrollAnimationManager, toastManager, contactFormManager;

// Initialize all managers when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Initialize all systems
        themeManager = new ThemeManager();
        navigationManager = new NavigationManager();
        progressBarManager = new ProgressBarManager();
        scrollAnimationManager = new ScrollAnimationManager();
        toastManager = new ToastManager();
        contactFormManager = new ContactFormManager(toastManager);

        // Performance optimized scroll handler
        const optimizedScrollHandler = Utils.throttle(() => {
            if (progressBarManager) {
                progressBarManager.updateProgress();
            }
        }, 16); // ~60fps

        // Add optimized scroll listener
        window.addEventListener('scroll', optimizedScrollHandler);

        // Add loading animation
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);

        // Ensure project cards are visible
        setTimeout(() => {
            const projectCards = document.querySelectorAll('.project-card');
            projectCards.forEach(card => {
                card.style.display = 'block';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            });
        }, 500);

        // Add keyboard navigation support
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (navMenu) navMenu.classList.remove('active');
                if (navToggle) navToggle.classList.remove('active');
                if (toastManager) toastManager.hide();
            }
        });

        // Add focus management for accessibility
        const focusableElements = document.querySelectorAll(
            'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );

        focusableElements.forEach(element => {
            element.addEventListener('focus', (e) => {
                e.target.style.outline = '2px solid var(--accent-color)';
                e.target.style.outlineOffset = '2px';
            });

            element.addEventListener('blur', (e) => {
                e.target.style.outline = '';
                e.target.style.outlineOffset = '';
            });
        });

        // Add smooth hover effects for interactive elements
        const interactiveElements = document.querySelectorAll('.btn, .skill-chip, .nav-link, .social-links a');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px)';
            });
            
            element.addEventListener('mouseleave', function() {
                this.style.transform = '';
            });
        });

        // Add ripple effect to buttons
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.classList.add('ripple');
                
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });

        // Add CSS for ripple effect
        const style = document.createElement('style');
        style.textContent = `
            .btn {
                position: relative;
                overflow: hidden;
            }
            
            .ripple {
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            }
            
            @keyframes ripple {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);

        console.log('Portfolio website initialized successfully!');
        
        // Test toast notification to verify it's working
        setTimeout(() => {
            if (toastManager) {
                toastManager.show('Welcome to Pratyush\'s Portfolio!', 'success');
            }
        }, 2000);

    } catch (error) {
        console.error('Error initializing portfolio:', error);
    }
});

// Error handling
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ThemeManager,
        NavigationManager,
        ProgressBarManager,
        ScrollAnimationManager,
        ToastManager,
        ContactFormManager,
        Utils
    };
}