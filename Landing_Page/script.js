class DisplayModeController {
    constructor() {
        this.mode = localStorage.getItem('mode') || 'light';
        this.toggleBtn = document.getElementById('themeToggle');
        this.icon = document.getElementById('themeIcon');
        this.initialize();
    }

    initialize() {
        this.applyMode(this.mode);
        this.toggleBtn.addEventListener('click', () => this.switchMode());
        window.addEventListener('load', () => {
            document.body.style.transition = 'color 0.25s, background-color 0.25s';
        });
    }

    applyMode(mode) {
        this.mode = mode;
        document.documentElement.dataset.theme = mode;
        localStorage.setItem('mode', mode);
        this.icon.className = mode === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
        this.animateClick();
    }

    switchMode() {
        this.applyMode(this.mode === 'light' ? 'dark' : 'light');
    }

    animateClick() {
        this.toggleBtn.style.scale = '0.92';
        setTimeout(() => {
            this.toggleBtn.style.scale = '1';
        }, 120);
    }
}

class UIEffects {
    constructor() {
        this.setupReveal();
        this.enableHovering();
        this.attachParallax();
    }

    setupReveal() {
        const opts = { threshold: 0.15, rootMargin: '0px 0px -40px' };
        const appear = new IntersectionObserver((items) => {
            items.forEach(i => {
                if (i.isIntersecting) {
                    i.target.style.opacity = '1';
                    i.target.style.translate = '0 0';
                }
            });
        }, opts);

        document.querySelectorAll('.feature-card, .indicator, .badge').forEach(el => {
            el.style.opacity = '0';
            el.style.translate = '0 25px';
            el.style.transition = 'opacity 0.5s, translate 0.5s';
            appear.observe(el);
        });
    }

    enableHovering() {
        document.querySelectorAll('.feature-card').forEach(card => {
            card.onmouseenter = () => card.style.transform = 'translateY(-6px) scale(1.015)';
            card.onmouseleave = () => card.style.transform = 'translateY(0) scale(1)';
        });

        document.querySelectorAll('.cta-button, .login-btn').forEach(btn => {
            btn.onmouseenter = () => btn.style.boxShadow = '0 6px 18px rgba(59,130,246,0.35)';
            btn.onmouseleave = () => btn.style.boxShadow = '0 3px 10px rgba(59,130,246,0.15)';
        });
    }

    attachParallax() {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            document.querySelectorAll('.bg-decoration').forEach((el, i) => {
                const offset = 0.4 + i * 0.15;
                el.style.transform = `translateY(${scrollY * offset}px)`;
            });
        });
    }
}

function enableSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

function headerBehaviorOnScroll() {
    const nav = document.querySelector('.header');
    let prevScroll = window.scrollY;

    window.addEventListener('scroll', () => {
        const curr = window.scrollY;

        if (curr > 100) {
            const bg = getComputedStyle(document.documentElement).getPropertyValue('--bg-primary').trim() + 'e0';
            nav.style.background = bg;
            nav.style.boxShadow = '0 2px 15px rgba(0,0,0,0.08)';
        } else {
            nav.style.background = 'rgba(255,255,255,0.75)';
            nav.style.boxShadow = 'none';
        }

        nav.style.transform = (curr > prevScroll && curr > 150) ? 'translateY(-100%)' : 'translateY(0)';
        prevScroll = curr;
    });
}

function optimizePerformance() {
    if ('IntersectionObserver' in window) {
        const imgObs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imgObs.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => imgObs.observe(img));
    }

    let debounce;
    const existingHandler = window.onscroll;
    window.addEventListener('scroll', () => {
        if (debounce) clearTimeout(debounce);
        debounce = setTimeout(() => {
            if (existingHandler) existingHandler();
        }, 12);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    new DisplayModeController();
    new UIEffects();
    enableSmoothAnchors();
    headerBehaviorOnScroll();
    optimizePerformance();
    setTimeout(() => document.body.classList.add('loaded'), 80);
});

document.addEventListener('visibilitychange', () => {
    document.body.style.animationPlayState = document.hidden ? 'paused' : 'running';
});

window.addEventListener('error', (e) => {
    console.warn('Caught error:', e.error);
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') document.body.classList.add('keyboard-mode');
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-mode');
});

window.CollabHub = {
    handleLogin,
    handleGetStarted,
    DisplayModeController,
    UIEffects
};
