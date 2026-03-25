# PROMPT — Plan Mode: Scaffolding QCM Certifications App

> **Usage**: Copy this entire document as your prompt in GitHub Copilot **Plan mode** (Agent mode).
> It will scaffold the complete Next.js application from scratch, following all conventions defined in `.github/copilot-instructions.md`.

---

## 🎯 Objective

Scaffold a complete **Next.js 16 (App Router)** web application for practicing certification QCMs (SCRUM, DevOps, SAFe).
The app must be production-ready in terms of structure, but uses static JSON files as a database (no external DB).

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16, App Router, React 19 |
| Language | TypeScript 5 (strict mode) |
| Styling | TailwindCSS 4 + shadcn/ui + Memphis Style |
| State | React Context API |
| i18n | i18next, react-i18next, i18next-browser-languagedetector, i18next-http-backend |
| Testing | Jest 29, React Testing Library, ts-jest, jest-environment-jsdom |
| Data | Static JSON files (`src/data/`) |

---

## 🎨 Memphis Style

The application must have a **Memphis design aesthetic** applied through `src/styles/memphis.css`:
- Bold, contrasting color palette: electric yellow `#FFE600`, coral red `#FF4D4D`, cobalt blue `#0057FF`, black `#111111`, white `#FFFFFF`
- Geometric decorative shapes (circles, triangles, zigzags, dots) as background patterns and card decorations
- Thick black borders (`border-2 border-black`) on cards and buttons
- Hard drop shadows (`box-shadow: 4px 4px 0px #111111`) instead of soft blur shadows
- Bold sans-serif typography (e.g., `font-black`, large headings)
- Flat, vibrant buttons with black borders and hover translate effects (`hover:-translate-y-0.5`)
- CSS custom properties defined in `src/styles/variables.css` for all Memphis colors and spacings
- Apply Memphis classes globally via `src/app/globals.css` importing both `memphis.css` and `variables.css`

---

## 📁 Project Structure to Generate

```
src/
  app/
    layout.tsx                        # Root layout: fonts, providers, Header, Footer
    page.tsx                          # Home page (public)
    globals.css                       # Imports memphis.css + variables.css
    (auth)/
      login/page.tsx                  # Login page (public)
      register/page.tsx               # Register page (public)
    dashboard/
      page.tsx                        # Dashboard (role: user, contributor, admin)
    practice/
      page.tsx                        # Topic selector page
      [topic]/page.tsx                # Practice by topic (role: user+)
      mixed/page.tsx                  # Mixed practice session (role: user+)
    contributor/
      qcm/
        new/page.tsx                  # Create new QCM (role: contributor, admin)
        [id]/edit/page.tsx            # Edit existing QCM (role: contributor, admin)
    admin/
      users/page.tsx                  # User management (role: admin)
      qcms/page.tsx                   # QCM management (role: admin)
    api/
      auth/
        login/route.ts                # POST /api/auth/login
        register/route.ts             # POST /api/auth/register
        logout/route.ts               # POST /api/auth/logout
      qcms/
        route.ts                      # GET all QCMs, POST new QCM
        [id]/route.ts                 # GET, PUT, DELETE single QCM
      users/
        route.ts                      # GET all users (admin only)
        [id]/route.ts                 # GET, PUT, DELETE single user (admin only)
  components/
    layout/
      Header.tsx                      # Logo + nav links + lang toggle + hamburger (mobile)
      Footer.tsx                      # Footer with lang toggle + links
      Navigation.tsx                  # Nav links list (used by Header & mobile menu)
      MobileMenu.tsx                  # Hamburger mobile drawer
    auth/
      LoginForm.tsx                   # Controlled form: email + password
      RegisterForm.tsx                # Controlled form: username + email + password + role
      RoleGuard.tsx                   # Wrapper that redirects if role not allowed
    home/
      HeroSection.tsx                 # Hero with Memphis visuals + CTA buttons
      CertificationCards.tsx          # 3 cards: SCRUM, DevOps, SAFe
      FeatureSection.tsx              # Feature highlights section
    qcm/
      QcmList.tsx                     # List of QCM cards with filter by topic
      QuestionCard.tsx                # Displays a single question + answer options
      AnswerOption.tsx                # Single answer option button (selected/correct/wrong states)
      QcmForm.tsx                     # Create/edit QCM form for contributors
      ResultSummary.tsx               # End-of-session results with score
      TopicSelector.tsx               # Card grid to choose a topic or mixed session
    admin/
      UserTable.tsx                   # Table of all users with edit/delete actions
    ui/
      Badge.tsx                       # Role/topic badge
      Button.tsx                      # Memphis-styled button (wraps shadcn Button)
      Card.tsx                        # Memphis-styled card with border + shadow
      Input.tsx                       # Memphis-styled input (wraps shadcn Input)
      Modal.tsx                       # Modal dialog (wraps shadcn Dialog)
      ProgressBar.tsx                 # Question progress indicator
  contexts/
    AuthContext.tsx                   # currentUser, login(), logout(), register()
    QcmContext.tsx                    # qcms list, currentSession, loadQcms(), submitAnswer()
    ThemeContext.tsx                  # theme toggle (if needed)
  data/
    qcms.json                         # Qcm[] — all certifications, all questions
    users.json                        # User[] — seed data (1 per role)
  hooks/
    useAuth.ts                        # Consumes AuthContext
    useQcm.ts                         # Consumes QcmContext
    useLocalStorage.ts                # Generic localStorage hook
    useTranslation.ts                 # Wraps react-i18next useTranslation
  lib/
    auth.ts                           # hashPassword, verifyPassword, generateId, session helpers
    i18n.ts                           # i18next configuration (lng: 'fr', fallbackLng: 'en')
  services/
    qcmService.ts                     # CRUD operations on qcms.json (via API routes)
    userService.ts                    # CRUD operations on users.json (via API routes)
  styles/
    memphis.css                       # Memphis design system: colors, shapes, shadows
    variables.css                     # CSS custom properties (--memphis-yellow, etc.)
  types/
    index.ts                          # Barrel export: User, Qcm, Question, AnswerOption, Role
public/
  locales/
    fr/
      common.json                     # French translations (default language)
    en/
      common.json                     # English translations
```

---

## 🗂️ Data Schemas

### `src/data/users.json`

Seed with exactly **3 users** (one per role). Passwords stored as plain text for local dev only.

```json
[
  {
    "id": "user-1",
    "username": "admin",
    "email": "admin@qcm.local",
    "password": "admin123",
    "role": "admin",
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  },
  {
    "id": "user-2",
    "username": "contributor",
    "email": "contributor@qcm.local",
    "password": "contrib123",
    "role": "contributor",
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  },
  {
    "id": "user-3",
    "username": "user",
    "email": "user@qcm.local",
    "password": "user123",
    "role": "user",
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  }
]
```

### `src/data/qcms.json`

Single array `Qcm[]` with entries for all 3 topics. Generate **3 questions per topic** as seed data (to be expanded later).

```json
[
  {
    "id": "qcm-scrum-1",
    "title": "SCRUM Fundamentals",
    "description": "Test your knowledge of SCRUM framework basics.",
    "topic": "scrum",
    "createdBy": "user-1",
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z",
    "questions": [
      {
        "id": "q-scrum-1-1",
        "text": "What is the recommended duration for a Sprint?",
        "options": [
          { "id": "a", "text": "1 week" },
          { "id": "b", "text": "1 to 4 weeks" },
          { "id": "c", "text": "2 months" },
          { "id": "d", "text": "6 months" }
        ],
        "correctAnswer": "b"
      },
      {
        "id": "q-scrum-1-2",
        "text": "Who is responsible for maximizing the value of the product?",
        "options": [
          { "id": "a", "text": "Scrum Master" },
          { "id": "b", "text": "Development Team" },
          { "id": "c", "text": "Product Owner" },
          { "id": "d", "text": "Stakeholders" }
        ],
        "correctAnswer": "c"
      },
      {
        "id": "q-scrum-1-3",
        "text": "What is the main purpose of the Daily Scrum?",
        "options": [
          { "id": "a", "text": "Report progress to the Product Owner" },
          { "id": "b", "text": "Inspect progress toward the Sprint Goal and adapt the plan" },
          { "id": "c", "text": "Review the backlog items" },
          { "id": "d", "text": "Assign tasks to team members" }
        ],
        "correctAnswer": "b"
      }
    ]
  },
  {
    "id": "qcm-devops-1",
    "title": "DevOps Essentials",
    "description": "Core concepts of DevOps culture and practices.",
    "topic": "devops",
    "createdBy": "user-1",
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z",
    "questions": [
      {
        "id": "q-devops-1-1",
        "text": "What does CI/CD stand for?",
        "options": [
          { "id": "a", "text": "Continuous Integration / Continuous Deployment" },
          { "id": "b", "text": "Code Integration / Code Delivery" },
          { "id": "c", "text": "Continuous Improvement / Continuous Development" },
          { "id": "d", "text": "Cloud Integration / Cloud Deployment" }
        ],
        "correctAnswer": "a"
      },
      {
        "id": "q-devops-1-2",
        "text": "Which of the following is a core principle of DevOps?",
        "options": [
          { "id": "a", "text": "Siloed teams for Dev and Ops" },
          { "id": "b", "text": "Manual deployments for control" },
          { "id": "c", "text": "Collaboration between development and operations" },
          { "id": "d", "text": "Quarterly release cycles" }
        ],
        "correctAnswer": "c"
      },
      {
        "id": "q-devops-1-3",
        "text": "What is Infrastructure as Code (IaC)?",
        "options": [
          { "id": "a", "text": "Writing code to document infrastructure" },
          { "id": "b", "text": "Managing infrastructure through machine-readable configuration files" },
          { "id": "c", "text": "Using a graphical UI to configure servers" },
          { "id": "d", "text": "Coding application logic in the infrastructure layer" }
        ],
        "correctAnswer": "b"
      }
    ]
  },
  {
    "id": "qcm-safe-1",
    "title": "SAFe Framework Overview",
    "description": "Introduction to Scaled Agile Framework (SAFe) principles.",
    "topic": "safe",
    "createdBy": "user-1",
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z",
    "questions": [
      {
        "id": "q-safe-1-1",
        "text": "What does SAFe stand for?",
        "options": [
          { "id": "a", "text": "Scaled Agile Framework for Enterprises" },
          { "id": "b", "text": "Simple Agile Framework for Everyone" },
          { "id": "c", "text": "Scaled Agile Framework" },
          { "id": "d", "text": "Strategic Agile Framework for Engineering" }
        ],
        "correctAnswer": "c"
      },
      {
        "id": "q-safe-1-2",
        "text": "What is a Program Increment (PI) in SAFe?",
        "options": [
          { "id": "a", "text": "A single Sprint" },
          { "id": "b", "text": "A timebox of 8–12 weeks in which an ART delivers value" },
          { "id": "c", "text": "A product backlog refinement ceremony" },
          { "id": "d", "text": "A type of release planning meeting" }
        ],
        "correctAnswer": "b"
      },
      {
        "id": "q-safe-1-3",
        "text": "What is the Agile Release Train (ART)?",
        "options": [
          { "id": "a", "text": "A deployment pipeline tool" },
          { "id": "b", "text": "A long-lived team of teams that delivers value in Program Increments" },
          { "id": "c", "text": "A sprint planning ceremony" },
          { "id": "d", "text": "A backlog management tool" }
        ],
        "correctAnswer": "b"
      }
    ]
  }
]
```

---

## 🔑 TypeScript Types (`src/types/index.ts`)

```typescript
export type Role = 'admin' | 'user' | 'contributor';
export type Topic = 'scrum' | 'devops' | 'safe';

export interface User {
  id: string;
  username: string;
  email: string;
  password?: string; // omitted in client responses
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface AnswerOption {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  text: string;
  options: AnswerOption[];
  correctAnswer: string; // matches AnswerOption.id
}

export interface Qcm {
  id: string;
  title: string;
  description: string;
  topic: Topic;
  questions: Question[];
  createdBy: string; // User.id
  createdAt: string;
  updatedAt: string;
}
```

---

## 🛣️ Routes & Role Access

| Route | Page | Roles Allowed | Notes |
|---|---|---|---|
| `/` | Home | Public | Hero, CertificationCards, FeatureSection |
| `/login` | Login | Public | Redirect to `/dashboard` if already logged in |
| `/register` | Register | Public | Redirect to `/dashboard` if already logged in |
| `/dashboard` | Dashboard | `user`, `contributor`, `admin` | Shows role-appropriate content |
| `/practice` | Topic Selector | `user`, `contributor`, `admin` | TopicSelector component |
| `/practice/[topic]` | Practice Session | `user`, `contributor`, `admin` | topic = `scrum` \| `devops` \| `safe` |
| `/practice/mixed` | Mixed Session | `user`, `contributor`, `admin` | Random questions from all topics |
| `/contributor/qcm/new` | Create QCM | `contributor`, `admin` | QcmForm in create mode |
| `/contributor/qcm/[id]/edit` | Edit QCM | `contributor`, `admin` | QcmForm in edit mode |
| `/admin/users` | User Management | `admin` | UserTable with CRUD |
| `/admin/qcms` | QCM Management | `admin` | QcmList with full CRUD |

---

## 🔒 RoleGuard Component

`RoleGuard` must:
1. Read `currentUser` from `AuthContext`
2. If not authenticated → redirect to `/login`
3. If authenticated but role not in `allowedRoles` → redirect to `/dashboard`
4. Otherwise → render `children`

```typescript
// Usage example:
<RoleGuard allowedRoles={['admin']}>
  <AdminUsersPage />
</RoleGuard>
```

---

## 🌐 Navigation — Header Component

The `Header` must implement:

**Desktop (md and above):**
- Left: Logo / App name (`QCM Certif`) with Memphis styling
- Center: Navigation links (visible based on user role)
  - Public: `Accueil`, `Connexion`
  - Logged in (all): `Tableau de bord`, `S'entraîner`
  - Contributor+: `Créer un QCM`
  - Admin: `Administration`
- Right: Language toggle (`FR` / `EN`) + user info + logout button

**Mobile (below md):**
- Left: Logo
- Right: Hamburger icon button
- On open: Fullscreen or slide-in drawer with all nav links + lang toggle

---

## 🌍 Internationalization

### Configuration (`src/lib/i18n.ts`)
```typescript
// Default language: French
// Fallback: English
// Backend: i18next-http-backend loading from /public/locales/{lng}/common.json
// Detection: localStorage key 'i18n_lang', then browser language
```

### Translation Key Structure

```json
// public/locales/fr/common.json
{
  "app": { "name": "QCM Certif", "tagline": "Préparez vos certifications" },
  "nav": {
    "home": "Accueil",
    "dashboard": "Tableau de bord",
    "practice": "S'entraîner",
    "createQcm": "Créer un QCM",
    "admin": "Administration",
    "login": "Connexion",
    "register": "Inscription",
    "logout": "Déconnexion"
  },
  "auth": {
    "loginTitle": "Connexion",
    "registerTitle": "Créer un compte",
    "email": "Email",
    "password": "Mot de passe",
    "username": "Nom d'utilisateur",
    "loginButton": "Se connecter",
    "registerButton": "S'inscrire",
    "noAccount": "Pas encore de compte ?",
    "alreadyAccount": "Déjà un compte ?"
  },
  "home": {
    "heroTitle": "Préparez vos certifications avec des QCM",
    "heroSubtitle": "SCRUM, DevOps, SAFe — Entraînez-vous à votre rythme",
    "startButton": "Commencer à s'entraîner",
    "learnMore": "En savoir plus"
  },
  "practice": {
    "title": "Choisissez votre thème",
    "mixed": "Session mixte",
    "startButton": "Démarrer",
    "nextQuestion": "Question suivante",
    "submitAnswer": "Valider",
    "results": "Voir les résultats",
    "score": "Votre score",
    "retry": "Recommencer"
  },
  "dashboard": {
    "title": "Tableau de bord",
    "welcome": "Bienvenue, {{username}}"
  },
  "contributor": {
    "createQcm": "Créer un QCM",
    "editQcm": "Modifier le QCM",
    "saveButton": "Enregistrer",
    "addQuestion": "Ajouter une question",
    "deleteQuestion": "Supprimer"
  },
  "admin": {
    "users": "Gestion des utilisateurs",
    "qcms": "Gestion des QCMs",
    "deleteUser": "Supprimer",
    "editUser": "Modifier",
    "role": "Rôle"
  },
  "common": {
    "loading": "Chargement...",
    "error": "Une erreur est survenue",
    "cancel": "Annuler",
    "save": "Enregistrer",
    "delete": "Supprimer",
    "edit": "Modifier",
    "back": "Retour"
  }
}
```

Generate the equivalent `public/locales/en/common.json` with English translations for all the same keys.

---

## 🔧 API Routes

### Auth
- `POST /api/auth/login` — body: `{ email, password }` → returns user object (without password) + sets session cookie
- `POST /api/auth/register` — body: `{ username, email, password, role }` → creates user in `users.json`
- `POST /api/auth/logout` — clears session cookie

### QCMs
- `GET /api/qcms` — returns all QCMs (optionally filtered by `?topic=scrum`)
- `POST /api/qcms` — creates new QCM (requires contributor or admin role)
- `GET /api/qcms/[id]` — returns single QCM
- `PUT /api/qcms/[id]` — updates QCM (requires contributor or admin role)
- `DELETE /api/qcms/[id]` — deletes QCM (requires admin role)

### Users (admin only)
- `GET /api/users` — returns all users (password excluded)
- `PUT /api/users/[id]` — updates user
- `DELETE /api/users/[id]` — deletes user

---

## ⚙️ Package Configuration

Generate a `package.json` with the following dependencies:

```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "i18next": "^23.0.0",
    "react-i18next": "^14.0.0",
    "i18next-browser-languagedetector": "^8.0.0",
    "i18next-http-backend": "^2.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/node": "^20.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "tailwindcss": "^4.0.0",
    "@tailwindcss/postcss": "^4.0.0",
    "jest": "^29.0.0",
    "@testing-library/react": "^16.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "jest-environment-jsdom": "^29.0.0",
    "ts-jest": "^29.0.0"
  }
}
```

Also run the following command to initialize shadcn/ui with TailwindCSS 4 using the required preset:

```bash
npx shadcn@latest init --preset b3d76gZEiQ
```

---

## 📋 Scaffolding Order

Generate files in this exact order to respect dependencies:

1. **`package.json`** + **`tsconfig.json`** + **`next.config.ts`** + **`tailwind.config.ts`** + **`postcss.config.ts`**
2. **`src/types/index.ts`** — all TypeScript types and interfaces
3. **`src/data/users.json`** + **`src/data/qcms.json`** — seed data as defined above
4. **`src/styles/variables.css`** + **`src/styles/memphis.css`** — Memphis design system
5. **`src/lib/auth.ts`** + **`src/lib/i18n.ts`** — utilities and i18n config
6. **`src/services/qcmService.ts`** + **`src/services/userService.ts`** — business logic
7. **`src/hooks/`** — all 4 hooks (`useAuth`, `useQcm`, `useLocalStorage`, `useTranslation`)
8. **`src/contexts/`** — `AuthContext`, `QcmContext`, `ThemeContext`
9. **`public/locales/fr/common.json`** + **`public/locales/en/common.json`** — i18n translations
10. **`src/components/ui/`** — atomic Memphis-styled components (Button, Card, Input, Badge, Modal, ProgressBar)
11. **`src/components/layout/`** — `Header`, `Footer`, `Navigation`, `MobileMenu`
12. **`src/components/auth/`** — `LoginForm`, `RegisterForm`, `RoleGuard`
13. **`src/components/home/`** — `HeroSection`, `CertificationCards`, `FeatureSection`
14. **`src/components/qcm/`** — `QcmList`, `QuestionCard`, `AnswerOption`, `QcmForm`, `ResultSummary`, `TopicSelector`
15. **`src/components/admin/`** — `UserTable`
16. **`src/app/layout.tsx`** + **`src/app/globals.css`** — root layout with providers
17. **`src/app/page.tsx`** — Home page
18. **`src/app/(auth)/login/page.tsx`** + **`src/app/(auth)/register/page.tsx`**
19. **`src/app/dashboard/page.tsx`**
20. **`src/app/practice/page.tsx`** + **`src/app/practice/[topic]/page.tsx`** + **`src/app/practice/mixed/page.tsx`**
21. **`src/app/contributor/qcm/new/page.tsx`** + **`src/app/contributor/qcm/[id]/edit/page.tsx`**
22. **`src/app/admin/users/page.tsx`** + **`src/app/admin/qcms/page.tsx`**
23. **All API routes** under `src/app/api/`
24. **`__tests__/`** — test files mirroring `src/` structure for key components

---

## ✅ Acceptance Criteria

Before considering the scaffold complete, verify:

- [ ] `npm install` runs without errors
- [ ] `npm run dev` starts the app on `http://localhost:3000`
- [ ] Home page (`/`) renders with Memphis styling
- [ ] Login page (`/login`) accepts `user@qcm.local / user123` and redirects to `/dashboard`
- [ ] `RoleGuard` redirects unauthenticated users from `/dashboard` to `/login`
- [ ] Admin user can access `/admin/users`
- [ ] Non-admin user cannot access `/admin/users` (redirected)
- [ ] Language toggle in Header switches between FR and EN
- [ ] `npm test` runs without configuration errors
- [ ] All components use translation keys (no hardcoded French or English strings)
