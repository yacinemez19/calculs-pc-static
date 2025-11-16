#!/bin/bash

# Script de démarrage pour le calculateur de devis statique

echo "================================================"
echo "  Calculateur de Devis - Version Statique"
echo "================================================"
echo ""

# Détecter le système d'exploitation
OS="$(uname -s)"

# Fonction pour démarrer le serveur
start_server() {
    PORT=8000
    
    echo "🚀 Démarrage du serveur sur le port $PORT..."
    echo ""
    
    # Essayer différentes méthodes
    if command -v python3 &> /dev/null; then
        echo "✅ Python 3 détecté - Lancement du serveur..."
        echo "📱 Ouvrez votre navigateur à l'adresse : http://localhost:$PORT"
        echo ""
        echo "Appuyez sur Ctrl+C pour arrêter le serveur"
        echo ""
        python3 -m http.server $PORT
    elif command -v python &> /dev/null; then
        PYTHON_VERSION=$(python --version 2>&1 | awk '{print $2}' | cut -d. -f1)
        if [ "$PYTHON_VERSION" -ge 3 ]; then
            echo "✅ Python détecté - Lancement du serveur..."
            echo "📱 Ouvrez votre navigateur à l'adresse : http://localhost:$PORT"
            echo ""
            echo "Appuyez sur Ctrl+C pour arrêter le serveur"
            echo ""
            python -m http.server $PORT
        else
            echo "⚠️  Python 2 détecté, passage à SimpleHTTPServer..."
            python -m SimpleHTTPServer $PORT
        fi
    elif command -v npx &> /dev/null; then
        echo "✅ npx détecté - Lancement du serveur..."
        echo "📱 Le navigateur devrait s'ouvrir automatiquement"
        echo ""
        echo "Appuyez sur Ctrl+C pour arrêter le serveur"
        echo ""
        npx http-server -p $PORT -o
    else
        echo "❌ Erreur : Aucun serveur HTTP disponible"
        echo ""
        echo "Veuillez installer l'une des options suivantes :"
        echo "  - Python 3 : brew install python3 (macOS) ou apt install python3 (Linux)"
        echo "  - Node.js/npx : brew install node (macOS) ou apt install nodejs (Linux)"
        echo ""
        echo "Ou ouvrez simplement index.html dans votre navigateur."
        exit 1
    fi
}

# Fonction pour ouvrir le navigateur
open_browser() {
    URL="http://localhost:8000"
    
    case "$OS" in
        Darwin*)
            open "$URL" 2>/dev/null
            ;;
        Linux*)
            xdg-open "$URL" 2>/dev/null || sensible-browser "$URL" 2>/dev/null
            ;;
        MINGW*|MSYS*|CYGWIN*)
            start "$URL" 2>/dev/null
            ;;
    esac
}

# Vérifier si nous sommes dans le bon dossier
if [ ! -f "index.html" ]; then
    echo "❌ Erreur : index.html introuvable"
    echo "Veuillez exécuter ce script depuis le dossier app_statique"
    exit 1
fi

# Menu principal
echo "Choisissez une option :"
echo "  1) Démarrer le serveur local (recommandé)"
echo "  2) Ouvrir directement index.html dans le navigateur"
echo "  3) Afficher les instructions"
echo ""
read -p "Votre choix (1-3) : " choice

case $choice in
    1)
        start_server
        ;;
    2)
        echo "🌐 Ouverture de l'application..."
        open_browser
        echo "✅ Application ouverte dans votre navigateur par défaut"
        ;;
    3)
        echo ""
        echo "📖 INSTRUCTIONS"
        echo "==============="
        echo ""
        echo "Méthode 1 : Serveur local (recommandé)"
        echo "  ./start.sh et choisissez l'option 1"
        echo ""
        echo "Méthode 2 : Ouverture directe"
        echo "  Double-cliquez sur index.html"
        echo ""
        echo "Méthode 3 : Avec Python"
        echo "  python3 -m http.server 8000"
        echo ""
        echo "Méthode 4 : Avec npm"
        echo "  npm start"
        echo ""
        ;;
    *)
        echo "❌ Option invalide"
        exit 1
        ;;
esac

