// ========================================
// AFFICHAGE DU PROFIL CHESS SCHOOL
// Fichier: profile-display.js
// À ajouter dans profil.html
// ========================================

document.addEventListener('DOMContentLoaded', function () {
    loadProfileData();
    setupProfileActions();
});

// Charger et afficher toutes les données du profil
function loadProfileData() {
    const data = window.ChessSchoolProgress.getProfileData();

    if (!data) {
        console.error('Aucune donnée de profil trouvée');
        return;
    }

    // Informations utilisateur
    updateUserInfo(data);

    // Statistiques rapides
    updateQuickStats(data);

    // Badges
    updateBadges(data);

    // Statistiques détaillées
    updateDetailedStats(data);

    // Barres de progression
    updateProgressBars(data);

    // Parcours d'apprentissage
    updateLearningPath(data);

    // Achievements
    updateAchievements(data);

    // Activité récente
    updateRecentActivity(data);
}

// Mettre à jour les informations utilisateur
function updateUserInfo(data) {
    const nameEl = document.querySelector('.profile-name');
    const usernameEl = document.querySelector('.profile-username');
    const avatarEl = document.querySelector('.profile-avatar');

    if (nameEl) nameEl.textContent = data.user.name;
    if (usernameEl) usernameEl.textContent = `@${data.user.username}`;
    if (avatarEl) avatarEl.textContent = data.user.avatar;
}

// Mettre à jour les statistiques rapides
function updateQuickStats(data) {
    const stats = data.stats;

    // ELO estimé
    const eloEl = document.querySelector('.stat-quick:nth-child(1) .stat-quick-value');
    if (eloEl) eloEl.textContent = stats.estimatedElo;

    // Jours actifs
    const daysEl = document.querySelector('.stat-quick:nth-child(2) .stat-quick-value');
    if (daysEl) daysEl.textContent = stats.daysActive;

    // Trophées
    const trophiesEl = document.querySelector('.stat-quick:nth-child(3) .stat-quick-value');
    if (trophiesEl) {
        const unlockedCount = Object.values(data.achievements).filter(a => a === true).length;
        trophiesEl.textContent = unlockedCount;
    }
}

// Mettre à jour les badges
function updateBadges(data) {
    const badgesContainer = document.querySelector('.badges-container');
    if (!badgesContainer) return;

    badgesContainer.innerHTML = '';

    const badges = [];

    // Badge jours actifs
    if (data.stats.daysActive >= 7) {
        badges.push({ icon: '🎓', text: 'Élève Actif' });
    }

    // Badge pages lues
    if (data.stats.totalPages >= 50) {
        badges.push({ icon: '📚', text: `${data.stats.totalPages} Pages` });
    }

    // Badge quiz
    if (data.stats.quizzesTaken >= 5) {
        badges.push({ icon: '🏆', text: 'Quiz Master' });
    }

    // Badge streak
    if (data.stats.streak >= 7) {
        badges.push({ icon: '🔥', text: `${data.stats.streak} jours` });
    }

    // Badge vidéos
    if (data.stats.videosWatched >= 10) {
        badges.push({ icon: '🎥', text: 'Cinéphile' });
    }

    badges.forEach(badge => {
        const badgeEl = document.createElement('span');
        badgeEl.className = 'badge';
        badgeEl.innerHTML = `${badge.icon} ${badge.text}`;
        badgesContainer.appendChild(badgeEl);
    });
}

// Mettre à jour les statistiques détaillées
function updateDetailedStats(data) {
    const stats = data.stats;

    // Pages visitées
    const pagesEl = document.querySelector('.stat-card:nth-child(1) .stat-value');
    if (pagesEl) pagesEl.textContent = stats.totalPages;

    // Temps d'étude
    const timeEl = document.querySelector('.stat-card:nth-child(2) .stat-value');
    if (timeEl) {
        const hours = Math.floor(stats.studyTime / 60);
        const minutes = Math.floor(stats.studyTime % 60);
        timeEl.textContent = `${hours}h ${minutes}m`;
    }

    // Taux de réussite quiz
    const successEl = document.querySelector('.stat-card:nth-child(3) .stat-value');
    if (successEl && stats.quizzesTaken > 0) {
        const totalQuestions = stats.quizzesTaken * 10; // Supposons 10 questions par quiz
        const percentage = Math.round((stats.quizzesCorrect / totalQuestions) * 100);
        successEl.textContent = `${percentage}%`;
    }

    // Parties jouées
    const gamesEl = document.querySelector('.stat-card:nth-child(4) .stat-value');
    if (gamesEl) gamesEl.textContent = stats.gamesPlayed;
}

// Mettre à jour les barres de progression
function updateProgressBars(data) {
    const progression = data.progression;

    const sections = [
        { name: 'base', index: 1 },
        { name: 'specificites', index: 2 },
        { name: 'ouvertures', index: 3 },
        { name: 'videos', index: 4 }
    ];

    sections.forEach(section => {
        const progressValue = progression[section.name] || 0;

        // Mettre à jour le pourcentage
        const valueEl = document.querySelector(`.progress-item:nth-child(${section.index}) .progress-value`);
        if (valueEl) valueEl.textContent = `${progressValue}%`;

        // Mettre à jour la barre
        const fillEl = document.querySelector(`.progress-item:nth-child(${section.index}) .progress-fill`);
        if (fillEl) fillEl.style.width = `${progressValue}%`;
    });
}

// Mettre à jour le parcours d'apprentissage
function updateLearningPath(data) {
    const path = data.learningPath;
    const pathItems = document.querySelectorAll('.path-item');

    const pathKeys = [
        'fundamentalRules',
        'specialMoves',
        'basicTactics',
        'openingRepertoire',
        'essentialEndgames'
    ];

    pathItems.forEach((item, index) => {
        const key = pathKeys[index];
        const isComplete = path[key];
        const checkEl = item.querySelector('.path-check');

        if (checkEl) {
            if (isComplete) {
                checkEl.classList.remove('incomplete');
                checkEl.textContent = '✓';
            } else {
                checkEl.classList.add('incomplete');
                checkEl.textContent = '○';
            }
        }
    });
}

// Mettre à jour les achievements
function updateAchievements(data) {
    const achievements = data.achievements;
    const achievementCards = document.querySelectorAll('.achievement-card');

    const achievementKeys = [
        'firstVisit',      // 0
        'reader100',       // 1
        'quizMaster',      // 2
        'speedRunner',     // 3
        'onFire',          // 4
        'tactician',       // 5
        'grandmaster',     // 6
        'perfectionist'    // 7
    ];

    achievementCards.forEach((card, index) => {
        const key = achievementKeys[index];
        const isUnlocked = achievements[key];

        if (isUnlocked) {
            card.classList.remove('locked');
        } else {
            card.classList.add('locked');
        }
    });
}

// Mettre à jour l'activité récente
function updateRecentActivity(data) {
    const activityList = document.querySelector('.recent-activity');
    if (!activityList) return;

    activityList.innerHTML = '';

    const activities = data.recentActivity.slice(0, 5); // 5 dernières activités

    if (activities.length === 0) {
        activityList.innerHTML = '<li class="activity-item"><span class="activity-icon">📭</span><div class="activity-content"><p class="activity-text">Aucune activité récente</p></div></li>';
        return;
    }

    activities.forEach(activity => {
        const li = document.createElement('li');
        li.className = 'activity-item';

        const timeAgo = getTimeAgo(activity.date);

        li.innerHTML = `
            <span class="activity-icon">${activity.icon}</span>
            <div class="activity-content">
                <p class="activity-text">${activity.text}</p>
                <span class="activity-time">${timeAgo}</span>
            </div>
        `;

        activityList.appendChild(li);
    });
}

// Calculer le "il y a X temps"
function getTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins} minute${diffMins > 1 ? 's' : ''}`;
    if (diffHours < 24) return `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaine${Math.floor(diffDays / 7) > 1 ? 's' : ''}`;
    return `Il y a ${Math.floor(diffDays / 30)} mois`;
}

// Configuration des actions du profil
function setupProfileActions() {
    // Bouton modifier profil
    const editBtn = document.querySelector('.edit-profile-btn');
    if (editBtn) {
        editBtn.addEventListener('click', function () {
            showEditModal();
        });
    }

    // Ajouter bouton d'export/import (optionnel)
    addDataManagementButtons();
}

// Afficher le modal de modification
function showEditModal() {
    const data = window.ChessSchoolProgress.getProfileData();

    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;

    modal.innerHTML = `
        <div style="background: white; padding: 40px; border-radius: 20px; max-width: 500px; width: 90%;">
            <h2 style="margin-top: 0; color: #333;">Modifier le profil</h2>
            
            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #333;">Nom</label>
                <input type="text" id="edit-name" value="${data.user.name}" 
                    style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 8px; font-size: 1em;">
            </div>
            
            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #333;">Nom d'utilisateur</label>
                <input type="text" id="edit-username" value="${data.user.username}" 
                    style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 8px; font-size: 1em;">
            </div>
            
            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #333;">Avatar (emoji)</label>
                <input type="text" id="edit-avatar" value="${data.user.avatar}" maxlength="2"
                    style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 8px; font-size: 1em;">
            </div>
            
            <div style="display: flex; gap: 12px; margin-top: 30px;">
                <button id="save-profile" style="flex: 1; padding: 14px; background: linear-gradient(135deg, #599bb3, #408c99); color: white; border: none; border-radius: 25px; font-weight: bold; cursor: pointer;">
                    Enregistrer
                </button>
                <button id="cancel-profile" style="flex: 1; padding: 14px; background: #ddd; color: #333; border: none; border-radius: 25px; font-weight: bold; cursor: pointer;">
                    Annuler
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Événements
    document.getElementById('save-profile').addEventListener('click', function () {
        const newName = document.getElementById('edit-name').value;
        const newUsername = document.getElementById('edit-username').value;
        const newAvatar = document.getElementById('edit-avatar').value;

        data.user.name = newName;
        data.user.username = newUsername;
        data.user.avatar = newAvatar;

        window.ChessSchoolProgress.saveData(data);
        document.body.removeChild(modal);
        loadProfileData();
    });

    document.getElementById('cancel-profile').addEventListener('click', function () {
        document.body.removeChild(modal);
    });

    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// Ajouter des boutons de gestion des données
function addDataManagementButtons() {
    const container = document.querySelector('.profile-container');
    if (!container) return;

    const section = document.createElement('div');
    section.className = 'profile-section';
    section.innerHTML = `
        <h2 class="section-title">⚙️ Gestion des Données</h2>
        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
            <button class="action-btn" onclick="window.ChessSchoolProgress.exportData()">
                📥 Exporter mes données
            </button>
            <button class="action-btn secondary" onclick="document.getElementById('import-file').click()">
                📤 Importer des données
            </button>
            <button class="action-btn secondary" onclick="window.ChessSchoolProgress.resetAllData()" style="background: #ef4444; color: white;">
                🗑️ Réinitialiser
            </button>
        </div>
        <input type="file" id="import-file" accept=".json" style="display: none;">
    `;

    container.appendChild(section);

    // Gérer l'import
    document.getElementById('import-file').addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (file) {
            window.ChessSchoolProgress.importData(file);
        }
    });
}

// Rafraîchir le profil toutes les 30 secondes
setInterval(() => {
    loadProfileData();
}, 30000);