FROM node:22-alpine

WORKDIR /app

# Copier les fichiers package.json et pnpm-lock.yaml (si vous utilisez pnpm)
COPY package*.json ./

# Installer les dépendances avec pnpm
RUN npm install --frozen-lockfile

# Copier le reste des fichiers du projet
COPY . .

# Création d'un dossier Images
RUN mkdir Images

# Exposer le port 5500
EXPOSE 5500

# Commande pour démarrer l'application
CMD ["npm", "start"]
