# Chess School (v5 - ALPHA / PREVIEW)

Site web éducatif gratuit pour apprendre et progresser aux **échecs** (en français).

## Aperçu

Le projet est une application web **100% front-end** (HTML/CSS/JavaScript) qui propose :

- Des pages de cours : **Bases**, **Spécificités**, **Ouvertures**, **Glossaire**
- Des ressources : **Vidéos**
- Des outils d’entraînement : **Quiz**, **Puzzles** (selon l’avancement)
- Un **équipement interactif** via scripts JS (gestion de la progression, interaction avec l’échiquier, etc.)

> Note : le site peut afficher une page de maintenance selon l’état du projet (voir `javascript/maintenance-redirect.js`).

## Contenu du dépôt

- **Pages HTML** (root)
  - `index.html` : page d’accueil
  - `base.html`, `specificite.html`, `ouverture.html`, `videos.html`
  - `quiz.html`, `quiznew.html`
  - `probleme.html` (puzzles), `profil.html` (progression)
  - `glossaire.html`, `faq.html`, `cgu.html`, `mentions-legales.html`, etc.
- **Styles**
  - `css/styles.css` (global)
  - `css/profil.css`, `css/puzzle.css`
- **Scripts JavaScript**
  - `javascript/script.js` : comportements généraux (ex. FAQ/quiz selon les pages)
  - `javascript/burger-menu.js` : menu mobile
  - `javascript/chessboard.js` : logique d’échiquier (si utilisé)
  - `javascript/save-system.js` : sauvegarde (localStorage / progression)
  - `javascript/progress-tracker.js` : suivi de progression
  - `javascript/maintenance-redirect.js` : redirection maintenance
  - `javascript/piece-util.js` : utilitaires de pièces

## Installation / Exécution

Aucune dépendance NPM n’est nécessaire.

### Option 1 : ouvrir le site directement

1. Ouvrez `index.html` dans votre navigateur.

### Option 2 : serveur local (recommandé)

Comme ce projet charge des ressources (JS/CSS), un petit serveur local évite certains soucis de chargement.

- Utilisez un serveur statique (ex. VSCode Live Server).

## Utilisation (fonctionnel)

- Naviguer via le menu (header + burger)
- Réaliser les **quiz**
- Suivre la progression dans `profil.html`

## Développement

- Le projet utilise des scripts séparés par fonctionnalité (échec/échec-mat, puzzle, quiz, sauvegarde, etc.)
- Les scripts s’appuient sur des variables globales possibles (ex. `window.ChessSchoolProgress`) et sur des éléments DOM propres à chaque page.

## Licence

Le projet est distribué sous **GNU AGPL v3** (voir `LICENSE.txt`).

## Liens

- GitHub : https://github.com/Devlaubin/Chess-school
- Discord : https://discord.gg/C4q8Cae4Ju
