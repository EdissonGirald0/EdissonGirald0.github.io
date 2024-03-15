document.addEventListener("DOMContentLoaded", function () {
    var navLinks = document.querySelectorAll('header nav a, footer nav a');
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
});
