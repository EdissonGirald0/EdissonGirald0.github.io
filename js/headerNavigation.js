document.addEventListener('DOMContentLoaded', function () {
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');
    let inactivityTimer = null;
    const INACTIVITY_TIMEOUT = 5000; // 5 segundos

    function startInactivityTimer() {
        clearTimeout(inactivityTimer);
        inactivityTimer = setTimeout(() => {
            if (mainNav.classList.contains('nav-visible')) {
                mainNav.classList.remove('nav-visible');
            }
        }, INACTIVITY_TIMEOUT);
    }

    function resetInactivityTimer() {
        if (mainNav.classList.contains('nav-visible')) {
            startInactivityTimer();
        }
    }

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function () {
            const isVisible = mainNav.classList.toggle('nav-visible');
            if (isVisible) {
                startInactivityTimer();
            } else {
                clearTimeout(inactivityTimer);
            }
        });

        // Reiniciar el temporizador con la interacción dentro del menú
        mainNav.addEventListener('mousemove', resetInactivityTimer);
        mainNav.addEventListener('click', resetInactivityTimer); // También al hacer clic dentro
        // Considerar 'focusin' si hay elementos focuseables como inputs dentro del nav
        // mainNav.addEventListener('focusin', resetInactivityTimer);
        // Considerar 'keydown' si se quiere reiniciar con el uso del teclado dentro del nav
        // mainNav.addEventListener('keydown', resetInactivityTimer);
    }

    // Opcional: Detener el temporizador si el puntero sale del menú y reiniciarlo si vuelve a entrar
    // Esto es útil si el usuario simplemente mueve el mouse fuera temporalmente
    // mainNav.addEventListener('mouseleave', () => {
    //     if (mainNav.classList.contains('nav-visible')) {
    //         clearTimeout(inactivityTimer); // Podrías querer solo pausar o manejarlo diferente
    //     }
    // });
    // mainNav.addEventListener('mouseenter', resetInactivityTimer);
}); 