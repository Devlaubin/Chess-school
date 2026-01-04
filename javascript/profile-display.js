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

// Mettre à jour les statistiques rapides
function updateQuickStats(data) {
    try {
        const stats = data.stats;

        // ELO estimé
        const eloEl = document.querySelector('.stat-quick:nth-child(1) .stat-quick-value');
        if (eloEl) eloEl.textContent = stats.estimatedElo || 800;

        // Jours actifs
        const daysEl = document.querySelector('.stat-quick:nth-child(2) .stat-quick-value');
        if (daysEl) daysEl.textContent = stats.daysActive || 0;

        // Trophées
        const trophiesEl = document.querySelector('.stat-quick:nth-child(3) .stat-quick-value');
        if (trophiesEl) {
            const unlockedCount = Object.values(data.achievements || {}).filter(a => a === true).length;
            trophiesEl.textContent = unlockedCount || 0;
        }

        console.log('✅ Stats rapides mises à jour');
    } catch (error) {
        console.error('❌ Erreur updateQuickStats:', error);
    }
}

// Mettre à jour les badges
function updateBadges(data) {
    try {
        const badgesContainer = document.querySelector('.badges-container');
        if (!badgesContainer) {
            console.warn('⚠️ .badges-container introuvable');
            return;
        }

        badgesContainer.innerHTML = '';

        const badges = [];

        // Badge jours actifs
        if ((data.stats.daysActive || 0) >= 3) {
            badges.push({ icon: '🎓', text: 'Élève Actif' });
        }

        // Badge pages lues
        if ((data.stats.totalPages || 0) >= 5) {
            badges.push({ icon: '📚', text: `${data.stats.totalPages} Pages` });
        }

        // Badge quiz
        if ((data.stats.quizzesTaken || 0) >= 1) {
            badges.push({ icon: '🏆', text: 'Quiz Master' });
        }

        // Badge streak
        if ((data.stats.streak || 0) >= 3) {
            badges.push({ icon: '🔥', text: `${data.stats.streak} jours` });
        }

        // Badge vidéos
        if ((data.stats.videosWatched || 0) >= 3) {
            badges.push({ icon: '🎥', text: 'Cinéphile' });
        }

        // Badge parties
        if ((data.stats.gamesPlayed || 0) >= 5) {
            badges.push({ icon: '♟️', text: 'Joueur' });
        }

        badges.forEach(badge => {
            const badgeEl = document.createElement('span');
            badgeEl.className = 'badge';
            badgeEl.innerHTML = `${badge.icon} ${badge.text}`;
            badgesContainer.appendChild(badgeEl);
        });

        console.log('✅ Badges mises à jour');
    } catch (error) {
        console.error('❌ Erreur updateBadges:', error);
    }
}

// Mettre à jour les statistiques détaillées
function updateDetailedStats(data) {
    try {
        const stats = data.stats;

        // Pages visitées
        const pagesEl = document.querySelector('.stat-card:nth-child(1) .stat-value');
        if (pagesEl) pagesEl.textContent = stats.totalPages || 0;

        // Temps d'étude
        const timeEl = document.querySelector('.stat-card:nth-child(2) .stat-value');
        if (timeEl) {
            const hours = Math.floor(((stats.studyTime || 0) / 60));
            const minutes = Math.floor(((stats.studyTime || 0) % 60));
            timeEl.textContent = `${hours}h ${minutes}m`;
        }

        // Taux de réussite quiz
        const successEl = document.querySelector('.stat-card:nth-child(3) .stat-value');
        if (successEl) {
            const totalQuestions = stats.quizzesTotalQuestions || 0;
            if (totalQuestions > 0) {
                const percentage = Math.round(((stats.quizzesCorrect || 0) / totalQuestions) * 100);
                successEl.textContent = `${percentage}%`;
            } else {
                successEl.textContent = '0%';
            }
        }

        // Parties jouées
        const gamesEl = document.querySelector('.stat-card:nth-child(4) .stat-value');
        if (gamesEl) gamesEl.textContent = stats.gamesPlayed || 0;

        console.log('✅ Stats détaillées mises à jour');
    } catch (error) {
        console.error('❌ Erreur updateDetailedStats:', error);
    }
}

// Mettre à jour les statistiques des puzzles
function updatePuzzleStats(data) {
    try {
        if (!data.puzzleStats) {
            console.log('⚠️ Pas de stats de puzzles');
            return;
        }

        const ps = data.puzzleStats;

        // Cartes de stats
        const solvedEl = document.getElementById('puzzles-solved');
        if (solvedEl) solvedEl.textContent = ps.totalSolved || 0;

        const rateEl = document.getElementById('puzzles-success-rate');
        if (rateEl) {
            if ((ps.totalAttempts || 0) > 0) {
                const rate = Math.round(((ps.totalSolved || 0) / ps.totalAttempts) * 100);
                rateEl.textContent = rate + '%';
            } else {
                rateEl.textContent = '0%';
            }
        }

        const streakEl = document.getElementById('puzzles-best-streak');
        if (streakEl) streakEl.textContent = ps.bestStreak || 0;

        const timeEl = document.getElementById('puzzles-avg-time');
        if (timeEl) timeEl.textContent = (ps.averageTime || 0) + 's';

        console.log('✅ Stats puzzles mises à jour');
    } catch (error) {
        console.error('❌ Erreur updatePuzzleStats:', error);
    }
}

// Mettre à jour les barres de progression
function updateProgressBars(data) {
    try {
        const progression = data.progression || {};

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

        console.log('✅ Barres de progression mises à jour');
    } catch (error) {
        console.error('❌ Erreur updateProgressBars:', error);
    }
}

// Mettre à jour le parcours d'apprentissage
function updateLearningPath(data) {
    try {
        const path = data.learningPath || {};
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
            const isComplete = path[key] || false;
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

        console.log('✅ Parcours d\'apprentissage mis à jour');
    } catch (error) {
        console.error('❌ Erreur updateLearningPath:', error);
    }
}

// Mettre à jour les achievements
function updateAchievements(data) {
    try {
        const achievements = data.achievements || {};
        const achievementCards = document.querySelectorAll('.achievement-card');

        const achievementKeys = [
            'firstVisit', 'reader10', 'quizMaster', 'speedRunner', 'onFire',
            'tactician', 'puzzleSolver', 'puzzleMaster', 'perfectPuzzle',
            'speedPuzzler', 'grandmaster', 'perfectionist'
        ];

        const achievementData = [
            { name: 'Premier Pas', desc: '1 page visitée' },
            { name: 'Lecteur Assidu', desc: '10 pages lues' },
            { name: 'Quiz Master', desc: '3 quiz parfaits' },
            { name: 'Rapide', desc: 'Quiz en < 2min' },
            { name: 'En Feu', desc: '3 jours consécutifs' },
            { name: 'Tacticien', desc: '10 parties jouées' },
            { name: 'Puzzle Solver', desc: '10 puzzles résolus' },
            { name: 'Puzzle Master', desc: '50 puzzles résolus' },
            { name: 'Puzzle Parfait', desc: '5 puzzles sans indice' },
            { name: 'Éclair', desc: '10 puzzles < 30s' },
            { name: 'Grand Maître', desc: 'Tout compléter' },
            { name: 'Perfectionniste', desc: '100% partout' }
        ];

        achievementCards.forEach((card, index) => {
            const key = achievementKeys[index];
            const isUnlocked = achievements[key] || false;

            // Mettre à jour le texte
            const nameEl = card.querySelector('.achievement-name');
            const descEl = card.querySelector('.achievement-desc');
            if (nameEl && achievementData[index]) nameEl.textContent = achievementData[index].name;
            if (descEl && achievementData[index]) descEl.textContent = achievementData[index].desc;

            if (isUnlocked) {
                card.classList.remove('locked');
            } else {
                card.classList.add('locked');
            }
        });

        console.log('✅ Achievements mises à jour');
    } catch (error) {
        console.error('❌ Erreur updateAchievements:', error);
    }
}

// Mettre à jour l'activité récente
function updateRecentActivity(data) {
    try {
        const activityList = document.querySelector('.recent-activity');
        if (!activityList) {
            console.warn('⚠️ .recent-activity introuvable');
            return;
        }

        activityList.innerHTML = '';

        const activities = (data.recentActivity || []).slice(0, 5);

        if (activities.length === 0) {
            activityList.innerHTML = '<li class="activity-item"><span class="activity-icon">📭</span><div class="activity-content"><p class="activity-text">Aucune activité récente</p></div></li>';
            return;
        }

        activities.forEach(activity => {
            const li = document.createElement('li');
            li.className = 'activity-item';

            const timeAgo = getTimeAgo(activity.date);

            li.innerHTML = `
                <span class="activity-icon">${activity.icon || '📌'}</span>
                <div class="activity-content">
                    <p class="activity-text">${activity.text}</p>
                    <span class="activity-time">${timeAgo}</span>
                </div>
            `;

            activityList.appendChild(li);
        });

        console.log('✅ Activité récente mise à jour');
    } catch (error) {
        console.error('❌ Erreur updateRecentActivity:', error);
    }
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
    console.log('🔧 Configuration des actions du profil...');

    // Bouton modifier profil
    const editBtn = document.querySelector('.edit-profile-btn');
    if (editBtn) {
        editBtn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('✏️ Ouverture du modal de modification');
            showEditModal();
        });
        console.log('✅ Bouton modifier profil configuré');
    } else {
        console.warn('⚠️ Bouton .edit-profile-btn introuvable');
    }
}

// Afficher le modal de modification
function showEditModal() {
    const data = window.ChessSchoolProgress.getProfileData();

    // Supprimer l'ancien modal s'il existe
    const oldModal = document.getElementById('edit-profile-modal');
    if (oldModal) oldModal.remove();

    const modal = document.createElement('div');
    modal.id = 'edit-profile-modal';
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
        animation: fadeIn 0.3s ease;
    `;

    const style = document.createElement('style');
    style.id = 'modal-style';
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;
    document.head.appendChild(style);

    modal.innerHTML = `
        <div style="background: white; padding: 40px; border-radius: 20px; max-width: 500px; width: 90%; box-shadow: 0 20px 60px rgba(0,0,0,0.3);font-family: Arial, sans-serif;">
            <h2 style="margin-top: 0; color: #333;">✏️ Modifier le profil</h2>
            
            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #333;">Nom</label>
                <input type="text" id="edit-name" value="${data.user.name || ''}" 
                    style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 8px; font-size: 1em; box-sizing: border-box;">
            </div>
            
            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #333;">Nom d'utilisateur</label>
                <input type="text" id="edit-username" value="${data.user.username || ''}" 
                    style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 8px; font-size: 1em; box-sizing: border-box;">
            </div>
            
            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #333;">Avatar (emoji)</label>
                <input type="text" id="edit-avatar" value="${data.user.avatar || '♔'}" maxlength="2"
                    style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 8px; font-size: 1em; box-sizing: border-box;">
                <small style="color: #666;">Suggestions: ♔ ♕ ♖ ♗ ♘ ♙ 👤 🎯 ⚡ 🏆</small>
            </div>
            
            <div style="display: flex; gap: 12px; margin-top: 30px;">
                <button id="save-profile" style="flex: 1; padding: 14px; background: linear-gradient(135deg, #599bb3, #408c99); color: white; border: none; border-radius: 25px; font-weight: bold; cursor: pointer; font-size: 1em;">
                    Enregistrer
                </button>
                <button id="cancel-profile" style="flex: 1; padding: 14px; background: #ddd; color: #333; border: none; border-radius: 25px; font-weight: bold; cursor: pointer; font-size: 1em;">
                    Annuler
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Événements
    document.getElementById('save-profile').addEventListener('click', function () {
        const newName = document.getElementById('edit-name').value.trim();
        const newUsername = document.getElementById('edit-username').value.trim();
        const newAvatar = document.getElementById('edit-avatar').value.trim();

        if (!newName || !newUsername) {
            alert('Le nom et le nom d\'utilisateur ne peuvent pas être vides !');
            return;
        }

        data.user.name = newName;
        data.user.username = newUsername;
        data.user.avatar = newAvatar || '♔';

        window.ChessSchoolProgress.saveData(data);
        modal.remove();
        loadProfileData();

        // Notification de succès
        const notif = document.createElement('div');
        notif.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #22c55e;
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10001;
            font-weight: 600;
        `;
        notif.textContent = '✅ Profil mis à jour !';
        document.body.appendChild(notif);
        setTimeout(() => notif.remove(), 3000);
    });

    document.getElementById('cancel-profile').addEventListener('click', function () {
        modal.remove();
    });

    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            modal.remove();
        }
    });

    // Focus sur le premier champ
    setTimeout(() => {
        document.getElementById('edit-name').focus();
    }, 100);
}

// Rafraîchir le profil toutes les 30 secondes
setInterval(() => {
    loadProfileData();
}, 30000);

console.log('✅ Profile Display Script chargé');