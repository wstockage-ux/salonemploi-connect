-- =============================================================================
-- SalonEmploi Connect — Base de Données Relationnelle MySQL 8.0
-- Livrable 7 : Jeu de données de démonstration complet (Seeders SQL)
-- Mot de passe par défaut pour tous les comptes : Password123!
-- Hash Bcrypt : $2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi
-- =============================================================================

USE `salonemploi_connect`;

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Insertion des Rôles
INSERT INTO `roles` (`id`, `code`, `libelle`, `description`) VALUES
(1, 'admin', 'Administrateur / Coordination', 'Supervision globale, gestion des portefeuilles, exports et pilotage des quotas.'),
(2, 'agent', 'Agent Opérationnel', 'Gestion de son portefeuille attribué, validation d offres, MER, coaching et suivi d insertion.'),
(3, 'entreprise', 'Entreprise Recruteur', 'Dépôt d offres, consultation des candidatures, entretiens et décisions d embauche.'),
(4, 'de', 'Demandeur d Emploi', 'Profil, compétences, CV, consultation des offres, postulation en 1 clic et suivi des RDV.');

-- 2. Insertion des Utilisateurs principaux
-- Mot de passe commun : Password123!
INSERT INTO `utilisateurs` (`id`, `role_id`, `email`, `telephone`, `password`, `actif`, `consentement_rgpd`, `date_consentement`, `derniere_connexion_at`) VALUES
-- 1 Administrateur / Coordination
(1, 1, 'coordination@salonemploi.fr', '0140000001', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 1, NOW(), NOW()),

-- 15 Agents opérationnels (ID 2 à 16)
(2, 2, 'agent.bernard@salonemploi.fr', '0601000001', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 1, NOW(), NOW()),
(3, 2, 'agent.dubois@salonemploi.fr', '0601000002', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 1, NOW(), NOW()),
(4, 2, 'agent.thomas@salonemploi.fr', '0601000003', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 1, NOW(), NOW()),
(5, 2, 'agent.robert@salonemploi.fr', '0601000004', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 1, NOW(), NOW()),
(6, 2, 'agent.richard@salonemploi.fr', '0601000005', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 1, NOW(), NOW()),
(7, 2, 'agent.petit@salonemploi.fr', '0601000006', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 1, NOW(), NOW()),
(8, 2, 'agent.durand@salonemploi.fr', '0601000007', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 1, NOW(), NOW()),
(9, 2, 'agent.leroy@salonemploi.fr', '0601000008', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 1, NOW(), NOW()),
(10, 2, 'agent.moreau@salonemploi.fr', '0601000009', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 1, NOW(), NOW()),
(11, 2, 'agent.simon@salonemploi.fr', '0601000010', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 1, NOW(), NOW()),
(12, 2, 'agent.laurent@salonemploi.fr', '0601000011', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 1, NOW(), NOW()),
(13, 2, 'agent.lefebvre@salonemploi.fr', '0601000012', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 1, NOW(), NOW()),
(14, 2, 'agent.michel@salonemploi.fr', '0601000013', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 1, NOW(), NOW()),
(15, 2, 'agent.garcia@salonemploi.fr', '0601000014', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 1, NOW(), NOW()),
(16, 2, 'agent.david@salonemploi.fr', '0601000015', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 1, NOW(), NOW()),

-- Entreprises (ID 17 à 26)
(17, 3, 'rh@novatech-solutions.fr', '0145203040', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 1, NOW(), NOW()),
(18, 3, 'contact@batiprestige.fr', '0148123456', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 1, NOW(), NOW()),
(19, 3, 'recrutement@clinique-st-jean.fr', '0153009988', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 1, NOW(), NOW()),
(20, 3, 'rh@grandhotel-etoile.com', '0142998877', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 1, NOW(), NOW()),
(21, 3, 'carrieres@trans-express-logistique.fr', '0188776655', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 1, NOW(), NOW()),
(22, 3, 'rh@ecorecycle-industries.com', '0177665544', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 1, NOW(), NOW()),
(23, 3, 'emploi@supermarches-saveurs.fr', '0166554433', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 1, NOW(), NOW()),
(24, 3, 'talents@cyberprotect-france.com', '0155443322', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 1, NOW(), NOW()),
(25, 3, 'rh@energie-verte-habitat.fr', '0144332211', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 1, NOW(), NOW()),
(26, 3, 'recrutement@restauration-terroir.fr', '0133221100', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 1, NOW(), NOW()),

-- Demandeurs d'emploi (ID 27 à 36)
(27, 4, 'yacine.b@email.fr', '0781001122', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 1, NOW(), NOW()),
(28, 4, 'sarah.m@email.fr', '0782002233', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 1, NOW(), NOW()),
(29, 4, 'kevin.d@email.fr', '0783003344', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 1, NOW(), NOW()),
(30, 4, 'fatima.z@email.fr', '0784004455', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 1, NOW(), NOW()),
(31, 4, 'thomas.l@email.fr', '0785005566', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 1, NOW(), NOW()),
(32, 4, 'amine.k@email.fr', '0786006677', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 1, NOW(), NOW()),
(33, 4, 'julie.p@email.fr', '0787007788', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 1, NOW(), NOW()),
(34, 4, 'mohamed.t@email.fr', '0788008899', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 1, NOW(), NOW()),
(35, 4, 'claire.v@email.fr', '0789009900', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 1, NOW(), NOW()),
(36, 4, 'lucas.g@email.fr', '0780001234', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 1, NOW(), NOW());

-- 3. Fiches des 15 Agents
INSERT INTO `agents` (`id`, `utilisateur_id`, `matricule`, `nom`, `prenom`, `telephone_pro`, `pole_affectation`) VALUES
(1, 2, 'AGT-001', 'Bernard', 'Marc', '0601000001', 'Pôle Numérique & Industrie'),
(2, 3, 'AGT-002', 'Dubois', 'Sophie', '0601000002', 'Pôle BTP & Énergie'),
(3, 4, 'AGT-003', 'Thomas', 'David', '0601000003', 'Pôle Santé & Médico-social'),
(4, 5, 'AGT-004', 'Robert', 'Émilie', '0601000004', 'Pôle Hôtellerie & Restauration'),
(5, 6, 'AGT-005', 'Richard', 'Julien', '0601000005', 'Pôle Logistique & Transport'),
(6, 7, 'AGT-006', 'Petit', 'Camille', '0601000006', 'Pôle Commerce & Vente'),
(7, 8, 'AGT-007', 'Durand', 'Alexandre', '0601000007', 'Pôle Tertiaire & Banque'),
(8, 9, 'AGT-008', 'Leroy', 'Nathalie', '0601000008', 'Pôle Services à la personne'),
(9, 10, 'AGT-009', 'Moreau', 'Sébastien', '0601000009', 'Pôle Environnement & Transition'),
(10, 11, 'AGT-010', 'Simon', 'Laura', '0601000010', 'Pôle Numérique & Cybersécurité'),
(11, 12, 'AGT-011', 'Laurent', 'Guillaume', '0601000011', 'Pôle Agroalimentaire'),
(12, 13, 'AGT-012', 'Lefebvre', 'Aurélie', '0601000012', 'Pôle Métallurgie & Mécanique'),
(13, 14, 'AGT-013', 'Michel', 'Stéphane', '0601000013', 'Pôle Événementiel & Sécurité'),
(14, 15, 'AGT-014', 'Garcia', 'Inès', '0601000014', 'Pôle Artisanat & Maintenance'),
(15, 16, 'AGT-015', 'David', 'Romain', '0601000015', 'Pôle Transport Voyageurs & Fret');

-- 4. Objectifs individuels des 15 Agents
INSERT INTO `objectifs` (`agent_id`, `annee`, `cible_entreprises`, `cible_offres`, `cible_mer`, `cible_insertions`) VALUES
(1, 2026, 4, 70, 270, 50),
(2, 2026, 4, 70, 270, 50),
(3, 2026, 4, 70, 270, 50),
(4, 2026, 3, 65, 260, 48),
(5, 2026, 3, 65, 260, 48),
(6, 2026, 3, 65, 260, 48),
(7, 2026, 3, 65, 260, 48),
(8, 2026, 3, 65, 260, 48),
(9, 2026, 3, 65, 260, 48),
(10, 2026, 4, 70, 270, 50),
(11, 2026, 3, 65, 260, 48),
(12, 2026, 3, 65, 260, 48),
(13, 2026, 3, 65, 260, 48),
(14, 2026, 3, 65, 260, 48),
(15, 2026, 4, 70, 270, 50);

-- 5. Fiches Entreprises avec Agent Référent
INSERT INTO `entreprises` (`id`, `utilisateur_id`, `agent_referent_id`, `raison_sociale`, `siret`, `secteur_activite`, `adresse`, `ville`, `code_postal`, `contact_nom`, `contact_prenom`, `contact_fonction`, `contact_telephone`, `contact_email`, `description`, `stand_numero`) VALUES
(1, 17, 1, 'NovaTech Solutions', '80123456700012', 'Numérique', '12 Avenue des Champs', 'Paris', '75008', 'Vidal', 'Caroline', 'Directrice RH', '0145203040', 'rh@novatech-solutions.fr', 'ESN spécialisée dans le développement web, cloud et IA.', 'A-01'),
(2, 18, 2, 'Bâti Prestige IDF', '79234567800023', 'BTP', '45 Rue de l Industrie', 'Nanterre', '92000', 'Dupont', 'François', 'Responsable Recrutement', '0148123456', 'contact@batiprestige.fr', 'Entreprise générale de bâtiment gros œuvre et second œuvre.', 'B-04'),
(3, 19, 3, 'Clinique Médicale Saint-Jean', '81245678900034', 'Santé', '8 Boulevard Magenta', 'Paris', '75010', 'Morel', 'Béatrice', 'DRH', '0153009988', 'recrutement@clinique-st-jean.fr', 'Établissement de soins privés pluridisciplinaire.', 'C-02'),
(4, 20, 4, 'Grand Hôtel de l Étoile', '78156789000045', 'Hôtellerie-Restauration', '2 Rue de Friedland', 'Paris', '75017', 'Leclerc', 'Thierry', 'Directeur d Exploitation', '0142998877', 'rh@grandhotel-etoile.com', 'Hôtel 4 étoiles & restaurant bistronomique au cœur de Paris.', 'D-01'),
(5, 21, 5, 'Trans Express Logistique', '82367890100056', 'Logistique', 'ZAC des Vignes', 'Roissy', '95700', 'Bertrand', 'Sandrine', 'Responsable Emploi', '0188776655', 'carrieres@trans-express-logistique.fr', 'Hub logistique spécialisé dans le fret express et e-commerce.', 'E-03'),
(6, 22, 9, 'EcoRecycle Industries', '83478901200067', 'Environnement', '18 Route Verte', 'Saint-Denis', '93200', 'Garnier', 'Maxime', 'Responsable Site', '0177665544', 'rh@ecorecycle-industries.com', 'Pionnier du recyclage des métaux et valorisation des déchets.', 'B-12'),
(7, 23, 6, 'Supermarchés Les Saveurs', '84589012300078', 'Commerce', '100 Rue Nationale', 'Créteil', '94000', 'Aubry', 'Valérie', 'Responsable Régionale RH', '0166554433', 'emploi@supermarches-saveurs.fr', 'Réseau de 15 supermarchés de proximité en Île-de-France.', 'F-05'),
(8, 24, 10, 'CyberProtect France', '85690123400089', 'Numérique', '25 Rue de Berri', 'Paris', '75008', 'Roche', 'Alain', 'CISO & DRH', '0155443322', 'talents@cyberprotect-france.com', 'Cabinet d audit et de réponse aux incidents de sécurité.', 'A-02'),
(9, 25, 2, 'Énergie Verte Habitat', '86701234500090', 'BTP / Énergie', '3 Impasse Volta', 'Montreuil', '93100', 'Navarro', 'Lucie', 'Chargée de Recrutement', '0144332211', 'rh@energie-verte-habitat.fr', 'Installation de pompes à chaleur, isolation thermique et photovoltaïque.', 'B-05'),
(10, 26, 4, 'Restauration & Terroirs', '87812345600001', 'Hôtellerie-Restauration', '14 Rue Saint-Honoré', 'Paris', '75001', 'Picard', 'Gilles', 'Chef Exécutif & Gérant', '0133221100', 'recrutement@restauration-terroir.fr', 'Groupe de 4 brasseries parisiennes traditionnelles.', 'D-02');

-- 6. Offres d'emploi avec compétences JSON
INSERT INTO `offres` (`id`, `entreprise_id`, `agent_validateur_id`, `reference`, `intitule`, `description`, `nombre_postes`, `type_contrat`, `niveau_etudes`, `competences_requises`, `experience_requise_mois`, `ville`, `code_postal`, `teletravail`, `remuneration_fourchette`, `date_limite`, `statut`, `date_validation`) VALUES
(1, 1, 1, 'OFF-2026-001', 'Développeur Full-Stack React / Laravel', 'Développement de fonctionnalités web pour nos plateformes clients, tests unitaires et intégration continue.', 2, 'CDI', 'Bac_3', '["React", "PHP", "Laravel", "MySQL", "Git"]', 24, 'Paris', '75008', 1, '38k - 45k €', '2026-11-30', 'publiee', NOW()),
(2, 1, 1, 'OFF-2026-002', 'Technicien Support Applicatif & Réseau', 'Assistance aux utilisateurs, diagnostic de niveau 1 et 2, gestion de parc informatique.', 1, 'CDD', 'Bac_2', '["Support N2", "Réseaux", "Windows", "Linux", "Relation client"]', 12, 'Paris', '75008', 0, '26k - 30k €', '2026-11-20', 'publiee', NOW()),
(3, 2, 2, 'OFF-2026-003', 'Chef d Équipe Gros Œuvre', 'Coordination de chantiers, encadrement d une équipe de 6 maçons, respect des consignes de sécurité.', 3, 'CDI', 'CAP_BEP', '["Maçonnerie", "Gestion de chantier", "Lecture de plans", "Sécurité BTP"]', 36, 'Nanterre', '92000', 0, '32k - 38k €', '2026-12-05', 'publiee', NOW()),
(4, 2, 2, 'OFF-2026-004', 'Électricien Bâtiment Confirmé', 'Tirage de câbles, pose d appareillages, raccordements armoires électriques dans logements neufs.', 2, 'CDI', 'CAP_BEP', '["Électricité", "Habilitation B1V", "Câblage", "Dépannage"]', 18, 'Nanterre', '92000', 0, '27k - 32k €', '2026-11-25', 'publiee', NOW()),
(5, 3, 3, 'OFF-2026-005', 'Infirmier Diplômé d État (IDE)', 'Prise en charge globale des patients hospitalisés, administration des soins et surveillance.', 4, 'CDI', 'Bac_3', '["Soins infirmiers", "Diplôme IDE", "Empathie", "Travail en équipe", "Rigueur"]', 6, 'Paris', '75010', 0, '30k - 36k €', '2026-11-15', 'publiee', NOW()),
(6, 3, 3, 'OFF-2026-006', 'Aide-Soignant(e) de Jour', 'Assistance aux actes de la vie quotidienne, hygiène et confort des patients de la clinique.', 3, 'CDI', 'CAP_BEP', '["Aide aux soins", "Hygiène hospitalière", "Écoute", "DEAS requis"]', 0, 'Paris', '75010', 0, '23k - 26k €', '2026-11-18', 'publiee', NOW()),
(7, 4, 4, 'OFF-2026-007', 'Chef de Rang Hôtellerie 4*', 'Accueil de la clientèle internationale, service en salle, conseil sur la carte des vins.', 2, 'CDI', 'Bac', '["Service en salle", "Anglais courant", "Savoir-être", "Gestion de rang"]', 24, 'Paris', '75017', 0, '28k - 33k €', '2026-11-22', 'publiee', NOW()),
(8, 4, 4, 'OFF-2026-008', 'Commis de Cuisine', 'Préparation des mises en place, découpe des denrées et cuisson sous la responsabilité du Chef.', 2, 'CDD', 'CAP_BEP', '["Cuisine traditionnelle", "Normes HACCP", "Rapidité", "Polyvalence"]', 6, 'Paris', '75017', 0, '22k - 25k €', '2026-11-12', 'publiee', NOW()),
(9, 5, 5, 'OFF-2026-009', 'Préparateur de Commandes CACES 1', 'Picking vocal, préparation des palettes et contrôle qualité avant expédition colis.', 5, 'Interim', 'Sans_diplome', '["CACES 1", "Préparation commandes", "Dynamisme", "Port de charges"]', 3, 'Roissy', '95700', 0, 'Smic + primes', '2026-11-10', 'publiee', NOW()),
(10, 5, 5, 'OFF-2026-010', 'Gestionnaire de Quai et Réception', 'Vérification des bordereaux de livraison, déchargement des camions et saisie informatique WMS.', 1, 'CDI', 'Bac', '["CACES 3", "WMS Logistique", "Inventaires", "Organisation"]', 12, 'Roissy', '95700', 0, '25k - 28k €', '2026-11-30', 'publiee', NOW()),
(11, 8, 10, 'OFF-2026-011', 'Analyste SOC Junior', 'Surveillance des alertes de sécurité, analyse des journaux d événements, gestion d incidents.', 2, 'CDI', 'Bac_5_plus', '["Cybersécurité", "SIEM", "Splunk", "Réseaux", "Analyse logs"]', 12, 'Paris', '75008', 1, '42k - 48k €', '2026-12-01', 'publiee', NOW()),
(12, 7, 6, 'OFF-2026-012', 'Hôte / Hôtesse de Caisse Polyvalent(e)', 'Encaissement des clients, tenue du rayon fruits et légumes, réassort en rayon.', 3, 'CDI', 'Sans_diplome', '["Sens du contact", "Caisse", "Rigueur", "Polyvalence"]', 0, 'Créteil', '94000', 0, 'Smic horaire', '2026-11-14', 'publiee', NOW()),
(13, 9, 2, 'OFF-2026-013', 'Technicien Installateur Pompe à Chaleur', 'Pose et mise en service de PAC air-eau et climatisation chez les particuliers.', 2, 'CDI', 'CAP_BEP', '["Plomberie", "Chauffage", "Fluides frigorigènes", "Permis B"]', 18, 'Montreuil', '93100', 0, '30k - 36k €', '2026-11-28', 'publiee', NOW()),
(14, 10, 4, 'OFF-2026-014', 'Barman / Barmaid Mixologiste', 'Confection de cocktails signature, gestion des stocks et animation du bar en soirée.', 1, 'CDI', 'CAP_BEP', '["Cocktails", "Service bar", "Aisance relationnelle", "Anglais"]', 12, 'Paris', '75001', 0, '26k - 30k €', '2026-11-19', 'en_validation', NULL),
(15, 6, 9, 'OFF-2026-015', 'Opérateur de Tri Matières Recyclables', 'Tri sur chaîne industrielle, séparation des métaux et respect strict des règles de sécurité.', 4, 'CDD', 'Sans_diplome', '["Tri industriel", "Endurance", "Ponctualité", "Esprit d équipe"]', 0, 'Saint-Denis', '93200', 0, 'Smic horaire', '2026-11-16', 'publiee', NOW());

-- 7. Demandeurs d'emploi avec compétences et critères de recherche
INSERT INTO `demandeurs_emploi` (`id`, `utilisateur_id`, `agent_referent_id`, `numero_de`, `nom`, `prenom`, `date_naissance`, `adresse`, `ville`, `code_postal`, `rayon_mobilite_km`, `niveau_etudes`, `filiere_formation`, `experience_annees`, `competences`, `types_contrats_recherches`, `statut_recherche`, `cv_path`, `cv_nom_original`) VALUES
(1, 27, 1, 'DE-75-00123', 'Bensaid', 'Yacine', '1998-04-14', '12 Rue Pajol', 'Paris', '75018', 20, 'Bac_3', 'Licence Pro Développement Web', 3, '["React", "JavaScript", "PHP", "Laravel", "MySQL", "Git"]', '["CDI", "Alternance"]', 'actif', '/storage/app/private/cvs/cv_yacine_b.pdf', 'CV_Yacine_Bensaid_Dev.pdf'),
(2, 28, 3, 'DE-75-00124', 'Mansouri', 'Sarah', '1995-09-22', '34 Rue de Belleville', 'Paris', '75020', 15, 'Bac_3', 'Diplôme d État Infirmier (IDE)', 4, '["Soins infirmiers", "Diplôme IDE", "Urgences", "Empathie", "Travail en équipe"]', '["CDI"]', 'actif', '/storage/app/private/cvs/cv_sarah_m.pdf', 'CV_Sarah_Mansouri_IDE.pdf'),
(3, 29, 2, 'DE-92-00456', 'Diallo', 'Kévin', '2001-02-11', '5 Rue des Bas', 'Asnières', '92600', 30, 'CAP_BEP', 'CAP Électricien', 2, '["Électricité", "Câblage", "Dépannage", "Habilitation B1V", "Permis B"]', '["CDI", "CDD"]', 'actif', '/storage/app/private/cvs/cv_kevin_d.pdf', 'CV_Kevin_Diallo_Electricien.pdf'),
(4, 30, 4, 'DE-75-00789', 'Zahraoui', 'Fatima', '1999-11-03', '15 Rue de Crimée', 'Paris', '75019', 15, 'Bac', 'Bac Pro Métiers de l Hôtellerie', 3, '["Service en salle", "Anglais courant", "Gestion de rang", "Savoir-être"]', '["CDI", "CDD"]', 'actif', '/storage/app/private/cvs/cv_fatima_z.pdf', 'CV_Fatima_Zahraoui_Hotellerie.pdf'),
(5, 31, 5, 'DE-93-00321', 'Leroy', 'Thomas', '2003-07-19', '8 Rue Gabriel Péri', 'Aulnay-sous-Bois', '93600', 35, 'Sans_diplome', 'Niveau Bac', 1, '["CACES 1", "Préparation commandes", "Dynamisme", "Port de charges", "CACES 3"]', '["CDI", "Interim", "CDD"]', 'actif', '/storage/app/private/cvs/cv_thomas_l.pdf', 'CV_Thomas_Leroy_Logistique.pdf'),
(6, 32, 10, 'DE-75-00852', 'Khelifi', 'Amine', '1997-05-30', '42 Rue Saint-Maur', 'Paris', '75011', 25, 'Bac_5_plus', 'Master Sécurité des SI', 2, '["Cybersécurité", "SIEM", "Splunk", "Python", "Réseaux", "Linux"]', '["CDI"]', 'actif', '/storage/app/private/cvs/cv_amine_k.pdf', 'CV_Amine_Khelifi_Cyber.pdf'),
(7, 33, 6, 'DE-94-00654', 'Petit', 'Julie', '2002-12-05', '19 Avenue Foch', 'Saint-Maur', '94100', 15, 'Sans_diplome', 'Brevet des Collèges', 1, '["Caisse", "Sens du contact", "Polyvalence", "Rigueur"]', '["CDI", "CDD"]', 'actif', '/storage/app/private/cvs/cv_julie_p.pdf', 'CV_Julie_Petit_Commerce.pdf'),
(8, 34, 2, 'DE-93-00987', 'Traoré', 'Mohamed', '1996-03-17', '7 Rue Victor Hugo', 'Bondy', '93140', 30, 'CAP_BEP', 'CAP Installateur Thermique', 3, '["Plomberie", "Chauffage", "Fluides frigorigènes", "Permis B", "Soudure"]', '["CDI"]', 'actif', '/storage/app/private/cvs/cv_mohamed_t.pdf', 'CV_Mohamed_Traore_Chauffagiste.pdf'),
(9, 35, 1, 'DE-75-00147', 'Vallet', 'Claire', '2000-08-08', '27 Rue de Vaugirard', 'Paris', '75015', 20, 'Bac_2', 'BTS SIO Option Réseaux', 2, '["Support N2", "Réseaux", "Windows", "Linux", "Relation client", "Ticketing"]', '["CDI", "CDD"]', 'actif', '/storage/app/private/cvs/cv_claire_v.pdf', 'CV_Claire_Vallet_Support.pdf'),
(10, 36, 4, 'DE-75-00369', 'Gauthier', 'Lucas', '2001-10-14', '6 Rue Mouffetard', 'Paris', '75005', 10, 'CAP_BEP', 'CAP Cuisine', 2, '["Cuisine traditionnelle", "Normes HACCP", "Rapidité", "Polyvalence", "Dressage"]', '["CDI", "CDD"]', 'actif', '/storage/app/private/cvs/cv_lucas_g.pdf', 'CV_Lucas_Gauthier_Cuisine.pdf');

-- 8. Candidatures
INSERT INTO `candidatures` (`id`, `offre_id`, `demandeur_emploi_id`, `type_origine`, `lettre_motivation`, `statut`, `date_candidature`) VALUES
(1, 1, 1, 'issue_mer', 'Passionné par le développement d applications modernes, je serais ravi de rejoindre NovaTech.', 'entretien_programme', DATE_SUB(NOW(), INTERVAL 3 DAY)),
(2, 2, 9, 'spontanee', 'Mon expérience en BTS et mes stages en support informatique correspondent parfaitement à vos attentes.', 'preselectionnee', DATE_SUB(NOW(), INTERVAL 2 DAY)),
(3, 4, 3, 'issue_mer', 'Électricien habilité et motivé, disponible immédiatement sur Nanterre et l ouest parisien.', 'entretien_programme', DATE_SUB(NOW(), INTERVAL 4 DAY)),
(4, 5, 2, 'spontanee', 'IDE avec 4 ans d expérience en milieu clinique, je souhaite intégrer votre équipe de soins.', 'retenue', DATE_SUB(NOW(), INTERVAL 7 DAY)),
(5, 7, 4, 'issue_mer', 'Bilingue anglais et expérimentée dans le service gastronomique et hôtelier.', 'entretien_programme', DATE_SUB(NOW(), INTERVAL 1 DAY)),
(6, 9, 5, 'spontanee', 'Titulaire des CACES 1 et 3 avec expérience en préparation vocale de commandes.', 'recue', NOW()),
(7, 11, 6, 'issue_mer', 'Diplômé d un Master en Cybersécurité, prêt à intervenir sur vos missions SOC.', 'entretien_programme', DATE_SUB(NOW(), INTERVAL 5 DAY)),
(8, 12, 7, 'spontanee', 'Souriante, ponctuelle et disponible le samedi pour vos points d encaissement.', 'preselectionnee', DATE_SUB(NOW(), INTERVAL 3 DAY)),
(9, 13, 8, 'issue_mer', 'Spécialiste de la pompe à chaleur avec attestation d aptitude fluides frigorigènes.', 'entretien_programme', DATE_SUB(NOW(), INTERVAL 2 DAY)),
(10, 8, 10, 'spontanee', 'Cuisinier rigoureux, passionné par le respect des produits frais et les normes HACCP.', 'preselectionnee', DATE_SUB(NOW(), INTERVAL 4 DAY));

-- 9. Mises en relation (MER) avec calculs de score pondérés
-- Compétences (50%), Mobilité (25%), Études (15%), Contrat (10%)
INSERT INTO `mises_en_relation` (`id`, `offre_id`, `demandeur_emploi_id`, `agent_initiateur_id`, `score_matching`, `detail_score`, `statut`, `commentaire_agent`) VALUES
(1, 1, 1, 1, 95.00, '{"competences": 50.0, "mobilite": 25.0, "etudes": 15.0, "contrat": 5.0}', 'convertie_candidature', 'Excellente adéquation technique (React/Laravel) et mobilité immédiate sur Paris 8.'),
(2, 4, 3, 2, 92.50, '{"competences": 47.5, "mobilite": 25.0, "etudes": 10.0, "contrat": 10.0}', 'convertie_candidature', 'Habilitation électrique valide et habite à proximité directe du chantier de Nanterre.'),
(3, 7, 4, 4, 90.00, '{"competences": 45.0, "mobilite": 25.0, "etudes": 10.0, "contrat": 10.0}', 'convertie_candidature', 'Excellente présentation, anglais fluide vérifié lors de l entretien de cadrage.'),
(4, 11, 6, 10, 96.00, '{"competences": 48.0, "mobilite": 23.0, "etudes": 15.0, "contrat": 10.0}', 'convertie_candidature', 'Profil rare sur le marché, certifié Splunk et autonome en analyse de menaces.'),
(5, 13, 8, 2, 91.00, '{"competences": 46.0, "mobilite": 25.0, "etudes": 10.0, "contrat": 10.0}', 'convertie_candidature', 'Technicien expérimenté et véhiculé pour les chantiers de pose résidentielle.'),
(6, 2, 9, 1, 88.00, '{"competences": 43.0, "mobilite": 25.0, "etudes": 10.0, "contrat": 10.0}', 'proposee', 'Profil polyvalent et autonome en support utilisateur.'),
(7, 3, 3, 2, 74.00, '{"competences": 32.0, "mobilite": 25.0, "etudes": 7.0, "contrat": 10.0}', 'proposee', 'Connaissances en gros œuvre mais profil orienté électricité : option secondaire.');

-- 10. Entretiens programmés au salon
INSERT INTO `entretiens` (`id`, `candidature_id`, `date_heure_debut`, `date_heure_fin`, `modalite`, `lieu_ou_lien`, `statut`, `compte_rendu`, `rappel_envoye`) VALUES
(1, 1, '2026-11-15 09:30:00', '2026-11-15 09:50:00', 'presentiel', 'Stand A-01 (NovaTech)', 'confirme', 'Candidat très structuré, maîtrise bien les concepts React et API REST.', 1),
(2, 3, '2026-11-15 10:00:00', '2026-11-15 10:20:00', 'presentiel', 'Stand B-04 (Bâti Prestige)', 'confirme', 'Expérience solide de terrain, bonne compréhension des schémas d armoires.', 1),
(3, 5, '2026-11-15 11:00:00', '2026-11-15 11:20:00', 'presentiel', 'Stand D-01 (Grand Hôtel)', 'confirme', 'Très bonne élocution, test d anglais concluant sur la carte des menus.', 1),
(4, 7, '2026-11-15 14:00:00', '2026-11-15 14:30:00', 'visio', 'https://salonemploi.fr/visio/cyberprotect-01', 'confirme', 'Très bon niveau technique sur les scénarios d intrusion simulés.', 1),
(5, 9, '2026-11-15 14:30:00', '2026-11-15 14:50:00', 'presentiel', 'Stand B-05 (Énergie Verte)', 'confirme', 'Autonomie validée et permis B confirmé.', 1);

-- 11. Fiches de Coaching par DE
INSERT INTO `coaching` (`id`, `demandeur_emploi_id`, `agent_id`, `points_forts`, `axes_amelioration`, `note_simulation`, `notes_confidentielles`, `plan_action`) VALUES
(1, 1, 1, 'Aisance technique remarquable, portfolio GitHub clair, très bon relationnel.', 'Mieux synthétiser les réalisations en moins de 3 minutes chrono.', 17, 'Candidat à fort potentiel d embauche directe sur le salon. Priorité 1.', 'Affiner le pitch des 3 premiers projets professionnels.'),
(2, 3, 2, 'Ponctuel, méthodique, respect scrupuleux des normes de sécurité chantier.', 'Prendre davantage confiance à l oral face à un conducteur de travaux.', 15, 'Technicien sérieux et fiable, recommandation appuyée à François Dupont.', 'Répéter les questions types sur la gestion des imprévus sur chantier.'),
(3, 4, 4, 'Excellente tenue professionnelle, bilinguisme naturel français/anglais.', 'Poser davantage de questions sur les perspectives d évolution du poste.', 18, 'Profil idéal pour le Grand Hôtel de l Étoile.', 'Préparer 3 questions précises sur le fonctionnement de la brigade.'),
(4, 6, 10, 'Expertise pointue en analyse de logs, curiosité technique, veille active.', 'Vulgariser son discours pour les interlocuteurs non techniques.', 16, 'Très recherché, plusieurs entreprises du pôle numérique peuvent matcher.', 'Travailler la présentation des certifications acquises.');

-- 12. Insertions & Suivi post-salon
INSERT INTO `insertions` (`id`, `demandeur_emploi_id`, `entreprise_id`, `offre_id`, `agent_id`, `decision`, `type_contrat`, `intitule_poste`, `date_prise_poste`, `salaire_brut_mensuel`, `suivi_1m_statut`, `suivi_1m_date`, `suivi_3m_statut`, `suivi_3m_date`, `suivi_6m_statut`, `suivi_6m_date`, `notes_suivi`) VALUES
(1, 2, 3, 5, 3, 'embauche', 'CDI', 'Infirmière Diplômée d État', '2026-12-01', 2850.00, 'confirme_en_poste', '2027-01-05', 'confirme_en_poste', '2027-03-02', 'a_relancer', NULL, 'Intégration réussie au service de chirurgie ambulatoire. Très bons retours de la cadre de santé.'),
(2, 1, 1, 1, 1, 'periode_essai', 'CDI', 'Développeur Full-Stack', '2026-12-15', 3350.00, 'confirme_en_poste', '2027-01-20', 'a_relancer', NULL, 'a_relancer', NULL, 'Période d essai validée avec succès le premier mois. Autonome sur les sprints React.');

-- 13. Notifications (Journal et simulation des flux)
INSERT INTO `notifications` (`id`, `utilisateur_id`, `canal`, `titre`, `message`, `statut`, `date_envoi`) VALUES
(1, 27, 'sms', 'SalonEmploi : Entretien confirmé', 'Votre entretien chez NovaTech est fixé le 15/11 à 09h30 sur le stand A-01. Pensez à votre pièce d identité.', 'envoyee', NOW()),
(2, 27, 'email', 'Convocation à votre entretien de recrutement', 'Bonjour Yacine,\nVotre candidature pour le poste Développeur Full-Stack a retenu l attention de NovaTech. Rendez-vous stand A-01.', 'envoyee', NOW()),
(3, 17, 'email', 'Nouvelle candidature via MER', 'L agent Marc Bernard vous a proposé le profil de Yacine Bensaid (Score de correspondance : 95%).', 'envoyee', NOW()),
(4, 2, 'in_app', 'Offre validée', 'L offre OFF-2026-001 a été validée et publiée avec succès.', 'envoyee', NOW());

-- 14. Journal des Connexions (Audit légal RGPD)
INSERT INTO `journal_connexions` (`utilisateur_id`, `email_tente`, `adresse_ip`, `user_agent`, `statut`, `motif_echec`) VALUES
(1, 'coordination@salonemploi.fr', '192.168.1.10', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0', 'succes', NULL),
(2, 'agent.bernard@salonemploi.fr', '192.168.1.25', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) Safari/605.1', 'succes', NULL),
(17, 'rh@novatech-solutions.fr', '82.120.45.12', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/537.36', 'succes', NULL),
(27, 'yacine.b@email.fr', '90.85.12.34', 'Mozilla/5.0 (Linux; Android 14; SM-S918B) Chrome/120.0 Mobile', 'succes', NULL),
(NULL, 'hacker@test.com', '45.142.120.8', 'python-requests/2.31.0', 'echec', 'Identifiants invalides');

SET FOREIGN_KEY_CHECKS = 1;
