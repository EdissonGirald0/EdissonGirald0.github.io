document.addEventListener("DOMContentLoaded", function () {
    var toggleButton = document.getElementById('contact-info-toggle');
    var detailsSection = document.getElementById('contact-info-details');
    var toggleIcon = document.getElementById('toggle-icon');

    toggleButton.addEventListener('click', function () {
        if (detailsSection.style.display === 'none') {
            detailsSection.style.display = 'block';
            toggleIcon.classList.remove('fa-angle-down');
            toggleIcon.classList.add('fa-angle-up');
        } else {
            detailsSection.style.display = 'none';
            toggleIcon.classList.remove('fa-angle-up');
            toggleIcon.classList.add('fa-angle-down');
        }
    });
});