const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('../config/config');
const database = require('./database');
const bcrypt = require('bcrypt'); // Assurez-vous que bcrypt est importé ici

const app = express();
const PORT = config.port || 3000; // Utiliser le port défini dans config ou 3000 par défaut

// Middleware
app.use(cors()); // Activer CORS pour toutes les routes
app.use(express.json()); // Analyser les corps des requêtes en JSON
app.use(express.static(path.join(__dirname, '../public'))); // Servir les fichiers statiques depuis le dossier 'public'
app.use(express.urlencoded({ extended: true })); // Pour traiter application/x-www-form-urlencoded

// Route pour page d'accueil
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html')); // Servir index.html
});

// Route pour la page de connexion 
app.post('/Connexion', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email et mot de passe sont requis." });
        }

        // Recherche de l'utilisateur dans la base de données
        const utilisateur = await database.getUtilisateurEmail(email);

        if (!utilisateur) {
            // Protection contre les attaques par timing
            const fakePassword = "$2b$10$placeholderplaintextbypasshash";
            await bcrypt.compare(password, fakePassword);
            return res.status(401).json({ error: "Email ou mot de passe incorrect." });
        }

        // Vérification du mot de passe
        const passwordMatch = await database.verificateurMotDePasse(utilisateur.password, password);
        if (!passwordMatch) {
            return res.status(401).json({ error: "Email ou mot de passe incorrect." });
        }

        // Réponse en cas de succès
        res.status(200).json({
            message: "Connexion réussie.",
            username: utilisateur.nom_utilisateur, // Assurez-vous que c'est le bon champ
        });
    } catch (error) {
        console.error("Erreur lors de la connexion :", error);
        res.status(500).json({ error: "Erreur interne du serveur." });
    }
});

// Route d'inscription 
app.post('/inscription', async (req, res) => {
    try {
        const { nom_utilisateur, email, mot_de_passe } = req.body;

        console.log('Données reçues :', req.body);
        
        // Validation des données
        if (!nom_utilisateur || !email || !mot_de_passe) {
            return res.status(400).json({ error: "Tous les champs (nom_utilisateur, email, mot_de_passe) sont requis." });
        }

        // Vérifier si l'email est déjà utilisé
        const utilisateurExistant = await database.getUtilisateurEmail(email);
        if (utilisateurExistant) {
            return res.status(409).json({ error: "Cet email est déjà utilisé." });
        }

        // Hacher le mot de passe
        const hashedPassword = await bcrypt.hash(mot_de_passe, 10);

        // Ajouter le nouvel utilisateur à la base de données
        const nouvelUtilisateur = await database.ajouterUtilisateur(nom_utilisateur, email, hashedPassword);

        // Réponse en cas de succès sans retourner le mot de passe
        res.status(201).json({
            message: "Utilisateur inscrit avec succès.",
            utilisateur: {
                id_utilisateur: nouvelUtilisateur.id_utilisateur,
                nom_utilisateur: nouvelUtilisateur.nom_utilisateur,
                email: nouvelUtilisateur.email,
            },
        });
    } catch (error) {
        console.error("Erreur lors de l'inscription :", error);
        res.status(500).json({ error: "Erreur interne du serveur." });
    }
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
        process.exit(1); // Quitter le processus si la connexion échoue
    });