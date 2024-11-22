// src/routes/objectifRoutes.js
const express = require('express');
const router = express.Router();
const database = require('../database'); // Assurez-vous que le chemin est correct

// Route pour récupérer les objectifs de l'utilisateur connecté
router.get('/Objectifs', async (req, res) => {
    try {
        const userId = req.session.userId; // Assurez-vous que vous avez configuré les sessions
        if (!userId) {
            return res.status(401).json({ error: "Utilisateur non authentifié" });
        }

        const objectifs = await database.getObjectifsUtilisateur(userId);
        res.json(objectifs);
    } catch (error) {
        console.error("Erreur lors de la récupération des objectifs :", error);
        res.status(500).json({ error: "Erreur interne du serveur." });
    }
});

module.exports = router;