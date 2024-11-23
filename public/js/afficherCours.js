document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/cours')  // Assurez-vous que cette route existe sur votre serveur
      .then(response => {
          if (!response.ok) {
              throw new Error('Erreur réseau');
          }
          return response.json();
      })
      .then(cours => {
          const tableBody = document.querySelector('#coursTable tbody');
          cours.forEach(cours => {
              const row = `
                <tr>
                  <td>${cours.code_cours}</td>
                  <td>${cours.nom_cours}</td>
                  <td>${cours.credits}</td>
                  <td>
                    <button class="btn btn-sm btn-outline-primary">Modifier</button>
                    <button class="btn btn-sm btn-outline-danger">Supprimer</button>
                  </td>
                </tr>
              `;
              tableBody.innerHTML += row;
          });
      })
      .catch(error => console.error('Erreur:', error));
});