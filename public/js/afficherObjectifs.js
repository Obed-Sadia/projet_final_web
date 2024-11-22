document.addEventListener('DOMContentLoaded', function() {
    fetchUserObjectifs();
});

function fetchUserObjectifs() {
    fetch('/objectifs')
        .then(response => response.json())
        .then(objectifs => {
            const objectifList = document.getElementById('objectifList');
            objectifList.innerHTML = ''; // Réinitialiser la liste

            objectifs.forEach(objectif => {
                const item = `
                    <div class="list-group-item list-group-item-action">
                        <div class="d-flex w-100 justify-content-between">
                            <h5 class="mb-1">${objectif.description}</h5>
                            <small class="badge badge-${objectif.statut === 'Atteint' ? 'success' : 'warning'}">${objectif.statut}</small>
                        </div>
                        <p class="mb-1">${objectif.details || 'Pas de détails fournis.'}</p>
                        <small class="text-muted">Date limite : ${objectif.date_echeance}</small>
                        <div class="mt-2">
                            <button class="btn btn-sm btn-outline-primary">Détails</button>
                            <button class="btn btn-sm btn-outline-danger">Supprimer</button>
                        </div>
                    </div>
                `;
                objectifList.innerHTML += item;
            });
        })
        .catch(error => console.error('Erreur lors de la récupération des objectifs:', error));
}