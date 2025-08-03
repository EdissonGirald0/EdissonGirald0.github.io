// Script para probar responsive design
document.addEventListener('DOMContentLoaded', function() {
    console.log('Responsive Test Loaded');
    
    // Función para log de breakpoints
    function logBreakpoint() {
        const width = window.innerWidth;
        let breakpoint = '';
        
        if (width <= 480) {
            breakpoint = 'Extra Small (≤480px)';
        } else if (width <= 774) {
            breakpoint = 'Small (481px-774px)';
        } else if (width <= 950) {
            breakpoint = 'Medium (775px-950px)';
        } else if (width <= 1199) {
            breakpoint = 'Large (951px-1199px)';
        } else {
            breakpoint = 'Extra Large (≥1200px)';
        }
        
        console.log(`Current breakpoint: ${breakpoint} (${width}px)`);
        
        // Verificar elementos problemáticos
        const container = document.querySelector('.container');
        const section = document.querySelector('.section');
        const portfolioOffer = document.querySelector('.portfolio-offer');
        const footer = document.querySelector('.footer-icon-bar');
        
        if (container) {
            console.log('Container width:', getComputedStyle(container).width);
            console.log('Container max-width:', getComputedStyle(container).maxWidth);
        }
        
        if (section) {
            console.log('Section width:', getComputedStyle(section).width);
            console.log('Section max-width:', getComputedStyle(section).maxWidth);
        }
        
        if (portfolioOffer) {
            console.log('Portfolio offer width:', getComputedStyle(portfolioOffer).width);
            console.log('Portfolio offer max-width:', getComputedStyle(portfolioOffer).maxWidth);
        }
        
        if (footer) {
            console.log('Footer width:', getComputedStyle(footer).width);
            console.log('Footer max-width:', getComputedStyle(footer).maxWidth);
        }
    }
    
    // Log inicial
    logBreakpoint();
    
    // Log al redimensionar
    window.addEventListener('resize', logBreakpoint);
    
    // Función para simular diferentes tamaños de pantalla
    window.testBreakpoints = function() {
        const breakpoints = [375, 480, 768, 850, 1024, 1200, 1400];
        let index = 0;
        
        const interval = setInterval(() => {
            if (index < breakpoints.length) {
                // En un entorno real, esto cambiaría el viewport
                console.log(`\n--- Testing breakpoint: ${breakpoints[index]}px ---`);
                
                // Simular el ancho
                Object.defineProperty(window, 'innerWidth', {
                    writable: true,
                    configurable: true,
                    value: breakpoints[index]
                });
                
                logBreakpoint();
                index++;
            } else {
                clearInterval(interval);
                console.log('\n--- Breakpoint testing complete ---');
            }
        }, 2000);
    };
    
    // Test automático después de 3 segundos
    setTimeout(() => {
        console.log('\n=== Starting automatic breakpoint test ===');
        // window.testBreakpoints();
    }, 3000);
});

// Función para detectar problemas de overflow
function detectOverflow() {
    const elements = document.querySelectorAll('*');
    const problems = [];
    
    elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const style = getComputedStyle(el);
        
        if (rect.width > window.innerWidth && style.overflow !== 'hidden' && style.overflowX !== 'hidden') {
            problems.push({
                element: el,
                width: rect.width,
                windowWidth: window.innerWidth,
                tagName: el.tagName,
                className: el.className
            });
        }
    });
    
    if (problems.length > 0) {
        console.warn('Overflow problems detected:', problems);
    } else {
        console.log('No overflow problems detected');
    }
    
    return problems;
}

// Exportar función para uso manual
window.detectOverflow = detectOverflow;

// Detectar overflow cada 5 segundos
setInterval(detectOverflow, 5000);
