document.addEventListener('DOMContentLoaded', () => {
    // Liste de puzzles (titre, FEN, couleur à jouer, description, hint)
    const puzzles = [
        { name: 'PUZZLE 1', fen: 'r1bqkbnr/ppp2ppp/2np4/4p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR w - - 0 1', turn: 'white', desc: 'Mat du Berger', hint: 'Commencez par attaquer le roi avec la dame.' },
        { name: 'PUZZLE 2', fen: '6k1/1R6/R7/8/8/8/8/8 w - - 0 1', turn: 'white', desc: 'Mat du Couloir', hint: 'La tour en b7 couvre des cases clés.' },
        { name: 'PUZZLE 3', fen: '5k2/8/5K2/8/2Q5/8/8/8 w - - 0 1', turn: 'white', desc: 'Mat du Baiser de la Mort', hint: 'La dame peut donner mat en f8' },
        { name: 'PUZZLE 4', fen: '6rk/1ppq4/1p3pQp/4p3/8/1P4RP/r1P3PK/8 w - - 0 1', turn: 'white', desc: 'Attaque Décisive', hint: 'Utilisez votre dame et votre tour pour chercher le mat.' },
        { name: 'PUZZLE 5', fen: '6k1/5ppp/8/2R5/8/8/5PPP/6K1 w - - 0 1', turn: 'white', desc: 'Mat du couloir', hint: 'Utilisez votre tour pour chercher le mat.' },
        { name: 'PUZZLE 6', fen: '2r5/1p3p1p/p3p3/1N2kp2/2P5/1P1K2P1/P2B3P/8 w - - 0 1', turn: 'white', desc: 'Fin de Partie Simple', hint: 'Utiliser votre fou.' }
    ];

    const listEl = document.getElementById('puzzle-list');
    const instr = document.getElementById('puzzle-instructions');
    const hintEl = document.getElementById('puzzle-hint');
    const hintBtn = document.getElementById('hint-btn');
    const nextBtn = document.getElementById('next-btn');
    let currentPuzzleIndex = 0;

    function renderPuzzleCards() {
        if (!listEl) return;
        listEl.innerHTML = '';
        puzzles.forEach((p, i) => {
            const card = document.createElement('div');
            card.className = 'puzzle-card';
            card.innerHTML = `
                        <div>
                            <h4>${p.name}</h4>
                            <p>${p.desc}</p>
                        </div>
                        <div class="puzzle-actions">
                            <button class="puzzle-btn" data-idx="${i}">Charger</button>
                            <button class="puzzle-btn secondary" data-idx="${i}">FEN</button>
                        </div>
                    `;

            card.querySelectorAll('.puzzle-btn').forEach(btn => {
                btn.addEventListener('click', (ev) => {
                    const idx = parseInt(ev.currentTarget.dataset.idx, 10);
                    const sel = puzzles[idx];
                    if (ev.currentTarget.classList.contains('secondary')) {
                        alert(`FEN: ${sel.fen}`);
                        return;
                    }
                    console.log('Puzzle card click', idx, sel.fen, 'loadPuzzle=', !!window.loadPuzzle, 'chessboardReady=', !!window.chessboardReady);
                    currentPuzzleIndex = idx;
                    if (hintEl) hintEl.textContent = '';
                    // If chessboard not ready yet, wait for event
                    function doLoad() {
                        if (window.loadPuzzle) window.loadPuzzle(sel.fen, sel.turn);
                        if (instr) instr.textContent = `${sel.name} — ${sel.turn === 'white' ? 'Blancs' : 'Noirs'} jouent`;
                    }
                    if (window.chessboardReady) doLoad();
                    else document.addEventListener('chessboardReady', doLoad, { once: true });
                });
            });

            listEl.appendChild(card);
        });
    }

    console.log('Puzzle selector script initialized');
    renderPuzzleCards();

    // Charger le puzzle initial une fois que l'échiquier est prêt
    function loadInitial() {
        if (window.loadPuzzle && puzzles.length > 0) {
            window.loadPuzzle(puzzles[0].fen, puzzles[0].turn);
            if (instr) instr.textContent = `${puzzles[0].name} — ${puzzles[0].turn === 'white' ? 'Blancs' : 'Noirs'} jouent`;
        }
    }

    if (window.chessboardReady) {
        loadInitial();
    } else {
        document.addEventListener('chessboardReady', loadInitial, { once: true });
    }

    // Hint button
    if (hintBtn) {
        hintBtn.addEventListener('click', () => {
            console.log('Hint button clicked, currentPuzzleIndex=', currentPuzzleIndex);
            const p = puzzles[currentPuzzleIndex] || puzzles[0];
            if (hintEl) {
                hintEl.textContent = p.hint || 'Aucun indice disponible.';
                hintBtn.textContent = 'Indice (affiché)';
                setTimeout(() => { hintBtn.textContent = 'Indice'; }, 3000);
            }
        });
    }
});
let puzzleStartTime = 0;
let puzzleAttempts = 0;
let puzzleHintsUsed = 0;
let currentPuzzleSolved = false;
let currentPuzzleId = 0;

// Démarrer le chrono quand on charge un puzzle
const originalLoadPuzzle = window.loadPuzzle;
window.loadPuzzle = function (fen, turn) {
    if (originalLoadPuzzle) {
        originalLoadPuzzle(fen, turn);
    }

    // Réinitialiser les compteurs
    puzzleStartTime = Date.now();
    puzzleAttempts = 0;
    puzzleHintsUsed = 0;
    currentPuzzleSolved = false;

    console.log('✅ Puzzle chargé, chrono démarré');
};

// Compter les tentatives quand on joue un coup
setTimeout(() => {
    const moveHistory = document.getElementById('move-history');
    if (moveHistory) {
        const moveObserver = new MutationObserver(function (mutations) {
            let hasNewMove = false;
            mutations.forEach(function (mutation) {
                if (mutation.addedNodes.length > 0) {
                    hasNewMove = true;
                }
            });

            if (hasNewMove) {
                puzzleAttempts++;
                console.log('🎯 Tentative #' + puzzleAttempts);
            }
        });

        moveObserver.observe(moveHistory, {
            childList: true,
            subtree: true
        });
    }
}, 1500);

// Modifier le bouton Indice pour compter
setTimeout(() => {
    const hintButton = document.getElementById('hint-btn');
    if (hintButton) {
        hintButton.addEventListener('click', function () {
            puzzleHintsUsed++;
            console.log('💡 Indices utilisés: ' + puzzleHintsUsed);
        }, { capture: true });
    }
}, 1500);

// Détecter si le puzzle est résolu (mat)
setTimeout(() => {
    const statusEl = document.getElementById('status-text');
    if (statusEl) {
        const statusObserver = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                const text = statusEl.textContent.toLowerCase();
                const isMate = text.includes('échec et mat') || text.includes('mat');

                if (isMate && !currentPuzzleSolved && puzzleAttempts > 0) {
                    currentPuzzleSolved = true;
                    console.log('🎉 Mat détecté !');
                    savePuzzleCompletion(true);
                }
            });
        });

        statusObserver.observe(statusEl, {
            childList: true,
            characterData: true,
            subtree: true
        });
    }
}, 1500);

function savePuzzleCompletion(solved) {
    if (!window.ChessSchoolProgress) {
        console.warn('⚠️ ChessSchoolProgress non disponible');
        return;
    }

    const timeSpent = Math.floor((Date.now() - puzzleStartTime) / 1000);

    // Déterminer la difficulté basée sur l'index du puzzle
    let difficulty = 'moyen';
    if (currentPuzzleId <= 2) difficulty = 'facile';
    else if (currentPuzzleId >= 5) difficulty = 'difficile';

    const puzzleData = {
        puzzleId: currentPuzzleId + 1,
        puzzleName: `Puzzle #${currentPuzzleId + 1}`,
        difficulty: difficulty,
        solved: solved,
        attempts: puzzleAttempts,
        hintsUsed: puzzleHintsUsed,
        timeSpent: timeSpent
    };

    console.log('💾 Sauvegarde puzzle:', puzzleData);

    window.ChessSchoolProgress.savePuzzleResult(puzzleData);

    if (solved) {
        showNotification('🎉 Puzzle #' + (currentPuzzleId + 1) + ' résolu en ' + timeSpent + 's !');
    }
}

function showNotification(message) {
    const oldNotif = document.getElementById('puzzle-notification');
    if (oldNotif) oldNotif.remove();

    const notification = document.createElement('div');
    notification.id = 'puzzle-notification';
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: linear-gradient(135deg, #22c55e, #16a34a);
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        font-weight: 600;
        max-width: 300px;
    `;
    notification.textContent = message;

    if (!document.getElementById('puzzle-notif-styles')) {
        const style = document.createElement('style');
        style.id = 'puzzle-notif-styles';
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(400px); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }

    notification.style.animation = 'slideInRight 0.3s ease';
    document.body.appendChild(notification);

    setTimeout(function () {
        notification.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(function () {
            if (notification.parentNode) notification.remove();
        }, 300);
    }, 4000);
}

// Mettre à jour le puzzle ID quand on change de puzzle
setTimeout(() => {
    const nextBtn = document.getElementById('next-btn');
    if (nextBtn) {
        nextBtn.addEventListener('click', function () {
            if (!currentPuzzleSolved && puzzleAttempts > 0) {
                console.log('⏭️ Passage au suivant sans résoudre');
                savePuzzleCompletion(false);
            }
            // Incrémenter l'index du puzzle
            currentPuzzleId = (currentPuzzleId + 1) % 6; // 6 puzzles au total
        }, { capture: true });
    }
}, 1500);

// Intercepter les clics sur les cartes de puzzles pour mettre à jour l'ID
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const puzzleCards = document.querySelectorAll('.puzzle-card');
        puzzleCards.forEach((card, index) => {
            const btn = card.querySelector('.puzzle-btn:not(.secondary)');
            if (btn) {
                btn.addEventListener('click', () => {
                    currentPuzzleId = index;
                    puzzleAttempts = 0;
                    puzzleHintsUsed = 0;
                    currentPuzzleSolved = false;
                    console.log('📍 Puzzle sélectionné: #' + (currentPuzzleId + 1));
                });
            }
        });
    }, 500);
});

console.log('✅ Système de sauvegarde des puzzles activé');
