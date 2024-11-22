const sqlite3 = require('sqlite3').verbose();
const config = require('../config/config');
const bcrypt = require('bcrypt'); 

let db = null;

// Fonction pofur établir une connexion à la base de données
function connect() {
    return new Promise((resolve, reject) => {
        db = new sqlite3.Database(config.databasePath, (err) => {
            if (err) {
                console.error('Error connecting to the database:', err.message);
                reject(err);
            } else {
                console.log('Connected to the SQLite database.');
                resolve(db);
            }
        });
    });
}

// Fonction pour récupérer un utilisateur par email
function getUtilisateurEmail(email) {
    return new Promise((resolve, reject) => {
        db.get("SELECT * FROM Utilisateur WHERE email = ?", [email], (err, row) => { // Notez l'utilisation de 'utilisateurs'
            if (err) {
                console.error('Error retrieving user:', err.message); // Ajout d'un log d'erreur
                reject(err); 
            } else {
                resolve(row); 
            }
        });
        
    });
}

//Fonction pour récupérer la liste de cour 
function getCoursUtilisateur(userId) {
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM Cours WHERE id_utilisateur = ?", [userId], (err, rows) => {
        if (err) {
          console.error('Error retrieving courses:', err.message);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
}

//Fonction pour récupérer la liste de cour 
function getObjectifsUtilisateur(userId) {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM Objectif WHERE id_etudiant = ?", [userId], (err, rows) => {
            if (err) {
                console.error('Error retrieving objectives:', err.message);
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

async function ajouterUtilisateur(nom_utilisateur, email, mot_de_passe) {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO Utilisateur (nom_utilisateur, email, mot_de_passe) VALUES (?, ?, ?)`;
        db.run(sql, [nom_utilisateur, email, mot_de_passe], function (err) {
            if (err) {
                console.error("Error adding user:", err.message);
                return reject(err);
            }
            resolve({
                id_utilisateur: this.lastID,
                nom_utilisateur: nom_utilisateur,
                email: email,
                mot_de_passe: mot_de_passe,
            });
        });
    });
}



// Exporter les fonctions pour utilisation ailleurs
module.exports = {
    connect,
    getUtilisateurEmail,
    ajouterUtilisateur,
    getCoursUtilisateur,
    getObjectifsUtilisateur
};