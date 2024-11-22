// src/routes/connexionRoutes.js
const express = require('express');
const path = require('path');
const router = express.Router();
const database = require('../database'); // Assurez-vous que le chemin est correct
const bcrypt = require('bcrypt');

// Route pour la connexion de l'utilisateur
router.post('/Connexion', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email et mot de passe sont requis." });
        }

        // Recherche de l'utilisateur dans la base de données
        const utilisateur = await database.getUtilisateurEmail(email);

        if (!utilisateur) {
            return res.status(401).json({ error: "Utilisateur non trouvé." });
        }

        // Comparaison des mots de passe
        if (utilisateur.mot_de_passe !== password) {
            return res.status(401).json({ error: "Email ou mot de passe incorrect." });
}

        // Stocker l'ID de l'utilisateur dans la session
        req.session.userId = utilisateur.id_utilisateur;
        req.session.username = utilisateur.nom_utilisateur

        // Rediriger vers le tableau de bord
        res.redirect('/tableau_de_bord'); // Assurez-vous que cette route est définie
    } catch (error) {
        console.error("Erreur lors de la connexion :", error);
        res.status(500).json({ error: "Erreur interne du serveur." });
    }
});

// Route pour afficher la page de connexion (GET)
router.get('/connexion', (req, res) => {
    console.log("Tentative d'accès à la page de connexion");
    res.sendFile(path.join(__dirname, '/../public/index.html')); // Assurez-vous que le chemin est correct
});


// Envoyer le nom de l'utilisateur
router.get('/user', (req, res) => {
    console.log("Tentative d'accès à /api/user");
    if (!req.session.userId) {
        console.log("Utilisateur non authentifié");
        return res.status(401).json({ error: "Utilisateur non authentifié" });
    }
    console.log("Utilisateur authentifié, récupération du nom d'utilisateur");
    res.json({ nom_utilisateur: req.session.username });
});


module.exports = router;

