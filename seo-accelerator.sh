#!/bin/bash

# Script para acelerar el posicionamiento web
# Edisson Giraldo - Ingeniero de Software e IA

echo "🚀 ACELERANDO POSICIONAMIENTO WEB..."
echo "======================================"

# 1. Verificar sitemap
echo "📄 Verificando sitemap.xml..."
curl -s -o /dev/null -w "%{http_code}" https://edissongirald0.github.io/sitemap.xml

# 2. Ping a motores de búsqueda
echo "🔔 Notificando a motores de búsqueda..."

# Google
echo "📍 Enviando sitemap a Google..."
curl -s "https://www.google.com/ping?sitemap=https://edissongirald0.github.io/sitemap.xml"

# Bing
echo "📍 Enviando sitemap a Bing..."
curl -s "https://www.bing.com/ping?sitemap=https://edissongirald0.github.io/sitemap.xml"

# 3. Verificar robots.txt
echo "🤖 Verificando robots.txt..."
curl -s https://edissongirald0.github.io/robots.txt

echo ""
echo "✅ PROCESO COMPLETADO"
echo "======================================"
echo "📊 Próximos pasos recomendados:"
echo "1. Enviar URL a Google Search Console"
echo "2. Configurar Bing Webmaster Tools"
echo "3. Compartir en redes sociales profesionales"
echo "4. Crear contenido de blog técnico"
echo "5. Obtener backlinks de calidad"
echo ""
