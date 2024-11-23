const express = require('express');
const router = express.Router();
const database = require('../database');

router.get('/evenements', async (req, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ error: "Utilisateur non authentifié" });
      }
  
      const etudiant = await database.getEtudiantParUserId(userId);
      if (!etudiant) {
        return res.status(404).json({ error: "Étudiant non trouvé" });
      }
  
      const evenements = await database.getEvenementsParEtudiantId(etudiant.id_etudiant);
      res.json(evenements);
    } catch (error) {
      console.error("Erreur lors de la récupération des événements :", error);
      res.status(500).json({ error: "Erreur interne du serveur." });
    }
  });

  module.exports = router;