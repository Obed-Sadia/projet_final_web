document.addEventListener('DOMContentLoaded', function () {
    var calendarEl = document.getElementById('calendar');

    // Initialisation du calendrier
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
        },
        buttonText: {
            today: "Aujourd'hui",
            month: 'Mois',
            week: 'Semaine',
            day: 'Jour',
        },
        locale: 'fr',
        events: function (info, successCallback, failureCallback) {
            fetch('/api/evenements')
                .then(response => response.json())
                .then(data => {
                    successCallback(
                        data.map(evt => ({
                            id: evt.id_evenement,
                            title: evt.titre,
                            start: evt.date_debut,
                            end: evt.date_fin,
                            color: getColorForEventType(evt.type),
                        }))
                    );
                })
                .catch(failureCallback);
        },
        eventClick: function (info) {
            alert('Événement: ' + info.event.title);
        },
        dayMaxEvents: true,
        height: 'auto',
    });

    // Rendre le calendrier
    calendar.render();

    // Charger les événements à venir
    fetch('/api/evenements')
        .then(response => response.json())
        .then(data => {
            const evenements = Array.isArray(data) ? data : data.evenements || [];
            const listeEvenements = document.getElementById('upcomingEvents');
            if (listeEvenements) {
                listeEvenements.innerHTML = '';
                evenements.forEach(evt => {
                    const li = document.createElement('li');
                    li.className = 'list-group-item';
                    li.textContent = `${evt.titre} - ${new Date(evt.date_debut).toLocaleDateString()}`;
                    listeEvenements.appendChild(li);
                });
            }
        })
        .catch(error => console.error('Erreur lors du chargement des événements à venir:', error));

    // Gestion du formulaire d'ajout d'événement
    const addEventForm = document.getElementById('addEventForm');
    if (addEventForm) {
        addEventForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const eventData = {
                titre: document.getElementById('eventTitle').value,
                date_debut: document.getElementById('eventDate').value,
                type: document.getElementById('eventType').value,
            };

            fetch('/api/evenements', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(eventData),
            })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error('Erreur lors de l’ajout de l’événement.');
                    }
                })
                .then(() => {
                    // Met à jour le calendrier et réinitialise le formulaire
                    calendar.refetchEvents();
                    addEventForm.reset();
                    alert('Événement ajouté avec succès.');
                })
                .catch(error => {
                    console.error('Erreur:', error);
                    alert('Une erreur est survenue lors de l’ajout de l’événement.');
                });
        });
    }

    // Fonction utilitaire pour définir la couleur selon le type d'événement
    function getColorForEventType(type) {
        switch (type) {
            case 'Examen':
                return '#ff4d4d'; // Rouge
            case 'Devoir':
                return '#4da6ff'; // Bleu
            case 'Projet':
                return '#66cc66'; // Vert
            default:
                return '#ffcc00'; // Jaune
        }
    }
});
