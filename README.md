# Calculateur de Devis - Version Statique

Cette application est une version 100% statique (HTML/CSS/JavaScript) du calculateur de devis. Elle fonctionne entièrement côté client sans nécessiter de serveur backend.

## Fonctionnalités

- Configuration de l'étude avec un nombre de phases personnalisable
- Calcul des montants HT, TVA et TTC
- Gestion des frais (en pourcentage ou montant fixe)
- Calcul automatique de l'acompte et du solde
- Conversion des montants en lettres (français)
- Interface responsive et moderne

## Utilisation

### Option 1 : Ouverture directe
Ouvrez simplement le fichier `index.html` dans votre navigateur web préféré.

### Option 2 : Serveur local (recommandé)
Pour éviter d'éventuels problèmes de CORS, vous pouvez lancer un serveur local :

**Avec Node.js (npx) :**
```bash
npx http-server
```

Puis ouvrez votre navigateur à l'adresse `http://localhost:8000`

## Structure des fichiers

- `index.html` : Page principale contenant les trois écrans de l'application
- `style.css` : Styles CSS (repris du design original)
- `app.js` : Logique principale de l'application
- `numberToWords.js` : Module de conversion de nombres en lettres françaises

