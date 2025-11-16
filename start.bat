@echo off
REM Script de démarrage pour Windows

echo ================================================
echo   Calculateur de Devis - Version Statique
echo ================================================
echo.

REM Vérifier si index.html existe
if not exist "index.html" (
    echo Erreur : index.html introuvable
    echo Veuillez executer ce script depuis le dossier app_statique
    pause
    exit /b 1
)

echo Demarrage du serveur local...
echo.

REM Essayer Python 3
where python >nul 2>nul
if %errorlevel% equ 0 (
    echo Python detecte - Lancement du serveur...
    echo.
    echo Ouvrez votre navigateur a l'adresse : http://localhost:8000
    echo.
    echo Appuyez sur Ctrl+C pour arreter le serveur
    echo.
    python -m http.server 8000
    goto :end
)

REM Essayer npx
where npx >nul 2>nul
if %errorlevel% equ 0 (
    echo npx detecte - Lancement du serveur...
    echo.
    echo Le navigateur devrait s'ouvrir automatiquement
    echo.
    echo Appuyez sur Ctrl+C pour arreter le serveur
    echo.
    npx http-server -p 8000 -o
    goto :end
)

REM Aucun serveur trouvé
echo Erreur : Aucun serveur HTTP disponible
echo.
echo Veuillez installer Python ou Node.js :
echo   - Python : https://www.python.org/downloads/
echo   - Node.js : https://nodejs.org/
echo.
echo Ou ouvrez simplement index.html dans votre navigateur.
echo.
pause
exit /b 1

:end
pause

