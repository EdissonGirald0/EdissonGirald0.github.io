document.addEventListener('DOMContentLoaded', function () {
    const themeToggleButton = document.getElementById('theme-toggle-button');
    const body = document.body;
    const themeIcon = themeToggleButton ? themeToggleButton.querySelector('i') : null;

    const K_THEME_KEY = 'themePreference';
    const K_LIGHT_THEME_CLASS = 'light-theme';
    const K_ICON_SUN = 'fa-sun';
    const K_ICON_MOON = 'fa-moon';

    function applyTheme(theme) {
        if (theme === K_LIGHT_THEME_CLASS) {
            body.classList.add(K_LIGHT_THEME_CLASS);
            if (themeIcon) themeIcon.classList.replace(K_ICON_MOON, K_ICON_SUN); 
        } else {
            body.classList.remove(K_LIGHT_THEME_CLASS);
            if (themeIcon) themeIcon.classList.replace(K_ICON_SUN, K_ICON_MOON);
        }
    }

    function toggleTheme() {
        const isLightTheme = body.classList.contains(K_LIGHT_THEME_CLASS);
        const newTheme = isLightTheme ? 'dark' : K_LIGHT_THEME_CLASS;
        applyTheme(newTheme);
        localStorage.setItem(K_THEME_KEY, newTheme);
    }

    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', toggleTheme);
    }

    // Cargar el tema guardado al iniciar
    const savedTheme = localStorage.getItem(K_THEME_KEY);
    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        // Opcional: detectar preferencia del sistema si no hay nada guardado
        // if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        //     applyTheme(K_LIGHT_THEME_CLASS);
        // }
        // Por defecto, el tema oscuro se aplica si no hay clase light-theme y no hay preferencia guardada
        // Así que, si no hay savedTheme, y el default es oscuro, el ícono debe ser luna.
        if (!body.classList.contains(K_LIGHT_THEME_CLASS) && themeIcon) {
             themeIcon.classList.replace(K_ICON_SUN, K_ICON_MOON);
        }
    }
}); 