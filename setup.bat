@echo off
REM Script d'installation et démarrage (Windows)
echo Vérification de Node...
node -v >nul 2>&1 || (
  echo Node n'est pas installé. Téléchargez depuis https://nodejs.org/
  pause
  exit /b 1
)
echo Vérification de npm...
npm -v >nul 2>&1 || (
  echo npm non trouvé. Assurez-vous que Node.js est installé correctement.
  pause
  exit /b 1
)
if not exist .env (
  if exist .env.example (
    copy .env.example .env
    echo Fichier .env créé à partir de .env.example
  ) else (
    echo .env.example introuvable — créez un .env manuellement.
  )
) else (
  echo .env existe déjà
)
echo Installation des dépendances...
npm install
echo Démarrage du serveur...
node server.js
pause
