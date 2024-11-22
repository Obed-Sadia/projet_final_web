const sqlite3 = require('sqlite3').verbose();
const config = require('../config/config');
const bcrypt = require('bcrypt'); 

let db = null;

// Fonction pour établir une connexion à la base de données
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

// Fonction pour vérifier le mot de passe
async function verificateurMotDePasse(storedPassword, inputPassword) {
    try {
        return await bcrypt.compare(inputPassword, storedPassword); 
    } catch (err) {
        console.error('Erreur lors de la vérification du mot de passe:', err);
        return false; 
    }
}

// Fonction pour ajouter un nouvel utilisateur avec hachage du mot de passe
async function ajouterUtilisateur(nom_utilisateur, email, mot_de_passe) {
    const hashedPassword = await bcrypt.hash(mot_de_passe, 10);
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO Utilisateur (nom_utilisateur, email, mot_de_passe) VALUES (?, ?, ?)`;
        db.run(sql, [nom_utilisateur, email, hashedPassword], function (err) { 
            if (err) {
                console.error('Error adding user:', err.message); 
                reject(err);
            } else {
                resolve({
                    id_utilisateur: this.lastID,
                    nom_utilisateur: nom_utilisateur,
                    email: email,
                });
            }
        });
    });
}

// Exporter les fonctions pour utilisation ailleurs
module.exports = {
    connect,
    getUtilisateurEmail,
    ajouterUtilisateur,
    verificateurMotDePasse
};