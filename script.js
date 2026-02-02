// Initialize Lucide icons
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    initNavigation();
    initTypingEffect();
    initGSAPAnimations();
    initParticleCanvas();
    initContactForm();
    initHoverEffects();
    initScrollReveal(); // Always init scroll reveal as fallback

    // Add loaded class after a short delay as fallback
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 2000);
});

// Scroll reveal - ONLY runs as fallback when GSAP is NOT available
function initScrollReveal() {
    // Skip if GSAP is available - GSAP handles its own animations
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        return;
    }

    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    if (animatedElements.length === 0) return;

    // Check for reduced motion preference - if so, don't animate
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        return; // Elements stay visible (default state)
    }

    // Add will-animate class to set up initial hidden state
    animatedElements.forEach(el => {
        el.classList.add('will-animate');
    });

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Small delay for staggered effect
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, 50);
                observer.unobserve(entry.target); // Stop observing once visible
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));
}

// Navigation functionality
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    const links = navLinks ? navLinks.querySelectorAll('a') : [];

    // Navbar scroll effect
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const currentScroll = window.pageYOffset;

                if (navbar) {
                    if (currentScroll > 50) {
                        navbar.classList.add('scrolled');
                    } else {
                        navbar.classList.remove('scrolled');
                    }
                }

                ticking = false;
            });
            ticking = true;
        }
    });

    // Mobile menu toggle
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close mobile menu on link click
        links.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Sidebar menu functionality
    const sidebarMenuBtn = document.getElementById('sidebarMenuBtn');
    const sidebarMenu = document.getElementById('sidebarMenu');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const sidebarCloseBtn = document.getElementById('sidebarCloseBtn');

    function openSidebar() {
        if (sidebarMenu && sidebarOverlay) {
            sidebarMenu.classList.add('active');
            sidebarOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            lucide.createIcons();
        }
    }

    function closeSidebar() {
        if (sidebarMenu && sidebarOverlay) {
            sidebarMenu.classList.remove('active');
            sidebarOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    if (sidebarMenuBtn) {
        sidebarMenuBtn.addEventListener('click', openSidebar);
    }

    if (sidebarCloseBtn) {
        sidebarCloseBtn.addEventListener('click', closeSidebar);
    }

    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', closeSidebar);
    }

    // Close sidebar on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeSidebar();
        }
    });

    // Close sidebar when clicking sidebar links
    const sidebarLinks = document.querySelectorAll('.sidebar-links a');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', closeSidebar);
    });

    // Active navigation link highlighting
    updateActiveNavLink();
}

// Active navigation link highlighting
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    // Only run on pages with multiple sections
    const isIndexPage = window.location.pathname.endsWith('index.html') ||
                        window.location.pathname === '/' ||
                        window.location.pathname.endsWith('/');

    if (!isIndexPage || sections.length < 2) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                let current = '';

                sections.forEach(section => {
                    const sectionTop = section.offsetTop;
                    if (window.pageYOffset >= sectionTop - 200) {
                        current = section.getAttribute('id');
                    }
                });

                navLinks.forEach(link => {
                    const href = link.getAttribute('href');
                    if (href.startsWith('#') || href.startsWith('index.html#')) {
                        link.classList.remove('active');
                        if (href === `#${current}` || href.includes(`#${current}`)) {
                            link.classList.add('active');
                        }
                    }
                });

                ticking = false;
            });
            ticking = true;
        }
    });
}

// Enhanced typing effect
function initTypingEffect() {
    const typingElement = document.getElementById('typingText');
    if (!typingElement) return;

    const titles = [
        'Robotics Engineer',
        'Physical AI Researcher',
        'MS Robotics @ Northeastern',
        'Computer Vision Engineer'
    ];

    let titleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let currentText = '';

    function type() {
        const currentTitle = titles[titleIndex];

        if (isDeleting) {
            currentText = currentTitle.substring(0, charIndex - 1);
            charIndex--;
        } else {
            currentText = currentTitle.substring(0, charIndex + 1);
            charIndex++;
        }

        typingElement.textContent = currentText;

        let typeSpeed = isDeleting ? 30 : 80;

        if (!isDeleting && charIndex === currentTitle.length) {
            typeSpeed = 2500;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            titleIndex = (titleIndex + 1) % titles.length;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    }

    setTimeout(type, 1500);
}

// GSAP Animations
function initGSAPAnimations() {
    // Check if GSAP is available
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        // Fallback to basic animations
        initBasicScrollAnimations();
        return;
    }

    // Register ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
        // Show all elements immediately
        gsap.set('.animate-on-scroll', { opacity: 1, y: 0 });
        gsap.set('.hero-content > *', { opacity: 1, y: 0 });
        return;
    }

    // Hero section animations
    const heroTimeline = gsap.timeline({ delay: 0.3 });

    heroTimeline
        .to('.profile-container', {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out'
        })
        .to('.hero-name', {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.out'
        }, '-=0.3')
        .to('.hero-title', {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: 'power2.out'
        }, '-=0.2')
        .to('.hero-tagline', {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: 'power2.out'
        }, '-=0.2')
        .to('.hero-cta', {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: 'power2.out'
        }, '-=0.2')
        .to('.social-links', {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: 'power2.out'
        }, '-=0.2');

    // Helper function to check if element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom > 0;
    }

    // Scroll-triggered animations for sections
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    animatedElements.forEach((element, index) => {
        // If already in viewport, show immediately with a quick fade
        if (isInViewport(element)) {
            gsap.fromTo(element,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.4, delay: index * 0.05, ease: 'power2.out' }
            );
        } else {
            // Set initial hidden state for elements below the fold
            gsap.set(element, { opacity: 0, y: 30 });

            // Animate to visible when scrolled into view
            gsap.to(element, {
                scrollTrigger: {
                    trigger: element,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                },
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: 'power2.out'
            });
        }
    });

    // Section title animations
    const sectionTitles = document.querySelectorAll('.section-title');
    sectionTitles.forEach(title => {
        // If already in viewport, show immediately
        if (isInViewport(title)) {
            gsap.fromTo(title,
                { opacity: 0, x: -20 },
                { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' }
            );
        } else {
            gsap.set(title, { opacity: 0, x: -30 });

            gsap.to(title, {
                scrollTrigger: {
                    trigger: title,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                },
                opacity: 1,
                x: 0,
                duration: 0.5,
                ease: 'power2.out'
            });
        }
    });

    // Staggered card animations
    const cardContainers = [
        '.skills-grid',
        '.projects-grid',
        '.education-grid',
        '.honors-grid',
        '.publications-list'
    ];

    cardContainers.forEach(container => {
        const containerEl = document.querySelector(container);
        if (containerEl) {
            const cards = Array.from(containerEl.children);

            // If container is already in viewport, animate immediately
            if (isInViewport(containerEl)) {
                gsap.fromTo(cards,
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: 'power2.out' }
                );
            } else {
                // Set initial state for containers below the fold
                gsap.set(cards, { opacity: 0, y: 30 });

                gsap.to(cards, {
                    scrollTrigger: {
                        trigger: containerEl,
                        start: 'top 80%',
                        toggleActions: 'play none none none'
                    },
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    stagger: 0.1,
                    ease: 'power2.out'
                });
            }
        }
    });

    // Timeline items animation
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        // If already in viewport, animate immediately
        if (isInViewport(item)) {
            gsap.fromTo(item,
                { opacity: 0, x: -20 },
                { opacity: 1, x: 0, duration: 0.4, delay: index * 0.05, ease: 'power2.out' }
            );
        } else {
            gsap.set(item, { opacity: 0, x: -30 });

            gsap.to(item, {
                scrollTrigger: {
                    trigger: item,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                },
                opacity: 1,
                x: 0,
                duration: 0.5,
                delay: index * 0.1,
                ease: 'power2.out'
            });
        }
    });

    // Parallax effect for hero background
    const heroContent = document.querySelector('.hero-content');
    const geometricPattern = document.querySelector('.geometric-pattern');

    if (heroContent) {
        gsap.to(heroContent, {
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 1
            },
            y: 100,
            opacity: 0.3,
            ease: 'none'
        });
    }

    if (geometricPattern) {
        gsap.to(geometricPattern, {
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 1
            },
            y: 50,
            ease: 'none'
        });
    }
}

// Fallback basic scroll animations (if GSAP not loaded)
function initBasicScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));

    // Show hero content immediately
    const heroElements = document.querySelectorAll('.hero-content > *');
    heroElements.forEach((el, index) => {
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 300 + (index * 100));
    });
}

// Tech Circuit Board Canvas Animation
function initParticleCanvas() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let nodes = [];
    let connections = [];
    let dataPackets = [];
    let animationId;
    let mouseX = 0;
    let mouseY = 0;

    // Tech colors
    const colors = {
        node: 'rgba(14, 165, 233, 0.8)',        // Cyan
        nodeGlow: 'rgba(14, 165, 233, 0.3)',
        nodeBright: 'rgba(56, 189, 248, 1)',    // Light cyan
        line: 'rgba(14, 165, 233, 0.15)',
        lineActive: 'rgba(14, 165, 233, 0.4)',
        packet: 'rgba(34, 211, 238, 0.9)',      // Bright cyan
        packetGlow: 'rgba(34, 211, 238, 0.4)'
    };

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initNodes();
    }

    // Track mouse position
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Circuit node class
    class Node {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.baseX = x;
            this.baseY = y;
            this.size = Math.random() * 3 + 2;
            this.pulsePhase = Math.random() * Math.PI * 2;
            this.pulseSpeed = 0.02 + Math.random() * 0.02;
            this.isActive = Math.random() > 0.7;
            this.connections = [];
        }

        update() {
            this.pulsePhase += this.pulseSpeed;

            // Mouse interaction - nodes move slightly away from cursor
            const dx = this.x - mouseX;
            const dy = this.y - mouseY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 120) {
                const force = (120 - distance) / 120;
                this.x = this.baseX + (dx / distance) * force * 15;
                this.y = this.baseY + (dy / distance) * force * 15;
            } else {
                this.x += (this.baseX - this.x) * 0.05;
                this.y += (this.baseY - this.y) * 0.05;
            }
        }

        draw() {
            const pulse = Math.sin(this.pulsePhase) * 0.5 + 0.5;
            const size = this.size + pulse * 1.5;

            // Glow effect
            if (this.isActive) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, size + 4, 0, Math.PI * 2);
                ctx.fillStyle = colors.nodeGlow;
                ctx.fill();
            }

            // Main node
            ctx.beginPath();
            ctx.arc(this.x, this.y, size, 0, Math.PI * 2);
            ctx.fillStyle = this.isActive ? colors.nodeBright : colors.node;
            ctx.fill();

            // Inner highlight
            ctx.beginPath();
            ctx.arc(this.x - size * 0.3, this.y - size * 0.3, size * 0.3, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.fill();
        }
    }

    // Data packet that travels along connections
    class DataPacket {
        constructor(startNode, endNode) {
            this.startNode = startNode;
            this.endNode = endNode;
            this.progress = 0;
            this.speed = 0.008 + Math.random() * 0.012;
            this.size = 2 + Math.random() * 2;
        }

        update() {
            this.progress += this.speed;
            return this.progress < 1;
        }

        draw() {
            const x = this.startNode.x + (this.endNode.x - this.startNode.x) * this.progress;
            const y = this.startNode.y + (this.endNode.y - this.startNode.y) * this.progress;

            // Glow
            ctx.beginPath();
            ctx.arc(x, y, this.size + 3, 0, Math.PI * 2);
            ctx.fillStyle = colors.packetGlow;
            ctx.fill();

            // Packet
            ctx.beginPath();
            ctx.arc(x, y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = colors.packet;
            ctx.fill();
        }
    }

    function initNodes() {
        nodes = [];
        connections = [];

        // Create grid of nodes with some randomness
        const spacing = 80;
        const jitter = 25;

        for (let x = spacing / 2; x < canvas.width; x += spacing) {
            for (let y = spacing / 2; y < canvas.height; y += spacing) {
                // Skip some nodes randomly for organic feel
                if (Math.random() > 0.3) {
                    const nodeX = x + (Math.random() - 0.5) * jitter * 2;
                    const nodeY = y + (Math.random() - 0.5) * jitter * 2;
                    nodes.push(new Node(nodeX, nodeY));
                }
            }
        }

        // Create connections between nearby nodes
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].baseX - nodes[j].baseX;
                const dy = nodes[i].baseY - nodes[j].baseY;
                const distance = Math.sqrt(dx * dx + dy * dy);

                // Connect nodes within range, but limit connections per node
                if (distance < 120 && nodes[i].connections.length < 4 && nodes[j].connections.length < 4) {
                    connections.push({ from: nodes[i], to: nodes[j], active: Math.random() > 0.6 });
                    nodes[i].connections.push(nodes[j]);
                    nodes[j].connections.push(nodes[i]);
                }
            }
        }
    }

    function drawConnections() {
        connections.forEach(conn => {
            const dx = conn.from.x - mouseX;
            const dy = conn.from.y - mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const isNearMouse = dist < 150;

            ctx.beginPath();
            ctx.moveTo(conn.from.x, conn.from.y);
            ctx.lineTo(conn.to.x, conn.to.y);
            ctx.strokeStyle = (conn.active || isNearMouse) ? colors.lineActive : colors.line;
            ctx.lineWidth = isNearMouse ? 1.5 : 1;
            ctx.stroke();
        });
    }

    function spawnDataPacket() {
        if (connections.length > 0 && dataPackets.length < 15) {
            const conn = connections[Math.floor(Math.random() * connections.length)];
            if (conn.active || Math.random() > 0.8) {
                const reverse = Math.random() > 0.5;
                dataPackets.push(new DataPacket(
                    reverse ? conn.to : conn.from,
                    reverse ? conn.from : conn.to
                ));
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw connections first (behind nodes)
        drawConnections();

        // Update and draw nodes
        nodes.forEach(node => {
            node.update();
            node.draw();
        });

        // Update and draw data packets
        dataPackets = dataPackets.filter(packet => {
            const alive = packet.update();
            if (alive) packet.draw();
            return alive;
        });

        // Randomly spawn new data packets
        if (Math.random() < 0.03) {
            spawnDataPacket();
        }

        animationId = requestAnimationFrame(animate);
    }

    resize();
    window.addEventListener('resize', resize);
    animate();

    // Pause animation when not visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (!animationId) animate();
            } else {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
        });
    });

    observer.observe(canvas);
}

// Hover effects
function initHoverEffects() {
    // Button hover effects - subtle
    const buttons = document.querySelectorAll('.btn-primary');
    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.05}px, ${y * 0.05}px) translateY(-1px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });

    // Card tilt effect - subtle
    const cards = document.querySelectorAll('.skill-card, .project-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 40;
            const rotateY = (centerX - x) / 40;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
}

// Contact form handling
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        const submitBtn = form.querySelector('.btn-submit');
        const originalText = submitBtn.innerHTML;

        // Add loading state
        submitBtn.innerHTML = '<span>Sending...</span>';
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';

        // Simulate sending (Formspree handles actual submission)
        setTimeout(() => {
            submitBtn.innerHTML = '<span>Message Sent!</span> <i data-lucide="check"></i>';
            submitBtn.style.background = '#059669';
            lucide.createIcons();

            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
                submitBtn.style.background = '';
                lucide.createIcons();
            }, 3000);
        }, 1500);
    });

    // Input focus animations
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', () => {
            if (input.value.trim() === '') {
                input.parentElement.classList.remove('focused');
            }
        });
    });
}

// Certificate Modal Functions
function openCertificateModal(pdfPath, title) {
    const modal = document.getElementById('certificateModal');
    const frame = document.getElementById('certificateFrame');
    const modalTitle = document.getElementById('modalTitle');

    if (modal && frame && modalTitle) {
        modalTitle.textContent = title;
        frame.src = pdfPath;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        lucide.createIcons();
    }
}

function closeCertificateModal() {
    const modal = document.getElementById('certificateModal');
    const frame = document.getElementById('certificateFrame');

    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        if (frame) {
            frame.src = '';
        }
    }
}

// Image Modal Functions
function openImageModal(imagePath, title) {
    const modal = document.getElementById('imageModal');
    const img = document.getElementById('modalImage');
    const modalTitle = document.getElementById('imageModalTitle');

    if (modal && img && modalTitle) {
        modalTitle.textContent = title;
        img.src = imagePath;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        lucide.createIcons();
    }
}

function closeImageModal() {
    const modal = document.getElementById('imageModal');
    const img = document.getElementById('modalImage');

    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        if (img) {
            img.src = '';
        }
    }
}

// Video Modal Functions
function openVideoModal(videoId, title) {
    const modal = document.getElementById('videoModal');
    const thumbnail = document.getElementById('videoThumbnail');
    const youtubeLink = document.getElementById('youtubeLink');
    const modalTitle = document.getElementById('videoModalTitle');

    if (modal && thumbnail && youtubeLink && modalTitle) {
        modalTitle.textContent = title;
        thumbnail.src = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        youtubeLink.href = `https://www.youtube.com/watch?v=${videoId}`;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        lucide.createIcons();
    }
}

function closeVideoModal() {
    const modal = document.getElementById('videoModal');

    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// NDA Modal Functions
function openNDAModal() {
    const modal = document.getElementById('ndaModal');

    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        lucide.createIcons();
    }
}

function closeNDAModal() {
    const modal = document.getElementById('ndaModal');

    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Close modals with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeCertificateModal();
        closeImageModal();
        closeVideoModal();
        closeNDAModal();
    }
});
