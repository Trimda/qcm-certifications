import React from 'react';
import Link from 'next/link';
import {
  BookOpenIcon,
  TagIcon,
  FileArrowUpIcon,
  DownloadSimpleIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  StarIcon,
  UsersIcon,
} from '@phosphor-icons/react/ssr';

export default function AboutPage() {
  const jsonExample = `[
  {
    "title": {
      "fr": "Titre du QCM en français",
      "en": "QCM title in English"
    },
    "description": {
      "fr": "Description courte en français.",
      "en": "Short description in English."
    },
    "topic": "scrum",        // "scrum" | "devops" | "safe"
    "isPrivate": false,      // true = visible uniquement par vous
    "questions": [
      {
        "text": {
          "fr": "Texte de la question en français ?",
          "en": "Question text in English?"
        },
        "options": [
          { "id": "a", "text": { "fr": "Option A", "en": "Option A" } },
          { "id": "b", "text": { "fr": "Option B", "en": "Option B" } },
          { "id": "c", "text": { "fr": "Option C", "en": "Option C" } },
          { "id": "d", "text": { "fr": "Option D", "en": "Option D" } }
        ],
        "correctAnswer": "b" // "a" | "b" | "c" | "d"
      }
    ]
  }
]`;

  const csvExample = `title_fr,title_en,description_fr,description_en,topic,is_private,question_fr,question_en,option_a_fr,option_a_en,option_b_fr,option_b_en,option_c_fr,option_c_en,option_d_fr,option_d_en,correct_answer
Mon QCM,My QCM,Description FR,Description EN,scrum,false,Question 1 FR ?,Question 1 EN ?,A FR,A EN,B FR,B EN,C FR,C EN,D FR,D EN,b
Mon QCM,My QCM,Description FR,Description EN,scrum,false,Question 2 FR ?,Question 2 EN ?,A FR,A EN,B FR,B EN,C FR,C EN,D FR,D EN,a`;

  const validationRules = [
    "Les champs \"title\" et \"description\" doivent avoir au moins une traduction (fr ou en).",
    "Le champ \"topic\" doit être l'une des valeurs : scrum, devops, safe.",
    "Chaque question doit avoir exactement 4 options avec les identifiants a, b, c et d.",
    "Le champ \"correctAnswer\" doit être l'un des identifiants d'option : a, b, c ou d.",
    "Le QCM doit contenir au moins une question.",
    "En CSV, une ligne correspond à une question. Les métadonnées (title, description, topic) sont répétées sur chaque ligne.",
    "Les colonnes \"_en\" peuvent être vides si le QCM est en français uniquement (et inversement).",
  ];

  return (
    <main className="max-w-4xl mx-auto px-4 py-12 flex flex-col gap-16">

      {/* ── Présentation ── */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <BookOpenIcon size={32} weight="bold" />
          <h1 className="memphis-heading text-3xl">À propos de QCM Certif</h1>
        </div>
        <p className="text-base leading-relaxed">
          <strong>QCM Certif</strong> est une application interactive pour préparer les certifications
          professionnelles <strong>SCRUM</strong>, <strong>DevOps</strong> et <strong>SAFe</strong> à travers des
          questionnaires à choix multiples.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: <StarIcon size={20} weight="bold" />, label: 'Sessions de pratique', desc: 'Par thème ou sessions mixtes, avec mémorisation de vos meilleurs scores.' },
            { icon: <UsersIcon size={20} weight="bold" />, label: 'Espace contributeur', desc: 'Créez et partagez vos propres QCMs, en français, en anglais ou dans les deux langues.' },
            { icon: <ShieldCheckIcon size={20} weight="bold" />, label: "Gestion des rôles", desc: "Trois niveaux d'accès : utilisateur, contributeur et administrateur." },
          ].map(({ icon, label, desc }) => (
            <div key={label} className="memphis-card flex flex-col gap-2 p-4">
              <div className="flex items-center gap-2 font-black">
                {icon}
                <span>{label}</span>
              </div>
              <p className="text-sm opacity-80">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Thèmes disponibles ── */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <TagIcon size={28} weight="bold" />
          <h2 className="memphis-heading text-2xl">Thèmes disponibles</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { topic: 'SCRUM', color: 'var(--memphis-yellow)', desc: 'Rôles, événements et artefacts du framework SCRUM.' },
            { topic: 'DevOps', color: 'var(--memphis-blue)', desc: 'CI/CD, Infrastructure as Code et culture DevOps.' },
            { topic: 'SAFe', color: 'var(--memphis-pink)', desc: "Program Increments, ART et mise à l'échelle agile." },
          ].map(({ topic, color, desc }) => (
            <div key={topic} className="memphis-card p-4 flex flex-col gap-2" style={{ borderColor: color }}>
              <span className="font-black text-lg" style={{ color }}>{topic}</span>
              <p className="text-sm opacity-80">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Import de QCMs ── */}
      <section id="import" className="flex flex-col gap-6 scroll-mt-24">
        <div className="flex items-center gap-3">
          <FileArrowUpIcon size={28} weight="bold" />
          <h2 className="memphis-heading text-2xl">Importer des QCMs</h2>
        </div>
        <p className="text-base leading-relaxed">
          Lors de la création d'un QCM, vous pouvez <strong>uploader directement un fichier JSON ou CSV</strong> au
          lieu de remplir le formulaire manuellement. Le fichier est validé en front puis vérifié côté serveur avant
          d'être pré-rempli dans le formulaire — vous pouvez ensuite réviser et soumettre.
        </p>

        {/* JSON */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="font-black text-lg uppercase tracking-wide">Format JSON</h3>
            <a
              href="/examples/qcm-example.json"
              download="qcm-example.json"
              className="memphis-button-outline inline-flex items-center gap-2 text-sm self-start sm:self-auto"
            >
              <DownloadSimpleIcon size={16} weight="bold" />
              Télécharger l'exemple JSON
            </a>
          </div>
          <p className="text-sm opacity-80">
            Le fichier doit être un <strong>tableau JSON</strong> contenant un objet QCM. Tous les champs textuels
            utilisent le format <code className="bg-gray-100 px-1 py-0.5 text-xs">{"{ fr: \"...\", en: \"...\" }"}</code>.
            Si votre QCM est uniquement en français, laissez <code className="bg-gray-100 px-1 py-0.5 text-xs">en</code> vide.
          </p>
          <pre className="bg-gray-950 text-green-400 text-xs p-4 overflow-x-auto border-2 border-black leading-relaxed">
            {jsonExample}
          </pre>
        </div>

        {/* CSV */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="font-black text-lg uppercase tracking-wide">Format CSV</h3>
            <a
              href="/examples/qcm-example.csv"
              download="qcm-example.csv"
              className="memphis-button-outline inline-flex items-center gap-2 text-sm self-start sm:self-auto"
            >
              <DownloadSimpleIcon size={16} weight="bold" />
              Télécharger l'exemple CSV
            </a>
          </div>
          <p className="text-sm opacity-80">
            Le fichier CSV utilise une <strong>ligne par question</strong>. Les colonnes de métadonnées (title, description,
            topic) sont répétées sur chaque ligne mais seules les valeurs de la <strong>première ligne</strong> sont
            utilisées. Les colonnes <code className="bg-gray-100 px-1 py-0.5 text-xs">_en</code> peuvent être laissées
            vides pour un QCM uniquement en français.
          </p>
          <pre className="bg-gray-950 text-green-400 text-xs p-4 overflow-x-auto border-2 border-black leading-relaxed whitespace-pre">
            {csvExample}
          </pre>
        </div>

        {/* Validation rules */}
        <div className="memphis-card p-4 flex flex-col gap-3">
          <h3 className="font-black text-base uppercase tracking-wide flex items-center gap-2">
            <ShieldCheckIcon size={18} weight="bold" />
            Règles de validation
          </h3>
          <ul className="flex flex-col gap-2">
            {validationRules.map((rule, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <CheckCircleIcon size={16} weight="bold" className="shrink-0 mt-0.5" />
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex gap-3">
          <Link href="/contributor/qcm/new" className="memphis-button-primary inline-flex items-center gap-2 text-sm">
            <FileArrowUpIcon size={16} weight="bold" />
            Créer un QCM maintenant
          </Link>
        </div>
      </section>

    </main>
  );
}
