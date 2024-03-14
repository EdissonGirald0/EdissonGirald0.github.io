// navigation.js
document.addEventListener("DOMContentLoaded", function () {
    var navLinks = document.querySelectorAll('header nav a, footer nav a');
    navLinks.forEach(function (link) {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            var current = document.getElementsByClassName('selected');
            current[0].className = current[0].className.replace(' selected', '');
            this.className += ' selected';
            var target = this.getAttribute('href').substring(1);
            document.getElementById(target).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});
