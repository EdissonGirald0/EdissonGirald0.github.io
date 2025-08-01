class ParticleSystem {
    constructor() {
        this.particles = [];
        this.canvas = null;
        this.ctx = null;
        this.animationId = null;
        this.isRunning = false;
        this.explosions = [];
        
        // Configuración de partículas
        this.config = {
            maxParticles: 200, // Más partículas para mejor conectividad
            explosionInterval: 1200, // Explosión cada 1.2 segundos
            particleLife: 5000, // Vida de partícula en ms
            explosionParticles: 15, // Más partículas por explosión
            baseSize: 1.0, // Tamaño base aumentado para mejor visibilidad
            maxSize: 2.5, // Tamaño máximo aumentado
            connectionDistance: 100, // Mayor distancia para más conexiones
            lineOpacity: 0.4, // Líneas más visibles
            chainExplosionChance: 0.6, // Mayor probabilidad de explosión en cadena
            chainExplosionRadius: 80, // Mayor radio para explosiones en cadena
            subdivisionChance: 0.3, // Probabilidad de que una partícula se subdivida
            subdivisionInterval: 1000, // Intervalo para subdivisión
            rotationSpeed: 0.02, // Velocidad de rotación
            maxConnections: 4, // Máximo conexiones por partícula
            lineWidth: 0.6, // Líneas más gruesas para mejor contraste
        };
        
        this.init();
    }
    
    init() {
        this.createCanvas();
        this.setupEventListeners();
        this.start();
    }
    
    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'particles-canvas';
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '-1'; // Debajo de todos los elementos
        this.canvas.style.opacity = '1.0'; // Aumentar opacidad base
        
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        
        this.resize();
    }
    
    setupEventListeners() {
        window.addEventListener('resize', () => this.resize());
        
        // Escuchar cambios de tema
        const observer = new MutationObserver(() => {
            this.updateParticleColors();
        });
        
        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ['class']
        });
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    getThemeColors() {
        const isLight = document.body.classList.contains('light-theme');
        
        if (isLight) {
            return {
                primary: '#0066ff', // Azul más saturado
                secondary: '#003d99', // Azul más oscuro
                accent: '#0099cc', // Cian más vibrante
                light: '#4d79a4', // Gris azulado más intenso
                spark: '#ff9500' // Naranja más vibrante
            };
        } else {
            return {
                primary: '#00ffff', // Cian más puro
                secondary: '#00e6e6', // Cian brillante
                accent: '#00ccff', // Azul cian
                light: '#66b3ff', // Azul claro más brillante
                spark: '#ffff00' // Amarillo más intenso
            };
        }
    }
    
    updateParticleColors() {
        const colors = this.getThemeColors();
        this.particles.forEach(particle => {
            if (particle.type === 'spark') {
                particle.color = colors.spark;
            } else {
                const colorKeys = ['primary', 'secondary', 'accent', 'light'];
                particle.color = colors[colorKeys[Math.floor(Math.random() * colorKeys.length)]];
            }
        });
    }
    
    createExplosion(x, y, isChainExplosion = false) {
        const colors = this.getThemeColors();
        const colorKeys = ['primary', 'secondary', 'accent', 'light'];
        
        // Más partículas para explosiones en cadena
        const particleCount = isChainExplosion ? 
            Math.floor(this.config.explosionParticles * 0.8) : 
            this.config.explosionParticles;
        
        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 / particleCount) * i + Math.random() * 0.8;
            const speed = Math.random() * 3.5 + 1.2;
            const size = Math.random() * (this.config.maxSize - this.config.baseSize) + this.config.baseSize;
            
            // Crear partícula de explosión
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: size,
                life: this.config.particleLife,
                maxLife: this.config.particleLife,
                color: colors[colorKeys[Math.floor(Math.random() * colorKeys.length)]],
                type: 'explosion',
                decay: 0.985,
                connections: [], // Array para almacenar conexiones
                rotation: Math.random() * Math.PI * 2, // Ángulo de rotación inicial
                rotationSpeed: (Math.random() - 0.5) * this.config.rotationSpeed,
                subdivisionTimer: Math.random() * this.config.subdivisionInterval,
                hasSubdivided: false
            });
            
            // Crear chispas adicionales
            if (Math.random() < 0.5) {
                this.particles.push({
                    x: x + (Math.random() - 0.5) * 20,
                    y: y + (Math.random() - 0.5) * 20,
                    vx: (Math.random() - 0.5) * 2.5,
                    vy: (Math.random() - 0.5) * 2.5,
                    size: Math.random() * 1.0 + 0.3,
                    life: this.config.particleLife * 0.7,
                    maxLife: this.config.particleLife * 0.7,
                    color: colors.spark,
                    type: 'spark',
                    decay: 0.97,
                    connections: [],
                    rotation: Math.random() * Math.PI * 2,
                    rotationSpeed: (Math.random() - 0.5) * this.config.rotationSpeed * 1.5,
                    subdivisionTimer: Math.random() * this.config.subdivisionInterval * 1.5,
                    hasSubdivided: false
                });
            }
        }
        
        // Crear explosiones en cadena
        if (!isChainExplosion && Math.random() < this.config.chainExplosionChance) {
            setTimeout(() => {
                this.createChainExplosions(x, y);
            }, 150 + Math.random() * 250);
        }
    }
    
    createRandomExplosion() {
        const x = Math.random() * this.canvas.width;
        const y = Math.random() * this.canvas.height;
        this.createExplosion(x, y);
    }
    
    createChainExplosions(originX, originY) {
        const numChainExplosions = Math.floor(Math.random() * 4) + 2; // 2-5 explosiones en cadena
        
        for (let i = 0; i < numChainExplosions; i++) {
            setTimeout(() => {
                const angle = Math.random() * Math.PI * 2;
                const distance = Math.random() * this.config.chainExplosionRadius + 40;
                const x = originX + Math.cos(angle) * distance;
                const y = originY + Math.sin(angle) * distance;
                
                // Asegurar que las explosiones estén dentro del canvas
                const clampedX = Math.max(30, Math.min(this.canvas.width - 30, x));
                const clampedY = Math.max(30, Math.min(this.canvas.height - 30, y));
                
                this.createExplosion(clampedX, clampedY, true);
            }, i * 120 + Math.random() * 80);
        }
    }
    
    subdivideParticle(particle) {
        if (particle.hasSubdivided || this.particles.length >= this.config.maxParticles) return;
        
        const colors = this.getThemeColors();
        const colorKeys = ['primary', 'secondary', 'accent', 'light'];
        
        // Crear 2-3 partículas más pequeñas
        const subdivisions = Math.floor(Math.random() * 2) + 2;
        
        for (let i = 0; i < subdivisions; i++) {
            const angle = (Math.PI * 2 / subdivisions) * i + Math.random() * 0.5;
            const speed = 0.8 + Math.random() * 0.4;
            const newSize = particle.size * (0.4 + Math.random() * 0.3);
            
            this.particles.push({
                x: particle.x + Math.cos(angle) * 8,
                y: particle.y + Math.sin(angle) * 8,
                vx: particle.vx * 0.3 + Math.cos(angle) * speed,
                vy: particle.vy * 0.3 + Math.sin(angle) * speed,
                size: newSize,
                life: particle.life * 0.6,
                maxLife: particle.life * 0.6,
                color: colors[colorKeys[Math.floor(Math.random() * colorKeys.length)]],
                type: 'subdivision',
                decay: 0.99,
                connections: [],
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * this.config.rotationSpeed * 2,
                subdivisionTimer: Infinity, // No más subdivisiones
                hasSubdivided: true
            });
        }
        
        particle.hasSubdivided = true;
    }
    
    calculateConnections() {
        // Limpiar conexiones existentes
        this.particles.forEach(particle => {
            particle.connections = [];
        });
        
        // Calcular nuevas conexiones con límite por partícula
        for (let i = 0; i < this.particles.length; i++) {
            const particle1 = this.particles[i];
            if (particle1.connections.length >= this.config.maxConnections) continue;
            
            // Crear array de candidatos con distancias
            const candidates = [];
            
            for (let j = i + 1; j < this.particles.length; j++) {
                const particle2 = this.particles[j];
                if (particle2.connections.length >= this.config.maxConnections) continue;
                
                const dx = particle1.x - particle2.x;
                const dy = particle1.y - particle2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.config.connectionDistance) {
                    candidates.push({
                        particle: particle2,
                        distance: distance,
                        opacity: 1 - (distance / this.config.connectionDistance)
                    });
                }
            }
            
            // Ordenar por distancia y tomar las conexiones más cercanas
            candidates.sort((a, b) => a.distance - b.distance);
            const maxNewConnections = this.config.maxConnections - particle1.connections.length;
            
            for (let k = 0; k < Math.min(candidates.length, maxNewConnections); k++) {
                const candidate = candidates[k];
                if (candidate.particle.connections.length < this.config.maxConnections) {
                    particle1.connections.push(candidate);
                    
                    // Crear conexión bidireccional para mejor distribución
                    candidate.particle.connections.push({
                        particle: particle1,
                        distance: candidate.distance,
                        opacity: candidate.opacity
                    });
                }
            }
        }
    }
    
    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            // Actualizar rotación
            particle.rotation += particle.rotationSpeed;
            
            // Aplicar rotación a la velocidad para movimiento en espiral
            const rotatedVx = particle.vx * Math.cos(particle.rotationSpeed) - particle.vy * Math.sin(particle.rotationSpeed);
            const rotatedVy = particle.vx * Math.sin(particle.rotationSpeed) + particle.vy * Math.cos(particle.rotationSpeed);
            
            particle.vx = rotatedVx;
            particle.vy = rotatedVy;
            
            // Actualizar posición
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Aplicar gravedad sutil
            particle.vy += 0.01;
            
            // Aplicar decaimiento de velocidad
            particle.vx *= particle.decay;
            particle.vy *= particle.decay;
            
            // Actualizar vida
            particle.life -= 16; // Aproximadamente 60fps
            
            // Verificar subdivisión
            if (!particle.hasSubdivided && particle.subdivisionTimer > 0) {
                particle.subdivisionTimer -= 16;
                if (particle.subdivisionTimer <= 0 && Math.random() < this.config.subdivisionChance) {
                    this.subdivideParticle(particle);
                }
            }
            
            // Eliminar partículas muertas
            if (particle.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
        
        // Calcular conexiones cada frame
        this.calculateConnections();
    }
    
    drawParticles() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Dibujar líneas de conexión primero
        this.drawConnections();
        
        // Luego dibujar las partículas
        this.particles.forEach(particle => {
            const alpha = particle.life / particle.maxLife;
            
            this.ctx.save();
            this.ctx.globalAlpha = alpha * 1.0; // Máxima opacidad
            
            // Aplicar transformación de rotación
            this.ctx.translate(particle.x, particle.y);
            this.ctx.rotate(particle.rotation);
            
            // Crear gradiente para efecto brillante con mejor contraste
            const gradient = this.ctx.createRadialGradient(
                0, 0, 0,
                0, 0, particle.size * 3
            );
            
            // Ajustar colores según el tipo con mayor intensidad
            if (particle.type === 'spark') {
                gradient.addColorStop(0, particle.color + 'FF'); // Opacidad completa
                gradient.addColorStop(0.3, particle.color + 'CC'); // 80% opacidad
                gradient.addColorStop(0.6, particle.color + '80'); // 50% opacidad
                gradient.addColorStop(0.9, particle.color + '40'); // 25% opacidad
                gradient.addColorStop(1, 'transparent');
            } else if (particle.type === 'subdivision') {
                gradient.addColorStop(0, particle.color + 'FF');
                gradient.addColorStop(0.4, particle.color + 'B3'); // 70% opacidad
                gradient.addColorStop(0.8, particle.color + '66'); // 40% opacidad
                gradient.addColorStop(1, 'transparent');
            } else {
                gradient.addColorStop(0, particle.color + 'FF');
                gradient.addColorStop(0.5, particle.color + '99'); // 60% opacidad
                gradient.addColorStop(0.8, particle.color + '4D'); // 30% opacidad
                gradient.addColorStop(1, 'transparent');
            }
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Agregar destello rotativo para chispas con mayor intensidad
            if (particle.type === 'spark' && alpha > 0.3) {
                this.ctx.fillStyle = particle.color + 'FF';
                this.ctx.beginPath();
                this.ctx.arc(0, 0, particle.size * 0.5, 0, Math.PI * 2);
                this.ctx.fill();
                
                // Destello en forma de cruz rotativa más visible
                this.ctx.strokeStyle = particle.color + 'CC';
                this.ctx.lineWidth = 0.8;
                this.ctx.beginPath();
                this.ctx.moveTo(-particle.size * 2, 0);
                this.ctx.lineTo(particle.size * 2, 0);
                this.ctx.moveTo(0, -particle.size * 2);
                this.ctx.lineTo(0, particle.size * 2);
                this.ctx.stroke();
            }
            
            this.ctx.restore();
        });
    }
    
    drawConnections() {
        const colors = this.getThemeColors();
        
        this.particles.forEach(particle => {
            if (particle.connections && particle.connections.length > 0) {
                particle.connections.forEach(connection => {
                    const alpha = (particle.life / particle.maxLife) * 
                                 (connection.particle.life / connection.particle.maxLife) * 
                                 connection.opacity * this.config.lineOpacity;
                    
                    if (alpha > 0.02) { // Solo dibujar si es lo suficientemente visible
                        this.ctx.save();
                        this.ctx.globalAlpha = alpha;
                        
                        // Crear gradiente para la línea con mejor contraste
                        const gradient = this.ctx.createLinearGradient(
                            particle.x, particle.y,
                            connection.particle.x, connection.particle.y
                        );
                        
                        // Gradiente más vibrante y visible
                        gradient.addColorStop(0, particle.color + 'AA'); // 67% opacidad
                        gradient.addColorStop(0.2, colors.primary + '88'); // 53% opacidad
                        gradient.addColorStop(0.5, colors.spark + '99'); // 60% opacidad
                        gradient.addColorStop(0.8, colors.accent + '88'); // 53% opacidad
                        gradient.addColorStop(1, connection.particle.color + 'AA'); // 67% opacidad
                        
                        this.ctx.strokeStyle = gradient;
                        this.ctx.lineWidth = this.config.lineWidth;
                        this.ctx.lineCap = 'round';
                        
                        // Línea principal
                        this.ctx.beginPath();
                        this.ctx.moveTo(particle.x, particle.y);
                        this.ctx.lineTo(connection.particle.x, connection.particle.y);
                        this.ctx.stroke();
                        
                        // Agregar destello central más frecuente para conexiones cercanas
                        if (connection.distance < this.config.connectionDistance * 0.5 && Math.random() < 0.15) {
                            const midX = (particle.x + connection.particle.x) / 2;
                            const midY = (particle.y + connection.particle.y) / 2;
                            
                            this.ctx.fillStyle = colors.spark + '80'; // 50% opacidad
                            this.ctx.beginPath();
                            this.ctx.arc(midX, midY, 1.2, 0, Math.PI * 2);
                            this.ctx.fill();
                        }
                        
                        this.ctx.restore();
                    }
                });
            }
        });
    }
    
    animate() {
        if (!this.isRunning) return;
        
        this.updateParticles();
        this.drawParticles();
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.animate();
        
        // Crear explosiones aleatorias
        this.explosionTimer = setInterval(() => {
            if (this.particles.length < this.config.maxParticles) {
                this.createRandomExplosion();
            }
        }, this.config.explosionInterval + Math.random() * 1000);
    }
    
    stop() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.explosionTimer) {
            clearInterval(this.explosionTimer);
        }
    }
    
    destroy() {
        this.stop();
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}

// Inicializar el sistema de partículas cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Esperar un poco para que todo esté cargado
    setTimeout(() => {
        window.particleSystem = new ParticleSystem();
    }, 500);
});

// Limpiar al salir de la página
window.addEventListener('beforeunload', function() {
    if (window.particleSystem) {
        window.particleSystem.destroy();
    }
});
