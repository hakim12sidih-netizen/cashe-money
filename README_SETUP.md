Installation et démarrage (guide rapide)

But: gérer automatiquement les fichiers manquants (.env) et installer les dépendances.

1) Pré-requis
- Node.js (recommandé v18+). Téléchargez depuis https://nodejs.org/
- (Windows) utilisez `setup.bat`; (Unix/WSL/macOS) utilisez `setup.sh`.

2) Procédure (automatique)
- Copiez `.env.example` en `.env` si nécessaire.
- Installe les dépendances depuis `package.json` (via `npm install`).
- Démarre le serveur avec `node server.js`.

Commandes rapides

Windows (CMD):
    setup.bat

PowerShell (si vous préférez):
    set MOCK_SMS=true; node server.js

Unix / macOS / WSL:
    chmod +x setup.sh
    ./setup.sh

Notes
- Si `npm` n'est pas disponible, installez Node.js (il inclut npm).
- Le script crée `.env` depuis `.env.example` seulement si `.env` est absent.
- Pour tester sans Twilio, activez le mode mock dans `.env` :
    MOCK_SMS=true

Support
- Si un module manque encore (erreur MODULE_NOT_FOUND), exécutez `npm install` manuellement dans le dossier du projet.
