document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menuToggle');
    const closeSidebar = document.getElementById('closeSidebar');
    const sidebar = document.getElementById('sidebar');
    const menuOverlay = document.getElementById('menuOverlay');
    const navLinks = document.querySelectorAll('.nav-links a');

    // Toggle Sidebar for Mobile
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.add('active');
            menuOverlay.classList.add('active');
        });
    }

    if (closeSidebar) {
        closeSidebar.addEventListener('click', () => {
            sidebar.classList.remove('active');
            menuOverlay.classList.remove('active');
        });
    }

    // Close sidebar when clicking overlay
    if (menuOverlay) {
        menuOverlay.addEventListener('click', () => {
            sidebar.classList.remove('active');
            menuOverlay.classList.remove('active');
        });
    }

    // Close sidebar when clicking a link (on mobile)
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Smooth scroll to section
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    const offset = 80; // Adjust for header height
                    const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                    const offsetPosition = elementPosition - offset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }

            if (window.innerWidth <= 768) {
                sidebar.classList.remove('active');
                menuOverlay.classList.remove('active');
            }

            // Remove active class from all links
            document.querySelectorAll('.nav-links li').forEach(li => li.classList.remove('active'));
            // Add active class to parent li
            link.parentElement.classList.add('active');
        });
    });

    // ===========================
    // Enhanced Scroll Reveal with Intersection Observer
    // ===========================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add stagger delay for multiple elements
                setTimeout(() => {
                    entry.target.classList.add('animated');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('animate-on-scroll');
        observer.observe(section);
    });

    // Observe timeline items individually with stagger
    document.querySelectorAll('.timeline-item').forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-30px)';
        item.style.transition = 'all 0.6s ease-out';
        item.style.transitionDelay = `${index * 0.2}s`;

        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                    timelineObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        timelineObserver.observe(item);
    });

    // ===========================
    // Counter Animation for Stats
    // ===========================
    const animateCounter = (element, target, suffix = '', duration = 2000) => {
        let current = 0;
        const increment = target / (duration / 16); // 60fps
        const isPercentage = suffix === '%';
        const isTime = suffix === 'h';

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                if (isPercentage || isTime) {
                    element.textContent = Math.floor(current) + suffix;
                } else {
                    element.textContent = Math.floor(current) + suffix;
                }
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target + suffix;
            }
        };

        updateCounter();
    };

    // Counter observer
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumber = entry.target.querySelector('.stat-number, .value');
                if (statNumber && !statNumber.dataset.counted) {
                    statNumber.dataset.counted = 'true';
                    const text = statNumber.textContent;

                    // Parse the number and suffix
                    if (text.includes('%')) {
                        const num = parseInt(text);
                        animateCounter(statNumber, num, '%');
                    } else if (text.includes('h')) {
                        const num = parseInt(text);
                        animateCounter(statNumber, num, 'h');
                    } else if (text.includes('+')) {
                        const num = parseInt(text);
                        animateCounter(statNumber, num, '+');
                    } else if (text.includes('k')) {
                        const num = parseFloat(text);
                        animateCounter(statNumber, num, 'k');
                    }
                }
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    // Observe stat cards
    document.querySelectorAll('.stat-card, .stat-box').forEach(card => {
        counterObserver.observe(card);
    });

    // ===========================
    // Q&A Accordion Animation
    // ===========================
    document.querySelectorAll('.qa-card').forEach(card => {
        const header = card.querySelector('.qa-header');
        const body = card.querySelector('.qa-body');

        // Initially hide all except active
        if (!card.classList.contains('active')) {
            body.style.maxHeight = '0';
            body.style.opacity = '0';
        } else {
            body.style.maxHeight = body.scrollHeight + 'px';
            body.style.opacity = '1';
        }

        header.addEventListener('click', () => {
            const isActive = card.classList.contains('active');

            // Close all other cards
            document.querySelectorAll('.qa-card').forEach(otherCard => {
                if (otherCard !== card) {
                    otherCard.classList.remove('active');
                    const otherBody = otherCard.querySelector('.qa-body');
                    otherBody.style.maxHeight = '0';
                    otherBody.style.opacity = '0';
                }
            });

            // Toggle current card
            card.classList.toggle('active');
            if (!isActive) {
                body.style.maxHeight = body.scrollHeight + 'px';
                body.style.opacity = '1';
            } else {
                body.style.maxHeight = '0';
                body.style.opacity = '0';
            }
        });
    });

    // ===========================
    // Hero Button Stagger Animation
    // ===========================
    const heroButtons = document.querySelectorAll('.hero-button-group .btn');
    heroButtons.forEach((btn, index) => {
        btn.style.opacity = '0';
        btn.style.transform = 'translateY(20px)';
        setTimeout(() => {
            btn.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            btn.style.opacity = '1';
            btn.style.transform = 'translateY(0)';
        }, 300 + (index * 150));
    });

    // ===========================
    // Smooth Page Load Animation
    // ===========================
    window.addEventListener('load', () => {
        document.body.style.opacity = '0';
        setTimeout(() => {
            document.body.style.transition = 'opacity 0.5s ease-in';
            document.body.style.opacity = '1';
        }, 100);
    });

    // ===========================
    // Header Transparency on Scroll
    // ===========================
    const header = document.querySelector('.site-header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // ===========================
    // Back to Top Button
    // ===========================
    const backToTopButton = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});
