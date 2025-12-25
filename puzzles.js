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

// Configuration des événements
function setupEventListeners() {
    // Boutons de difficulté
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentDifficulty = this.dataset.difficulty;
            displayPuzzleList();
        });
    });

    // Bouton vérifier
    document.getElementById('submit-move').addEventListener('click', checkMove);

    // Entrée clavier
    document.getElementById('move-input').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') checkMove();
    });

    // Bouton indice
    document.getElementById('hint-btn').addEventListener('click', showHint);

    // Bouton solution
    document.getElementById('solution-btn').addEventListener('click', showSolution);

    // Bouton puzzle suivant
    document.getElementById('next-puzzle-btn').addEventListener('click', nextPuzzle);
}

// Charger les statistiques
function loadPuzzleStats() {
    if (!window.ChessSchoolProgress) return;

    const data = window.ChessSchoolProgress.getProfileData();
    const puzzleStats = data.puzzleStats || {
        totalAttempts: 0,
        totalSolved: 0,
        currentStreak: 0,
        bestStreak: 0,
        solvedPuzzles: []
    };

    document.getElementById('total-solved').textContent = puzzleStats.totalSolved;

    const successRate = puzzleStats.totalAttempts > 0
        ? Math.round((puzzleStats.totalSolved / puzzleStats.totalAttempts) * 100)
        : 0;
    document.getElementById('success-rate').textContent = successRate + '%';

    document.getElementById('current-streak').textContent = puzzleStats.currentStreak;
    document.getElementById('best-streak').textContent = puzzleStats.bestStreak;
}

// Afficher la liste des puzzles
function displayPuzzleList() {
    const grid = document.getElementById('puzzle-grid');
    grid.innerHTML = '';

    const puzzles = puzzlesDatabase[currentDifficulty];
    const data = window.ChessSchoolProgress ? window.ChessSchoolProgress.getProfileData() : null;
    const solvedPuzzles = data?.puzzleStats?.solvedPuzzles || [];

    puzzles.forEach(puzzle => {
        const card = document.createElement('div');
        card.className = 'puzzle-card';

        if (solvedPuzzles.includes(puzzle.id)) {
            card.classList.add('solved');
        }

        card.innerHTML = `
            <div class="puzzle-card-header">
                <span class="puzzle-number">Puzzle #${puzzle.id}</span>
                <span class="puzzle-difficulty-badge ${puzzle.difficulty}">${puzzle.difficulty}</span>
            </div>
            <h4 style="margin: 10px 0; color: #333;">${puzzle.title}</h4>
            <p style="margin: 0; color: #666; font-size: 0.9em;">${puzzle.description}</p>
            ${solvedPuzzles.includes(puzzle.id) ? '<p style="margin-top: 10px; color: #22c55e; font-weight: 600;">✓ Résolu</p>' : ''}
        `;

        card.addEventListener('click', () => loadPuzzle(puzzle));
        grid.appendChild(card);
    });
}

// Charger un puzzle
function loadPuzzle(puzzle) {
    currentPuzzle = puzzle;
    attempts = 0;
    hintsUsed = 0;
    startTime = Date.now();

    document.getElementById('puzzle-list').style.display = 'none';
    document.getElementById('puzzle-view').style.display = 'grid';

    document.getElementById('puzzle-title').textContent = puzzle.title;
    document.getElementById('puzzle-description').textContent = puzzle.description;
    document.getElementById('puzzle-objective').textContent = puzzle.objective;
    document.getElementById('move-input').value = '';
    document.getElementById('feedback').style.display = 'none';

    displayPosition(puzzle.position);
}

// Afficher la position
function displayPosition(fen) {
    const position = document.getElementById('chess-position');
    position.innerHTML = '';

    // Simplification : afficher une position de base
    // Dans une vraie implémentation, vous parseriez le FEN
    const pieces = {
        'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚', 'p': '♟',
        'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔', 'P': '♙'
    };

    // Créer un échiquier simple 8x8
    for (let row = 7; row >= 0; row--) {
        for (let col = 0; col < 8; col++) {
            const square = document.createElement('div');
            square.className = `chess-square ${(row + col) % 2 === 0 ? 'light' : 'dark'}`;
            square.dataset.row = row;
            square.dataset.col = col;

            // Afficher quelques pièces (exemple simple)
            if (row === 0 && col === 4) square.textContent = '♔';
            if (row === 7 && col === 4) square.textContent = '♚';

            position.appendChild(square);
        }
    }
}

// Vérifier le coup
function checkMove() {
    const moveInput = document.getElementById('move-input').value.trim();
    const feedback = document.getElementById('feedback');
    attempts++;

    if (!currentPuzzle) return;

    // Simplification : comparaison directe
    // Dans une vraie implémentation, vous utiliseriez chess.js
    if (moveInput.toLowerCase() === currentPuzzle.solution.toLowerCase()) {
        // ✅ CORRECT
        feedback.className = 'feedback-box success';
        feedback.innerHTML = `
            <strong>🎉 Excellent !</strong><br>
            Vous avez trouvé la solution : ${currentPuzzle.solution}<br>
            Tentatives : ${attempts} | Temps : ${Math.floor((Date.now() - startTime) / 1000)}s
        `;

        // Sauvegarder la progression
        savePuzzleSolved(true);

    } else {
        // ❌ INCORRECT
        feedback.className = 'feedback-box error';
        feedback.innerHTML = `
            <strong>❌ Pas tout à fait...</strong><br>
            Ce n'est pas le bon coup. Essayez encore !<br>
            Tentatives : ${attempts}
        `;
    }
}

// Afficher un indice
function showHint() {
    if (!currentPuzzle) return;

    hintsUsed++;
    const feedback = document.getElementById('feedback');
    feedback.className = 'feedback-box';
    feedback.style.display = 'block';
    feedback.style.background = 'rgba(255, 193, 7, 0.1)';
    feedback.style.borderLeft = '4px solid #ffc107';
    feedback.style.color = '#856404';
    feedback.innerHTML = `
        <strong>💡 Indice :</strong><br>
        ${currentPuzzle.hint}
    `;
}

// Afficher la solution
function showSolution() {
    if (!currentPuzzle) return;

    const feedback = document.getElementById('feedback');
    feedback.className = 'feedback-box';
    feedback.style.display = 'block';
    feedback.style.background = 'rgba(59, 130, 246, 0.1)';
    feedback.style.borderLeft = '4px solid #3b82f6';
    feedback.style.color = '#1e40af';
    feedback.innerHTML = `
        <strong>🔍 Solution :</strong><br>
        ${currentPuzzle.solution}<br>
        <em>${currentPuzzle.description}</em>
    `;

    // Sauvegarder comme non résolu (vue la solution)
    savePuzzleSolved(false);
}

// Puzzle suivant
function nextPuzzle() {
    const puzzles = puzzlesDatabase[currentDifficulty];
    const currentIndex = puzzles.findIndex(p => p.id === currentPuzzle.id);
    const nextIndex = (currentIndex + 1) % puzzles.length;

    loadPuzzle(puzzles[nextIndex]);
}

// Sauvegarder la progression du puzzle
function savePuzzleSolved(solved) {
    if (!window.ChessSchoolProgress) return;

    const timeSpent = Math.floor((Date.now() - startTime) / 1000);

    window.ChessSchoolProgress.savePuzzleResult({
        puzzleId: currentPuzzle.id,
        difficulty: currentPuzzle.difficulty,
        solved: solved,
        attempts: attempts,
        hintsUsed: hintsUsed,
        timeSpent: timeSpent
    });

    loadPuzzleStats();
    displayPuzzleList();
}

// Menu burger
const nav = document.getElementById('main-nav');
const toggle = document.getElementById('nav-toggle');
const sideFrame = document.getElementById('side-frame');
const backdrop = document.getElementById('frame-backdrop');

if (toggle) {
    toggle.addEventListener('click', function () {
        const isOpen = nav.classList.contains('open');
        if (isOpen) {
            nav.classList.remove('open');
            if (sideFrame) sideFrame.classList.remove('open');
            if (backdrop) backdrop.classList.remove('open');
        } else {
            nav.classList.add('open');
            if (sideFrame) sideFrame.classList.add('open');
            if (backdrop) backdrop.classList.add('open');
        }
    });
}

if (backdrop) {
    backdrop.addEventListener('click', function () {
        nav.classList.remove('open');
        sideFrame.classList.remove('open');
        backdrop.classList.remove('open');
    });
}