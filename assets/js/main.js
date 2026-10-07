document.addEventListener('DOMContentLoaded', () => {

    // --- 1. LÁMPARA DE LAVA (HOME) ---
    const fluidCanvas = document.getElementById('fluidCanvas');
    if (fluidCanvas) {
        const ctx = fluidCanvas.getContext('2d');
        let width, height;
        let particles = [];
        const particleCount = 15;
        let mouse = { x: -1000, y: -1000 };
        let isVisible = true;
        let animationFrameId = null;

        function resize() {
            width = fluidCanvas.width = window.innerWidth;
            height = fluidCanvas.height = window.innerHeight;
        }

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 1.0;
                this.vy = (Math.random() - 0.5) * 1.0;
                this.size = Math.random() * 60 + 40;
                const colors = ['#D4AF37', '#8B0000', '#C41E3A', '#996515'];
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Gravedad Central
                const centerX = width / 2;
                const centerY = height / 2;
                const dxCenter = centerX - this.x;
                const dyCenter = centerY - this.y;
                const distCenter = Math.sqrt(dxCenter * dxCenter + dyCenter * dyCenter);

                if (distCenter > 300) {
                    const pullStrength = 0.00002 * (distCenter / 300);
                    this.vx += dxCenter * pullStrength;
                    this.vy += dyCenter * pullStrength;
                } else {
                    this.vx += dxCenter * 0.000001;
                    this.vy += dyCenter * 0.000001;
                }

                // Mouse / Touch
                const dxMouse = mouse.x - this.x;
                const dyMouse = mouse.y - this.y;
                const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
                const maxDist = 150;

                if (distMouse < maxDist) {
                    const force = (maxDist - distMouse) / maxDist;
                    const angle = Math.atan2(dyMouse, dxMouse);
                    this.vx -= Math.cos(angle) * force * 0.2;
                    this.vy -= Math.sin(angle) * force * 0.2;
                }

                this.vx *= 0.998;
                this.vy *= 0.998;

                if (this.x < -150 || this.x > width + 150) this.vx *= -1;
                if (this.y < -150 || this.y > height + 150) this.vy *= -1;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        function animate() {
            if (!isVisible) return;
            ctx.clearRect(0, 0, width, height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            animationFrameId = requestAnimationFrame(animate);
        }

        window.addEventListener('resize', () => {
            resize();
            initParticles();
        });

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        // Soporte táctil en pantalla de inicio
        window.addEventListener('touchmove', (e) => {
            if (e.touches && e.touches[0]) {
                mouse.x = e.touches[0].clientX;
                mouse.y = e.touches[0].clientY;
            }
        }, { passive: true });

        window.addEventListener('touchend', () => {
            mouse.x = -1000;
            mouse.y = -1000;
        }, { passive: true });

        // Optimización de batería: Pausar canvas al salir del viewport
        const heroSection = fluidCanvas.closest('header') || fluidCanvas;
        const heroObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                isVisible = entry.isIntersecting;
                if (isVisible) {
                    if (!animationFrameId) {
                        animationFrameId = requestAnimationFrame(animate);
                    }
                } else {
                    if (animationFrameId) {
                        cancelAnimationFrame(animationFrameId);
                        animationFrameId = null;
                    }
                }
            });
        }, { threshold: 0.05 });
        heroObserver.observe(heroSection);

        resize();
        initParticles();
        animate();
    }

    // --- 2. EFECTO RACE TRAILS (FORMULA STUDENT) ---
    const raceCanvas = document.getElementById('raceCanvas');
    if (raceCanvas) {
        const ctx = raceCanvas.getContext('2d');
        let width, height;
        let racers = [];
        const racerCount = 25;
        let isVisibleRace = true;
        let animationFrameRaceId = null;

        function resizeRace() {
            width = raceCanvas.width = window.innerWidth;
            height = raceCanvas.height = window.innerHeight;
        }

        class Racer {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.speed = Math.random() * 2 + 1;
                this.length = Math.random() * 80 + 30;
                this.width = Math.random() * 3 + 1;

                const colors = [
                    'rgba(255, 255, 255, 0.6)',
                    'rgba(200, 30, 58, 0.8)',
                    'rgba(212, 175, 55, 0.7)'
                ];
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }

            update() {
                this.x += this.speed;
                if (this.x > width + this.length) {
                    this.x = -this.length;
                    this.y = Math.random() * height;
                    this.speed = Math.random() * 2 + 1;
                }
            }

            draw() {
                ctx.beginPath();
                const gradient = ctx.createLinearGradient(this.x - this.length, this.y, this.x, this.y);
                gradient.addColorStop(0, "transparent");
                gradient.addColorStop(1, this.color);

                ctx.strokeStyle = gradient;
                ctx.lineWidth = this.width;
                ctx.lineCap = "round";

                ctx.moveTo(this.x - this.length, this.y);
                ctx.lineTo(this.x, this.y);
                ctx.stroke();
            }
        }

        function initRacers() {
            racers = [];
            for (let i = 0; i < racerCount; i++) {
                racers.push(new Racer());
            }
        }

        function animateRace() {
            if (!isVisibleRace) return;
            ctx.clearRect(0, 0, width, height);
            racers.forEach(r => {
                r.update();
                r.draw();
            });
            animationFrameRaceId = requestAnimationFrame(animateRace);
        }

        window.addEventListener('resize', () => { resizeRace(); });

        const raceSection = raceCanvas.closest('header') || raceCanvas;
        const raceObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                isVisibleRace = entry.isIntersecting;
                if (isVisibleRace) {
                    if (!animationFrameRaceId) {
                        animationFrameRaceId = requestAnimationFrame(animateRace);
                    }
                } else {
                    if (animationFrameRaceId) {
                        cancelAnimationFrame(animationFrameRaceId);
                        animationFrameRaceId = null;
                    }
                }
            });
        }, { threshold: 0.05 });
        raceObserver.observe(raceSection);

        resizeRace();
        initRacers();
        animateRace();
    }

    // --- 3. EFECTO VFX PARTICLES (VFX PAGE) ---
    const vfxCanvas = document.getElementById('vfxCanvas');
    if (vfxCanvas) {
        const ctx = vfxCanvas.getContext('2d');
        let width, height;
        let particles = [];
        const particleCount = 60;
        let isVisibleVFX = true;
        let animationFrameVFXId = null;

        function resizeVFX() {
            width = vfxCanvas.width = window.innerWidth;
            height = vfxCanvas.height = window.innerHeight;
        }

        class MagicParticle {
            constructor() {
                this.reset();
                this.y = Math.random() * height;
            }

            reset() {
                this.x = Math.random() * width;
                this.y = height + Math.random() * 100;
                this.speed = Math.random() * 1 + 0.5;
                this.size = Math.random() * 3 + 1;
                this.life = Math.random() * 100 + 50;
                this.opacity = Math.random() * 0.5 + 0.2;
                this.wobble = Math.random() * Math.PI * 2;

                const colors = [
                    '142, 68, 173',
                    '212, 175, 55',
                    '155, 89, 182',
                    '255, 255, 255'
                ];
                this.colorRGB = colors[Math.floor(Math.random() * colors.length)];
            }

            update() {
                this.y -= this.speed;
                this.wobble += 0.05;
                this.x += Math.sin(this.wobble) * 0.5;
                this.life--;

                if (this.life < 0 || this.y < -50) {
                    this.reset();
                }
            }

            draw() {
                ctx.beginPath();
                const alpha = Math.min(this.opacity, this.life / 50);

                ctx.fillStyle = `rgba(${this.colorRGB}, ${alpha})`;
                ctx.shadowBlur = 15;
                ctx.shadowColor = `rgba(${this.colorRGB}, 0.8)`;

                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();

                ctx.shadowBlur = 0;
            }
        }

        function initVFX() {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new MagicParticle());
            }
        }

        function animateVFX() {
            if (!isVisibleVFX) return;
            ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
            ctx.fillRect(0, 0, width, height);

            ctx.globalCompositeOperation = 'lighter';

            particles.forEach(p => {
                p.update();
                p.draw();
            });

            ctx.globalCompositeOperation = 'source-over';
            animationFrameVFXId = requestAnimationFrame(animateVFX);
        }

        window.addEventListener('resize', () => { resizeVFX(); initVFX(); });

        const vfxSection = vfxCanvas.closest('header') || vfxCanvas;
        const vfxObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                isVisibleVFX = entry.isIntersecting;
                if (isVisibleVFX) {
                    if (!animationFrameVFXId) {
                        animationFrameVFXId = requestAnimationFrame(animateVFX);
                    }
                } else {
                    if (animationFrameVFXId) {
                        cancelAnimationFrame(animationFrameVFXId);
                        animationFrameVFXId = null;
                    }
                }
            });
        }, { threshold: 0.05 });
        vfxObserver.observe(vfxSection);

        resizeVFX();
        initVFX();
        animateVFX();
    }

    // --- 4. CARGA DIFERIDA DE GIFS & INTERACCIÓN TÁCTIL (PC + MÓVIL) ---
    const projectCards = document.querySelectorAll('.project-card');

    function loadCardGif(card) {
        const staticImg = card.querySelector('.project-img');
        const imgContainer = card.querySelector('.image-container');
        if (!staticImg || !imgContainer) return;

        // Evitar duplicados
        if (imgContainer.querySelector('.project-gif')) return;

        const gifSrc = staticImg.getAttribute('data-gif');
        if (gifSrc && gifSrc.trim() !== '') {
            const gifImg = document.createElement('img');
            gifImg.src = gifSrc;
            gifImg.classList.add('project-gif');
            gifImg.alt = (staticImg.alt || 'Project') + ' preview';
            gifImg.decoding = 'async';
            imgContainer.appendChild(gifImg);
        }
    }

    // Carga progresiva cuando las tarjetas están cerca de aparecer en pantalla
    const cardIntersectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                loadCardGif(entry.target);
                cardIntersectionObserver.unobserve(entry.target);
            }
        });
    }, { rootMargin: '200px 0px 200px 0px' });

    projectCards.forEach(card => {
        cardIntersectionObserver.observe(card);

        // En PC: Hover instantáneo
        card.addEventListener('pointerenter', () => {
            loadCardGif(card);
        });

        // En Móvil: Tap para desplegar overlay sin romper los enlaces
        card.addEventListener('click', (e) => {
            // Si el usuario tocó un enlace interactivo (Play, Video, Code, Itch), dejamos que navegue
            if (e.target.closest('a') || e.target.closest('button')) {
                return;
            }

            const isTouchActive = card.classList.contains('touch-active');
            projectCards.forEach(c => c.classList.remove('touch-active'));

            if (!isTouchActive) {
                card.classList.add('touch-active');
                loadCardGif(card);
            }
        });
    });

    // Cerrar tarjetas activas al pulsar fuera en móvil
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.project-card')) {
            projectCards.forEach(c => c.classList.remove('touch-active'));
        }
    });

    // --- 4.1 VÍDEOS EN TRABAJO EN PROGRESO (index.html) ---
    const wipCards = document.querySelectorAll('.wip-card');
    wipCards.forEach(card => {
        const video = card.querySelector('.wip-video');
        if (!video) return;

        // En PC: Al pasar el ratón, reproduce el vídeo sobre el cartel
        card.addEventListener('pointerenter', () => {
            const p = video.play();
            if (p !== undefined) p.catch(() => {});
        });

        // Al salir el ratón, pausa el vídeo y vuelve a verse el cartel
        card.addEventListener('pointerleave', () => {
            video.pause();
        });

        // En móvil: Tap para alternar entre ver el cartel o ver el vídeo en movimiento
        card.addEventListener('click', (e) => {
            if (e.target.closest('a') || e.target.closest('button')) return;
            const isTouchActive = card.classList.contains('touch-active');
            wipCards.forEach(c => {
                c.classList.remove('touch-active');
                const v = c.querySelector('.wip-video');
                if (v) v.pause();
            });
            if (!isTouchActive) {
                card.classList.add('touch-active');
                video.play().catch(() => {});
            }
        });
    });

    // --- 5. OPTIMIZACIÓN DE VÍDEOS VFX (vfx.html) ---
    const vfxVideos = document.querySelectorAll('.vfx-video');
    if (vfxVideos.length > 0) {
        // Asegurar atributos nativos de reproducción fluida
        vfxVideos.forEach(v => {
            v.setAttribute('autoplay', '');
            v.setAttribute('loop', '');
            v.setAttribute('muted', '');
            v.setAttribute('playsinline', '');
            v.muted = true;
        });

        // Observer con margen amplio (400px):
        // NUNCA pausa ningún vídeo mientras esté visible en pantalla.
        // Solo suspende los vídeos que quedan muy lejos del scroll para no saturar memoria.
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const video = entry.target;
                if (entry.isIntersecting) {
                    if (video.paused) {
                        video.play().catch(() => {});
                    }
                } else {
                    if (!video.paused) {
                        video.pause();
                    }
                }
            });
        }, { rootMargin: '400px 0px 400px 0px', threshold: 0 });

        vfxVideos.forEach(v => videoObserver.observe(v));

        // Pausar vídeos si se minimiza o cambia de pestaña para ahorrar batería
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                vfxVideos.forEach(v => {
                    if (!v.paused) v.pause();
                });
            } else {
                vfxVideos.forEach(v => {
                    if (v.paused) v.play().catch(() => {});
                });
            }
        });
    }

    // --- 6. SCROLL REVEAL ---
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // --- 7. MENÚ MÓVIL RESPONSIVO CON AUTO-CIERRE ---
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuBtn && mobileMenu) {
        const menuIcon = menuBtn.querySelector('i');

        const toggleMobileMenu = (forceOpen) => {
            const isCurrentlyHidden = mobileMenu.classList.contains('hidden');
            const shouldOpen = forceOpen !== undefined ? forceOpen : isCurrentlyHidden;

            if (shouldOpen) {
                mobileMenu.classList.remove('hidden');
                if (menuIcon) {
                    menuIcon.classList.remove('fa-bars');
                    menuIcon.classList.add('fa-xmark');
                }
            } else {
                mobileMenu.classList.add('hidden');
                if (menuIcon) {
                    menuIcon.classList.remove('fa-xmark');
                    menuIcon.classList.add('fa-bars');
                }
            }
        };

        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMobileMenu();
        });

        // Auto-cierre al hacer clic en cualquier enlace del menú móvil
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                toggleMobileMenu(false);
            });
        });

        // Cerrar si se pulsa fuera de la barra de navegación
        document.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) && !menuBtn.contains(e.target)) {
                toggleMobileMenu(false);
            }
        });
    }

    // --- 8. SOMBRA DINÁMICA DEL NAVBAR AL HACER SCROLL ---
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 30) {
                navbar.classList.add('bg-black/90', 'shadow-xl');
                navbar.classList.remove('bg-black/70');
            } else {
                navbar.classList.remove('bg-black/90', 'shadow-xl');
                navbar.classList.add('bg-black/70');
            }
        }, { passive: true });
    }

    // --- 9. FILTRO DE CATEGORÍAS EN VFX (vfx.html) ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const vfxCards = document.querySelectorAll('.vfx-card');
    const vfxSections = document.querySelectorAll('.vfx-section');

    if (filterBtns.length > 0 && vfxCards.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.getAttribute('data-filter');

                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                vfxCards.forEach(card => {
                    const categories = card.getAttribute('data-category') || '';
                    if (filter === 'all' || categories.includes(filter)) {
                        card.style.display = '';
                    } else {
                        card.style.display = 'none';
                    }
                });

                vfxSections.forEach(section => {
                    const secCat = section.getAttribute('data-section-category') || '';
                    if (filter === 'all') {
                        section.style.display = '';
                    } else if (filter === 'production' && secCat === 'production') {
                        section.style.display = '';
                    } else if (filter === 'gamejam' && secCat === 'gamejam') {
                        section.style.display = '';
                    } else if (filter === 'unreal' && secCat === 'unreal') {
                        section.style.display = '';
                    } else if (filter === 'unity' && (secCat === 'production' || secCat === 'gamejam')) {
                        section.style.display = '';
                    } else {
                        const hasVisibleCard = Array.from(section.querySelectorAll('.vfx-card')).some(c => c.style.display !== 'none');
                        section.style.display = hasVisibleCard ? '' : 'none';
                    }
                });
            });
        });
    }

    // --- 10. MODAL / LIGHTBOX DE VFX (vfx.html) ---
    const vfxModal = document.getElementById('vfx-modal');
    const modalVideo = document.getElementById('modal-video');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalTags = document.getElementById('modal-tags');
    const modalContext = document.getElementById('modal-context');
    const modalCloseBtn = document.getElementById('modal-close-btn');

    if (vfxModal && modalVideo) {
        const openModal = (card) => {
            const videoSrc = card.getAttribute('data-video');
            const title = card.getAttribute('data-title') || '';
            const engine = card.getAttribute('data-engine') || '';
            const tool = card.getAttribute('data-tool') || '';
            const context = card.getAttribute('data-context') || '';
            const desc = card.getAttribute('data-desc') || '';

            modalVideo.src = videoSrc;
            modalTitle.textContent = title;
            modalDesc.textContent = desc;
            modalContext.textContent = context ? `Project: ${context}` : '';

            modalTags.innerHTML = '';
            if (engine) {
                const engineSpan = document.createElement('span');
                engineSpan.className = 'text-g-gold text-xs font-bold uppercase tracking-wider border border-g-gold px-2.5 py-1 rounded';
                engineSpan.textContent = engine;
                modalTags.appendChild(engineSpan);
            }
            if (tool) {
                const toolSpan = document.createElement('span');
                toolSpan.className = 'text-white text-xs font-bold uppercase tracking-wider border border-white/30 px-2.5 py-1 rounded';
                toolSpan.textContent = tool;
                modalTags.appendChild(toolSpan);
            }
            if (context) {
                const ctxSpan = document.createElement('span');
                ctxSpan.className = 'text-blue-400 text-xs font-bold uppercase tracking-wider border border-blue-400/40 px-2.5 py-1 rounded';
                ctxSpan.textContent = context;
                modalTags.appendChild(ctxSpan);
            }

            vfxModal.classList.add('active');
            document.body.style.overflow = 'hidden';

            modalVideo.play().catch(() => {});
        };

        const closeModal = () => {
            vfxModal.classList.remove('active');
            modalVideo.pause();
            modalVideo.src = '';
            document.body.style.overflow = '';
        };

        vfxCards.forEach(card => {
            card.addEventListener('click', () => openModal(card));
        });

        if (modalCloseBtn) {
            modalCloseBtn.addEventListener('click', closeModal);
        }

        vfxModal.addEventListener('click', (e) => {
            if (e.target === vfxModal) {
                closeModal();
            }
        });

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && vfxModal.classList.contains('active')) {
                closeModal();
            }
        });
    }

    // --- 11. BOTÓN VOLVER ARRIBA (BACK TO TOP) ---
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }, { passive: true });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // --- 12. COPIAR EMAIL CON TOAST NOTIFICATION ---
    const copyEmailBtn = document.getElementById('copy-email-btn');
    if (copyEmailBtn) {
        let toastTimeout = null;
        const emailToCopy = 'edwb2404@gmail.com';

        const showToast = (message) => {
            let toast = document.getElementById('copy-toast');
            if (!toast) {
                toast = document.createElement('div');
                toast.id = 'copy-toast';
                toast.className = 'toast-notification';
                document.body.appendChild(toast);
            }
            toast.innerHTML = `<i class="fas fa-check-circle text-g-gold text-base"></i> <span>${message}</span>`;
            toast.classList.add('show');

            if (toastTimeout) clearTimeout(toastTimeout);
            toastTimeout = setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        };

        copyEmailBtn.addEventListener('click', async () => {
            try {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    await navigator.clipboard.writeText(emailToCopy);
                } else {
                    const tempInput = document.createElement('input');
                    tempInput.value = emailToCopy;
                    document.body.appendChild(tempInput);
                    tempInput.select();
                    document.execCommand('copy');
                    document.body.removeChild(tempInput);
                }

                showToast(`Copied: <strong>${emailToCopy}</strong>`);

                const originalHtml = copyEmailBtn.innerHTML;
                copyEmailBtn.innerHTML = '<i class="fas fa-check text-g-gold"></i> <span>Copied!</span>';

                setTimeout(() => {
                    copyEmailBtn.innerHTML = originalHtml;
                }, 2000);
            } catch (err) {
                showToast(`Email: <strong>${emailToCopy}</strong>`);
            }
        });
    }
});