document.addEventListener('DOMContentLoaded', () => {
    
    // --- LÓGICA DEL NAVBAR ---
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- LÓGICA DEL BOTÓN FLOTANTE (FAB) ---
    const fabTrigger = document.getElementById('fab-trigger');
    const fabContainer = document.querySelector('.fab-container');

    if (fabTrigger && fabContainer) {
        fabTrigger.addEventListener('click', () => {
            fabContainer.classList.toggle('active');
        });

        // Cerrar si se hace clic fuera del botón
        document.addEventListener('click', (e) => {
            if (!fabContainer.contains(e.target)) {
                fabContainer.classList.remove('active');
            }
        });
    }

    // --- RESTO DE LÓGICA (Tabs, FAQ, 3D) ---
    // (Mantén el código de tabs y acordeones aquí...)
    
    // FAQ
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const header = item.querySelector('.faq-header');
        header.addEventListener('click', () => {
            const currentlyActive = document.querySelector('.faq-item.active');
            if (currentlyActive && currentlyActive !== item) {
                currentlyActive.classList.remove('active');
                currentlyActive.querySelector('.faq-body').style.height = 0;
            }
            const body = item.querySelector('.faq-body');
            if (item.classList.contains('active')) {
                item.classList.remove('active');
                body.style.height = 0;
            } else {
                item.classList.add('active');
                body.style.height = body.scrollHeight + 'px';
            }
        });
    });

    // TABS
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetId = e.currentTarget.getAttribute('data-target');
            tabContents.forEach(content => {
                content.style.display = 'none';
                content.classList.remove('active');
            });
            tabBtns.forEach(b => b.classList.remove('active'));
            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                targetContent.style.display = 'block';
                setTimeout(() => { targetContent.classList.add('active'); }, 10);
            }
            e.currentTarget.classList.add('active');
        });
    });

    // 3D LOGO
    const heroSection = document.getElementById('hero-section');
    const logo3D = document.getElementById('hero-logo-3d');

    if (heroSection && logo3D) {
        heroSection.addEventListener('mousemove', (e) => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            
            const x = e.clientX;
            const y = e.clientY;
            
            // ANTES: * 30 (Muy exagerado)
            // AHORA: * 10 (Sutil y elegante)
            const xRotation = (x / width - 0.5) * 10; 
            const yRotation = (y / height - 0.5) * -10; 
            
            logo3D.style.transform = `perspective(1000px) rotateX(${yRotation}deg) rotateY(${xRotation}deg)`;
        });

        heroSection.addEventListener('mouseleave', () => {
             // Regresa suavemente al centro
             logo3D.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
        });
    }
});