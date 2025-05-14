function adjustMainContentPadding() {
    const header = document.getElementById('pageHeader');
    const mainContent = document.getElementById('mainContent');

    if (header && mainContent) {
        if (header.style.display === 'none' || getComputedStyle(header).display === 'none') {
            // Si el header está explícitamente oculto (display: none), no se necesita padding.
            mainContent.style.paddingTop = '0px';
        } else {
            const headerHeight = header.offsetHeight;
            mainContent.style.paddingTop = headerHeight + 'px';
        }
    }
}

// Hacerla global para que pueda ser llamada desde el script inline en index.html
window.adjustMainContentPaddingGlobal = adjustMainContentPadding;

document.addEventListener('DOMContentLoaded', function() {
    // Ajuste inicial al cargar el DOM
    // Es importante que esto se ejecute DESPUÉS de que handleOrientationChange haya podido correr,
    // ya que handleOrientationChange también se ejecuta al cargar y puede cambiar el display del header.
    // Por ello, handleOrientationChange ya llama a adjustMainContentPaddingGlobal.
    // Pero lo dejamos aquí también por si el script de orientación no existe o falla.
    adjustMainContentPadding(); 

    // Ajustar al redimensionar la ventana
    window.addEventListener('resize', adjustMainContentPadding);
}); 