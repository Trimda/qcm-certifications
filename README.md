# QCM Certifications

> Application web de QCM pour préparer les certifications **SCRUM**, **DevOps** et **SAFe**.

---

## 📋 Présentation

**QCM Certif** est une application interactive permettant aux utilisateurs de s'entraîner sur des questionnaires à choix multiples (QCM) dans le cadre de la préparation à des certifications fonctionnelles et techniques.

- **Session par thème** : pratiquer uniquement les questions SCRUM, DevOps ou SAFe
- **Session mixte par thème** : jusqu'à 40 questions mélangées dans la même catégorie
- **Meilleur score** : sauvegardé en base (JSON) par utilisateur et par QCM
- **Notation** : les utilisateurs peuvent noter chaque QCM de 1 à 5 étoiles après l'avoir terminé
- **Espace contributeur** : création et édition de QCMs bilingues (FR / EN)
- **Espace admin** : tableau de bord avec aperçu des derniers utilisateurs et QCMs, pages dédiées pour la gestion complète

Le design suit le **style Memphis** : couleurs vives, formes géométriques, bordures épaisses.

---

## 🧱 Stack Technique

| Couche | Technologie |
|---|---|
| Framework | Next.js 15 (App Router), React 19 |
| Langage | TypeScript 5 strict |
| Styling | TailwindCSS 4 + Memphis Style custom |
| Icônes | @phosphor-icons/react (weight bold) |
| État | React Context API (AuthContext, QcmContext) |
| i18n | i18next, react-i18next (bundled, pas de HTTP backend) |
| Auth | Cookie `qcm_session` (base64 JSON), bcryptjs |
| Tests | Jest 29, React Testing Library |
| Données | Fichiers JSON statiques (`src/data/`) |

---

## ⚙️ Prérequis

- [Node.js](https://nodejs.org/) >= 20.x
- npm >= 10.x

---

## 🚀 Installation & Démarrage

```bash
# Cloner le dépôt
git clone https://github.com/<votre-org>/qcm-certifications.git
cd qcm-certifications

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

L'application est accessible sur [http://localhost:3000](http://localhost:3000).

---

## 📁 Structure du Projet

```
src/
+-- app/
|   +-- (auth)/             # Login, Register
|   +-- admin/
|   |   +-- page.tsx        # Dashboard admin (aperçu récent)
|   |   +-- users/          # Gestion complète des utilisateurs
|   |   +-- qcms/           # Gestion complète des QCMs
|   +-- contributor/        # Création & édition de QCMs
|   +-- dashboard/          # Tableau de bord utilisateur
|   +-- my-qcms/            # Mes QCMs (contributeur/admin)
|   +-- account/            # Mon Compte
|   +-- practice/
|   |   +-- page.tsx        # Sélecteur de thème (3 cartes)
|   |   +-- [topic]/        # QCMs par thème + session mixte thème
|   |   +-- mixed/          # Session mixte toutes catégories
|   +-- api/                # Routes API REST
|       +-- auth/           # login, logout, register, me
|       +-- qcms/           # CRUD QCMs
|       +-- scores/         # Meilleurs scores + notes étoiles
|       +-- ratings/        # Moyennes publiques des notes
|       +-- users/          # CRUD utilisateurs (admin)
+-- components/
|   +-- admin/              # UserTable, QcmTable
|   +-- auth/               # LoginForm, RegisterForm, RoleGuard
|   +-- home/               # HeroSection, CertificationCards, FeatureSection
|   +-- layout/             # Header, Footer, Navigation, MobileMenu
|   +-- qcm/                # QcmList, QuestionCard, AnswerOption, QcmForm, ResultSummary, TopicSelector
|   +-- ui/                 # Badge, Button, Card, Input, Modal, PasswordInput, ProgressBar, StarRating
+-- contexts/               # AuthContext, QcmContext
+-- data/                   # qcms.json · users.json · scores.json
+-- hooks/                  # useAuth, useQcm, useLocalStorage, useTranslation, useBestScores
+-- lib/                    # auth.ts, i18n.ts, localizedText.ts
+-- services/               # qcmService.ts, userService.ts
+-- styles/                 # memphis.css, variables.css
+-- types/                  # Types TypeScript (barrel export)
public/
+-- locales/
    +-- fr/common.json      # Traductions françaises (langue par défaut)
    +-- en/common.json      # Traductions anglaises
```

---

## 👤 Rôles & Accès

| Rôle | Accès |
|---|---|
| `user` | Tableau de bord, sessions de pratique, Mon Compte |
| `contributor` | Tout `user` + créer/éditer ses QCMs, Mes QCMs |
| `admin` | Accès complet + tableau de bord admin, gestion utilisateurs & QCMs |

### Comptes de test (développement local)

| Email | Mot de passe | Rôle |
|---|---|---|
| `admin@qcm.local` | `admin123` | admin |
| `contributor@qcm.local` | `contrib123` | contributor |
| `user@qcm.local` | `user123` | user |

---

## 🎯 Fonctionnalités clés

### Sessions de pratique
- **TopicSelector** (`/practice`) : 3 cartes de thème, sans session mixte globale
- **Par thème** (`/practice/[topic]`) : liste des QCMs + bandeau «Session mixte» (jusqu'à 40 questions mélangées du thème)
- **Recommencer** : relance exactement la même session (mêmes questions, même ordre)
- **Retour aux thèmes** : réinitialise la session et navigue vers `/practice/[topic]`

### Scores & Notation
- **Meilleur score** : persisté en base (`src/data/scores.json`) via `PATCH /api/scores` pour les utilisateurs connectés ; `localStorage` pour les invités
- **Note étoiles** (1-5) : attribuable à la fin de chaque QCM individuel (pas en session mixte) ; modifiable à chaque essai
- **Note moyenne** : calculée par `GET /api/ratings` et affichée en lecture seule sur chaque carte QCM

### QCMs bilingues
- Tout le contenu (`title`, `description`, `text` des questions/réponses) est stocké en `LocalizedText { fr, en }`
- `QcmForm` propose 3 modes de saisie : FR uniquement / EN uniquement / FR+EN (colonnes)
- Affichage automatique dans la langue de l'interface

### Visibilité des QCMs
- `isPrivate?: boolean` : un QCM privé n'est visible que par son créateur et les admins
- L'API filtre selon le rôle de l'utilisateur connecté

---

## 🔧 API Routes

| Méthode | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/login` | — | Connexion |
| POST | `/api/auth/logout` | — | Déconnexion |
| POST | `/api/auth/register` | — | Inscription |
| GET | `/api/auth/me` | session | Utilisateur courant |
| GET | `/api/qcms` | optionnel | Liste QCMs (filtré par rôle) |
| POST | `/api/qcms` | session | Créer un QCM |
| GET/PUT/DELETE | `/api/qcms/[id]` | session | Opérations sur un QCM |
| GET | `/api/scores` | session | Scores + notes de l'utilisateur |
| PATCH | `/api/scores` | session | Màj score ou note étoile |
| GET | `/api/ratings` | — | Moyennes des notes (public) |
| GET/POST/PUT/DELETE | `/api/users` | admin | Gestion des utilisateurs |

---

## 🎨 Icônes

Le projet utilise **[Phosphor Icons](https://phosphoricons.com/)** via `@phosphor-icons/react`.

- Toutes les icônes utilisent le style `weight="bold"`
- Nommées avec le suffixe `Icon` : `ArrowRightIcon`, `StarIcon`, `TrophyIcon`, `ShuffleIcon`, etc.
- `optimizePackageImports` activé dans `next.config.ts`
- Ne jamais utiliser d'emojis ou de caractères Unicode comme icônes

---

## 🌍 Internationalisation

- **Langue par défaut** : Français (`fr`)
- **Langue secondaire** : Anglais (`en`)
- Toggle de langue dans le **Header** et le **Footer**
- Préférence persistée dans `localStorage` (clé : `i18n_lang`)
- Traductions bundlées statiquement (pas de requête HTTP)

---

## 📜 Commandes

```bash
npm run dev      # Démarrer en mode développement
npm run build    # Compiler pour la production
npm run start    # Démarrer le serveur de production
npm test         # Lancer les tests Jest
npm run lint     # Vérifier le code (ESLint)
```

---

## 🗺️ Roadmap

- [ ] Base de données réelle (PostgreSQL / SQLite via Prisma)
- [ ] Statistiques de performance par utilisateur
- [ ] Import/export de QCMs en CSV ou JSON
- [ ] Mode révision des erreurs après une session
- [ ] Déploiement sur Vercel

---

## 📄 Licence

[MIT](LICENSE)
