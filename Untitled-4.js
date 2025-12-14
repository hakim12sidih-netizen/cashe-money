// js/main.js
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.querySelector('.contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault(); // Empêche le rechargement de la page

            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const operator = document.getElementById('operator').value;
            const message = document.getElementById('message').value;
            const submitButton = this.querySelector('button');

            if (!name || !phone || !operator || !message) {
                alert('Veuillez remplir tous les champs du formulaire.');
                return;
            }

            // Prépare les données à envoyer
            const formData = { name, phone, operator, message };
            const originalButtonText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = 'Envoi en cours...';

            try {
                // Utilise l'API Fetch pour envoyer les données au backend
                const response = await fetch('http://localhost:3000/send-message', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                const result = await response.json();

                if (result.success) {
                    alert('Merci pour votre message! Nous vous contacterons bientôt.');
                    this.reset(); // Réinitialise le formulaire
                } else {
                    throw new Error(result.message || 'Une erreur est survenue.');
                }

            } catch (error) {
                console.error('Erreur lors de l\'envoi du formulaire:', error);
                alert('Une erreur est survenue lors de l\'envoi du message. Veuillez réessayer.');
            } finally {
                // Réactive le bouton
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            }
        });
    }
});
