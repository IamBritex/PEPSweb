document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.carousel-track');
    const prevButton = document.querySelector('.prev-btn');
    const nextButton = document.querySelector('.next-btn');
    const dotsNav = document.querySelector('.carousel-dots');
    
    if (!track || !prevButton || !nextButton) return;

    const slides = Array.from(track.children);
    let currentIndex = 0;
    
    // Función para vibrar (Haptic Feedback)
    const vibrate = () => {
        // Verifica si el navegador soporta vibración
        if (navigator.vibrate) {
            navigator.vibrate(40); // Vibra 40ms (suave)
        }
    };

    // Crear Dots (Indicadores)
    const createDots = () => {
        dotsNav.innerHTML = ''; // Limpiar dots existentes
        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.ariaLabel = `Ir a slide ${index + 1}`;
            dotsNav.appendChild(dot);
        });
    };

    // Inicializar dots
    createDots();
    let dots = Array.from(dotsNav.children);

    const getSlideWidth = () => {
        return slides[0].getBoundingClientRect().width;
    };

    const moveToSlide = (index) => {
        const slideWidth = getSlideWidth();
        track.style.transform = `translateX(-${slideWidth * index}px)`;
        
        // Actualizar dots
        dots.forEach(d => d.classList.remove('active'));
        if(dots[index]) dots[index].classList.add('active');
        
        currentIndex = index;
        updateControls();
        
        // VIBRAR AL MOVER
        vibrate();
    };

    // Determinar cuántos slides son visibles según el ancho de pantalla
    const getVisibleSlides = () => {
        if (window.innerWidth >= 1024) return 3;
        if (window.innerWidth >= 700) return 2;
        return 1;
    };

    // Lógica para ocultar/mostrar controles según si caben todos los elementos
    const updateControls = () => {
        const visibleSlides = getVisibleSlides();
        const maxIndex = slides.length - visibleSlides;

        // 1. Ocultar TODOS los controles si las tarjetas caben en pantalla
        // (Ej: Tenemos 3 tarjetas y estamos en desktop viendo 3)
        if (slides.length <= visibleSlides) {
            dotsNav.style.display = 'none';
            prevButton.style.display = 'none';
            nextButton.style.display = 'none';
            // Asegurar que esté en la posición 0 si cambiamos de tamaño
            if (currentIndex !== 0) {
                track.style.transform = `translateX(0px)`;
                currentIndex = 0;
            }
            return; // Salimos de la función
        } else {
            // Si hay más tarjetas que espacio, mostramos controles
            dotsNav.style.display = 'flex';
            prevButton.style.display = 'flex';
            nextButton.style.display = 'flex';
        }

        // 2. Estado de los botones (Deshabilitar extremos)
        if (currentIndex === 0) {
            prevButton.disabled = true;
            prevButton.style.opacity = '0.3';
        } else {
            prevButton.disabled = false;
            prevButton.style.opacity = '1';
        }

        if (currentIndex >= maxIndex) {
            nextButton.disabled = true;
            nextButton.style.opacity = '0.3';
        } else {
            nextButton.disabled = false;
            nextButton.style.opacity = '1';
        }
        
        // 3. Ocultar dots que no sean alcanzables (opcional, limpieza visual)
        dots.forEach((dot, index) => {
            if (index > maxIndex) {
                dot.style.display = 'none';
            } else {
                dot.style.display = 'block';
            }
        });
    };

    // Event Listeners
    nextButton.addEventListener('click', () => {
        const visibleSlides = getVisibleSlides();
        const maxIndex = slides.length - visibleSlides;
        
        if (currentIndex < maxIndex) {
            moveToSlide(currentIndex + 1);
        }
    });

    prevButton.addEventListener('click', () => {
        if (currentIndex > 0) {
            moveToSlide(currentIndex - 1);
        }
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            const visibleSlides = getVisibleSlides();
            const maxIndex = slides.length - visibleSlides;
            let targetIndex = index;
            if (targetIndex > maxIndex) targetIndex = maxIndex;
            
            moveToSlide(targetIndex);
        });
    });

    // Resize
    window.addEventListener('resize', () => {
        // Recalcular visibilidad de dots/flechas
        updateControls();
        // Ajustar posición del track
        const slideWidth = getSlideWidth();
        track.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
    });

    // Inicializar
    updateControls();
});