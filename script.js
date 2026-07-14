/* ============================================
   NOEL LAO — PREMIUM PORTFOLIO
   JavaScript Interactivity
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // LOADING SCREEN
    // ==========================================
    const loader = document.getElementById('loader');
    document.body.classList.add('no-scroll');

    window.addEventListener('load', () => {
        setTimeout(() => {
            document.body.classList.add('loaded');
            document.body.classList.remove('no-scroll');
            setTimeout(() => {
                if (loader) loader.style.display = 'none';
            }, 600);
        }, 2800);
    });

    // ==========================================
    // CUSTOM CURSOR
    // ==========================================
    const cursor = document.getElementById('cursor');
    const cursorFollower = document.getElementById('cursorFollower');
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

    if (!isTouchDevice && cursor && cursorFollower) {
        let mouseX = 0, mouseY = 0;
        let followerX = 0, followerY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';
        });

        // Smooth follower animation
        function animateFollower() {
            followerX += (mouseX - followerX) * 0.15;
            followerY += (mouseY - followerY) * 0.15;
            cursorFollower.style.left = followerX + 'px';
            cursorFollower.style.top = followerY + 'px';
            requestAnimationFrame(animateFollower);
        }
        animateFollower();

        // Hover effect on interactive elements
        const interactiveSelectors = 'a, button, .portfolio-card, .service-card, .skill-card, .why-card, .filter-btn, input, textarea, select, .slider-btn, .play-btn-large, .social-link, .theme-toggle';

        document.addEventListener('mouseover', (e) => {
            if (e.target.closest(interactiveSelectors)) {
                cursor.classList.add('cursor-hover');
                cursorFollower.classList.add('cursor-hover');
            }
        });

        document.addEventListener('mouseout', (e) => {
            if (e.target.closest(interactiveSelectors)) {
                cursor.classList.remove('cursor-hover');
                cursorFollower.classList.remove('cursor-hover');
            }
        });
    }

    // ==========================================
    // NAVBAR
    // ==========================================
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll effect
    function handleNavScroll() {
        if (window.scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    window.addEventListener('scroll', handleNavScroll, { passive: true });

    // Hamburger toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });
    }

    // Close mobile menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (hamburger) hamburger.classList.remove('active');
            if (navMenu) navMenu.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                const offset = 80;
                const top = targetEl.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // Active section highlighting
    const sections = document.querySelectorAll('section[id]');
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => link.classList.remove('active'));
                const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
                if (activeLink) activeLink.classList.add('active');
            }
        });
    }, { threshold: 0.2, rootMargin: '-80px 0px -40% 0px' });

    sections.forEach(section => sectionObserver.observe(section));

    // ==========================================
    // HERO PARTICLES
    // ==========================================
    const canvas = document.getElementById('heroParticles');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        const hero = document.querySelector('.hero');
        let particles = [];
        const PARTICLE_COUNT = 70;

        function resizeCanvas() {
            if (hero) {
                canvas.width = hero.offsetWidth;
                canvas.height = hero.offsetHeight;
            }
        }
        resizeCanvas();

        class Particle {
            constructor() {
                this.reset();
                this.y = Math.random() * canvas.height;
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = canvas.height + 10;
                this.radius = Math.random() * 1.5 + 0.5;
                this.opacity = Math.random() * 0.3 + 0.1;
                this.speedY = -(Math.random() * 0.5 + 0.2);
                this.speedX = (Math.random() - 0.5) * 0.3;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.y < -10) this.reset();
                if (this.x < 0) this.x = canvas.width;
                if (this.x > canvas.width) this.x = 0;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`;
                ctx.fill();
            }
        }

        // Initialize particles
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push(new Particle());
        }

        function drawConnections() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 100) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(212, 175, 55, ${0.12 * (1 - dist / 100)})`;
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
            requestAnimationFrame(animateParticles);
        }
        animateParticles();

        // Debounced resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(resizeCanvas, 250);
        });
    }

    // ==========================================
    // SCROLL REVEAL ANIMATIONS
    // ==========================================
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));

    // ==========================================
    // ANIMATED COUNTERS
    // ==========================================
    const statNumbers = document.querySelectorAll('.stat-number');

    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        if (isNaN(target)) return;
        const duration = 2000;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - (1 - progress) * (1 - progress); // easeOutQuad
            element.textContent = Math.floor(eased * target);
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        requestAnimationFrame(update);
    }

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => counterObserver.observe(el));

    // ==========================================
    // PORTFOLIO VIDEO AUTOPLAY SYSTEM
    // ==========================================
    const allPortfolioVideos = document.querySelectorAll('.portfolio-card video');

    // Play all visible videos
    function playVisibleVideos() {
        allPortfolioVideos.forEach(video => {
            const rect = video.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            if (isVisible && video.paused) {
                video.play().catch(() => {});
            }
        });
    }

    // Resume videos when user returns to tab / app
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            playVisibleVideos();
        }
    });

    // Also resume on window focus (covers alt-tab & app switching)
    window.addEventListener('focus', () => {
        playVisibleVideos();
    });

    // Play/pause based on scroll visibility
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            if (entry.isIntersecting && !document.hidden) {
                video.play().catch(() => {});
            } else {
                video.pause();
            }
        });
    }, { threshold: 0.2 });

    allPortfolioVideos.forEach(video => videoObserver.observe(video));

    // ==========================================
    // PORTFOLIO FILTERING
    // ==========================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioCards = document.querySelectorAll('.portfolio-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');
            let delay = 0;

            portfolioCards.forEach((card, index) => {
                const categories = card.getAttribute('data-category');
                const match = filter === 'all' || categories.includes(filter);

                if (match) {
                    setTimeout(() => {
                        card.classList.remove('hidden');
                    }, delay);
                    delay += 80;
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    // ==========================================
    // PORTFOLIO MODAL
    // ==========================================
    const modal = document.getElementById('portfolioModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalCategory = document.getElementById('modalCategory');
    const modalDesc = document.getElementById('modalDesc');
    const modalMedia = document.getElementById('modalMedia');
    const modalClose = document.getElementById('modalClose');

    // Open modal via view buttons
    document.addEventListener('click', (e) => {
        const viewBtn = e.target.closest('.view-btn');
        if (viewBtn && modal) {
            const card = viewBtn.closest('.portfolio-card');
            if (!card) return;

            const title = card.querySelector('.card-title')?.textContent || '';
            const category = card.querySelector('.card-category')?.textContent || '';
            const desc = card.querySelector('.card-desc')?.textContent || '';

            modalTitle.textContent = title;
            modalCategory.textContent = category;
            modalDesc.textContent = desc;

            // Detect media type and display in modal
            const img = card.querySelector('.card-thumbnail img');
            const video = card.querySelector('.card-thumbnail video');

            if (video && video.src) {
                // Video in modal plays unmuted with controls
                modalMedia.innerHTML = `<video src="${video.src}" controls autoplay loop style="width:100%;height:100%;object-fit:contain;border-radius:12px;"></video>`;
            } else if (img && img.src) {
                modalMedia.innerHTML = `<img src="${img.src}" alt="${title}" style="width:100%;height:100%;object-fit:contain;border-radius:12px;">`;
            } else {
                modalMedia.innerHTML = `<div class="media-preview" style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;border-radius:12px;background:var(--bg-secondary);"><i class="fas fa-image" style="font-size:48px;color:rgba(212,175,55,0.2);"></i></div>`;
            }

            modal.classList.add('active');
            document.body.classList.add('no-scroll');
        }
    });

    // Close modal
    function closeModal() {
        if (modal) {
            const modalVideo = modal.querySelector('video');
            if (modalVideo) modalVideo.pause();
            modal.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }
    }

    if (modalClose) modalClose.addEventListener('click', closeModal);
    document.querySelector('.modal-overlay')?.addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });


    // ==========================================
    // SKILL PROGRESS BARS
    // ==========================================
    const skillBars = document.querySelectorAll('.skill-progress');
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                const progress = entry.target.getAttribute('data-progress');
                setTimeout(() => {
                    entry.target.style.width = progress + '%';
                }, index * 200);
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    skillBars.forEach(bar => skillObserver.observe(bar));

    // ==========================================
    // TESTIMONIAL SLIDER
    // ==========================================
    const track = document.getElementById('testimonialTrack');
    const prevBtn = document.getElementById('prevTestimonial');
    const nextBtn = document.getElementById('nextTestimonial');
    const dotsContainer = document.getElementById('sliderDots');

    if (track && prevBtn && nextBtn && dotsContainer) {
        const cards = track.querySelectorAll('.testimonial-card');
        const totalSlides = cards.length;
        let currentSlide = 0;
        let autoSlideInterval;

        // Create dots
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.setAttribute('aria-label', `Testimonial ${i + 1}`);
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }

        const dots = dotsContainer.querySelectorAll('.dot');

        function goToSlide(index) {
            currentSlide = index;
            track.style.transform = `translateX(-${index * 100}%)`;
            dots.forEach(d => d.classList.remove('active'));
            if (dots[index]) dots[index].classList.add('active');
        }

        function nextSlide() {
            goToSlide((currentSlide + 1) % totalSlides);
        }

        function prevSlide() {
            goToSlide((currentSlide - 1 + totalSlides) % totalSlides);
        }

        nextBtn.addEventListener('click', nextSlide);
        prevBtn.addEventListener('click', prevSlide);

        // Auto-advance
        function startAutoSlide() {
            autoSlideInterval = setInterval(nextSlide, 5000);
        }
        startAutoSlide();

        // Pause on hover
        const sliderEl = track.closest('.testimonial-slider');
        if (sliderEl) {
            sliderEl.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
            sliderEl.addEventListener('mouseleave', startAutoSlide);
        }

        // Touch/swipe support
        let touchStartX = 0;
        track.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        }, { passive: true });

        track.addEventListener('touchend', (e) => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) {
                diff > 0 ? nextSlide() : prevSlide();
            }
        });
    }

    // ==========================================
    // CONTACT FORM (sends to email via Formspree)
    // ==========================================
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('.submit-btn');
            if (!btn) return;

            // Sync reply-to with the visitor's email
            const emailField = document.getElementById('contactEmail');
            const replyTo = document.getElementById('replyTo');
            if (emailField && replyTo) replyTo.value = emailField.value;

            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
            btn.disabled = true;

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: new FormData(contactForm),
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    btn.innerHTML = '<span>Message Sent!</span><i class="fas fa-check"></i>';
                    btn.classList.add('success');
                    contactForm.reset();
                } else {
                    btn.innerHTML = '<span>Failed to Send</span><i class="fas fa-times"></i>';
                    btn.style.background = '#e74c3c';
                }
            } catch (error) {
                btn.innerHTML = '<span>Failed to Send</span><i class="fas fa-times"></i>';
                btn.style.background = '#e74c3c';
            }

            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.classList.remove('success');
                btn.style.background = '';
                btn.disabled = false;
            }, 3000);
        });
    }

    // ==========================================
    // DARK / LIGHT MODE TOGGLE
    // ==========================================
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        const icon = themeToggle.querySelector('i');

        // Load saved preference
        if (localStorage.getItem('theme') === 'light') {
            document.body.classList.add('light-mode');
            if (icon) icon.classList.replace('fa-moon', 'fa-sun');
        }

        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            if (document.body.classList.contains('light-mode')) {
                if (icon) icon.classList.replace('fa-moon', 'fa-sun');
                localStorage.setItem('theme', 'light');
            } else {
                if (icon) icon.classList.replace('fa-sun', 'fa-moon');
                localStorage.setItem('theme', 'dark');
            }
        });
    }

    // ==========================================
    // BACK TO TOP
    // ==========================================
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }, { passive: true });

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ==========================================
    // FLOATING CONTACT BUTTON
    // ==========================================
    const floatingContact = document.getElementById('floatingContact');
    if (floatingContact) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > window.innerHeight) {
                floatingContact.classList.add('visible');
            } else {
                floatingContact.classList.remove('visible');
            }
        }, { passive: true });
    }

    // ==========================================
    // PARALLAX EFFECT (desktop only)
    // ==========================================
    if (window.innerWidth > 1024) {
        const heroContent = document.querySelector('.hero-content');
        const heroVisual = document.querySelector('.hero-visual');
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrolled = window.scrollY;
                    if (scrolled < window.innerHeight) {
                        if (heroContent) heroContent.style.transform = `translateY(${scrolled * 0.12}px)`;
                        if (heroVisual) heroVisual.style.transform = `translateY(${scrolled * 0.08}px)`;
                    }
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

});
