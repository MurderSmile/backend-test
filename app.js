const express = require("express");

const app = express();

const helmet = require("helmet");

const mongoose = require("mongoose");

const path = require("path");

const cors = require("cors");

const postRoutes = require("./routes/post");

const userRoutes = require("./routes/user");

const fs = require("fs");

// Création du dossier 'images' s'il n'existe pas //
if (!fs.existsSync("images")) {
  fs.mkdirSync("images");
}

// Connexion au serveur MongoDB //
mongoose.set("strictQuery", false);
mongoose
  .connect(
    "mongodb+srv://MurderSmile:DeathLaugh@cluster13.wdfny.mongodb.net/?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Autorisation CORS //
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization",
    "access-control-allow-origin"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  res.setHeader("Cross-Origin-Resource-Policy", "*");
  next();
});

// Lien vers le fichier 'post.js' du dossier 'routes' //
app.use("/api/posts", postRoutes);

// Lien vers le fichier 'user.js' du dossier 'routes' //
app.use("/api/auth", userRoutes);

// Lien vers le répertoire 'images' //
app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app;
