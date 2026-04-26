// ==========================================
// Fox Defender — Landing Page Scripts
// ==========================================

document.addEventListener('DOMContentLoaded', () => {

    // --- Particle System ---
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouseX = 0, mouseY = 0;
    let animationFrame;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = (Math.random() - 0.5) * 0.3;
            this.opacity = Math.random() * 0.4 + 0.1;
            this.color = Math.random() > 0.7 ? '#FF6B35' : '#ffffff';
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Subtle mouse interaction
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) {
                this.x -= dx * 0.002;
                this.y -= dy * 0.002;
            }

            if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                this.reset();
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.opacity;
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }

    function initParticles() {
        const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
        particles = [];
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(255, 107, 53, ${0.04 * (1 - dist / 120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        drawConnections();
        animationFrame = requestAnimationFrame(animateParticles);
    }

    resizeCanvas();
    initParticles();
    animateParticles();

    window.addEventListener('resize', () => {
        resizeCanvas();
        initParticles();
    });

    // --- Cursor Glow ---
    const cursorGlow = document.getElementById('cursorGlow');
    let glowX = 0, glowY = 0, currentGlowX = 0, currentGlowY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        glowX = e.clientX;
        glowY = e.clientY;
    });

    function animateGlow() {
        currentGlowX += (glowX - currentGlowX) * 0.1;
        currentGlowY += (glowY - currentGlowY) * 0.1;
        cursorGlow.style.left = currentGlowX + 'px';
        cursorGlow.style.top = currentGlowY + 'px';
        requestAnimationFrame(animateGlow);
    }
    animateGlow();

    // Hide cursor glow on mobile
    if ('ontouchstart' in window) {
        cursorGlow.style.display = 'none';
    }

    // --- Navbar Scroll ---
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        lastScroll = scrollY;
    });

    // --- Mobile Menu ---
    const burger = document.getElementById('burger');
    const navLinks = document.getElementById('navLinks');

    burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        navLinks.classList.toggle('open');
        document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            burger.classList.remove('active');
            navLinks.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // --- Scroll Animations ---
    const animatedElements = document.querySelectorAll('[data-animate]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, parseInt(delay));
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => observer.observe(el));

    // --- Tilt Effect on Cards ---
    const cards = document.querySelectorAll('.about-card, .feature-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // --- Smooth Scroll for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // --- Typed effect for hero subtitle (subtle) ---
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        heroTitle.style.opacity = '0';
        heroTitle.style.transform = 'translateY(20px)';
        setTimeout(() => {
            heroTitle.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            heroTitle.style.opacity = '1';
            heroTitle.style.transform = 'translateY(0)';
        }, 200);
    }

    // --- Support Counter (localStorage) ---
    const supportCountEl = document.getElementById('supportCount');
    let supportCount = parseInt(localStorage.getItem('foxDefenderSupport') || '0', 10);

    function animateCount(el, target) {
        const start = parseInt(el.textContent, 10) || 0;
        if (start === target) { el.textContent = target; return; }
        const duration = 600;
        const startTime = performance.now();
        function step(now) {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(start + (target - start) * eased);
            if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    if (supportCountEl) {
        supportCountEl.textContent = supportCount;
        supportCountEl.setAttribute('data-count', supportCount);
    }

    // --- Support button ---
    const supportBtn = document.querySelector('.support-btn');
    if (supportBtn) {
        supportBtn.addEventListener('click', function(e) {
            // Ripple effect
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255,255,255,0.3);
                width: 100px;
                height: 100px;
                transform: translate(-50%, -50%) scale(0);
                animation: rippleEffect 0.6s ease-out;
                pointer-events: none;
            `;
            const rect = this.getBoundingClientRect();
            ripple.style.left = (e.clientX - rect.left) + 'px';
            ripple.style.top = (e.clientY - rect.top) + 'px';
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);

            // Increment support counter
            supportCount++;
            localStorage.setItem('foxDefenderSupport', supportCount);
            if (supportCountEl) {
                animateCount(supportCountEl, supportCount);
                supportCountEl.setAttribute('data-count', supportCount);
            }
        });

        // Add ripple keyframes
        const style = document.createElement('style');
        style.textContent = `
            @keyframes rippleEffect {
                to { transform: translate(-50%, -50%) scale(4); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    // --- Hero support button also links to DonationAlerts ---
    const heroSupportBtn = document.querySelector('.hero-actions .btn-primary');
    if (heroSupportBtn) {
        heroSupportBtn.setAttribute('href', 'https://www.donationalerts.com/r/medbecher');
        heroSupportBtn.setAttribute('target', '_blank');
        heroSupportBtn.setAttribute('rel', 'noopener noreferrer');
    }

    // --- Parallax on hero background image ---
    const heroImage = document.querySelector('.hero-image');
    if (heroImage) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            if (scrollY < window.innerHeight) {
                heroImage.style.transform = `scale(${1 + scrollY * 0.0003}) translateY(${scrollY * 0.15}px)`;
            }
        });
    }

});
