# SalonEmploi Connect — Guide d'Installation et de Déploiement

Ce guide détaille pas à pas l'installation, la configuration, la mise en production et la politique de sauvegarde de la plateforme **SalonEmploi Connect** (gestion des Offres, Candidatures, MER et Insertion professionnelle).

---

## 1. Prérequis Système

| Composant | Version minimale recommandée | Utilité |
| :--- | :--- | :--- |
| **Système d'exploitation** | Linux Ubuntu 22.04 LTS / Debian 12 ou Windows Server 2022 | Environnement serveur |
| **PHP** | 8.2+ ou 8.3+ (avec extensions `pdo_mysql`, `mbstring`, `openssl`, `tokenizer`, `xml`, `ctype`, `json`, `curl`) | Back-end Laravel 11 |
| **Base de Données** | MySQL 8.0+ ou MariaDB 10.11+ (moteur InnoDB, UTF8mb4) | Persistance relationnelle |
| **Node.js & NPM** | Node.js v18.0+ ou v20+ LTS et NPM 10+ | Front-end React Vite |
| **Serveur Web** | Nginx 1.24+ ou Apache 2.4+ avec mod_rewrite | Reverse Proxy, SSL & compression |
| **Composer** | Composer v2.6+ | Gestionnaire de dépendances PHP |

---

## 2. Déploiement de la Base de Données MySQL

### Étape 2.1 : Connexion au serveur MySQL
Connectez-vous à votre instance MySQL avec des privilèges administrateur :
```bash
mysql -u root -p
```

### Étape 2.2 : Exécution du script de création DDL (Livrable 4)
Exécutez le script SQL complet situé dans `database/schema.sql` pour créer la base et les 14 tables avec leurs index :
```sql
SOURCE /chemin/vers/salonemploi-connect/database/schema.sql;
```
*Le script crée automatiquement la base `salonemploi_connect` avec l'encodage `utf8mb4_unicode_ci` et configure les contraintes d'intégrité.*

### Étape 2.3 : Injection du jeu de données de démonstration (Livrable 7)
Pour injecter le vivier complet (les 4 rôles, 15 agents, objectifs, 50 entreprises modèles, offres et candidats) :
```sql
SOURCE /chemin/vers/salonemploi-connect/database/seeders.sql;
```

---

## 3. Configuration & Démarrage du Back-end Laravel

### Étape 3.1 : Déploiement des dépendances
Dans le répertoire `backend/` :
```bash
cd backend
composer install --no-dev --optimize-autoloader
```

### Étape 3.2 : Configuration du fichier `.env`
Copiez le modèle d'environnement et configurez les accès à la base de données :
```bash
cp .env.example .env
php artisan key:generate
```

Éditez les variables clés dans `.env` :
```env
APP_NAME="SalonEmploi Connect"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://salonemploi.votre-domaine.fr

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=salonemploi_connect
DB_USERNAME=salonemploi_user
DB_PASSWORD=votre_mot_de_passe_robuste

# Pilote de notifications : 'sandbox' (dev) ou 'twilio' / 'brevo' (prod)
NOTIFICATION_DRIVER=sandbox
TWILIO_SID=
TWILIO_AUTH_TOKEN=
TWILIO_NUMBER=
BREVO_API_KEY=
```

### Étape 3.3 : Optimisation du cache Laravel
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Étape 3.4 : Démarrage du serveur de développement (ou service PHP-FPM)
```bash
php artisan serve --port=8000
```

---

## 4. Configuration & Démarrage du Front-end React

### Étape 4.1 : Installation des paquets
Dans le répertoire `frontend/` :
```bash
cd frontend
npm install
```

### Étape 4.2 : Démarrage en mode développement
```bash
npm run dev
```
L'application est immédiatement accessible à l'adresse locale : **http://localhost:3000** (ou 5173).

### Étape 4.3 : Compilation pour la production
Pour générer les fichiers statiques optimisés (minifiés, bundle compressé) :
```bash
npm run build
```
Les fichiers de production sont générés dans `frontend/dist/`.

---

## 5. Configuration Nginx pour la Production

Voici la configuration type Nginx recommandée pour servir le front-end React en Single Page Application (SPA), faire le proxy vers l'API Laravel et activer la compression Gzip/Brotli pour les réseaux mobiles lents :

```nginx
server {
    listen 80;
    server_name salonemploi.votre-domaine.fr;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name salonemploi.votre-domaine.fr;

    # Certificats SSL (Let's Encrypt / Certbot)
    ssl_certificate /etc/letsencrypt/live/salonemploi.votre-domaine.fr/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/salonemploi.votre-domaine.fr/privkey.pem;

    # Headers de Sécurité
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header X-XSS-Protection "1; mode=block";

    # Compression pour connexion mobile faible débit
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;

    # Racine du Front-end React compilé
    root /var/www/salonemploi-connect/frontend/dist;
    index index.html;

    # Routage SPA React
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API REST Laravel
    location /api {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Sécurisation des CV et téléchargements privés
    location /storage/app/private/cvs {
        internal;
        alias /var/www/salonemploi-connect/backend/storage/app/private/cvs;
    }
}
```

---

## 6. Politique de Sauvegarde Automatique

Pour garantir la résilience des données des 50 entreprises et 4 000 DE, mettez en place un cron quotidien de sauvegarde :

### Script `/usr/local/bin/backup_salonemploi.sh` :
```bash
#!/bin/bash
BACKUP_DIR="/var/backups/salonemploi"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

# Sauvegarde MySQL compressée
mysqldump -u salonemploi_user -p'VOTRE_MOT_DE_PASSE' salonemploi_connect | gzip > $BACKUP_DIR/db_salonemploi_$DATE.sql.gz

# Sauvegarde des CVs
tar -czf $BACKUP_DIR/cvs_salonemploi_$DATE.tar.gz /var/www/salonemploi-connect/backend/storage/app/private/cvs

# Rétention : suppression des sauvegardes de plus de 30 jours
find $BACKUP_DIR -type f -name "*.gz" -mtime +30 -exec rm {} \;
```

Ajout dans la crontab (`crontab -e`) :
```cron
0 2 * * * /usr/local/bin/backup_salonemploi.sh > /dev/null 2>&1
```

---

## 7. Comptes de Démonstration Inclus

Tous les comptes de test sont initialisés avec le mot de passe : `Password123!`

| Profil | Identifiant de connexion | Rôle & Périmètre |
| :--- | :--- | :--- |
| **Coordination** | `coordination@salonemploi.fr` | Administrateur global, quotas, classement 15 agents |
| **Agent Référent** | `agent.bernard@salonemploi.fr` (ou `AGT-001`) | Portefeuille Pôle Numérique, offres et matching |
| **Entreprise Recruteur**| `rh@novatech-solutions.fr` | Stand A-01 (NovaTech Solutions), gestion candidatures |
| **Candidat (DE)** | `yacine.b@email.fr` (ou `DE-75-00123`) | Profil Développeur Web, postulation en 1 clic |
