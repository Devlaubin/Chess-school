// ========================================
// SYSTÈME DE PUZZLES CHESS SCHOOL
// Fichier: puzzles.js
// ========================================

// Base de données des puzzles
const puzzlesDatabase = {
    facile: [
        {
            id: 1,
            title: "Mat en 1 coup",
            description: "Les blancs jouent et font mat",
            objective: "Trouvez le coup gagnant !",
            position: "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R",
            solution: "Qf7#",
            hint: "Regardez la dame blanche et le roi noir...",
            difficulty: "facile"
        },
        {
            id: 2,
            title: "Fourchette royale",
            description: "Les blancs jouent et gagnent du matériel",
            objective: "Attaquez le roi et la tour simultanément",
            position: "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R",
            solution: "Ng5",
            hint: "Le cavalier peut faire une fourchette...",
            difficulty: "facile"
        },
        {
            id: 3,
            title: "Clouage décisif",
            description: "Les blancs jouent et gagnent la dame",
            objective: "Clouez une pièce importante",
            position: "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R",
            solution: "Bg5",
            hint: "Le fou peut clouer le cavalier sur la dame...",
            difficulty: "facile"
        }
    ],
    moyen: [
        {
            id: 4,
            title: "Sacrifice de dame",
            description: "Les blancs sacrifient la dame pour mater",
            objective: "Trouvez le sacrifice gagnant",
            position: "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQK2R",
            solution: "Qxf7+",
            hint: "Sacrifiez la dame sur f7...",
            difficulty: "moyen"
        },
        {
            id: 5,
            title: "Mat du couloir",
            description: "Les blancs font mat avec la tour",
            objective: "Exploitez le roi coincé",
            position: "6k1/5ppp/8/8/8/8/5PPP/R5K1",
            solution: "Ra8#",
            hint: "Le roi noir ne peut pas s'échapper...",
            difficulty: "moyen"
        }
    ],
    difficile: [
        {
            id: 6,
            title: "Combinaison complexe",
            description: "Les blancs jouent et gagnent",
            objective: "Trouvez la suite de coups gagnante",
            position: "r1bq1rk1/ppp2ppp/2np1n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQ1RK1",
            solution: "Bxf7+",
            hint: "Commencez par un sacrifice de fou...",
            difficulty: "difficile"
        }
    ]
};

// Variables globales
let currentPuzzle = null;
let currentDifficulty = 'facile';
let attempts = 0;
let hintsUsed = 0;
let startTime = 0;

// Initialisation
document.addEventListener('DOMContentLoaded', function () {
    loadPuzzleStats();
    setupEventListeners();
    displayPuzzleList();
});

// ... (reste du fichier puzzles.js copié ici) ...
