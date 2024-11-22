// src/routes/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const path = require('path');



router.get('/Tableau_de_bord', (req, res) => {
    console.log("Tentative d'accès au tableau de bord");
    if (!req.session.userId) {
        console.log("Utilisateur non authentifié, redirection vers /connexion");
        return res.redirect('/connexion');
    }
    console.log("Utilisateur authentifié, chargement du tableau de bord");
    res.sendFile(path.join(__dirname, '../../public/pages/Tableau_de_bord.html'));
});

module.exports = router;