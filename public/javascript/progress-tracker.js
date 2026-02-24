// ========================================
// SYSTÈME DE PROGRESSION CHESS SCHOOL - VERSION CORRIGÉE
// Fichier: progress-tracker.js
// ========================================

const ChessSchoolProgress = {
    // Clé de stockage principale
    STORAGE_KEY: 'chessSchoolProgress',

    // Initialiser le système
    init() {
        this.ensureDataStructure();
        this.trackPageVisit();
        this.startSessionTimer();
        console.log('Chess School Progress Tracker initialisé');
    },

    // Structure de données initiale
    getDefaultData() {
        return {
            user: {
                username: 'ChessLearner2025',
                name: 'Joueur d\'Échecs',
                avatar: '♔',
                joinDate: new Date().toISOString(),
                lastVisit: new Date().toISOString()
            },
            stats: {
                totalPages: 0,
                studyTime: 0, // en minutes
                currentSession: 0,
                quizzesTaken: 0,
                quizzesCorrect: 0,
                quizzesTotalQuestions: 0,
                gamesPlayed: 0,
                videosWatched: 0,
                daysActive: 0,
                streak: 0,
                estimatedElo: 800
            },
            puzzleStats: {
                totalAttempts: 0,
                totalSolved: 0,
                currentStreak: 0,
                bestStreak: 0,
                solvedPuzzles: [],
                totalHintsUsed: 0,
                averageTime: 0,
                byDifficulty: {
                    facile: { solved: 0, attempted: 0 },
                    moyen: { solved: 0, attempted: 0 },
                    difficile: { solved: 0, attempted: 0 }
                }
            },
            progression: {
                base: 0,
                specificites: 0,
                ouvertures: 0,
                videos: 0
            },
            pagesVisited: {},
            quizResults: [],
            achievements: {
                firstVisit: false,
                reader10: false,
                quizMaster: false,
                speedRunner: false,
                onFire: false,
                tactician: false,
                puzzleSolver: false,    // ✨ NOUVEAU : 10 puzzles résolus
                puzzleMaster: false,    // ✨ NOUVEAU : 50 puzzles résolus
                perfectPuzzle: false,   // ✨ NOUVEAU : Puzzle sans indice
                speedPuzzler: false,    // ✨ NOUVEAU : Puzzle en < 30s
                grandmaster: false,
                perfectionist: false
            },
            learningPath: {
                fundamentalRules: false,
                specialMoves: false,
                basicTactics: false,
                openingRepertoire: false,
                essentialEndgames: false
            },
            recentActivity: [],
            badges: []
        };
    },

    // ... (reste du fichier progress-tracker.js copié ici) ...
};

// Exposer globalement
if (!window.ChessSchoolProgress) window.ChessSchoolProgress = ChessSchoolProgress;
window.ChessSchoolProgress.init();
