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

    // Vérifier et créer la structure si nécessaire
    ensureDataStructure() {
        let data = this.loadData();
        if (!data) {
            data = this.getDefaultData();
            this.saveData(data);
        }
        // S'assurer que les nouvelles propriétés existent
        if (!data.stats.quizzesTotalQuestions) {
            data.stats.quizzesTotalQuestions = 0;
        }
        // Vérifier la dernière visite pour les jours actifs
        this.updateDaysActive(data);
        return data;
    },

    // Charger les données
    loadData() {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            return stored ? JSON.parse(stored) : null;
        } catch (e) {
            console.error('Erreur chargement données:', e);
            return null;
        }
    },

    // Sauvegarder les données
    saveData(data) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('Erreur sauvegarde données:', e);
            return false;
        }
    },

    // Mettre à jour les jours actifs
    updateDaysActive(data) {
        const today = new Date().toDateString();
        const lastVisit = new Date(data.user.lastVisit).toDateString();

        if (today !== lastVisit) {
            data.stats.daysActive++;

            // Vérifier le streak
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toDateString();

            if (lastVisit === yesterdayStr) {
                data.stats.streak++;
            } else {
                data.stats.streak = 1;
            }

            data.user.lastVisit = new Date().toISOString();
            this.saveData(data);
        }
    },

    // Suivre la visite d'une page
    trackPageVisit() {
        const data = this.loadData();
        const pageName = this.getCurrentPageName();

        if (!data.pagesVisited[pageName]) {
            data.pagesVisited[pageName] = {
                visits: 0,
                firstVisit: new Date().toISOString(),
                lastVisit: new Date().toISOString(),
                timeSpent: 0
            };
            data.stats.totalPages++;
        }

        data.pagesVisited[pageName].visits++;
        data.pagesVisited[pageName].lastVisit = new Date().toISOString();

        // Mettre à jour la progression par section
        this.updateSectionProgress(data, pageName);

        // Vérifier les achievements
        this.checkAchievements(data);

        this.saveData(data);
    },

    // Obtenir le nom de la page actuelle
    getCurrentPageName() {
        const path = window.location.pathname;
        const page = path.split('/').pop() || 'index.html';
        return page.replace('.html', '');
    },

    // ✨ CORRIGÉ : Meilleure logique de progression des sections
    updateSectionProgress(data, pageName) {
        const sectionPages = {
            base: ['base', 'index'],
            specificites: ['specificite'],
            ouvertures: ['ouverture'],
            videos: ['videos']
        };

        for (const [section, pages] of Object.entries(sectionPages)) {
            // Vérifier si la page appartient à cette section
            if (pages.includes(pageName)) {
                // Calculer la progression basée sur :
                // 1. Visite de la page (40%)
                // 2. Temps passé (30%)
                // 3. Scroll complet (30%)

                let progress = 40; // Base pour avoir visité

                const pageData = data.pagesVisited[pageName];
                if (pageData) {
                    // Bonus temps (max 30% si > 2 minutes)
                    const timeBonus = Math.min(30, (pageData.timeSpent / 2) * 30);
                    progress += timeBonus;

                    // Bonus visites multiples (max 30%)
                    const visitBonus = Math.min(30, pageData.visits * 10);
                    progress += visitBonus;
                }

                data.progression[section] = Math.min(100, Math.round(progress));
            }
        }
    },

    // Timer de session
    startSessionTimer() {
        const data = this.loadData();
        const pageName = this.getCurrentPageName();

        // Sauvegarder le temps passé toutes les 30 secondes
        setInterval(() => {
            const currentData = this.loadData();
            currentData.stats.studyTime += 0.5; // 30 secondes = 0.5 minutes

            if (currentData.pagesVisited[pageName]) {
                currentData.pagesVisited[pageName].timeSpent += 0.5;
            }

            // Mettre à jour la progression de la section
            this.updateSectionProgress(currentData, pageName);

            this.saveData(currentData);
        }, 30000);
    },

    // ✨ CORRIGÉ : Enregistrer un résultat de quiz
    saveQuizResult(difficulty, score, total, timeSeconds) {
        const data = this.loadData();

        const result = {
            date: new Date().toISOString(),
            difficulty: difficulty,
            score: score,
            total: total,
            percentage: Math.round((score / total) * 100),
            time: timeSeconds
        };

        data.quizResults.push(result);
        data.stats.quizzesTaken++;
        data.stats.quizzesCorrect += score;
        data.stats.quizzesTotalQuestions += total; // ✨ NOUVEAU : Compter le total des questions

        // Ajouter à l'activité récente
        this.addActivity(data, `Quiz "${difficulty}" complété avec ${result.percentage}%`, '✅');

        // Vérifier les achievements
        this.checkAchievements(data);

        // Mettre à jour l'ELO estimé
        this.updateEstimatedElo(data);

        this.saveData(data);
    },

    // ✨ NOUVEAU : Sauvegarder un résultat de puzzle
    savePuzzleResult(puzzleData) {
            const data = this.loadData();

            if (!data.puzzleStats) {
                data.puzzleStats = {
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
                };
            }

            data.puzzleStats.totalAttempts++;
            data.puzzleStats.byDifficulty[puzzleData.difficulty].attempted++;

            if (puzzleData.solved) {
                data.puzzleStats.totalSolved++;
                data.puzzleStats.byDifficulty[puzzleData.difficulty].solved++;

                // Ajouter à la liste des puzzles résolus
                if (!data.puzzleStats.solvedPuzzles.includes(puzzleData.puzzleId)) {
                    data.puzzleStats.solvedPuzzles.push(puzzleData.puzzleId);
                }

                // Streak
                data.puzzleStats.currentStreak++;
                if (data.puzzleStats.currentStreak > data.puzzleStats.bestStreak) {
                    data.puzzleStats.bestStreak = data.puzzleStats.currentStreak;
                }

                // Activité
                this.addActivity(data,
                    `Puzzle #${puzzleData.puzzleId} résolu en ${puzzleData.timeSpent}s`,
                    '🧩'
                );
            } else {
                data.puzzleStats.currentStreak = 0;
            }

            // Compteurs
            data.puzzleStats.totalHintsUsed += puzzleData.hintsUsed || 0;

            // Temps moyen
            const times = data.recentActivity
                .filter(a => a.icon === '🧩')
                .map(a => {
                    const match = a.text.match(/(\d+)s/);
                    return match ? parseInt(match[1]) : 0;
                });

            if (times.length > 0) {
                data.puzzleStats.averageTime = Math.round(
                    times.reduce((a, b) => a + b, 0) / times.length
                );
            }

            // Vérifier achievements
            this.checkAchievements(data);

            this.saveData(data);
    },

    // Mettre à jour l'ELO estimé
    updateEstimatedElo(data) {
        // ✨ CORRIGÉ : Calcul basé sur le total réel des questions
        const avgQuizScore = data.stats.quizzesTotalQuestions > 0
            ? data.stats.quizzesCorrect / data.stats.quizzesTotalQuestions
            : 0;

        const progressAvg = (data.progression.base + data.progression.specificites +
            data.progression.ouvertures + data.progression.videos) / 4;

        // Formule simple d'estimation
        const baseElo = 800;
        const quizBonus = avgQuizScore * 500;
        const progressBonus = progressAvg * 5;

        data.stats.estimatedElo = Math.round(baseElo + quizBonus + progressBonus);
    },

    // Enregistrer une partie jouée
    saveGamePlayed(won, movesCount) {
        const data = this.loadData();
        data.stats.gamesPlayed++;

        this.addActivity(data,
            won ? `Partie gagnée en ${movesCount} coups` : `Partie jouée (${movesCount} coups)`,
            '♟️'
        );

        this.checkAchievements(data);
        this.saveData(data);
    },

    // Enregistrer une vidéo regardée
    saveVideoWatched(videoTitle) {
        const data = this.loadData();
        data.stats.videosWatched++;

        this.addActivity(data, `Vidéo "${videoTitle}" visionnée`, '🎥');

        // Mettre à jour la progression vidéos (10% par vidéo, max 100%)
        data.progression.videos = Math.min(100, data.stats.videosWatched * 10);

        this.saveData(data);
    },

    // Ajouter une activité récente
    addActivity(data, text, icon) {
        const activity = {
            date: new Date().toISOString(),
            text: text,
            icon: icon
        };

        data.recentActivity.unshift(activity);

        // Garder seulement les 10 dernières activités
        if (data.recentActivity.length > 10) {
            data.recentActivity = data.recentActivity.slice(0, 10);
        }
    },

    // ✨ CORRIGÉ : Vérifier et débloquer les achievements (plus faciles)
    checkAchievements(data) {
        const achievements = data.achievements;

        // Premier Pas (dès la première page)
        if (!achievements.firstVisit && data.stats.totalPages >= 1) {
            achievements.firstVisit = true;
            this.unlockAchievement(data, 'Premier Pas', '🎓');
        }

        // Lecteur Assidu (10 pages au lieu de 100)
        if (!achievements.reader10 && data.stats.totalPages >= 10) {
            achievements.reader10 = true;
            this.unlockAchievement(data, 'Lecteur Assidu', '📚');
        }

        // Quiz Master (3 quiz parfaits au lieu de 10)
        const perfectQuizzes = data.quizResults.filter(q => q.percentage === 100).length;
        if (!achievements.quizMaster && perfectQuizzes >= 3) {
            achievements.quizMaster = true;
            this.unlockAchievement(data, 'Quiz Master', '🎯');
        }

        // Speed Runner (1 quiz rapide au lieu de 5)
        const fastQuizzes = data.quizResults.filter(q => q.time < 120).length;
        if (!achievements.speedRunner && fastQuizzes >= 1) {
            achievements.speedRunner = true;
            this.unlockAchievement(data, 'Rapide', '⚡');
        }

        // En Feu (3 jours consécutifs au lieu de 7)
        if (!achievements.onFire && data.stats.streak >= 3) {
            achievements.onFire = true;
            this.unlockAchievement(data, 'En Feu', '🔥');
        }

        // Tacticien (10 parties au lieu de 50)
        if (!achievements.tactician && data.stats.gamesPlayed >= 10) {
            achievements.tactician = true;
            this.unlockAchievement(data, 'Tacticien', '♟️');
        }

        // ✨ NOUVEAU : Puzzle Solver (10 puzzles)
        if (!achievements.puzzleSolver && data.puzzleStats && data.puzzleStats.totalSolved >= 10) {
            achievements.puzzleSolver = true;
            this.unlockAchievement(data, 'Puzzle Solver', '🧩');
        }

        // ✨ NOUVEAU : Puzzle Master (50 puzzles)
        if (!achievements.puzzleMaster && data.puzzleStats && data.puzzleStats.totalSolved >= 50) {
            achievements.puzzleMaster = true;
            this.unlockAchievement(data, 'Puzzle Master', '🎯');
        }

        // ✨ NOUVEAU : Perfect Puzzle (résolu sans indice)
        if (!achievements.perfectPuzzle && data.puzzleStats) {
            const perfectSolves = data.recentActivity.filter(a =>
                a.icon === '🧩' && a.text.includes('sans indice')
            ).length;
            if (perfectSolves >= 5) {
                achievements.perfectPuzzle = true;
                this.unlockAchievement(data, 'Puzzle Parfait', '💎');
            }
        }

        // ✨ NOUVEAU : Speed Puzzler (résolu en moins de 30s)
        if (!achievements.speedPuzzler && data.puzzleStats) {
            const fastSolves = data.recentActivity.filter(a => {
                if (a.icon !== '🧩') return false;
                const match = a.text.match(/(\d+)s/);
                return match && parseInt(match[1]) < 30;
            }).length;
            if (fastSolves >= 10) {
                achievements.speedPuzzler = true;
                this.unlockAchievement(data, 'Éclair', '⚡');
            }
        }

        // Perfectionniste (100% partout)
        const allComplete = Object.values(data.progression).every(p => p === 100);
        if (!achievements.perfectionist && allComplete) {
            achievements.perfectionist = true;
            this.unlockAchievement(data, 'Perfectionniste', '🌟');
        }

        // Grand Maître (tout complété + tous les achievements)
        const allAchievements = Object.entries(achievements)
            .filter(([key]) => key !== 'grandmaster')
            .every(([_, value]) => value === true);
        if (!achievements.grandmaster && allAchievements && allComplete) {
            achievements.grandmaster = true;
            this.unlockAchievement(data, 'Grand Maître', '👑');
        }
    },

    // Débloquer un achievement
    unlockAchievement(data, name, icon) {
        this.addActivity(data, `Nouveau trophée débloqué : "${name}"`, '🏆');

        // Ajouter un badge si nécessaire
        if (!data.badges.includes(name)) {
            data.badges.push(name);
        }

        console.log(`🏆 Trophée débloqué : ${name}`);
    },

    // Mettre à jour le parcours d'apprentissage
    updateLearningPath(pathKey, completed) {
        const data = this.loadData();
        data.learningPath[pathKey] = completed;

        if (completed) {
            const pathNames = {
                fundamentalRules: 'Règles Fondamentales',
                specialMoves: 'Coups Spéciaux',
                basicTactics: 'Tactiques de Base',
                openingRepertoire: 'Répertoire d\'Ouvertures',
                essentialEndgames: 'Finales Essentielles'
            };

            this.addActivity(data, `✓ ${pathNames[pathKey]} complété`, '🎯');
        }

        this.saveData(data);
    },

    // Obtenir toutes les données pour le profil
    getProfileData() {
        return this.loadData();
    },

    // Réinitialiser toutes les données
    resetAllData() {
        if (confirm('Êtes-vous sûr de vouloir réinitialiser toutes vos données ?')) {
            localStorage.removeItem(this.STORAGE_KEY);
            const newData = this.getDefaultData();
            this.saveData(newData);
            alert('Données réinitialisées !');
            window.location.reload();
        }
    },

    // Exporter les données
    exportData() {
        const data = this.loadData();
        const dataStr = JSON.stringify(data, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `chess-school-progress-${new Date().toISOString().split('T')[0]}.json`;
        a.click();

        URL.revokeObjectURL(url);
    },

    // Importer les données
    importData(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                this.saveData(data);
                alert('Données importées avec succès !');
                window.location.reload();
            } catch (error) {
                alert('Erreur lors de l\'importation des données');
                console.error(error);
            }
        };
        reader.readAsText(file);
    }
};

// Initialiser automatiquement au chargement de la page
if (typeof window !== 'undefined') {
    window.ChessSchoolProgress = ChessSchoolProgress;

    document.addEventListener('DOMContentLoaded', () => {
        ChessSchoolProgress.init();
    });
}

// Pour le parcours d'apprentissage
function markPathComplete(pathKey) {
    window.ChessSchoolProgress.updateLearningPath(pathKey, true);
}