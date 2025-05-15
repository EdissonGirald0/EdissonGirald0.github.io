document.addEventListener("DOMContentLoaded", function () {
    const navToggleButton = document.getElementById('footer-nav-toggle');
    const navContent = document.getElementById('footer-nav-content');

    const contactToggleButton = document.getElementById('footer-contact-toggle');
    const contactContent = document.getElementById('footer-contact-content');

    // Función para cerrar todos los paneles abiertos excepto el especificado
    function closeOtherPanels(currentPanel) {
        if (currentPanel !== navContent && navContent.style.display === 'block') {
            navContent.style.display = 'none';
            navToggleButton.setAttribute('aria-expanded', 'false');
        }
        if (currentPanel !== contactContent && contactContent.style.display === 'block') {
            contactContent.style.display = 'none';
            contactToggleButton.setAttribute('aria-expanded', 'false');
        }
    }

    if (navToggleButton && navContent) {
        navToggleButton.addEventListener('click', function () {
            const isNavVisible = navContent.style.display === 'block';
            closeOtherPanels(navContent); // Cierra otros paneles antes de abrir/cerrar este
            navContent.style.display = isNavVisible ? 'none' : 'block';
            navToggleButton.setAttribute('aria-expanded', !isNavVisible);
        });
    }

    if (contactToggleButton && contactContent) {
        contactToggleButton.addEventListener('click', function () {
            const isContactVisible = contactContent.style.display === 'block';
            closeOtherPanels(contactContent); // Cierra otros paneles antes de abrir/cerrar este
            contactContent.style.display = isContactVisible ? 'none' : 'block';
            contactToggleButton.setAttribute('aria-expanded', !isContactVisible);
        });
    }

    // Opcional: Cerrar los paneles si se hace clic fuera de ellos
    document.addEventListener('click', function(event) {
        const isClickInsideNavToggle = navToggleButton && navToggleButton.contains(event.target);
        const isClickInsideNavContent = navContent && navContent.contains(event.target);
        const isClickInsideContactToggle = contactToggleButton && contactToggleButton.contains(event.target);
        const isClickInsideContactContent = contactContent && contactContent.contains(event.target);

        if (!isClickInsideNavToggle && !isClickInsideNavContent && 
            !isClickInsideContactToggle && !isClickInsideContactContent) {
            if (navContent && navContent.style.display === 'block') {
                navContent.style.display = 'none';
                navToggleButton.setAttribute('aria-expanded', 'false');
            }
            if (contactContent && contactContent.style.display === 'block') {
                contactContent.style.display = 'none';
                contactToggleButton.setAttribute('aria-expanded', 'false');
            }
        }
    });
});