// src/server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('../config/config');
const database = require('./database');
const session = require('express-session'); // Assurez-vous d'avoir installé ce package

// Importer les routes 
const objectifsRoutes = require('./routes/objectifsRoutes');
const coursRoutes = require('./routes/coursRoutes');
const connexionRoutes = require('./routes/connexionRoutes'); // Assurez-vous que le chemin est correct
const inscriptionRoutes = require('./routes/inscriptionRoutes');
const tableaudebordRoutes = require('./routes/tableaudebordRoutes'); // Nouvelle route pour le tableau de bord


const app = express();
const PORT = config.port || 3000;


// Configurer les sessions
app.use(session({
    secret: '12hjhjgjhguhj345', // Changez ceci par une clé secrète plus sécurisée en production
    resave: false,
    saveUninitialized: true,
}));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// Utilisation des routes
app.use('/api', connexionRoutes);  // Assurez-vous que cette ligne est présente avant les autres routes
app.use('/api', inscriptionRoutes);
app.use('/api', coursRoutes);
app.use('/api', objectifsRoutes);
app.use('/', tableaudebordRoutes); // Utiliser les routes du tableau de bord

// Route pour page d'accueil
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Démarrage du serveur
database.connect()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Failed to connect to the database', err);
        process.exit(1);
    });