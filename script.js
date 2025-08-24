// Dark mode toggle logic
const toggleButton = document.getElementById('darkModeToggle');

toggleButton.addEventListener('click', () => {
    // Toggle dark mode class on body
    const isDarkMode = document.body.classList.toggle('dark-mode');

    if (isDarkMode) {
        // Save preference and update icon
        localStorage.setItem('darkMode', 'enabled');
        toggleButton.classList.remove('fa-moon');
        toggleButton.classList.add('fa-sun');
    } else {
        localStorage.setItem('darkMode', 'disabled');
        toggleButton.classList.remove('fa-sun');
        toggleButton.classList.add('fa-moon');
    }
});

// On load, set dark mode if previously enabled
if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark-mode');
    toggleButton.classList.remove('fa-moon');
    toggleButton.classList.add('fa-sun');
}

// Remove focus from nav links after click (for accessibility)
document.querySelectorAll('.nav-item a').forEach(link => {
    link.addEventListener('click', () => {
        link.blur();
    });
});

// Header and social strip show/hide on scroll and hover
document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('header');
    const socialStrip = document.querySelector('.social-strip');
    let lastScrollY = window.scrollY;
    let isHovered = false;
    let isSocialHovered = false;
    let scrollThreshold = 150;
    let mouseLeaveTimeout;
    let lastShownTime = 0; 

    // Helper to update header styles based on state
    function updateHeaderStyles(isHidden, isMobile) {
        if (isHidden) {
            if (isMobile) {
                header.style.transform = 'translateX(-50%) translateY(-110%)';
                header.style.opacity = '0';
                header.style.pointerEvents = 'none';
            } else {
                header.style.transform = 'translateX(-50%) translateY(80%)';
                header.style.opacity = '0.3';
                header.style.pointerEvents = 'auto';
            }
            header.classList.add('header-hidden');
        } else {
            header.style.transform = 'translateX(-50%) translateY(0)';
            header.style.opacity = '1';
            header.style.pointerEvents = 'auto';
            header.classList.remove('header-hidden');
            lastShownTime = Date.now(); 
        }
    }

    if (header) {
        // Show header on mouse enter
        header.addEventListener('mouseenter', () => {
            isHovered = true;
            lastShownTime = Date.now(); 
            updateHeaderStyles(false, window.innerWidth <= 768);
        });

        // Hide header after delay on mouse leave
        header.addEventListener('mouseleave', () => {
            clearTimeout(mouseLeaveTimeout);
            mouseLeaveTimeout = setTimeout(() => {
                isHovered = false;
                const isMobile = window.innerWidth <= 768;
                if (window.scrollY > lastScrollY && window.scrollY > 0) {
                    if (isMobile || (!isMobile && Date.now() - lastShownTime >= 1000)) {
                        updateHeaderStyles(true, isMobile);
                    }
                }
            }, 1000);
        });

        // Hide header and social strip after nav click (for mobile/desktop)
        document.querySelectorAll('.nav-item a').forEach(link => {
            link.addEventListener('click', () => {
                setTimeout(() => {
                    const isMobile = window.innerWidth <= 768;
                    updateHeaderStyles(true, isMobile);
                    if (socialStrip && !isMobile) {
                        socialStrip.style.transform = 'translateY(-50%) translateX(-70%)';
                        socialStrip.style.opacity = '0';
                        socialStrip.style.pointerEvents = 'auto';
                        socialStrip.classList.add('header-hidden');
                    }
                }, 1000);
            });
        });
    }

    if (socialStrip) {
        // Track hover state for social strip
        socialStrip.addEventListener('mouseenter', () => {
            isSocialHovered = true;
        });

        socialStrip.addEventListener('mouseleave', () => {
            isSocialHovered = false;
            const isMobile = window.innerWidth <= 768;
            if (window.scrollY > lastScrollY && window.scrollY > 0 && !isMobile && Date.now() - lastShownTime >= 2000) {
                socialStrip.style.transform = 'translateY(-50%) translateX(-70%)';
                socialStrip.style.opacity = '0';
                socialStrip.style.pointerEvents = 'auto';
                socialStrip.classList.add('header-hidden');
            }
        });
    }

    // Debounce helper for scroll events
    function debounce(func, wait) {
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

    // Scroll event: hide/show header and social strip based on scroll direction
    window.addEventListener('scroll', debounce(() => {
        const isMobile = window.innerWidth <= 768;
        const currentScrollY = window.scrollY;
        const timeSinceLastShown = Date.now() - lastShownTime;

        if (timeSinceLastShown < 200) {
            return;
        }

        if (isHovered && !isMobile) {
            lastScrollY = currentScrollY;
            return;
        }

        const shouldHideSocial = !isSocialHovered || isMobile;
        const hasScrolledEnough = Math.abs(currentScrollY - lastScrollY) > 10;

        if (!hasScrolledEnough) {
            return;
        }

        if (currentScrollY > lastScrollY && currentScrollY > scrollThreshold) {
            if (isMobile || (!isMobile && timeSinceLastShown >= 1000)) {
                updateHeaderStyles(true, isMobile);
                if (socialStrip && shouldHideSocial) {
                    socialStrip.style.transform = 'translateY(-50%) translateX(-70%)';
                    socialStrip.style.opacity = '0';
                    socialStrip.style.pointerEvents = 'auto';
                    socialStrip.classList.add('header-hidden');
                }
            }
        } else if (currentScrollY < lastScrollY || currentScrollY <= scrollThreshold) {
            updateHeaderStyles(false, isMobile);
            if (socialStrip) {
                socialStrip.style.transform = 'translateY(-50%) translateX(0)';
                socialStrip.style.opacity = '1';
                socialStrip.style.pointerEvents = 'auto';
                socialStrip.classList.remove('header-hidden');
            }
        }
        lastScrollY = currentScrollY;
    }, 100)); 
});

// Dynamic typing effect for hero section
let phrases = ['Web Development', 'AI & ML', 'Open Source', 'Cybersecurity', 'Design', 'Problem Solving'];
let currentPhrase = 0;
let currentIndex = 0;
let dynamicText = document.getElementById('dynamicText');

// Types out the current phrase letter by letter
function typeText() {
    if (currentIndex < phrases[currentPhrase].length) {
        dynamicText.textContent += phrases[currentPhrase].charAt(currentIndex);
        currentIndex++;
        setTimeout(typeText, 150);
    } else {
        setTimeout(() => {
            deleteText();
        }, 150);
    }
}

// Deletes the current phrase letter by letter
function deleteText() {
    if (currentIndex > 0) {
        dynamicText.textContent = phrases[currentPhrase].substring(0, currentIndex - 1);
        currentIndex--;
        setTimeout(deleteText, 150);
    } else {
        currentPhrase = (currentPhrase + 1) % phrases.length;
        setTimeout(typeText, 150);
    }
}

// Start typing effect on window load
window.onload = () => {
    typeText();
};

// Stars animation for dark mode background
class StarsAnimation {
    constructor() {
        this.starsContainer = null;
        this.stars = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.init();
    }

    init() {
        this.createStarsContainer();
        this.generateStars();
        this.bindEvents();
    }

    // Create container for stars
    createStarsContainer() {
        const pg1 = document.querySelector('.pg1');
        if (pg1) {
            this.starsContainer = document.createElement('div');
            this.starsContainer.className = 'stars-container';
            pg1.appendChild(this.starsContainer);
        }
    }

    // Generate stars with random positions and sizes
    generateStars() {
        const starCount = window.innerWidth < 768 ? 50 : 100;
        
        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            
            const sizes = ['small', 'medium', 'large'];
            const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
            star.classList.add(randomSize);
            
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            
            star.style.animationDelay = Math.random() * 3 + 's';
            
            this.starsContainer.appendChild(star);
            this.stars.push({
                element: star,
                baseX: parseFloat(star.style.left),
                baseY: parseFloat(star.style.top),
                moveX: 0,
                moveY: 0
            });
        }
    }

    // Bind mousemove and resize events for interactive stars
    bindEvents() {
        document.addEventListener('mousemove', (e) => {
            this.mouseX = (e.clientX / window.innerWidth) * 100;
            this.mouseY = (e.clientY / window.innerHeight) * 100;
            this.updateStarsPosition();
        });

        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    // Update star positions based on mouse movement
    updateStarsPosition() {
        this.stars.forEach((star, index) => {
            const distance = Math.sqrt(
                Math.pow(star.baseX - this.mouseX, 2) + 
                Math.pow(star.baseY - this.mouseY, 2)
            );
            
            const maxDistance = 20;
            const influence = Math.max(0, 1 - distance / maxDistance);
            
            const moveIntensity = influence * 2;
            star.moveX = (this.mouseX - star.baseX) * moveIntensity * 0.1;
            star.moveY = (this.mouseY - star.baseY) * moveIntensity * 0.1;
            
            star.element.style.transform = `translate(${star.moveX}px, ${star.moveY}px)`;
        });
    }

    // Regenerate stars on window resize
    handleResize() {
        if (this.starsContainer) {
            this.starsContainer.innerHTML = '';
            this.stars = [];
            this.generateStars();
        }
    }

    // Remove stars animation and cleanup
    destroy() {
        if (this.starsContainer) {
            this.starsContainer.remove();
            this.starsContainer = null;
            this.stars = [];
        }
    }
}

// Hero animation for light mode background
class HeroAnimation {
    constructor() {
        this.heroContainer = null;
        this.shapes = [];
        this.particles = [];
        this.particleInterval = null;
        this.maxParticles = 60; 
        this.init();
    }

    init() {
        this.createHeroContainer();
        this.generateShapes();
        this.generateParticles();
        this.startAnimation();
    }

    // Create container for hero animation
    createHeroContainer() {
        const pg1 = document.querySelector('.pg1');
        const containers = pg1.querySelectorAll('.hero-animation');
        containers.forEach((c, i) => { if (i > 0) c.remove(); });
        let container = pg1.querySelector('.hero-animation');
        if (!container) {
            container = document.createElement('div');
            container.className = 'hero-animation';
            pg1.appendChild(container);
        }
        this.heroContainer = container;
        this.heroContainer.innerHTML = '';
    }

    // Generate geometric shapes for animation
    generateShapes() {
        if (!this.heroContainer) return;
        const shapeCount = window.innerWidth < 768 ? 15 : 25;
        const shapeTypes = ['circle', 'square', 'triangle', 'hexagon'];
        for (let i = 0; i < shapeCount; i++) {
            const shape = document.createElement('div');
            shape.className = 'geometric-shape';
            shape.classList.add(`shape-${shapeTypes[Math.floor(Math.random() * shapeTypes.length)]}`);
            shape.style.left = Math.random() * 100 + '%';
            shape.style.top = Math.random() * 100 + '%';
            shape.style.animationDelay = Math.random() * 8 + 's';
            this.heroContainer.appendChild(shape);
            this.shapes.push(shape);
        }
    }

    // Generate floating particles for animation
    generateParticles() {
        if (!this.heroContainer) return;
        const particleCount = window.innerWidth < 768 ? 20 : 40;
        for (let i = 0; i < particleCount; i++) {
            this.addNewParticle();
        }
    }

    // Start interval for continuous particle animation
    startAnimation() {
        if (this.particleInterval) clearInterval(this.particleInterval);
        this.particleInterval = setInterval(() => {
            if (!document.body.classList.contains('dark-mode') && this.heroContainer) {
                if (this.heroContainer.querySelectorAll('.particle').length < this.maxParticles) {
                    this.addNewParticle();
                }
            }
        }, 800);
    }

    // Add a new particle to the animation
    addNewParticle() {
        if (!this.heroContainer) return;
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = '100vh';
        particle.style.animationDuration = (6 + Math.random() * 4) + 's';
        this.heroContainer.appendChild(particle);
        setTimeout(() => {
            if (particle.parentNode) particle.parentNode.removeChild(particle);
        }, 10000);
    }

    // Remove hero animation and cleanup
    destroy() {
        if (this.particleInterval) {
            clearInterval(this.particleInterval);
            this.particleInterval = null;
        }
        if (this.heroContainer) {
            this.heroContainer.innerHTML = '';
            this.heroContainer = null;
        }
        this.shapes = [];
        this.particles = [];
    }

    // Regenerate animation on window resize
    handleResize() {
        this.destroy();
        this.init();
    }
}

// Animation switching logic based on dark mode
document.addEventListener('DOMContentLoaded', () => {
    let starsAnimation = null;
    let heroAnimation = null;
    
    // Initialize correct animation based on mode
    const initAnimations = () => {
        if (document.body.classList.contains('dark-mode')) {
            if (!starsAnimation) {
                starsAnimation = new StarsAnimation();
            }
            if (heroAnimation) {
                heroAnimation.destroy();
                heroAnimation = null;
            }
        } else {
            if (!heroAnimation) {
                heroAnimation = new HeroAnimation();
            }
            if (starsAnimation) {
                starsAnimation.destroy();
                starsAnimation = null;
            }
        }
    };
    
    initAnimations();
    
    // Observe body class changes to switch animations
    const observer = new MutationObserver(() => {
        initAnimations();
    });
    
    observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['class']
    });
    
    // Handle window resize for responsive animation
    window.addEventListener('resize', () => {
        if (starsAnimation) {
            starsAnimation.handleResize();
        }
        if (heroAnimation) {
            heroAnimation.handleResize();
        }
    });
});

// Project section tab switching logic
function showProjects(type) {
    const groups = {
        webapps: document.querySelector('.project-group.webapps'),
        devtools: document.querySelector('.project-group.devtools'),
        desktopapps: document.querySelector('.project-group.desktopapps'),
        utility: document.querySelector('.project-group.utility')
    };
    const btns = {
        webapps: document.getElementById('webAppsBtn'),
        devtools: document.getElementById('devToolsBtn'),
        desktopapps: document.getElementById('desktopAppsBtn'),
        utility: document.getElementById('utilityBtn')
    };
    Object.keys(groups).forEach(key => {
        if (key === type) {
            // Show selected group and activate button
            groups[key].style.display = '';
            groups[key].classList.remove('aos-animate');
            void groups[key].offsetWidth;
            groups[key].classList.add('aos-animate');
            btns[key].classList.add('active');
        } else {
            // Hide other groups and deactivate buttons
            groups[key].style.display = 'none';
            btns[key].classList.remove('active');
        }
    });
    // Refresh AOS animations if available
    if (window.AOS && typeof window.AOS.refresh === 'function') {
        window.AOS.refresh();
    }
}