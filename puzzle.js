// puzzle.js — charge des positions de puzzle et montre la solution
(function () {
    const puzzleSelect = document.getElementById('puzzle-select');
    const loadBtn = document.getElementById('load-puzzle');
    const resetBtn = document.getElementById('reset-puzzle');
    const showSolBtn = document.getElementById('show-solution');
    const descEl = document.getElementById('puzzle-desc');

    // Définir des puzzles (board indexé [row][col], row 0 = rangée 1)
    const puzzles = [
        {
            title: 'Mat en 1 — Tour',
            desc: 'Blancs jouent et mat en 1. Jouez la tour pour mater.',
            turn: 'white',
            // Position simple : roi blanc e1, tour h1, roi noir e8 (colonnes 4,7,4)
            board: (function () {
                const b = Array(8).fill(null).map(() => Array(8).fill(null));
                b[0][4] = { type: 'king', color: 'white' }; // e1
                b[0][7] = { type: 'rook', color: 'white' }; // h1
                b[7][4] = { type: 'king', color: 'black' }; // e8
                return b;
            })(),
            // Solution: tour h1 -> h8
            solution: [{ from: { row: 0, col: 7 }, to: { row: 7, col: 7 } }]
        },
        {
            title: 'Mat en 2 — Dame',
            desc: 'Blancs jouent et forcent le mat en 2 coups.',
            turn: 'white',
            board: (function () {
                const b = Array(8).fill(null).map(() => Array(8).fill(null));
                b[0][4] = { type: 'king', color: 'white' }; // e1
                b[0][3] = { type: 'queen', color: 'white' }; // d1
                b[7][4] = { type: 'king', color: 'black' }; // e8
                b[6][3] = { type: 'pawn', color: 'black' }; // d7 (obstacle)
                return b;
            })(),
            // Solution: Qd1-d6, then Qd6-e7 (two moves)
            solution: [
                { from: { row: 0, col: 3 }, to: { row: 5, col: 3 } },
                { from: { row: 5, col: 3 }, to: { row: 6, col: 4 } }
            ]
        }
    ];

    let currentPuzzle = null;

    function deepCopyBoard(src) {
        return JSON.parse(JSON.stringify(src));
    }

    function loadPuzzle(index) {
        const p = puzzles[index];
        if (!p) return;
        currentPuzzle = p;

        board = deepCopyBoard(p.board);
        currentTurn = p.turn || 'white';
        moveHistory = [];
        gameHistory = [];
        selectedSquare = null;
        enPassantTarget = null;
        isGameOver = false;
        hasMoved = {
            whiteKing: false,
            blackKing: false,
            whiteRookLeft: false,
            whiteRookRight: false,
            blackRookLeft: false,
            blackRookRight: false
        };

        descEl.textContent = p.desc || '';
        clearHighlights();
        updateBoard();
        updateTurnInfo();
        updateMoveHistory();
        statusText.textContent = 'Puzzle chargé. À vous de jouer.';
    }

    function resetPuzzle() {
        if (!currentPuzzle) return;
        loadPuzzle(puzzles.indexOf(currentPuzzle));
    }

    function executeMoveObj(move) {
        const fromR = move.from.row;
        const fromC = move.from.col;
        const toR = move.to.row;
        const toC = move.to.col;
        const piece = board[fromR][fromC];
        if (!piece) return;

        // Sauvegarder l'état pour possibilité d'annulation
        gameHistory.push({ board: JSON.parse(JSON.stringify(board)), hasMoved: { ...hasMoved }, enPassantTarget: enPassantTarget });
        movePiece({ row: fromR, col: fromC }, { row: toR, col: toC }, piece);
        // Changer de tour
        currentTurn = currentTurn === 'white' ? 'black' : 'white';
        updateBoard();
        updateTurnInfo();
        updateMoveHistory();
    }

    function showSolution() {
        if (!currentPuzzle || !currentPuzzle.solution) return;
        const seq = currentPuzzle.solution;
        // Exécuter la séquence avec un petit délai entre les coups
        let i = 0;
        function step() {
            if (i >= seq.length) return;
            executeMoveObj(seq[i]);
            i++;
            setTimeout(step, 600);
        }
        step();
    }

    // Événements
    loadBtn.addEventListener('click', () => {
        const idx = parseInt(puzzleSelect.value, 10);
        loadPuzzle(idx);
    });

    resetBtn.addEventListener('click', () => {
        resetPuzzle();
    });

    showSolBtn.addEventListener('click', () => {
        showSolution();
    });

    // Charger automatiquement le premier puzzle pour faciliter la démo
    window.addEventListener('load', () => {
        loadPuzzle(0);
    });
})();
