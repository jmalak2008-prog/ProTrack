# ProTrack — Smart Recruitment Platform

Application ATS en français, développée avec Next.js 14, React, TypeScript, Tailwind CSS, Recharts, Supabase (schéma et RLS fournis) et OpenRouter (analyse de CV côté serveur).

## 1. Lancer l'application

Prérequis : Node.js 20+ et npm.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Ouvrir http://localhost:3000.

Sans variables Supabase ni OpenRouter, l'application démarre en **mode démonstration** : 4 offres, 22 candidats fictifs, entretiens, évaluations, navigation interactive et stockage local via `localStorage`. Les données de démo ne sont pas des données réelles et ne doivent pas être utilisées pour prendre une décision de recrutement.

## 2. Analyse réelle des CV

1. Créer une clé sur OpenRouter.
2. Ajouter `OPENROUTER_API_KEY=...` dans `.env.local` (jamais de préfixe `NEXT_PUBLIC_`).
3. Définir éventuellement `OPENROUTER_MODEL` (par défaut `openai/gpt-4o-mini`).
4. Redémarrer le serveur.
5. Dans « Analyse IA des CV », sélectionner un poste, déposer des PDF (maximum 50) puis lancer l'analyse.

L'API `/api/analyze` extrait le texte PDF côté serveur avec `pdf-parse`, envoie le contenu à OpenRouter, puis valide la structure JSON. Les critères motivation, disponibilité et salaire restent `null` si le CV ne les documente pas. Vérifier les résultats avant de les utiliser : l'IA peut se tromper et ne prend jamais la décision finale.

> Avant un déploiement public, ajouter une authentification obligatoire, des limites de taille et de fréquence, une file de traitement asynchrone pour les lots de 50 fichiers, une politique de conservation/suppression des CV et les mentions d'information/consentement conformes au droit applicable. Ne pas téléverser de vrais CV dans une démo publique.

## 3. Supabase (base de données, comptes, stockage)

1. Créer un projet Supabase.
2. Dans SQL Editor, exécuter `supabase/schema.sql`.
3. Créer les utilisateurs dans Supabase Auth puis leurs profils dans `public.profiles` avec le rôle voulu. La première administratrice doit être initialisée par un administrateur de projet depuis SQL sécurisé.
4. Renseigner `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY` dans `.env.local`.
5. Le bucket `candidate-cvs` est privé et limité aux PDF ; les politiques RLS du schéma limitent l'accès aux postes concernés.

Le schéma formalise les tables utilisateurs, offres, membres de poste, candidats, candidatures, CV, scores IA/humains, entretiens, participants, évaluations, commentaires, historique et audit. Les politiques SQL fournies constituent la base de sécurité à tester et durcir avant production.

**État actuel de cette livraison :** l'interface et les parcours de démonstration sont opérationnels et persistés localement ; l'API d'analyse réelle est câblée à OpenRouter ; le schéma Supabase/RLS est fourni mais la couche de synchronisation des écrans avec Supabase Auth/DB/Storage doit encore être branchée avant une utilisation multi-utilisateur en production. Le sélecteur de rôle dans la démo sert uniquement à présenter les profils et n'est pas un contrôle d'accès sécurisé.

## 4. Fonctionnalités incluses

- Tableau de bord et graphiques calculés depuis les données de l'application.
- CRUD de base des offres, pondérations configurables avec validation stricte à 100 %.
- Recherche et filtres des candidatures, export CSV compatible Excel, changement de statut et historique.
- Import PDF multi-fichiers (limite UI 50), alerte de doublon, aucun effacement automatique.
- Analyse CV via OpenRouter (quand la clé est configurée), score pondéré, notes modifiables et recalcul.
- Classement par score, puis compétences techniques, expérience et date en cas d'égalité.
- Seuils 75/50 par défaut, recommandation non décisionnelle.
- Planification d'entretiens, statuts et espace de compte rendu.
- Grille d'évaluation et commentaires, rapports et paramètres de rôles en démo.

## 5. Vérification

```bash
npm run build
```

Pour les tests métier, contrôler notamment que les pondérations actives totalisent 100 %, que les notes inconnues ne deviennent pas des zéros, que les doublons sont signalés sans suppression, et que les rôles non RH ne voient que leurs postes dans la version Supabase.
