document.addEventListener('DOMContentLoaded', function() {
    fetchUserName();
});

function fetchUserName() {
    fetch('/api/user')  // Utilisez /api/user pour récupérer les données utilisateur
        .then(response => {
            if (!response.ok) {  // Vérifiez si la réponse est correcte
                throw new Error('Erreur réseau');
            }
            return response.json();
        })
        .then(data => {
            const userGreeting = document.getElementById('userGreeting');
            userGreeting.textContent += data.nom_utilisateur || "Invité"; // Affiche "Invité" si aucun utilisateur n'est connecté
        })
        .catch(error => console.error('Erreur lors de la récupération du nom d\'utilisateur:', error));
}