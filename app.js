// Portfolio App - Creative Developer Experience
class PortfolioApp {
    constructor() {
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.scrollProgress = 0;
        this.currentSection = 'hero';
        this.isLoaded = false;
        this.audioEnabled = false;
        this.konamiCode = [];
        this.konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
        
        this.init();
    }

    init() {
        this.setTimeBasedTheme();
        this.initPreloader();
        this.initParticleSystem();
        this.initCustomCursor();
        this.initScrollEffects();
        this.initNavigation();
        this.initTypewriter();
        this.initAnimations();
        this.initSkillsSystem();
        this.initProjectsModal();
        this.initContactForm();
        this.initEasterEgg();
        this.initEventListeners();
    }

    setTimeBasedTheme() {
        const hour = new Date().getHours();
        const body = document.body;
        
        body.classList.remove('time-morning', 'time-evening', 'time-night');
        
        if (hour >= 6 && hour < 12) {
            body.classList.add('time-morning');
        } else if (hour >= 12 && hour < 18) {
            body.classList.add('time-evening');
        } else {
            body.classList.add('time-night');
        }
    }

    initPreloader() {
        const preloader = document.querySelector('.preloader');
        const progressBar = document.querySelector('.preloader-progress');
        let progress = 0;

        const updateProgress = () => {
            progress += Math.random() * 15;
            if (progress > 100) progress = 100;
            
            progressBar.style.width = `${progress}%`;
            
            if (progress < 100) {
                setTimeout(updateProgress, 100 + Math.random() * 200);
            } else {
                setTimeout(() => {
                    preloader.classList.add('hidden');
                    this.isLoaded = true;
                    this.startAnimations();
                }, 500);
            }
        };

        updateProgress();
    }

    initParticleSystem() {
        const canvas = document.getElementById('particle-canvas');
        const ctx = canvas.getContext('2d');
        
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Create particles
        for (let i = 0; i < 50; i++) {
            this.particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 3 + 1,
                opacity: Math.random() * 0.5 + 0.2,
                color: `hsl(${Math.random() * 60 + 180}, 70%, 60%)`
            });
        }

        const animateParticles = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            this.particles.forEach((particle, index) => {
                // Move particle
                particle.x += particle.vx;
                particle.y += particle.vy;
                
                // Mouse interaction
                const dx = this.mouse.x - particle.x;
                const dy = this.mouse.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    const force = (100 - distance) / 100;
                    particle.vx += dx * force * 0.001;
                    particle.vy += dy * force * 0.001;
                }
                
                // Boundaries
                if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
                if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
                
                // Draw particle
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = particle.color;
                ctx.globalAlpha = particle.opacity;
                ctx.fill();
                
                // Connect nearby particles
                for (let j = index + 1; j < this.particles.length; j++) {
                    const other = this.particles[j];
                    const dx2 = particle.x - other.x;
                    const dy2 = particle.y - other.y;
                    const distance2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
                    
                    if (distance2 < 100) {
                        ctx.beginPath();
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(other.x, other.y);
                        ctx.strokeStyle = particle.color;
                        ctx.globalAlpha = (100 - distance2) / 100 * 0.2;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            });
            
            ctx.globalAlpha = 1;
            requestAnimationFrame(animateParticles);
        };

        animateParticles();
    }

    initCustomCursor() {
        const cursor = document.querySelector('.custom-cursor');
        
        if (!cursor) return;
        
        const dot = document.querySelector('.cursor-dot');
        const glow = document.querySelector('.cursor-glow');

        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            
            cursor.style.left = `${e.clientX}px`;
            cursor.style.top = `${e.clientY}px`;
        });

        // Hover effects
        const hoverElements = document.querySelectorAll('a, button, .project-card, .skill-sphere, .testimonial-card');
        
        hoverElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursor.classList.add('cursor-hover');
            });
            
            element.addEventListener('mouseleave', () => {
                cursor.classList.remove('cursor-hover');
            });
        });
    }

    initScrollEffects() {
        const progressBar = document.querySelector('.scroll-progress-bar');
        const sections = document.querySelectorAll('section');
        
        const updateScrollProgress = () => {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollTop = window.pageYOffset;
            this.scrollProgress = (scrollTop / scrollHeight) * 100;
            
            if (progressBar) {
                progressBar.style.height = `${this.scrollProgress}%`;
            }
            
            // Update active section
            sections.forEach(section => {
                const rect = section.getBoundingClientRect();
                if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
                    this.currentSection = section.id;
                    this.updateActiveNavLink();
                }
            });
        };

        window.addEventListener('scroll', this.throttle(updateScrollProgress, 10));
    }

    initNavigation() {
        // Navigation links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('data-section');
                if (targetId) {
                    this.scrollToSection(targetId);
                }
            });
        });

        // CTA buttons in hero section
        const ctaButtons = document.querySelectorAll('.cta-button');
        ctaButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Create ripple effect
                this.createRipple(e, button);
                
                // Get target section
                const targetId = button.getAttribute('data-section');
                if (targetId) {
                    // Small delay to show ripple effect
                    setTimeout(() => {
                        this.scrollToSection(targetId);
                    }, 100);
                }
            });
        });

        // Audio toggle
        const audioToggle = document.querySelector('.audio-toggle');
        if (audioToggle) {
            audioToggle.addEventListener('click', () => {
                this.audioEnabled = !this.audioEnabled;
                audioToggle.classList.toggle('muted', !this.audioEnabled);
            });
        }
    }

    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const navHeight = document.querySelector('.nav').offsetHeight;
            const targetPosition = section.offsetTop - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }

    updateActiveNavLink() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === this.currentSection) {
                link.classList.add('active');
            }
        });
    }

    initTypewriter() {
        const texts = [
            'Creative Developer & 3D Artist',
            'WebGL Specialist',
            'Interactive Experience Designer',
            'Digital Innovation Expert'
        ];
        
        const typewriterElement = document.querySelector('.typewriter-text');
        if (!typewriterElement) return;
        
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let isPaused = false;

        const typeWriter = () => {
            if (!this.isLoaded) {
                setTimeout(typeWriter, 100);
                return;
            }

            const currentText = texts[textIndex];
            
            if (!isDeleting) {
                typewriterElement.textContent = currentText.slice(0, charIndex++);
                
                if (charIndex > currentText.length) {
                    isPaused = true;
                    setTimeout(() => {
                        isPaused = false;
                        isDeleting = true;
                    }, 2000);
                }
            } else {
                typewriterElement.textContent = currentText.slice(0, charIndex--);
                
                if (charIndex < 0) {
                    isDeleting = false;
                    textIndex = (textIndex + 1) % texts.length;
                }
            }
            
            if (!isPaused) {
                const speed = isDeleting ? 50 : 100;
                setTimeout(typeWriter, speed);
            }
        };

        typeWriter();
    }

    initAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // Special animations for specific elements
                    if (entry.target.classList.contains('timeline-item')) {
                        this.animateTimeline();
                    }
                    
                    if (entry.target.classList.contains('testimonial-card')) {
                        this.animateTestimonialWaveforms();
                    }
                    
                    if (entry.target.classList.contains('floating-bubbles')) {
                        this.animateFloatingBubbles();
                    }
                }
            });
        }, observerOptions);

        // Observe elements
        const animatedElements = document.querySelectorAll('.bio-card, .timeline-item, .skill-meter, .project-card, .testimonial-card, .floating-bubbles');
        animatedElements.forEach(el => observer.observe(el));
    }

    initSkillsSystem() {
        const skillMeters = document.querySelectorAll('.skill-meter');
        const skillSpheres = document.querySelectorAll('.skill-sphere');
        const orbitCenter = document.querySelector('.selected-category');
        
        // Animate skill bars when in view
        const animateSkillBars = () => {
            skillMeters.forEach((meter, index) => {
                setTimeout(() => {
                    const level = meter.getAttribute('data-level');
                    const progressBar = meter.querySelector('.skill-progress');
                    const percentageElement = meter.querySelector('.skill-percentage');
                    
                    if (progressBar) {
                        progressBar.style.width = `${level}%`;
                    }
                    
                    // Animate percentage counter
                    if (percentageElement) {
                        this.animateCounter(percentageElement, 0, parseInt(level), 1500);
                    }
                }, index * 200);
            });
        };

        // Skill sphere interactions
        skillSpheres.forEach(sphere => {
            sphere.addEventListener('click', () => {
                const category = sphere.closest('.orbit-ring')?.getAttribute('data-category');
                if (orbitCenter && category) {
                    const categoryElement = orbitCenter.querySelector('.selected-category');
                    if (categoryElement) {
                        categoryElement.textContent = category;
                    }
                }
                
                // Highlight related skill meters
                skillMeters.forEach(meter => {
                    meter.classList.remove('highlighted');
                });
                
                const skillName = sphere.getAttribute('data-skill');
                const relatedMeters = document.querySelectorAll(`[data-skill="${skillName}"]`);
                relatedMeters.forEach(meter => meter.classList.add('highlighted'));
            });
        });

        // Start animation when skills section is in view
        const skillsSection = document.getElementById('skills');
        if (skillsSection) {
            const skillsObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(animateSkillBars, 500);
                        skillsObserver.unobserve(entry.target);
                    }
                });
            });
            
            skillsObserver.observe(skillsSection);
        }
    }

    initProjectsModal() {
        const projectCards = document.querySelectorAll('.project-card');
        const projectViewBtns = document.querySelectorAll('.project-view-btn');
        const modal = document.getElementById('projectModal');
        const modalClose = document.querySelector('.modal-close');
        const modalOverlay = document.querySelector('.modal-overlay');
        
        const projects = {
            '1': {
                title: 'Quantum Visualization',
                description: 'Interactive 3D data visualization exploring quantum computing principles through immersive WebGL experiences. This project combines complex quantum mechanics concepts with intuitive visual representations, making abstract quantum phenomena accessible through stunning visualizations.',
                technologies: ['Three.js', 'WebGL', 'D3.js', 'GLSL'],
                liveLink: 'https://quantum-viz.demo',
                githubLink: 'https://github.com/alexchen/quantum-viz'
            },
            '2': {
                title: 'Neural Network Garden',
                description: 'Generative art installation that visualizes machine learning processes as growing, evolving digital organisms. Features real-time neural network training visualization with beautiful organic animations that represent data flow and learning processes.',
                technologies: ['p5.js', 'TensorFlow.js', 'WebAudio', 'Canvas'],
                liveLink: 'https://neural-garden.demo',
                githubLink: 'https://github.com/alexchen/neural-garden'
            },
            '3': {
                title: 'Holographic Interface',
                description: 'Futuristic UI framework with holographic effects, spatial interactions, and gesture-based controls. Built for next-generation immersive web experiences with cutting-edge WebXR technology and advanced 3D interactions.',
                technologies: ['React', 'Three.js', 'WebXR', 'GSAP'],
                liveLink: 'https://holo-ui.demo',
                githubLink: 'https://github.com/alexchen/holo-interface'
            },
            '4': {
                title: 'Sonic Landscape',
                description: 'Audio-reactive 3D environment that transforms music into immersive visual landscapes in real-time. Features advanced audio analysis algorithms and generative visuals that create unique landscapes for every song.',
                technologies: ['Web Audio API', 'Three.js', 'GLSL', 'WebGL'],
                liveLink: 'https://sonic-landscape.demo',
                githubLink: 'https://github.com/alexchen/sonic-landscape'
            }
        };

        // Handle project card clicks
        projectCards.forEach(card => {
            card.addEventListener('click', (e) => {
                // Don't trigger if clicking on the view button specifically
                if (!e.target.classList.contains('project-view-btn')) {
                    const projectId = card.getAttribute('data-project');
                    if (projects[projectId]) {
                        this.showProjectModal(projects[projectId]);
                    }
                }
            });
        });

        // Handle view button clicks
        projectViewBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const card = btn.closest('.project-card');
                const projectId = card?.getAttribute('data-project');
                if (projects[projectId]) {
                    this.showProjectModal(projects[projectId]);
                }
            });
        });

        // Modal close handlers
        if (modalClose) {
            modalClose.addEventListener('click', () => {
                this.closeModal();
            });
        }

        if (modalOverlay) {
            modalOverlay.addEventListener('click', () => {
                this.closeModal();
            });
        }
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    showProjectModal(project) {
        const modal = document.getElementById('projectModal');
        if (!modal) return;
        
        const title = modal.querySelector('.project-modal-title');
        const description = modal.querySelector('.project-modal-description');
        const techContainer = modal.querySelector('.project-modal-tech');
        const liveLink = modal.querySelector('.project-link');
        const githubLink = modal.querySelector('.github-link');

        if (title) title.textContent = project.title;
        if (description) description.textContent = project.description;
        
        if (techContainer) {
            techContainer.innerHTML = '';
            project.technologies.forEach(tech => {
                const tag = document.createElement('span');
                tag.className = 'tech-tag';
                tag.textContent = tech;
                techContainer.appendChild(tag);
            });
        }

        if (liveLink) liveLink.href = project.liveLink;
        if (githubLink) githubLink.href = project.githubLink;

        modal.classList.remove('hidden');
    }

    closeModal() {
        const modal = document.getElementById('projectModal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    initContactForm() {
        const form = document.getElementById('contactForm');
        const sendButton = document.querySelector('.send-button');
        const sendText = sendButton?.querySelector('.send-text');
        
        if (!form || !sendButton) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');
            
            if (!name || !email || !message) {
                this.showNotification('Please fill in all fields! ⚠️');
                return;
            }
            
            // Simulate form submission
            sendButton.classList.add('sending');
            sendButton.disabled = true;
            if (sendText) sendText.textContent = 'Sending...';
            
            // Create particle burst effect
            const particleBurst = sendButton.querySelector('.particle-burst');
            if (particleBurst) {
                particleBurst.style.width = '200px';
                particleBurst.style.height = '200px';
                particleBurst.style.opacity = '1';
            }
            
            setTimeout(() => {
                sendButton.classList.remove('sending');
                sendButton.disabled = false;
                if (sendText) sendText.textContent = 'Message Sent!';
                
                // Reset particle burst
                if (particleBurst) {
                    particleBurst.style.width = '0';
                    particleBurst.style.height = '0';
                    particleBurst.style.opacity = '0';
                }
                
                // Reset form after delay
                setTimeout(() => {
                    form.reset();
                    if (sendText) sendText.textContent = 'Send Message';
                    
                    // Remove focused states
                    const formGroups = form.querySelectorAll('.form-group');
                    formGroups.forEach(group => {
                        group.classList.remove('focused');
                    });
                }, 2000);
                
                // Show success message
                this.showNotification('Message sent successfully! 🚀');
            }, 2000);
        });

        // Enhanced input focus effects
        const inputs = document.querySelectorAll('.neon-input');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement?.classList.add('focused');
            });
            
            input.addEventListener('blur', () => {
                input.parentElement?.classList.remove('focused');
            });
        });
    }

    initEasterEgg() {
        document.addEventListener('keydown', (e) => {
            this.konamiCode.push(e.code);
            
            if (this.konamiCode.length > this.konamiSequence.length) {
                this.konamiCode.shift();
            }
            
            if (JSON.stringify(this.konamiCode) === JSON.stringify(this.konamiSequence)) {
                this.showEasterEgg();
                this.konamiCode = [];
            }
        });
    }

    showEasterEgg() {
        const easterEgg = document.getElementById('easterEgg');
        if (easterEgg) {
            easterEgg.classList.remove('hidden');
            
            // Create special particle explosion
            this.createParticleExplosion();
            
            setTimeout(() => {
                easterEgg.classList.add('hidden');
            }, 3000);
        }
    }

    initEventListeners() {
        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));
        
        // Social link hover effects
        const socialLinks = document.querySelectorAll('.social-link');
        socialLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                link.style.transform = 'translateY(-5px) rotateZ(5deg)';
            });
            
            link.addEventListener('mouseleave', () => {
                link.style.transform = 'translateY(0) rotateZ(0deg)';
            });
        });
    }

    // Helper methods
    startAnimations() {
        const heroTitle = document.querySelector('.hero-title');
        const heroSubtitle = document.querySelector('.hero-subtitle');
        const heroBio = document.querySelector('.hero-bio');
        const heroCta = document.querySelector('.hero-cta');
        
        if (heroTitle) setTimeout(() => heroTitle.style.opacity = '1', 500);
        if (heroSubtitle) setTimeout(() => heroSubtitle.style.opacity = '1', 1000);
        if (heroBio) setTimeout(() => heroBio.style.opacity = '1', 1500);
        if (heroCta) setTimeout(() => heroCta.style.opacity = '1', 2000);
    }

    animateTimeline() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        timelineItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }

    animateTestimonialWaveforms() {
        const waveforms = document.querySelectorAll('.voice-waveform');
        waveforms.forEach(waveform => {
            const bars = waveform.querySelectorAll('.waveform-bar');
            bars.forEach((bar, index) => {
                setTimeout(() => {
                    bar.style.animationPlayState = 'running';
                }, index * 100);
            });
        });
    }

    animateFloatingBubbles() {
        const bubbles = document.querySelectorAll('.feedback-bubble');
        bubbles.forEach((bubble, index) => {
            setTimeout(() => {
                bubble.style.animationPlayState = 'running';
            }, index * 500);
        });
    }

    animateCounter(element, start, end, duration) {
        const startTime = performance.now();
        
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const current = Math.round(start + (end - start) * progress);
            element.textContent = `${current}%`;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        };
        
        requestAnimationFrame(updateCounter);
    }

    createRipple(event, button) {
        const ripple = button.querySelector('.ripple-effect');
        if (!ripple) return;
        
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.transform = 'scale(0)';
        
        requestAnimationFrame(() => {
            ripple.style.transform = 'scale(1)';
        });
        
        setTimeout(() => {
            ripple.style.transform = 'scale(0)';
        }, 600);
    }

    createParticleExplosion() {
        const canvas = document.getElementById('particle-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const explosionParticles = [];
        
        // Create explosion particles
        for (let i = 0; i < 30; i++) {
            explosionParticles.push({
                x: canvas.width / 2,
                y: canvas.height / 2,
                vx: (Math.random() - 0.5) * 20,
                vy: (Math.random() - 0.5) * 20,
                size: Math.random() * 5 + 2,
                color: `hsl(${Math.random() * 360}, 70%, 60%)`,
                life: 1,
                decay: Math.random() * 0.02 + 0.01
            });
        }
        
        const animateExplosion = () => {
            explosionParticles.forEach((particle, index) => {
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.vy += 0.5; // gravity
                particle.life -= particle.decay;
                
                if (particle.life <= 0) {
                    explosionParticles.splice(index, 1);
                    return;
                }
                
                ctx.save();
                ctx.globalAlpha = particle.life;
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = particle.color;
                ctx.fill();
                ctx.restore();
            });
            
            if (explosionParticles.length > 0) {
                requestAnimationFrame(animateExplosion);
            }
        };
        
        animateExplosion();
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--time-primary);
            color: var(--color-btn-primary-text);
            padding: 16px 24px;
            border-radius: 8px;
            z-index: 10000;
            animation: slideInRight 0.5s ease;
            box-shadow: 0 0 20px var(--time-glow);
            font-family: var(--font-heading);
            font-weight: 500;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.5s ease forwards';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 500);
        }, 3000);
    }

    handleResize() {
        // Handle responsive adjustments
        const canvas = document.getElementById('particle-canvas');
        if (canvas) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
    }

    // Utility functions
    throttle(func, limit) {
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

    debounce(func, wait) {
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
}

// Additional CSS animations via JavaScript
const additionalStyles = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
    
    .hero-title,
    .hero-subtitle,
    .hero-bio,
    .hero-cta {
        opacity: 0;
        transition: opacity 1s ease;
    }
    
    .timeline-item {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
    }
    
    .skill-meter.highlighted {
        transform: scale(1.05);
        box-shadow: 0 0 20px var(--time-glow);
        transition: all 0.3s ease;
    }
    
    .voice-waveform .waveform-bar {
        animation-play-state: paused;
    }
    
    .feedback-bubble {
        animation-play-state: paused;
    }
    
    .form-group.focused .neon-input {
        border-color: var(--time-primary);
        box-shadow: 0 0 20px var(--time-glow);
    }
    
    .send-button.sending {
        background: var(--time-secondary);
        transform: scale(1.05);
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioApp();
});

// Add magnetic hover effect for enhanced interactivity
document.addEventListener('DOMContentLoaded', () => {
    // Magnetic hover effect for buttons and cards
    const magneticElements = document.querySelectorAll('.btn, .project-card, .testimonial-card');
    
    magneticElements.forEach(element => {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            element.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'translate(0, 0)';
        });
    });
    
    // Parallax effect for section titles
    const parallaxElements = document.querySelectorAll('.section-title');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const rate = scrolled * -0.05;
                element.style.transform = `translateY(${rate}px)`;
            }
        });
    });
});

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        const perfData = performance.getEntriesByType('navigation')[0];
        if (perfData) {
            console.log(`Page load time: ${perfData.loadEventEnd - perfData.loadEventStart}ms`);
        }
    });
}