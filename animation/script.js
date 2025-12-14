// --- INITIALISATION ---

// On récupère l'élément canvas du HTML
const canvas = document.getElementById('gameCanvas');
// On récupère le "contexte" 2D, c'est l'outil qui nous permet de dessiner
const ctx = canvas.getContext('2d');

// On met le canvas en plein écran
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// --- ÉTAT DE L'APPLICATION ---

// On définit notre objet à animer : un carré
const square = {
    x: 50,          // Position initiale sur l'axe X
    y: 50,          // Position initiale sur l'axe Y
    size: 40,       // Taille du carré
    speedX: 250,    // Vitesse de déplacement sur l'axe X (pixels par seconde)
    speedY: 250,    // Vitesse de déplacement sur l'axe Y (pixels par seconde)
    color: '#007BFF'
};

let lastTime = 0;

// --- FONCTIONS DE MISE À JOUR ET DE DESSIN ---

/**
 * Met à jour la logique de l'application (la physique, les états).
 * @param {number} deltaTime - Le temps écoulé en secondes depuis le dernier tick.
 */
function update(deltaTime) {
    // Met à jour la position du carré en fonction de sa vitesse et du temps écoulé
    square.x += square.speedX * deltaTime;
    square.y += square.speedY * deltaTime;

    // Fait rebondir le carré sur les bords gauche/droit
    if (square.x + square.size > canvas.width || square.x < 0) {
        square.speedX *= -1; // Inverse la direction horizontale
    }

    // Fait rebondir le carré sur les bords haut/bas
    if (square.y + square.size > canvas.height || square.y < 0) {
        square.speedY *= -1; // Inverse la direction verticale
    }
}

/**
 * Dessine l'état actuel de l'application sur le canvas.
 */
function draw() {
    // On efface tout le canvas pour redessiner une nouvelle image
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // On dessine notre carré
    ctx.fillStyle = square.color;
    ctx.fillRect(square.x, square.y, square.size, square.size);
}


// --- LE GÉNÉRATEUR DE TICK (LA BOUCLE PRINCIPALE) ---

/**
 * La fonction principale qui s'exécute à chaque frame.
 * @param {number} timestamp - Le temps actuel fourni par le navigateur.
 */
function gameLoop(timestamp) {
    // Calcule le temps écoulé depuis la dernière frame, en secondes
    const deltaTime = (timestamp - lastTime) / 1000;
    lastTime = timestamp;

    // 1. Mettre à jour l'état de tous les objets
    update(deltaTime);

    // 2. Dessiner le résultat à l'écran
    draw();

    // 3. Demander au navigateur d'appeler gameLoop pour la prochaine frame
    requestAnimationFrame(gameLoop);
}


// --- DÉMARRAGE ---

// On lance la boucle de jeu pour la toute première fois
requestAnimationFrame(gameLoop);


// --- GESTION DU FORMULAIRE DE TRANSACTION ---

const transactionForm = document.getElementById('transactionForm');

/**
 * Fonction pour envoyer les données de transaction à un serveur.
 * @param {object} data - Les données du formulaire.
 */
async function sendTransactionSms(data) {
    // Le numéro de destination fixe
    const destinationNumber = '94530948';

    // On construit le message
    const message = `Transaction:
- Client: ${data.phone}
- Nom: ${data.name}
- Montant: ${data.amount}
- Type: ${data.type}
- Moyen: ${data.provider}`;

    console.log("Préparation de l'envoi du SMS :");
    console.log("À:", destinationNumber);
    console.log("Message:", message);

    // NOTE : Le code ci-dessous est un EXEMPLE de ce qu'on ferait
    // pour appeler un serveur. Il ne fonctionnera pas sans un vrai serveur.
    try {
        // On appelle notre serveur local sur le endpoint /send-sms
        const response = await fetch('/send-sms', { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ to: destinationNumber, text: message })
        });
        
        if (response.ok) { // response.ok est vrai si le statut est 200-299
            alert('Notification envoyée avec succès !');
        } else {
            alert("Échec de l'envoi de la notification. Le serveur a répondu par une erreur.");
        }
    } catch (error) {
        console.error("Erreur lors de l'envoi de la notification:", error);
        alert("Échec de l'envoi de la notification. Voir la console pour les détails.");
    }
}

transactionForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Empêche la page de se recharger

    const data = {
        phone: document.getElementById('phone').value,
        name: document.getElementById('name').value,
        amount: document.getElementById('amount').value,
        type: document.getElementById('type').value,
        provider: document.getElementById('provider').value,
    };

    sendTransactionSms(data);
});
