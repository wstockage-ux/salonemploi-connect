# SalonEmploi Connect 🚀

> **Plateforme web complète et responsive de gestion d'un salon de l'emploi : Offres, Candidatures, MER (Mise en Relation) et Suivi d'Insertion.**

---

## 🎯 Contexte & Objectifs Chiffrés
- **50 entreprises** participantes avec numéros de stand.
- **1 000 offres d'emploi** collectées, réparties par secteurs et validées par workflow.
- **4 000 demandeurs d'emploi (DE)** inscrits avec profils, compétences et CVs.
- **15 agents opérationnels**, chacun avec un portefeuille d'entreprises et d'objectifs individuels.
- **Approche Mobile-First & Résilience Basse Bande-Passante** (optimisée pour smartphone et connexion limitée le jour J).

---

## 🏛️ Les 8 Livrables du Projet

| N° | Livrable | Emplacement & Description |
| :---: | :--- | :--- |
| **1** | **Architecture globale & Diagramme des modules** | Documentée dans `docs/ARCHITECTURE.md` (flux Mermaid, PWA, sécurité, RBAC). |
| **2** | **Modèle de données relationnel complet** | Dictionnaire des 14 tables, contraintes, index InnoDB et diagramme ERD. |
| **3** | **Liste détaillée des écrans par profil** | Parcours et fonctionnalités pour Coordination, Agent, Entreprise et DE. |
| **4** | **Code de la base de données (DDL MySQL 8.0)** | Fichier `database/schema.sql` (création propre avec clés et index optimisés). |
| **5** | **Code du Back-end (API Laravel 11 REST)** | Répertoire `backend/` (Modèles Eloquent, Contrôleurs REST, Sanctum, Moteur MER). |
| **6** | **Code du Front-end (React 18 Vite)** | Répertoire `frontend/` (Mobile-First, 4 tableaux de bord, formulaires, Kanban, MER). |
| **7** | **Jeu de données de démonstration (Seeders)** | Fichier `database/seeders.sql` (vivier complet 15 agents, 50 entreprises, offres, DE). |
| **8** | **Guide d'installation et de déploiement** | Fichier `docs/GUIDE_INSTALLATION_DEPLOIEMENT.md` (serveur web Nginx, SSL, sauvegardes). |

---

## 🔐 Identifiants des Comptes de Démonstration

Mot de passe commun pour tous les comptes : `Password123!`

- **1. Administrateur / Coordination :** `coordination@salonemploi.fr`  
  *Vue consolidée des 50 entreprises, 1 000 offres, entonnoir de conversion, classement des 15 agents, alertes temps réel et centre d'exports Excel/PDF/CSV.*
- **2. Agent Opérationnel :** `agent.bernard@salonemploi.fr` (ou matricule `AGT-001`)  
  *Accès portefeuille personnel, to-do list du jour, validation d'offres en 1 clic, moteur MER avec calcul de score 0-100%, fiche de coaching et suivi des relances 1/3/6 mois.*
- **3. Entreprise Recruteur :** `rh@novatech-solutions.fr`  
  *Stand A-01, dépôt d'offre assisté, gestion des candidatures en vue Kanban, lecteur de CV intégré, planning des entretiens.*
- **4. Demandeur d'Emploi :** `yacine.b@email.fr` (ou numéro `DE-75-00123`)  
  *Espace mobile-first, CV, catalogue d'offres filtrable avec badge de score MER calculé pour lui, postulation en 1 clic, convocation salon et gestion RGPD.*

---

## ⚡ Démarrage Rapide

### 1. Base de données MySQL
```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seeders.sql
```

### 2. Back-end Laravel API
```bash
cd backend
composer install
php artisan serve --port=8000
```

### 3. Front-end React Vite
```bash
cd frontend
npm install
npm run dev
```
Accès à l'application web responsive : **http://localhost:3000**
