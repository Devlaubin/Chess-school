// ========================================
// AFFICHAGE DU PROFIL CHESS SCHOOL - VERSION CORRIGÉE
// Fichier: profile-display.js
// ========================================

// Attendre que le système de progression soit disponible
function waitForProgress(callback, maxWait = 5000) {
    const startTime = Date.now();

    const checkProgress = () => {
        if (window.ChessSchoolProgress && window.ChessSchoolProgress.getProfileData) {
            console.log('✅ ChessSchoolProgress disponible!');
            callback();
        } else if (Date.now() - startTime < maxWait) {
            setTimeout(checkProgress, 100);
        } else {
            console.error('❌ Timeout: ChessSchoolProgress non disponible');
        }
    };

    checkProgress();
}

// Démarrer après que le DOM soit chargé ET que le progrès soit disponible
document.addEventListener('DOMContentLoaded', function () {
    console.log('🔄 DOMContentLoaded déclenché');

    waitForProgress(() => {
        console.log('📊 Initialisation du profil...');
        loadProfileData();
        setupProfileActions();
    });
});

// Charger et afficher toutes les données du profil
function loadProfileData() {
    console.log('📊 Chargement des données du profil...');

    if (!window.ChessSchoolProgress) {
        console.error('❌ ChessSchoolProgress non disponible');
        return;
    }

    try {
        const data = window.ChessSchoolProgress.getProfileData();

        if (!data) {
            console.error('❌ Aucune donnée de profil trouvée');
            return;
        }

        console.log('✅ Données trouvées:', data);

        // Informations utilisateur
        updateUserInfo(data);

        // Statistiques rapides
        updateQuickStats(data);

        // Badges
        updateBadges(data);

        // Statistiques détaillées
        updateDetailedStats(data);

        // Statistiques puzzles
        updatePuzzleStats(data);

        // Barres de progression
        updateProgressBars(data);

        // Parcours d'apprentissage
        updateLearningPath(data);

        // Achievements
        updateAchievements(data);

        // Activité récente
        updateRecentActivity(data);

        console.log('✅ Profil complètement chargé');
    } catch (error) {
        console.error('❌ Erreur lors du chargement du profil:', error);
    }
}

// Mettre à jour les informations utilisateur
function updateUserInfo(data) {
    try {
        const nameEl = document.querySelector('.profile-name');
        const usernameEl = document.querySelector('.profile-username');
        const avatarEl = document.querySelector('.profile-avatar');

        if (nameEl) nameEl.textContent = data.user.name || 'Joueur d\'Échecs';
        if (usernameEl) usernameEl.textContent = '@' + (data.user.username || 'ChessLearner2025');
        if (avatarEl) avatarEl.textContent = data.user.avatar || '♔';

        console.log('✅ Infos utilisateur mises à jour');
    } catch (error) {
        console.error('❌ Erreur updateUserInfo:', error);
    }
}

// ... (reste du fichier profile-display.js copié ici) ...
