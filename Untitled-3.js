// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
// Configurez nodemailer pour envoyer des emails (optionnel mais très utile)

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors()); // Autorise les requêtes depuis votre page web
app.use(bodyParser.json()); // Pour parser les données JSON
app.use(bodyParser.urlencoded({ extended: true })); // Pour parser les formulaires

// Servir les fichiers statiques (votre frontend)
app.use(express.static('public')); // Mettez vos fichiers html, css, js dans un dossier "public"

// Route pour gérer la soumission du formulaire
app.post('/send-message', (req, res) => {
    const { name, phone, operator, message } = req.body;

    console.log('Nouveau message reçu:');
    console.log(`Nom: ${name}`);
    console.log(`Téléphone: ${phone}`);
    console.log(`Opérateur: ${operator}`);
    console.log(`Message: ${message}`);

    // Ici, vous pourriez ajouter la logique pour envoyer un email avec Nodemailer
    // ou sauvegarder les données dans une base de données.

    // Réponse de succès au client
    res.status(200).json({ success: true, message: 'Message reçu avec succès !' });
});

app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
