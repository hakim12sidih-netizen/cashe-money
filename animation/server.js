// --- server.js ---

// 0. Charger les variables d'environnement depuis le fichier .env
require('dotenv').config();

// 1. On importe les librairies nécessaires
const express = require('express'); // Framework pour créer le serveur web
const twilio = require('twilio');   // Librairie pour le service d'envoi de SMS

// 2. Initialisation du serveur Express
const app = express();
const PORT = 3000; // Le "port" sur lequel notre serveur va écouter. C'est comme un numéro de porte.

// 3. Configuration du serveur
// Cette ligne est CRUCIALE. Elle permet au serveur de comprendre le JSON envoyé par le frontend.
app.use(express.json()); 
// Cette ligne permet au serveur de servir les fichiers statiques (index.html, script.js)
// __dirname est une variable spéciale en Node.js qui contient le chemin du dossier où se trouve server.js
app.use(express.static(__dirname));


// 4. Configuration de Twilio (le service d'envoi de SMS)
// ATTENTION : Ce sont des clés secrètes. Ne les partagez jamais.
// On récupère les clés depuis les variables d'environnement de manière sécurisée.
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;


// 5. Le plus important : L'endroit où le serveur "prend" les informations
// On dit au serveur : "Quand tu reçois une requête HTTP POST sur l'URL '/send-sms'..."
app.post('/send-sms', (req, res) => {
    console.log("Requête reçue sur /send-sms");

    // "...prends les données qui ont été envoyées dans le corps (body) de la requête."
    const { to, text } = req.body; 
    
    // Adaptez le préfixe à votre pays. Par exemple, +228 pour le Togo, +33 pour la France.
    const destinationNumberWithCountryCode = '+228' + to;

    console.log(`Tentative d'envoi du SMS à ${destinationNumberWithCountryCode}`);

    // On utilise le client Twilio pour envoyer le vrai SMS
    client.messages.create({
        body: text,
        from: twilioPhoneNumber,
        to: destinationNumberWithCountryCode
    }).then(message => {
        console.log('SMS envoyé avec succès ! SID:', message.sid);
        res.status(200).json({ success: true, message: 'SMS envoyé !' });
    }).catch(error => {
        console.error('Erreur lors de l\'envoi du SMS:', error);
        res.status(500).json({ success: false, message: 'Erreur lors de l\'envoi du SMS' });
    });
});

// 6. Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré. Ouvrez http://localhost:${PORT} dans votre navigateur.`);
});