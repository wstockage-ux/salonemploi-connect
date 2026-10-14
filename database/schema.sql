-- =============================================================================
-- SalonEmploi Connect — Base de Données Relationnelle MySQL 8.0
-- Livrable 4 : Script DDL complet de création de la base et des tables
-- =============================================================================

CREATE DATABASE IF NOT EXISTS `salonemploi_connect`
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE `salonemploi_connect`;

-- Désactivation temporaire des vérifications de clés étrangères pour réinitialisation propre
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `journal_connexions`;
DROP TABLE IF EXISTS `notifications`;
DROP TABLE IF EXISTS `insertions`;
DROP TABLE IF EXISTS `coaching`;
DROP TABLE IF EXISTS `entretiens`;
DROP TABLE IF EXISTS `mises_en_relation`;
DROP TABLE IF EXISTS `candidatures`;
DROP TABLE IF EXISTS `offres`;
DROP TABLE IF EXISTS `demandeurs_emploi`;
DROP TABLE IF EXISTS `entreprises`;
DROP TABLE IF EXISTS `objectifs`;
DROP TABLE IF EXISTS `agents`;
DROP TABLE IF EXISTS `utilisateurs`;
DROP TABLE IF EXISTS `roles`;

SET FOREIGN_KEY_CHECKS = 1;

-- -----------------------------------------------------------------------------
-- 1. Table : roles
-- 4 profils stricts : admin, agent, entreprise, de
-- -----------------------------------------------------------------------------
CREATE TABLE `roles` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(30) NOT NULL,
    `libelle` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_roles_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 2. Table : utilisateurs
-- Gestion des identifiants sécurisés, mots de passe hachés et consentement RGPD
-- -----------------------------------------------------------------------------
CREATE TABLE `utilisateurs` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `role_id` BIGINT UNSIGNED NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `telephone` VARCHAR(25) NULL,
    `password` VARCHAR(255) NOT NULL,
    `actif` BOOLEAN NOT NULL DEFAULT TRUE,
    `email_verified_at` TIMESTAMP NULL,
    `telephone_verified_at` TIMESTAMP NULL,
    `consentement_rgpd` BOOLEAN NOT NULL DEFAULT FALSE,
    `date_consentement` TIMESTAMP NULL,
    `derniere_connexion_at` TIMESTAMP NULL,
    `remember_token` VARCHAR(100) NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` TIMESTAMP NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_utilisateurs_email` (`email`),
    KEY `idx_utilisateurs_role` (`role_id`),
    KEY `idx_utilisateurs_telephone` (`telephone`),
    KEY `idx_utilisateurs_actif` (`actif`),
    CONSTRAINT `fk_utilisateurs_role` FOREIGN KEY (`role_id`) 
        REFERENCES `roles` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 3. Table : agents
-- Profil des 15 agents opérationnels en charge de portefeuilles
-- -----------------------------------------------------------------------------
CREATE TABLE `agents` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `utilisateur_id` BIGINT UNSIGNED NOT NULL,
    `matricule` VARCHAR(50) NOT NULL,
    `nom` VARCHAR(100) NOT NULL,
    `prenom` VARCHAR(100) NOT NULL,
    `telephone_pro` VARCHAR(25) NULL,
    `pole_affectation` VARCHAR(100) NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_agents_utilisateur` (`utilisateur_id`),
    UNIQUE KEY `uk_agents_matricule` (`matricule`),
    KEY `idx_agents_nom_prenom` (`nom`, `prenom`),
    KEY `idx_agents_pole` (`pole_affectation`),
    CONSTRAINT `fk_agents_utilisateur` FOREIGN KEY (`utilisateur_id`) 
        REFERENCES `utilisateurs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 4. Table : objectifs
-- Objectifs chiffrés individuels par agent pour le salon
-- -----------------------------------------------------------------------------
CREATE TABLE `objectifs` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `agent_id` BIGINT UNSIGNED NOT NULL,
    `annee` INT NOT NULL DEFAULT 2026,
    `cible_entreprises` INT NOT NULL DEFAULT 4,
    `cible_offres` INT NOT NULL DEFAULT 70,
    `cible_mer` INT NOT NULL DEFAULT 270,
    `cible_insertions` INT NOT NULL DEFAULT 50,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_objectifs_agent_annee` (`agent_id`, `annee`),
    CONSTRAINT `fk_objectifs_agent` FOREIGN KEY (`agent_id`) 
        REFERENCES `agents` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 5. Table : entreprises
-- Fiche entreprise avec rattachement à son agent référent
-- -----------------------------------------------------------------------------
CREATE TABLE `entreprises` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `utilisateur_id` BIGINT UNSIGNED NOT NULL,
    `agent_referent_id` BIGINT UNSIGNED NOT NULL,
    `raison_sociale` VARCHAR(150) NOT NULL,
    `siret` VARCHAR(14) NULL,
    `secteur_activite` VARCHAR(100) NOT NULL,
    `adresse` VARCHAR(255) NULL,
    `ville` VARCHAR(100) NOT NULL,
    `code_postal` VARCHAR(10) NOT NULL,
    `contact_nom` VARCHAR(100) NOT NULL,
    `contact_prenom` VARCHAR(100) NOT NULL,
    `contact_fonction` VARCHAR(100) NULL,
    `contact_telephone` VARCHAR(25) NOT NULL,
    `contact_email` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `logo_path` VARCHAR(255) NULL,
    `stand_numero` VARCHAR(30) NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_entreprises_utilisateur` (`utilisateur_id`),
    UNIQUE KEY `uk_entreprises_siret` (`siret`),
    KEY `idx_entreprises_agent_referent` (`agent_referent_id`),
    KEY `idx_entreprises_secteur` (`secteur_activite`),
    KEY `idx_entreprises_ville` (`ville`),
    KEY `idx_entreprises_raison_sociale` (`raison_sociale`),
    CONSTRAINT `fk_entreprises_utilisateur` FOREIGN KEY (`utilisateur_id`) 
        REFERENCES `utilisateurs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_entreprises_agent_referent` FOREIGN KEY (`agent_referent_id`) 
        REFERENCES `agents` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 6. Table : offres
-- 1 000 offres d'emploi avec workflow de validation par l'agent
-- -----------------------------------------------------------------------------
CREATE TABLE `offres` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `entreprise_id` BIGINT UNSIGNED NOT NULL,
    `agent_validateur_id` BIGINT UNSIGNED NULL,
    `reference` VARCHAR(50) NOT NULL,
    `intitule` VARCHAR(150) NOT NULL,
    `description` TEXT NOT NULL,
    `nombre_postes` INT NOT NULL DEFAULT 1,
    `type_contrat` ENUM('CDI', 'CDD', 'Alternance', 'Stage', 'Interim') NOT NULL,
    `niveau_etudes` ENUM('Sans_diplome', 'CAP_BEP', 'Bac', 'Bac_2', 'Bac_3', 'Bac_5_plus') NOT NULL,
    `competences_requises` JSON NOT NULL,
    `experience_requise_mois` INT NOT NULL DEFAULT 0,
    `ville` VARCHAR(100) NOT NULL,
    `code_postal` VARCHAR(10) NOT NULL,
    `teletravail` BOOLEAN NOT NULL DEFAULT FALSE,
    `remuneration_fourchette` VARCHAR(100) NULL,
    `date_limite` DATE NOT NULL,
    `statut` ENUM('brouillon', 'en_validation', 'publiee', 'pourvue', 'cloturee') NOT NULL DEFAULT 'brouillon',
    `motif_refus` TEXT NULL,
    `date_validation` TIMESTAMP NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` TIMESTAMP NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_offres_reference` (`reference`),
    KEY `idx_offres_entreprise` (`entreprise_id`),
    KEY `idx_offres_agent_validateur` (`agent_validateur_id`),
    KEY `idx_offres_statut` (`statut`),
    KEY `idx_offres_type_contrat` (`type_contrat`),
    KEY `idx_offres_niveau_etudes` (`niveau_etudes`),
    KEY `idx_offres_ville` (`ville`),
    KEY `idx_offres_date_limite` (`date_limite`),
    CONSTRAINT `fk_offres_entreprise` FOREIGN KEY (`entreprise_id`) 
        REFERENCES `entreprises` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_offres_agent_validateur` FOREIGN KEY (`agent_validateur_id`) 
        REFERENCES `agents` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 7. Table : demandeurs_emploi
-- Vivier des 4 000 demandeurs d'emploi (DE)
-- -----------------------------------------------------------------------------
CREATE TABLE `demandeurs_emploi` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `utilisateur_id` BIGINT UNSIGNED NOT NULL,
    `agent_referent_id` BIGINT UNSIGNED NULL,
    `numero_de` VARCHAR(50) NOT NULL,
    `nom` VARCHAR(100) NOT NULL,
    `prenom` VARCHAR(100) NOT NULL,
    `date_naissance` DATE NOT NULL,
    `adresse` VARCHAR(255) NULL,
    `ville` VARCHAR(100) NOT NULL,
    `code_postal` VARCHAR(10) NOT NULL,
    `rayon_mobilite_km` INT NOT NULL DEFAULT 25,
    `niveau_etudes` ENUM('Sans_diplome', 'CAP_BEP', 'Bac', 'Bac_2', 'Bac_3', 'Bac_5_plus') NOT NULL,
    `filiere_formation` VARCHAR(150) NULL,
    `experience_annees` INT NOT NULL DEFAULT 0,
    `competences` JSON NOT NULL,
    `types_contrats_recherches` JSON NOT NULL,
    `statut_recherche` ENUM('actif', 'en_poste', 'en_formation', 'desinscrit') NOT NULL DEFAULT 'actif',
    `cv_path` VARCHAR(255) NULL,
    `cv_nom_original` VARCHAR(255) NULL,
    `lettre_motivation_defaut` TEXT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` TIMESTAMP NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_demandeurs_emploi_utilisateur` (`utilisateur_id`),
    UNIQUE KEY `uk_demandeurs_emploi_numero` (`numero_de`),
    KEY `idx_de_agent_referent` (`agent_referent_id`),
    KEY `idx_de_nom_prenom` (`nom`, `prenom`),
    KEY `idx_de_ville` (`ville`),
    KEY `idx_de_niveau_etudes` (`niveau_etudes`),
    KEY `idx_de_statut_recherche` (`statut_recherche`),
    CONSTRAINT `fk_de_utilisateur` FOREIGN KEY (`utilisateur_id`) 
        REFERENCES `utilisateurs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_de_agent_referent` FOREIGN KEY (`agent_referent_id`) 
        REFERENCES `agents` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 8. Table : candidatures
-- Postulations directes ou suite à une recommandation
-- -----------------------------------------------------------------------------
CREATE TABLE `candidatures` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `offre_id` BIGINT UNSIGNED NOT NULL,
    `demandeur_emploi_id` BIGINT UNSIGNED NOT NULL,
    `type_origine` ENUM('spontanee', 'suggeree_agent', 'issue_mer') NOT NULL DEFAULT 'spontanee',
    `lettre_motivation` TEXT NULL,
    `statut` ENUM('recue', 'preselectionnee', 'entretien_programme', 'retenue', 'refusee') NOT NULL DEFAULT 'recue',
    `motif_refus` TEXT NULL,
    `date_candidature` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_candidatures_offre_de` (`offre_id`, `demandeur_emploi_id`),
    KEY `idx_candidatures_de` (`demandeur_emploi_id`),
    KEY `idx_candidatures_offre` (`offre_id`),
    KEY `idx_candidatures_statut` (`statut`),
    KEY `idx_candidatures_date` (`date_candidature`),
    CONSTRAINT `fk_candidatures_offre` FOREIGN KEY (`offre_id`) 
        REFERENCES `offres` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_candidatures_de` FOREIGN KEY (`demandeur_emploi_id`) 
        REFERENCES `demandeurs_emploi` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 9. Table : mises_en_relation (MER)
-- Algorithme de matching et propositions d'intermédiation des agents
-- -----------------------------------------------------------------------------
CREATE TABLE `mises_en_relation` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `offre_id` BIGINT UNSIGNED NOT NULL,
    `demandeur_emploi_id` BIGINT UNSIGNED NOT NULL,
    `agent_initiateur_id` BIGINT UNSIGNED NULL,
    `score_matching` DECIMAL(5,2) NOT NULL,
    `detail_score` JSON NOT NULL,
    `statut` ENUM('proposee', 'acceptee_de', 'rejetee_de', 'acceptee_entreprise', 'rejetee_entreprise', 'convertie_candidature') NOT NULL DEFAULT 'proposee',
    `commentaire_agent` TEXT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_mer_offre_de` (`offre_id`, `demandeur_emploi_id`),
    KEY `idx_mer_offre` (`offre_id`),
    KEY `idx_mer_de` (`demandeur_emploi_id`),
    KEY `idx_mer_agent` (`agent_initiateur_id`),
    KEY `idx_mer_score` (`score_matching`),
    KEY `idx_mer_statut` (`statut`),
    CONSTRAINT `fk_mer_offre` FOREIGN KEY (`offre_id`) 
        REFERENCES `offres` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_mer_de` FOREIGN KEY (`demandeur_emploi_id`) 
        REFERENCES `demandeurs_emploi` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_mer_agent` FOREIGN KEY (`agent_initiateur_id`) 
        REFERENCES `agents` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 10. Table : entretiens
-- Créneaux de rendez-vous physiques au salon ou en visioconférence
-- -----------------------------------------------------------------------------
CREATE TABLE `entretiens` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `candidature_id` BIGINT UNSIGNED NOT NULL,
    `date_heure_debut` DATETIME NOT NULL,
    `date_heure_fin` DATETIME NOT NULL,
    `modalite` ENUM('presentiel', 'visio', 'telephonique') NOT NULL DEFAULT 'presentiel',
    `lieu_ou_lien` VARCHAR(255) NOT NULL,
    `statut` ENUM('programme', 'confirme', 'realise', 'annule_candidat', 'annule_entreprise', 'reporte') NOT NULL DEFAULT 'programme',
    `compte_rendu` TEXT NULL,
    `rappel_envoye` BOOLEAN NOT NULL DEFAULT FALSE,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_entretiens_candidature` (`candidature_id`),
    KEY `idx_entretiens_debut` (`date_heure_debut`),
    KEY `idx_entretiens_statut` (`statut`),
    CONSTRAINT `fk_entretiens_candidature` FOREIGN KEY (`candidature_id`) 
        REFERENCES `candidatures` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 11. Table : coaching
-- Préparation individuelle des DE par leur agent référent
-- -----------------------------------------------------------------------------
CREATE TABLE `coaching` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `demandeur_emploi_id` BIGINT UNSIGNED NOT NULL,
    `agent_id` BIGINT UNSIGNED NOT NULL,
    `points_forts` TEXT NULL,
    `axes_amelioration` TEXT NULL,
    `note_simulation` INT NULL,
    `notes_confidentielles` TEXT NULL,
    `plan_action` TEXT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_coaching_de` (`demandeur_emploi_id`),
    KEY `idx_coaching_agent` (`agent_id`),
    CONSTRAINT `fk_coaching_de` FOREIGN KEY (`demandeur_emploi_id`) 
        REFERENCES `demandeurs_emploi` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_coaching_agent` FOREIGN KEY (`agent_id`) 
        REFERENCES `agents` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 12. Table : insertions
-- Enregistrement des décisions de recrutement et suivi post-salon à 1, 3 et 6 mois
-- -----------------------------------------------------------------------------
CREATE TABLE `insertions` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `demandeur_emploi_id` BIGINT UNSIGNED NOT NULL,
    `entreprise_id` BIGINT UNSIGNED NOT NULL,
    `offre_id` BIGINT UNSIGNED NULL,
    `agent_id` BIGINT UNSIGNED NOT NULL,
    `decision` ENUM('embauche', 'periode_essai', 'refus', 'desistement') NOT NULL,
    `type_contrat` ENUM('CDI', 'CDD_plus_6m', 'CDD_moins_6m', 'Alternance', 'Interim') NOT NULL,
    `intitule_poste` VARCHAR(150) NOT NULL,
    `date_prise_poste` DATE NOT NULL,
    `salaire_brut_mensuel` DECIMAL(10,2) NULL,
    `suivi_1m_statut` ENUM('a_relancer', 'confirme_en_poste', 'rupture', 'sans_reponse') NOT NULL DEFAULT 'a_relancer',
    `suivi_1m_date` DATE NULL,
    `suivi_3m_statut` ENUM('a_relancer', 'confirme_en_poste', 'rupture', 'sans_reponse') NOT NULL DEFAULT 'a_relancer',
    `suivi_3m_date` DATE NULL,
    `suivi_6m_statut` ENUM('a_relancer', 'confirme_en_poste', 'rupture', 'sans_reponse') NOT NULL DEFAULT 'a_relancer',
    `suivi_6m_date` DATE NULL,
    `notes_suivi` TEXT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_insertions_de` (`demandeur_emploi_id`),
    KEY `idx_insertions_entreprise` (`entreprise_id`),
    KEY `idx_insertions_offre` (`offre_id`),
    KEY `idx_insertions_agent` (`agent_id`),
    KEY `idx_insertions_decision` (`decision`),
    KEY `idx_insertions_prise_poste` (`date_prise_poste`),
    KEY `idx_insertions_suivi_1m` (`suivi_1m_statut`),
    KEY `idx_insertions_suivi_3m` (`suivi_3m_statut`),
    KEY `idx_insertions_suivi_6m` (`suivi_6m_statut`),
    CONSTRAINT `fk_insertions_de` FOREIGN KEY (`demandeur_emploi_id`) 
        REFERENCES `demandeurs_emploi` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT `fk_insertions_entreprise` FOREIGN KEY (`entreprise_id`) 
        REFERENCES `entreprises` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT `fk_insertions_offre` FOREIGN KEY (`offre_id`) 
        REFERENCES `offres` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT `fk_insertions_agent` FOREIGN KEY (`agent_id`) 
        REFERENCES `agents` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 13. Table : notifications
-- File d'envois multi-canaux (e-mail, SMS, notifications in-app)
-- -----------------------------------------------------------------------------
CREATE TABLE `notifications` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `utilisateur_id` BIGINT UNSIGNED NOT NULL,
    `canal` ENUM('email', 'sms', 'in_app') NOT NULL,
    `titre` VARCHAR(150) NOT NULL,
    `message` TEXT NOT NULL,
    `statut` ENUM('en_attente', 'envoyee', 'echec') NOT NULL DEFAULT 'en_attente',
    `date_envoi` TIMESTAMP NULL,
    `erreur_log` TEXT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_notifications_utilisateur` (`utilisateur_id`),
    KEY `idx_notifications_statut` (`statut`),
    KEY `idx_notifications_canal` (`canal`),
    CONSTRAINT `fk_notifications_utilisateur` FOREIGN KEY (`utilisateur_id`) 
        REFERENCES `utilisateurs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 14. Table : journal_connexions
-- Audit de sécurité et conformité légale des connexions
-- -----------------------------------------------------------------------------
CREATE TABLE `journal_connexions` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `utilisateur_id` BIGINT UNSIGNED NULL,
    `email_tente` VARCHAR(191) NOT NULL,
    `adresse_ip` VARCHAR(45) NOT NULL,
    `user_agent` VARCHAR(255) NULL,
    `statut` ENUM('succes', 'echec') NOT NULL,
    `motif_echec` VARCHAR(100) NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_journal_utilisateur` (`utilisateur_id`),
    KEY `idx_journal_email` (`email_tente`),
    KEY `idx_journal_ip` (`adresse_ip`),
    KEY `idx_journal_statut` (`statut`),
    KEY `idx_journal_created_at` (`created_at`),
    CONSTRAINT `fk_journal_utilisateur` FOREIGN KEY (`utilisateur_id`) 
        REFERENCES `utilisateurs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
