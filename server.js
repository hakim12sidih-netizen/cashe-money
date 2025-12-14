// --- server.js ---

const path = require('path');
// 0. Charger les variables d'environnement depuis le fichier .env (si installé)
try {
    require('dotenv').config();
} catch (err) {
    console.warn('Module `dotenv` introuvable — continuez sans .env ou installez-le avec `npm install dotenv`.');
}

// 1. On importe les librairies nécessaires
let express;
try {
    express = require('express'); // Framework pour créer le serveur web
} catch (err) {
    console.error('Module `express` introuvable. Exécutez `npm install` dans le dossier du projet pour installer les dépendances.');
    process.exit(1);
}

let twilio = null;
try {
    twilio = require('twilio');   // Librairie pour le service d'envoi de SMS
} catch (err) {
    console.warn('Module `twilio` introuvable — le mode mock SMS sera utilisé si activé. Pour installer: `npm install twilio`.');
}

// 2. Initialisation du serveur Express
const app = express();
// Render fournit le port via une variable d'environnement, sinon on utilise 3000 en local.
const PORT = process.env.PORT || 3000;

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
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

// On vérifie que toutes les clés sont bien présentes AVANT d'initialiser Twilio
// Activer le mode mock si `MOCK_SMS=true` ou `TWILIO_MOCK=true` dans .env
const MOCK_SMS = process.env.MOCK_SMS === 'true' || process.env.TWILIO_MOCK === 'true';

let client = null;
// Si les variables Twilio manquent ou si la librairie `twilio` est absente, on bascule en mode non-configuré / mock
if (!accountSid || !authToken || !twilioPhoneNumber || !twilio) {
    console.warn("Attention: Une ou plusieurs variables d'environnement Twilio sont manquantes.");
    console.warn("Le serveur démarrera, mais l'envoi de SMS réel sera désactivé en local.");

    if (MOCK_SMS) {
        console.info("Mode MOCK_SMS activé — utilisation d'un client Twilio factice.");
        client = {
            messages: {
                create: async ({ body, from, to }) => {
                    console.log('MOCK SMS envoyé —', { to, from, body });
                    return { sid: `MOCK-${Date.now()}` };
                }
            }
        };
    }
} else {
    client = twilio(accountSid, authToken);
}

// Route pour la page d'accueil
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 5. Le plus important : L'endroit où le serveur "prend" les informations
// On dit au serveur : "Quand tu reçois une requête HTTP POST sur l'URL '/send-sms'..."
app.post('/send-sms', async (req, res) => {
    console.log("Requête reçue sur /send-sms");

    // "...prends les données qui ont été envoyées dans le corps (body) de la requête."
    const { to, text } = req.body; 
    
    if (!to || !text) {
        return res.status(400).json({ success: false, message: "Données de la requête manquantes." });
    }

    // Adaptez le préfixe à votre pays. Par exemple, +228 pour le Togo, +33 pour la France.
    const destinationNumberWithCountryCode = '+228' + to;

    console.log(`Tentative d'envoi du SMS à ${destinationNumberWithCountryCode}`);

    try {
        // Si Twilio n'est pas configuré, on répond clairement sans planter
        if (!client) {
            console.warn('Tentative d\'envoi de SMS alors que Twilio n\'est pas configuré.');
            return res.status(503).json({ success: false, message: 'Service SMS non configuré sur le serveur.' });
        }

        // On utilise le client Twilio pour envoyer le vrai SMS avec await
        const message = await client.messages.create({
            body: text,
            from: twilioPhoneNumber,
            to: destinationNumberWithCountryCode
        });
        console.log('SMS envoyé avec succès ! SID:', message.sid);
        res.status(200).json({ success: true, message: 'SMS envoyé !' });
    } catch (error) {
        console.error('Erreur lors de l\'envoi du SMS:', error);
        res.status(500).json({ success: false, message: 'Erreur lors de la communication avec le service SMS.' });
    }
});

// 6. Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré. Ouvrez http://localhost:${PORT} dans votre navigateur.`);
});

// Route de diagnostic pour vérifier l'état du mock et la configuration Twilio
app.get('/mock-status', (req, res) => {
    res.json({
        mockEnabled: MOCK_SMS,
        twilioConfigured: !!(accountSid && authToken && twilioPhoneNumber && client),
    });
});