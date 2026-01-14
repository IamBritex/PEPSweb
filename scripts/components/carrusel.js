document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.carousel-track');
    const prevButton = document.querySelector('.prev-btn');
    const nextButton = document.querySelector('.next-btn');
    const dotsNav = document.querySelector('.carousel-dots');
    
    if (!track || !prevButton || !nextButton) return;

    const slides = Array.from(track.children);
    let currentIndex = 0;
    
    // Variables para Swipe
    let touchStartX = 0;
    let touchEndX = 0;

    // Función Vibración
    const vibrate = () => {
        if (navigator.vibrate) navigator.vibrate(40);
    };

    // Crear Dots
    const createDots = () => {
        dotsNav.innerHTML = '';
        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.ariaLabel = `Ir a slide ${index + 1}`;
            dotsNav.appendChild(dot);
        });
    };

    createDots();
    let dots = Array.from(dotsNav.children);

    const getSlideWidth = () => {
        return slides[0].getBoundingClientRect().width;
    };

    // Determinar cuántos slides son visibles
    const getVisibleSlides = () => {
        if (window.innerWidth >= 1024) return 3;
        if (window.innerWidth >= 700) return 2;
        return 1;
    };

    // --- LÓGICA DE MOVIMIENTO ---
    const moveToSlide = (index) => {
        const visibleSlides = getVisibleSlides();
        const maxIndex = slides.length - visibleSlides;

        // Bucle Infinito Lógica:
        // Si el índice es mayor al máximo posible, volvemos al inicio (0)
        if (index > maxIndex) {
            index = 0;
        }
        // Si el índice es menor a 0, vamos al final
        if (index < 0) {
            index = maxIndex;
        }

        const slideWidth = getSlideWidth();
        track.style.transform = `translateX(-${slideWidth * index}px)`;
        
        // Actualizar dots
        dots.forEach(d => d.classList.remove('active'));
        if(dots[index]) dots[index].classList.add('active');
        
        currentIndex = index;
        
        // Ya NO deshabilitamos botones, siempre activos para el bucle
        updateControlsVisibility(); 
        
        vibrate();
    };

    // Ocultar controles si TODO el contenido cabe en pantalla
    const updateControlsVisibility = () => {
        const visibleSlides = getVisibleSlides();
        
        if (slides.length <= visibleSlides) {
            // Ocultar todo si no hay nada que scrollear
            dotsNav.style.display = 'none';
            prevButton.style.display = 'none';
            nextButton.style.display = 'none';
            if (currentIndex !== 0) {
                track.style.transform = `translateX(0px)`;
                currentIndex = 0;
            }
        } else {
            // Mostrar si hay contenido extra
            dotsNav.style.display = 'flex';
            prevButton.style.display = 'flex';
            nextButton.style.display = 'flex';
            
            // Aseguramos que los botones estén habilitados para el bucle
            prevButton.disabled = false;
            nextButton.disabled = false;
            prevButton.style.opacity = '1';
            nextButton.style.opacity = '1';
            
            // Ocultar dots inalcanzables (opcional de limpieza)
            const maxIndex = slides.length - visibleSlides;
            dots.forEach((dot, index) => {
                dot.style.display = (index > maxIndex) ? 'none' : 'block';
            });
        }
    };

    // --- EVENT LISTENERS BOTONES ---
    nextButton.addEventListener('click', () => {
        moveToSlide(currentIndex + 1);
    });

    prevButton.addEventListener('click', () => {
        moveToSlide(currentIndex - 1);
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            moveToSlide(index);
        });
    });

    // --- EVENT LISTENERS TOUCH (SWIPE) ---
    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    const handleSwipe = () => {
        // Umbral mínimo para considerar swipe (50px)
        const threshold = 50;
        
        if (touchEndX < touchStartX - threshold) {
            // Swipe Izquierda -> Siguiente
            moveToSlide(currentIndex + 1);
        }
        
        if (touchEndX > touchStartX + threshold) {
            // Swipe Derecha -> Anterior
            moveToSlide(currentIndex - 1);
        }
    };

    // --- RESIZE ---
    window.addEventListener('resize', () => {
        updateControlsVisibility();
        // Recalcular posición para que no se desajuste el transform
        const slideWidth = getSlideWidth();
        track.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
    });

    // Inicializar
    updateControlsVisibility();
});