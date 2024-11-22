const express = require('express');
const router = express.Router();
const database = require('../database');

// Route pour l'enregistrement d'un utilisateur
router.post('/Inscription', async (req, res) => {
    try {
        const { nom_utilisateur, email, mot_de_passe } = req.body;

        // Validation des entrées
        if (!nom_utilisateur || !email || !mot_de_passe) {
            return res.status(400).json({ error: "Tous les champs (nom_utilisateur, email, mot_de_passe) sont requis." });
        }

        // Vérifiez si l'utilisateur existe déjà
        const utilisateurExistant = await database.getUtilisateurEmail(email);
        if (utilisateurExistant) {
            return res.status(400).json({ error: "Un utilisateur avec cet email existe déjà." });
        }

        // Ajout de l'utilisateur
        const utilisateur = await database.ajouterUtilisateur(nom_utilisateur, email, mot_de_passe);
        res.status(201).json({
            message: "Utilisateur enregistré avec succès.",
            utilisateur,
        });
    } catch (error) {
        console.error("Erreur lors de l'inscription :", error);
        res.status(500).json({ error: "Erreur interne du serveur." });
    }
});

module.exports = router;