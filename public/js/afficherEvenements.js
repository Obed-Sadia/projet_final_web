document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        events: '/api/evenements',
        eventClick: function(info) {
            alert('Événement: ' + info.event.title);
        }
    });
    calendar.render();

    // Charger les événements à venir
    fetch('/api/evenements')
        .then(response => response.json())
        .then(data => {
            const evenements = Array.isArray(data) ? data : data.evenements || [];
            const listeEvenements = document.getElementById('upcomingEvents');
            listeEvenements.innerHTML = '';
            evenements.forEach(evt => {
                const li = document.createElement('li');
                li.className = 'list-group-item';
                li.textContent = `${evt.titre} - ${new Date(evt.date_debut).toLocaleDateString()}`;
                listeEvenements.appendChild(li);
            });
        })
        .catch(error => console.error('Erreur:', error));

    // Gestion du formulaire d'ajout d'événement
    document.getElementById('addEventForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const eventData = {
            titre: document.getElementById('eventTitle').value,
            date_debut: document.getElementById('eventDate').value,
            type: document.getElementById('eventType').value
        };

        fetch('/api/evenements', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(eventData),
        })
        .then(response => response.json())
        .then(data => {
            calendar.refetchEvents();
            e.target.reset();
            // Mettre à jour la liste des événements à venir
            return fetch('/api/evenements');
        })
        .then(response => response.json())
        .then(data => {
            const evenements = Array.isArray(data) ? data : data.evenements || [];
            const listeEvenements = document.getElementById('upcomingEvents');
            listeEvenements.innerHTML = '';
            evenements.forEach(evt => {
                const li = document.createElement('li');
                li.className = 'list-group-item';
                li.textContent = `${evt.titre} - ${new Date(evt.date_debut).toLocaleDateString()}`;
                listeEvenements.appendChild(li);
            });
        })
        .catch((error) => {
            console.error('Erreur:', error);
        });
    });
});