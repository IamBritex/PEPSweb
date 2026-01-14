document.addEventListener('DOMContentLoaded', () => {
    const heroSection = document.getElementById('hero-section');
    const heroImg = document.getElementById('hero-logo-3d');

    // Si no existen los elementos, no hacemos nada
    if (!heroSection || !heroImg) return;

    // --- VARIABLES DE ESTADO ---
    let currentX = 0; // Posición actual (suavizada)
    let currentY = 0;
    let targetX = 0;  // Posición objetivo (mouse o giroscopio)
    let targetY = 0;
    
    // Factor de suavizado (0.1 = muy suave, 0.9 = muy rápido)
    const smoothing = 0.1; 
    
    // Límite máximo de rotación en grados
    const limit = 15; 

    // --- DETECCIÓN DE MOUSE (Escritorio) ---
    heroSection.addEventListener('mousemove', (e) => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        // Calculamos posición relativa del mouse (-0.5 a 0.5)
        const mouseX = (e.clientX / width) - 0.5;
        const mouseY = (e.clientY / height) - 0.5;

        // Asignamos el objetivo
        targetY = mouseX * limit * 2; // Rotación en eje Y (Izquierda/Derecha)
        targetX = mouseY * limit * -2; // Rotación en eje X (Arriba/Abajo) - Invertido
    });

    // Resetear al salir el mouse
    heroSection.addEventListener('mouseleave', () => {
        targetX = 0;
        targetY = 0;
    });

    // --- DETECCIÓN DE GIROSCOPIO (Móvil) ---
    // Nota: Requiere HTTPS y en iOS a veces requiere permiso explícito (botón),
    // pero este es el estándar para Android y web moderna.
    const handleOrientation = (event) => {
        // Beta: Inclinación frontal/trasera (-180 a 180)
        // Gamma: Inclinación izquierda/derecha (-90 a 90)
        let beta = event.beta; 
        let gamma = event.gamma;

        // Ajuste para posición natural de sostener el celular (aprox 45 grados)
        // Si no restamos 45, el usuario tendría que tener el celular plano sobre la mesa.
        if (beta) beta -= 45;

        // Limitamos los valores para que no de vueltas completas
        if (beta > limit) beta = limit;
        if (beta < -limit) beta = -limit;
        if (gamma > limit) gamma = limit;
        if (gamma < -limit) gamma = -limit;

        if (beta && gamma) {
            targetX = -beta; // Invertimos para efecto natural
            targetY = gamma;
        }
    };

    // Agregamos el listener del giroscopio
    if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', handleOrientation);
    }

    // --- BUCLE DE ANIMACIÓN (Render Loop) ---
    // Esto corre a 60fps para interpolar valores y lograr suavidad extrema
    const animate = () => {
        // Interpolación Lineal (Lerp): Moverse un 10% hacia el objetivo en cada frame
        currentX += (targetX - currentX) * smoothing;
        currentY += (targetY - currentY) * smoothing;

        // Aplicar transformación
        // 'perspective' debe coincidir con tu CSS
        heroImg.style.transform = `perspective(1000px) rotateX(${currentX.toFixed(2)}deg) rotateY(${currentY.toFixed(2)}deg)`;

        // Solicitar siguiente frame
        requestAnimationFrame(animate);
    };

    // Iniciar animación
    animate();
});