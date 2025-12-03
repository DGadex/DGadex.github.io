document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. LÁMPARA DE LAVA (HOME) ---
    const fluidCanvas = document.getElementById('fluidCanvas');
    if (fluidCanvas) {
        const ctx = fluidCanvas.getContext('2d');
        let width, height;
        let particles = [];
        const particleCount = 15; 
        let mouse = { x: -1000, y: -1000 };

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
                const distCenter = Math.sqrt(dxCenter*dxCenter + dyCenter*dyCenter);
                
                if(distCenter > 300) {
                     const pullStrength = 0.00002 * (distCenter / 300);
                     this.vx += dxCenter * pullStrength;
                     this.vy += dyCenter * pullStrength;
                } else {
                     this.vx += dxCenter * 0.000001; 
                     this.vy += dyCenter * 0.000001; 
                }

                // Mouse
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
            ctx.clearRect(0, 0, width, height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animate);
        }

        window.addEventListener('resize', () => { resize(); initParticles(); });
        window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });

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
                // VELOCIDAD MUCHO MÁS LENTA Y ELEGANTE
                this.speed = Math.random() * 2 + 1; // Antes era *4 + 2
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
                    // Reset speed on loop
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
            ctx.clearRect(0, 0, width, height);
            racers.forEach(r => {
                r.update();
                r.draw();
            });
            requestAnimationFrame(animateRace);
        }

        window.addEventListener('resize', () => { resizeRace(); });
        
        resizeRace();
        initRacers();
        animateRace();
    }

    // --- 3. GIF PREVIEW & HOVER ---
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        const staticImg = card.querySelector('.project-img');
        const imgContainer = card.querySelector('.image-container');
        
        if(staticImg && imgContainer) {
            const gifSrc = staticImg.getAttribute('data-gif');

            if (gifSrc && gifSrc.trim() !== "") {
                const gifImg = document.createElement('img');
                gifImg.src = gifSrc;
                gifImg.classList.add('project-gif'); 
                gifImg.alt = staticImg.alt + " preview";
                imgContainer.appendChild(gifImg);
            }
        }
    });

    // --- 4. SCROLL REVEAL & PARALLAX ---
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // --- 5. MOBILE MENU ---
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
    }
});