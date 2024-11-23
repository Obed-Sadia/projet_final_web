-- Insérer des utilisateurs avec un ID auto-généré
INSERT INTO Utilisateur (nom_utilisateur, mot_de_passe, email)
SELECT 
    'user' || row_number AS nom_utilisateur,
    'password' || row_number AS mot_de_passe,
    'user' || row_number || '@example.com' AS email
FROM (SELECT ROW_NUMBER() OVER () AS row_number FROM sqlite_master LIMIT 50);



-- Insérer des administrateurs en associant chaque utilisateur pair à un administrateur
INSERT INTO Administrateur (id_utilisateur, nom, prenom)
SELECT 
    id_utilisateur,
    'NomAdmin' || row_number,
    'PrenomAdmin' || row_number
FROM (SELECT id_utilisateur, ROW_NUMBER() OVER () AS row_number FROM Utilisateur LIMIT 50)
WHERE row_number % 2 = 0;  -- Insérer uniquement les utilisateurs ayant le rôle admin




INSERT INTO Programme (code_programme, nom_programme, niveau, credits_requis)
SELECT 
    'PROG' || printf('%03d', row_number + 100) AS code_programme,
    CASE (row_number % 5)
        WHEN 0 THEN 'Informatique'
        WHEN 1 THEN 'Génie électrique'
        WHEN 2 THEN 'Administration'
        WHEN 3 THEN 'Psychologie'
        ELSE 'Biologie'
    END || ' ' || row_number,
    CASE (row_number % 3)
        WHEN 0 THEN 'Baccalauréat'
        WHEN 1 THEN 'Maîtrise'
        ELSE 'Doctorat'
    END,
    90 + (row_number * 3)
FROM (SELECT ROW_NUMBER() OVER () AS row_number FROM sqlite_master LIMIT 50);

-- Insertion des années académiques
INSERT INTO AnneeAcademique (annee, date_debut, date_fin)
VALUES 
    ('2020-2021', '2020-09-01', '2021-08-31'),
    ('2021-2022', '2021-09-01', '2022-08-31'),
    ('2022-2023', '2022-09-01', '2023-08-31'),
    ('2023-2024', '2023-09-01', '2024-08-31'),
    ('2024-2025', '2024-09-01', '2025-08-31'),
    ('2025-2026', '2025-09-01', '2026-08-31'),
    ('2026-2027', '2026-09-01', '2027-08-31'),
    ('2027-2028', '2027-09-01', '2028-08-31'),
    ('2028-2029', '2028-09-01', '2029-08-31'),
    ('2029-2030', '2029-09-01', '2030-08-31');




-- Insérer les étudiants
INSERT INTO Etudiant (id_utilisateur, id_programme, matricule, nom, prenom, date_naissance, date_inscription)
SELECT 
    u.id_utilisateur,
    (row_number % 10) + 1,  -- Affectation d'un id_programme basé sur row_number
    'E' || printf('%06d', 200000 + row_number) AS matricule,
    CASE 
        WHEN row_number % 5 = 0 THEN 'Dupont'
        WHEN row_number % 5 = 1 THEN 'Lemoine'
        WHEN row_number % 5 = 2 THEN 'Martin'
        WHEN row_number % 5 = 3 THEN 'Bernard'
        ELSE 'Dufresne'
    END AS nom,  -- Génération de noms réalistes
    CASE 
        WHEN row_number % 4 = 0 THEN 'Alice'
        WHEN row_number % 4 = 1 THEN 'Bob'
        WHEN row_number % 4 = 2 THEN 'Claire'
        ELSE 'David'
    END AS prenom,  -- Génération de prénoms réalistes
    date('1990-01-01', '+' || (row_number * 100) || ' days') AS date_naissance,  -- Date de naissance réaliste
    date('2020-09-01', '+' || (row_number * 30) || ' days') AS date_inscription  -- Date d'inscription réaliste
FROM 
    (SELECT ROW_NUMBER() OVER () AS row_number FROM sqlite_master LIMIT 50) AS rn
JOIN 
    Utilisateur u ON rn.row_number = u.id_utilisateur;  -- Associer chaque row_number à un utilisateur



INSERT INTO Session (id_annee, nom_session, date_debut, date_fin)
SELECT 
    (row_number % 10) + 1,
    CASE (row_number % 3)
        WHEN 0 THEN 'Automne'
        WHEN 1 THEN 'Hiver'
        ELSE 'Été'
    END || ' ' || (2020 + (row_number / 3)),
    date('2020-09-01', '+' || (row_number * 120) || ' days'),
    date('2020-12-20', '+' || (row_number * 120) || ' days')
FROM (SELECT ROW_NUMBER() OVER () AS row_number FROM sqlite_master LIMIT 50);


INSERT INTO Cours (id_etudiant, id_session, code_cours, nom_cours, credits, description)
SELECT 
    e.id_utilisateur,  -- Liaison avec un étudiant
    (row_number % 10) + 1,  -- Association avec une session
    'COURS' || printf('%03d', row_number + 100) AS code_cours,
    'Cours ' || row_number,
    (row_number % 3) + 1,  -- Nombre de crédits
    'Description du cours ' || row_number
FROM (SELECT ROW_NUMBER() OVER () AS row_number FROM sqlite_master LIMIT 50) AS rn
JOIN Etudiant e ON rn.row_number = e.id_utilisateur;  -- Associer chaque ligne à un étudiant



INSERT INTO Note (id_etudiant, id_cours, id_session, note, date_obtention)
SELECT 
    (row_number % 10) + 1,
    (row_number % 10) + 1,
    (row_number % 10) + 1,
    CAST(60 + ((row_number * 4) % 41) AS DECIMAL(5,2)),  -- Générer une note aléatoire mais cohérente
    date('2020-12-20', '+' || (row_number * 7) || ' days')
FROM (SELECT ROW_NUMBER() OVER () AS row_number FROM sqlite_master LIMIT 50);


INSERT INTO Objectif (id_etudiant, id_cours, id_session, id_annee, description, date_creation, date_echeance, statut, type_objectif)
SELECT 
    (row_number % 10) + 1,
    (row_number % 10) + 1,
    (row_number % 10) + 1,
    (row_number % 10) + 1,
    'Objectif ' || row_number,
    date('2020-09-01', '+' || ((row_number * 7) % 365) || ' days'),
    date('2020-12-20', '+' || ((row_number * 7) % 365) || ' days'),
    CASE (row_number % 3)
        WHEN 0 THEN 'En cours'
        WHEN 1 THEN 'Complété'
        ELSE 'À faire'
    END,
    CASE (row_number % 4)
        WHEN 0 THEN 'Académique'
        WHEN 1 THEN 'Personnel'
        WHEN 2 THEN 'Professionnel'
        ELSE 'Autre'
    END
FROM (SELECT ROW_NUMBER() OVER () AS row_number FROM sqlite_master LIMIT 50);



INSERT INTO Evenement (id_etudiant, id_cours, titre, description, date_debut, date_fin, type)
SELECT
    (row_number % 10) + 1,
    (row_number % 10) + 1,
    CASE (row_number % 5)
        WHEN 0 THEN 'Examen final'
        WHEN 1 THEN 'Présentation de projet'
        WHEN 2 THEN 'Atelier pratique'
        WHEN 3 THEN 'Conférence invitée'
        ELSE 'Séance de révision'
    END || ' - ' || row_number,
    'Cet événement est crucial pour ' || 
    CASE (row_number % 5)
        WHEN 0 THEN 'évaluer les connaissances acquises'
        WHEN 1 THEN 'démontrer les compétences développées'
        WHEN 2 THEN 'appliquer les concepts théoriques'
        WHEN 3 THEN 'élargir les perspectives professionnelles'
        ELSE 'consolider les apprentissages'
    END,
    datetime('2020-09-01T09:00:00', '+' || ((row_number * 3)) || ' days'),
    datetime('2020-09-01T11:00:00', '+' || ((row_number * 3)) || ' days'),
    CASE (row_number % 4)
        WHEN 0 THEN 'Cours'
        WHEN 1 THEN 'Examen'
        WHEN 2 THEN 'Atelier'
        ELSE 'Autre'
    END
FROM (SELECT ROW_NUMBER() OVER () AS row_number FROM sqlite_master LIMIT 50);
