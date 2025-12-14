#!/bin/sh
# Script d'installation et démarrage (Unix / macOS / WSL)
set -e
printf "Vérification de Node...\n"
if ! command -v node >/dev/null 2>&1; then
  printf "Node n'est pas installé. Voir https://nodejs.org/\n"
  exit 1
fi
if [ ! -f .env ]; then
  if [ -f .env.example ]; then
    cp .env.example .env
    printf ".env créé depuis .env.example\n"
  else
    printf ".env.example introuvable — créez .env manuellement\n"
  fi
else
  printf ".env existe déjà\n"
fi
if command -v npm >/dev/null 2>&1; then
  printf "Installation des dépendances...\n"
  npm install
else
  printf "npm non trouvé — installez Node.js pour exécuter 'npm install'\n"
fi
printf "Démarrage du serveur...\n"
node server.js
