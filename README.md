# QCM Certifications

> Application web de QCM pour préparer les certifications **SCRUM**, **DevOps** et **SAFe**.

---

## 📋 Présentation

**QCM Certif** est une application interactive permettant aux utilisateurs de s'entraîner sur des questionnaires à choix multiples (QCM) dans le cadre de la préparation à des certifications fonctionnelles et techniques.

- **Session par thème** : pratiquer uniquement les questions SCRUM, DevOps ou SAFe
- **Session mixte** : mélange de questions issus de toutes les certifications
- **Espace contributeur** : création et édition de QCMs
- **Espace admin** : gestion des utilisateurs et des QCMs

Le design suit le **style Memphis** : couleurs vives, formes géométriques, bordures épaisses.

---

## 🧱 Stack Technique

| Couche | Technologie |
|---|---|
| Framework | Next.js 15 (App Router), React 19 |
| Langage | TypeScript 5 |
| Styling | TailwindCSS 4 + shadcn/ui + Memphis Style |
| État | React Context API |
| i18n | i18next, react-i18next |
| Tests | Jest 29, React Testing Library |
| Données | Fichiers JSON statiques (`src/data/`) |

---

## ⚙️ Prérequis

- [Node.js](https://nodejs.org/) ≥ 20.x
- npm ≥ 10.x

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
├── app/                  # Pages & API routes (Next.js App Router)
│   ├── (auth)/           # Login, Register
│   ├── admin/            # Gestion utilisateurs & QCMs (admin)
│   ├── contributor/      # Création & édition QCMs (contributeur)
│   ├── dashboard/        # Tableau de bord (utilisateur connecté)
│   ├── practice/         # Sessions d'entraînement
│   └── api/              # Routes API REST
├── components/           # Composants réutilisables (par feature)
├── contexts/             # AuthContext, QcmContext, ThemeContext
├── data/                 # qcms.json + users.json (base de données locale)
├── hooks/                # Hooks personnalisés
├── lib/                  # Utilitaires (auth, i18n)
├── services/             # Logique métier (qcmService, userService)
├── styles/               # memphis.css, variables.css
└── types/                # Types TypeScript (barrel export)
public/
└── locales/
    ├── fr/common.json    # Traductions françaises (langue par défaut)
    └── en/common.json    # Traductions anglaises
```

---

## 👤 Rôles & Accès

| Rôle | Accès |
|---|---|
| `user` | Tableau de bord, sessions de pratique |
| `contributor` | Tout ce que `user` peut faire + créer/éditer des QCMs |
| `admin` | Accès complet + gestion des utilisateurs et de tous les QCMs |

### Comptes de test (développement local)

| Email | Mot de passe | Rôle |
|---|---|---|
| `admin@qcm.local` | `admin123` | admin |
| `contributor@qcm.local` | `contrib123` | contributor |
| `user@qcm.local` | `user123` | user |

---

## 🌍 Internationalisation

- **Langue par défaut** : Français (`fr`)
- **Langue secondaire** : Anglais (`en`)
- Le toggle de langue est disponible dans le **Header** et le **Footer**
- La préférence est persistée dans `localStorage` (clé : `i18n_lang`)

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

- [ ] Authentification avec JWT et cookies sécurisés
- [ ] Base de données réelle (PostgreSQL / SQLite via Prisma)
- [ ] Statistiques de performance par utilisateur
- [ ] Import/export de QCMs en CSV ou JSON
- [ ] Mode révision des erreurs après une session
- [ ] Déploiement sur Vercel

---

## 📄 Licence

[MIT](LICENSE)