// src/routes/coursRoutes.js
const express = require('express');
const router = express.Router();
const database = require('../database');

router.get('/Cours', async (req, res) => {
  try {
    const userId = req.session?.userId; // Assurez-vous d'avoir configuré les sessions
    if (!userId) {
      return res.status(401).json({ error: "Utilisateur non authentifié" });
    }

    const cours = await database.getCoursUtilisateur(userId);
    res.json(cours);
  } catch (error) {
    console.error("Erreur lors de la récupération des cours :", error);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
});

module.exports = router;