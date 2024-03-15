document.addEventListener("DOMContentLoaded", function () {
    var navLinks = document.querySelectorAll('header nav a, footer nav a');
    var headerTitle = document.querySelector('header h1'); // Selecciona el título del encabezado
    
    navLinks.forEach(function (link) {
        link.addEventListener('click', function (event) {
            // Verificar si el enlace es interno o externo
            var href = this.getAttribute('href');
            if (href && href.charAt(0) === '#') {
                // Enlace interno: desplazamiento suave
                event.preventDefault();
                var target = href.substring(1);
                document.getElementById(target).scrollIntoView({
                    behavior: 'smooth'
                });
                // Agregar la clase 'selected' al enlace activo
                var current = document.getElementsByClassName('selected');
                if (current.length > 0) {
                    current[0].classList.remove('selected');
                }
                this.classList.add('selected');
            } else {
                // Enlace externo: abrir en una nueva pestaña
                this.setAttribute('target', '_blank');
            }
        });
    });

    // Detectar el evento de desplazamiento de la ventana
    window.addEventListener('scroll', function () {
        // Verificar si la sección "Quién soy" está en la vista
        if (isSectionInView(document.getElementById('quien-soy'))) {
            // Ocultar el título del encabezado
            headerTitle.style.display = 'none';
        } else {
            // Mostrar el título del encabezado
            headerTitle.style.display = 'block';
        }
    });

    // Función para verificar si una sección está en la vista
    function isSectionInView(section) {
        var rect = section.getBoundingClientRect();
        var windowHeight = window.innerHeight || document.documentElement.clientHeight;
        var topThreshold = 0.2; // Umbral superior (20%)
        var bottomThreshold = 0.8; // Umbral inferior (80%)
        return rect.top <= windowHeight * bottomThreshold && rect.bottom >= windowHeight * topThreshold;
    }
});
