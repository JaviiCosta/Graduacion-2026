/* ══════════════════════════════════════════
   INITIALIZATION
   ══════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
    AOS.init({
        once: true,
        duration: 900,
        easing: 'ease-out-cubic',
        offset: 80
    });

    initParticles();
    initSmoothScroll();
    initNavScrollEffect();
    initParallax();
    initLetterTyping();
    initGiftCelebration();
    initFloralDecor();
});

/* ══════════════════════════════════════════
   PARTICLE BACKGROUND — Elegant dust motes
   ══════════════════════════════════════════ */
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let w, h;

    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const count = Math.min(35, Math.floor(window.innerWidth / 40));
    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * w,
            y: Math.random() * h,
            r: Math.random() * 1.2 + 0.3,
            vx: (Math.random() - 0.5) * 0.15,
            vy: (Math.random() - 0.5) * 0.15,
            alpha: Math.random() * 0.15 + 0.03
        });
    }

    function draw() {
        ctx.clearRect(0, 0, w, h);
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0) p.x = w;
            if (p.x > w) p.x = 0;
            if (p.y < 0) p.y = h;
            if (p.y > h) p.y = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(212, 180, 140, ${p.alpha})`;
            ctx.fill();
        });

        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(212, 180, 140, ${0.025 * (1 - dist / 120)})`;
                    ctx.lineWidth = 0.4;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(draw);
    }
    draw();
}

/* ══════════════════════════════════════════
   SMOOTH SCROLL
   ══════════════════════════════════════════ */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(a.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

/* ══════════════════════════════════════════
   NAV SCROLL EFFECT
   ══════════════════════════════════════════ */
function initNavScrollEffect() {
    const nav = document.getElementById('main-nav');

    window.addEventListener('scroll', () => {
        const current = window.scrollY;
        if (current > 80) {
            nav.style.background = 'rgba(26,20,16,0.88)';
            nav.style.borderBottomColor = 'rgba(255,255,255,0.06)';
        } else {
            nav.style.background = 'rgba(26,20,16,0.65)';
            nav.style.borderBottomColor = 'rgba(255,255,255,0.04)';
        }
    }, { passive: true });
}

/* ══════════════════════════════════════════
   PARALLAX (GSAP ScrollTrigger)
   ══════════════════════════════════════════ */
function initParallax() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    // Hero content parallax
    gsap.to('.hero-content', {
        y: 100,
        opacity: 0.2,
        ease: 'none',
        scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 2
        }
    });

    // Scroll indicator fade
    gsap.to('.scroll-indicator', {
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
            trigger: '#hero',
            start: '8% top',
            end: '25% top',
            scrub: true
        }
    });

    // Year blocks — dynamic staggered entrance
    gsap.utils.toArray('.year-block').forEach((block) => {
        const label = block.querySelector('.year-label');
        const number = block.querySelector('.year-number');
        const line = block.querySelector('.year-line');
        const content = block.querySelector('.year-content');
        const photo = block.querySelector('.year-photo');

        // Year number scales in
        gsap.from(number, {
            scale: 0.3,
            opacity: 0,
            ease: 'back.out(1.7)',
            duration: 0.8,
            scrollTrigger: {
                trigger: block,
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });

        // Divider line expands from left
        gsap.from(line, {
            scaleX: 0,
            transformOrigin: 'left center',
            ease: 'power3.out',
            duration: 1,
            delay: 0.15,
            scrollTrigger: {
                trigger: block,
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });

        // Year name fades in from right
        if (label) {
            gsap.from(label.querySelector('.year-name'), {
                x: 30,
                opacity: 0,
                ease: 'power2.out',
                duration: 0.7,
                delay: 0.3,
                scrollTrigger: {
                    trigger: block,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            });
        }

        // Content card slides up with subtle scale
        gsap.from(content, {
            y: 40,
            opacity: 0,
            scale: 0.97,
            ease: 'power3.out',
            duration: 0.9,
            delay: 0.2,
            scrollTrigger: {
                trigger: block,
                start: 'top 82%',
                toggleActions: 'play none none none'
            }
        });

        const isReverse = block.classList.contains('reverse');

        // Photo card slides in from right (or left if reverse)
        if (photo) {
            gsap.from(photo, {
                x: isReverse ? -40 : 40,
                opacity: 0,
                scale: 0.97,
                ease: 'power3.out',
                duration: 0.9,
                delay: 0.35,
                scrollTrigger: {
                    trigger: block,
                    start: 'top 82%',
                    toggleActions: 'play none none none'
                }
            });
        }
    });

    // Letter section ambient glow
    gsap.to('.gift-ambient', {
        scale: 1.3,
        opacity: 1,
        ease: 'none',
        scrollTrigger: {
            trigger: '#letter',
            start: 'top bottom',
            end: 'center center',
            scrub: 2
        }
    });
}

/* ══════════════════════════════════════════
   LETTER TYPING EFFECT
   ══════════════════════════════════════════ */
function initLetterTyping() {
    const letterSection = document.getElementById('letter');
    const cursor = document.getElementById('letter-cursor');
    let started = false;

    // The letter content — each entry is [elementId, text]
    const letterParts = [
        ['letter-greeting', 'Querida Laura:'],
        ['letter-p1', 'Hoy celebramos algo que va mucho más allá de un título. Celebramos cada madrugada frente a la pantalla, cada problema que parecía imposible y que finalmente resolviste, y cada momento en el que, aunque te cuestionaste qué sentido tenía la carrera, elegiste seguir adelante.'],
        ['letter-p2', 'Todavía recuerdo tu primer suspenso en el parcial de Estadística, y esos días de Física en los que estuviste día y noche esforzándote para sacarla adelante. Recuerdo Cálculo, que fue la primera y última asignatura que te llevaste a septiembre; y esas veces en las que no solo no te enterabas de la clase, sino que te costaba tanto leer lo que ponía en la pizarra que te acababan doliendo los ojos.'],
        ['letter-p3', 'Tampoco me olvido de aquellos trabajos interminables y de las asignaturas tediosas de segundo año que no te dejaban descansar ni un minuto. O de la primera vez que conociste a Paco Madrid y el monumental enfado que te pillaste cuando no dejó a Susana repetir el examen, un suplicio que luego reviviste con la asignatura de tercero que él mismo impartía. Y cómo olvidar el cabreo con Mario por lo sucedido en la clase de Inglés.'],
        ['letter-p4', 'No obstante, no todo han sido momentos difíciles; también guardo un recuerdo precioso de tus alegrías. Me acuerdo del día que hiciste amigas en la universidad, de las quedadas con tu grupo para jugar a juegos de mesa, ir al cine o cotillear. Son inolvidables nuestros viajes juntos a Madrid, Valencia, Salamanca, Jaén y Cádiz... Y, por supuesto, las fiestas de fin de año en Sojo Ribera, en Hípico y en aquel local donde arrasamos con toda la comida habida y por haber.'],
        ['letter-p5', 'Tengo grabada tu primera feria vestida de flamenca: eras la mujer más guapa, ¡hasta te echaron piropos unas mujeres desde un coche! También me hace sonreír cuando descubriste y empezaste a jugar a The Binding of Isaac, o cuando conseguiste entrar en aquellas maravillosas prácticas en la Guardia Civil, donde no solo te invitaban a desayunar, sino que tenías tanto tiempo libre que prácticamente te pagaban por pasarte logros en los videojuegos. E incluso, en medio de todo esto, has aprendido a tocar la guitarra tan bien que ya vas a dar tu primer concierto.'],
        ['letter-p6', 'Han sido cuatro años de dedicación, esfuerzo y crecimiento los que te han traído hasta aquí. No ha sido un camino fácil, y precisamente por eso tiene tanto valor. Has demostrado una fortaleza y una determinación que te acompañarán siempre.'],
        ['letter-p7', 'El mundo necesita personas como tú: curiosas, perseverantes y con la capacidad de convertir las ideas en realidad. Estoy súper orgulloso de ti, de la mujer que eres y de todo lo que estás consiguiendo. Puedo decir, sin dudarlo, que soy una de las personas más afortunadas del mundo por estar con alguien tan impresionante y maravillosa como tú.'],
        ['letter-closing', 'Te amo muchísimo. ¡Felicidades, ingeniera!'],
        ['letter-signature', 'Javier Jesús Costa Ruiz-canela'],
    ];

    function typeText(elementId, text, charDelay) {
        return new Promise(resolve => {
            const el = document.getElementById(elementId);
            let i = 0;
            el.innerHTML = ''; // Clear content

            function typeChar() {
                if (i < text.length) {
                    // Si el cursor no está en el elemento (al inicio), lo añadimos.
                    if (cursor.parentNode !== el) {
                        el.appendChild(cursor);
                    }
                    // Insertar el nuevo carácter JUSTO ANTES del cursor, así el cursor nunca sale del DOM y sigue parpadeando.
                    el.insertBefore(document.createTextNode(text.charAt(i)), cursor);
                    i++;
                    const delay = charDelay + Math.random() * 15;
                    setTimeout(typeChar, delay);
                } else {
                    resolve();
                }
            }
            typeChar();
        });
    }

    async function startTyping() {
        if (started) return;
        started = true;

        cursor.classList.add('active');

        for (let i = 0; i < letterParts.length; i++) {
            const [id, text] = letterParts[i];
            // Greeting types slower, paragraphs faster, signature slower
            let speed;
            if (i === 0) speed = 40;             // Greeting — deliberate
            else if (i === letterParts.length - 1) speed = 50;  // Signature — slow, final
            else if (i === letterParts.length - 2) speed = 35;  // Closing — moderate
            else speed = 18;                      // Paragraphs — flowing

            await typeText(id, text, speed);

            // Pause between sections
            if (i < letterParts.length - 1) {
                await new Promise(r => setTimeout(r, 400));
            }
        }

        // Hide cursor after typing completes
        await new Promise(r => setTimeout(r, 1500));
        cursor.style.transition = 'opacity 0.6s ease';
        cursor.style.opacity = '0';
        await new Promise(r => setTimeout(r, 600));
        cursor.style.display = 'none';
    }

    // Trigger when letter section enters viewport
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(startTyping, 600);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    observer.observe(letterSection);
}

/* ══════════════════════════════════════════
   CELEBRATION — Elegant silver/gold particles
   ══════════════════════════════════════════ */
function initGiftCelebration() {
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    let confetti = [];
    let fired = false;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const colors = [
        'rgba(200, 200, 200,',
        'rgba(230, 230, 230,',
        'rgba(255, 255, 255,',
        'rgba(212, 197, 160,',
        'rgba(180, 180, 180,',
        'rgba(220, 210, 185,',
    ];

    function fire() {
        if (fired) return;
        fired = true;

        for (let i = 0; i < 50; i++) {
            confetti.push({
                x: canvas.width / 2 + (Math.random() - 0.5) * 300,
                y: canvas.height / 2,
                w: Math.random() * 5 + 2,
                h: Math.random() * 3 + 1,
                color: colors[Math.floor(Math.random() * colors.length)],
                vx: (Math.random() - 0.5) * 5,
                vy: Math.random() * -8 - 2,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 3,
                gravity: 0.1,
                alpha: 0.85,
                decay: 0.002 + Math.random() * 0.002
            });
        }
        animateConfetti();
    }

    function animateConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        confetti = confetti.filter(c => c.alpha > 0);

        confetti.forEach(c => {
            c.x += c.vx;
            c.vy += c.gravity;
            c.y += c.vy;
            c.rotation += c.rotationSpeed;
            c.alpha -= c.decay;
            c.vx *= 0.995;

            ctx.save();
            ctx.translate(c.x, c.y);
            ctx.rotate(c.rotation * Math.PI / 180);
            ctx.globalAlpha = Math.max(0, c.alpha);
            ctx.fillStyle = c.color + c.alpha + ')';
            ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
            ctx.restore();
        });

        if (confetti.length > 0) {
            requestAnimationFrame(animateConfetti);
        }
    }

    const letterSection = document.getElementById('letter');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(fire, 1200);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.4 });

    observer.observe(letterSection);
}

/* ══════════════════════════════════════════
   FLORAL DECOR — Continuous hearts & roses
   ══════════════════════════════════════════ */
function initFloralDecor() {
    const emojis = ['🌹', '❤️', '🌹', '❤️', '🌹', '❤️', '🥀', '🌹', '❤️', '💕'];
    const MAX_ACTIVE = 25;        // Max emojis visible at once
    const LIFETIME = 3000;        // How long each emoji lives (ms)
    const FADE_DURATION = 800;    // Fade-out transition time (ms)
    const SCROLL_COOLDOWN = 300;  // Min ms between scroll spawns
    const IDLE_INTERVAL = 1200;   // Spawn interval when not scrolling (ms)
    const BATCH_SCROLL = 3;       // Emojis per scroll event
    const BATCH_IDLE = 1;         // Emojis per idle tick

    let activeCount = 0;
    let lastScrollSpawn = 0;

    // Spawn a single emoji at a random screen-edge position
    function spawnEmoji() {
        if (activeCount >= MAX_ACTIVE) return;

        const el = document.createElement('span');
        el.className = 'floral-float';
        el.textContent = emojis[Math.floor(Math.random() * emojis.length)];

        // Position on screen edges only (left or right)
        let xPercent;
        if (Math.random() < 0.5) {
            xPercent = Math.random() * 8 + 1;     // Left 1-9%
        } else {
            xPercent = Math.random() * 8 + 91;    // Right 91-99%
        }

        const yPercent = Math.random() * 90 + 5;  // 5-95% of viewport
        const size = Math.random() * 1.4 + 0.9;   // 0.9rem – 2.3rem
        const drift = (Math.random() - 0.5) * 40; // Horizontal drift px

        el.style.left = xPercent + '%';
        el.style.top = yPercent + '%';
        el.style.fontSize = size + 'rem';
        el.style.setProperty('--drift', drift + 'px');

        document.body.appendChild(el);
        activeCount++;

        // Trigger the appear animation on next frame
        requestAnimationFrame(() => {
            el.classList.add('visible');
        });

        // After LIFETIME, fade out and remove
        setTimeout(() => {
            el.style.opacity = '0';
            el.style.transform = 'scale(0.5) translateY(-20px)';
            setTimeout(() => {
                el.remove();
                activeCount--;
            }, FADE_DURATION);
        }, LIFETIME);
    }

    // Spawn a batch of emojis
    function spawnBatch(count) {
        for (let i = 0; i < count; i++) {
            // Stagger slightly for natural feel
            setTimeout(() => spawnEmoji(), i * 120);
        }
    }

    // On scroll: spawn emojis (throttled)
    function onScroll() {
        const now = Date.now();
        if (now - lastScrollSpawn >= SCROLL_COOLDOWN) {
            lastScrollSpawn = now;
            spawnBatch(BATCH_SCROLL);
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    // Idle timer: continuously spawn even without scrolling
    setInterval(() => {
        spawnBatch(BATCH_IDLE);
    }, IDLE_INTERVAL);

    // Spawn an initial batch so the page isn't empty
    setTimeout(() => spawnBatch(5), 800);
}
