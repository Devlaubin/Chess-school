// Variables globales
let board = [];
let selectedSquare = null;
let currentTurn = 'white'; // 'white' ou 'black'
let moveHistory = [];
let gameHistory = []; // Pour annuler les coups
let hasMoved = {
    whiteKing: false,
    blackKing: false,
    whiteRookLeft: false,
    whiteRookRight: false,
    blackRookLeft: false,
    blackRookRight: false
};
let enPassantTarget = null; // Case disponible pour prise en passant
let isGameOver = false;

// Pièces et leurs symboles
const pieces = {
    king: { white: '♔', black: '♚', name: 'Roi' },
    queen: { white: '♕', black: '♛', name: 'Dame' },
    rook: { white: '♖', black: '♜', name: 'Tour' },
    bishop: { white: '♗', black: '♝', name: 'Fou' },
    knight: { white: '♘', black: '♞', name: 'Cavalier' },
    pawn: { white: '♙', black: '♟', name: 'Pion' }
};

// URLs des images des pièces (Wikimedia Commons - images libres)
const pieceImages = {
    king: {
        white: 'https://upload.wikimedia.org/wikipedia/commons/4/42/Chess_klt45.svg',
        black: 'https://upload.wikimedia.org/wikipedia/commons/f/f0/Chess_kdt45.svg'
    },
    queen: {
        white: 'https://upload.wikimedia.org/wikipedia/commons/1/15/Chess_qlt45.svg',
        black: 'https://upload.wikimedia.org/wikipedia/commons/4/47/Chess_qdt45.svg'
    },
    rook: {
        white: 'https://upload.wikimedia.org/wikipedia/commons/7/72/Chess_rlt45.svg',
        black: 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Chess_rdt45.svg'
    },
    bishop: {
        white: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Chess_blt45.svg',
        black: 'https://upload.wikimedia.org/wikipedia/commons/9/98/Chess_bdt45.svg'
    },
    knight: {
        white: 'https://upload.wikimedia.org/wikipedia/commons/7/70/Chess_nlt45.svg',
        black: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Chess_ndt45.svg'
    },
    pawn: {
        white: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Chess_plt45.svg',
        black: 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Chess_pdt45.svg'
    }
};

// Descriptions des pièces
const pieceDescriptions = {
    king: 'Le Roi se déplace d\'une case dans toutes les directions (horizontal, vertical, diagonal).',
    queen: 'La Dame se déplace dans toutes les directions sur autant de cases que souhaité.',
    rook: 'La Tour se déplace horizontalement ou verticalement sur autant de cases que souhaité.',
    bishop: 'Le Fou se déplace en diagonale sur autant de cases que souhaité.',
    knight: 'Le Cavalier se déplace en forme de "L" (2 cases + 1 case perpendiculaire) et peut sauter par-dessus les autres pièces.',
    pawn: 'Le Pion avance d\'une case vers l\'avant (ou deux cases lors de son premier mouvement). Il capture en diagonale.'
};

// Éléments DOM (initialisés après le chargement du DOM)
let chessboard = null;
let turnInfo = null;
let statusText = null;
let moveHistoryEl = null;
let newGameBtn = null;
let undoBtn = null;

// Créer l'échiquier
function createBoard() {
    console.log('createBoard called, chessboard element:', chessboard);
    if (!chessboard) return;
    chessboard.innerHTML = '';
    for (let row = 7; row >= 0; row--) {
        for (let col = 0; col < 8; col++) {
            const square = document.createElement('div');
            square.className = `square ${(row + col) % 2 === 0 ? 'white' : 'black'}`;
            square.dataset.row = row;
            square.dataset.col = col;
            square.addEventListener('click', () => handleSquareClick(row, col));
            chessboard.appendChild(square);
        }
    }
}

// Initialiser la position de départ
function initStartPosition() {
    board = Array(8).fill(null).map(() => Array(8).fill(null));

    // Pièces noires (rangée 7)
    board[7] = [
        { type: 'rook', color: 'black' },
        { type: 'knight', color: 'black' },
        { type: 'bishop', color: 'black' },
        { type: 'queen', color: 'black' },
        { type: 'king', color: 'black' },
        { type: 'bishop', color: 'black' },
        { type: 'knight', color: 'black' },
        { type: 'rook', color: 'black' }
    ];

    // Pions noirs (rangée 6)
    for (let i = 0; i < 8; i++) {
        board[6][i] = { type: 'pawn', color: 'black' };
    }

    // Pions blancs (rangée 1)
    for (let i = 0; i < 8; i++) {
        board[1][i] = { type: 'pawn', color: 'white' };
    }

    // Pièces blanches (rangée 0)
    board[0] = [
        { type: 'rook', color: 'white' },
        { type: 'knight', color: 'white' },
        { type: 'bishop', color: 'white' },
        { type: 'queen', color: 'white' },
        { type: 'king', color: 'white' },
        { type: 'bishop', color: 'white' },
        { type: 'knight', color: 'white' },
        { type: 'rook', color: 'white' }
    ];

    currentTurn = 'white';
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
    updateBoard();
    updateTurnInfo();
    updateMoveHistory();
    statusText.textContent = 'Partie en cours';
}

// Clic sur une case
function handleSquareClick(row, col) {
    console.log('square click', row, col, 'currentTurn=', currentTurn, 'isGameOver=', isGameOver);
    if (isGameOver) {
        alert('La partie est terminée ! Cliquez sur "Nouvelle partie" pour recommencer.');
        return;
    }

    const clickedPiece = board[row][col];

    // Si aucune pièce n'est sélectionnée
    if (!selectedSquare) {
        // Vérifier si on clique sur une pièce de la bonne couleur
        if (clickedPiece && clickedPiece.color === currentTurn) {
            selectedSquare = { row, col };
            clearHighlights();
            showPossibleMoves(clickedPiece.type, row, col, clickedPiece.color);
            updateBoard();
        }
    } else {
        // Une pièce est déjà sélectionnée
        const selectedPiece = board[selectedSquare.row][selectedSquare.col];

        // Si on clique sur une de ses propres pièces, changer la sélection
        if (clickedPiece && clickedPiece.color === currentTurn) {
            selectedSquare = { row, col };
            clearHighlights();
            showPossibleMoves(clickedPiece.type, row, col, clickedPiece.color);
            updateBoard();
        } else {
            // Essayer de déplacer la pièce
            // IMPORTANT: Utiliser getLegalMoves, pas getPossibleMoves !
            // getLegalMoves vérifie que le coup ne laisse pas le roi en échec
            const legalMoves = getLegalMoves(
                selectedPiece.type,
                selectedSquare.row,
                selectedSquare.col,
                selectedPiece.color
            );

            const isValidMove = legalMoves.some(([r, c]) => r === row && c === col);

            if (isValidMove) {
                // Sauvegarder l'état pour annulation
                gameHistory.push({
                    board: JSON.parse(JSON.stringify(board)),
                    hasMoved: { ...hasMoved },
                    enPassantTarget: enPassantTarget
                });

                // Effectuer le déplacement
                movePiece(selectedSquare, { row, col }, selectedPiece);

                // Vérifier échec et mat
                checkGameStatus();

                // Changer de tour
                currentTurn = currentTurn === 'white' ? 'black' : 'white';
                selectedSquare = null;
                clearHighlights();
                updateBoard();
                updateTurnInfo();
            } else {
                // Coup invalide, désélectionner et alerter l'utilisateur
                selectedSquare = null;
                clearHighlights();
                updateBoard();
                // Optionnel : afficher un message
                // alert('Coup illégal ! Ce coup laisserait votre roi en échec.');
            }
        }
    }
}

// Effacer les highlights
function clearHighlights() {
    document.querySelectorAll('.square').forEach(sq => {
        sq.classList.remove('highlight', 'possible-move', 'selected');
    });
}

// Mettre à jour l'affichage de l'échiquier
function updateBoard() {
    document.querySelectorAll('.square').forEach(square => {
        const row = parseInt(square.dataset.row);
        const col = parseInt(square.dataset.col);
        const piece = board[row][col];

        square.innerHTML = ''; // Vider la case

        if (piece) {
            const img = document.createElement('img');
            img.src = pieceImages[piece.type][piece.color];
            img.className = 'piece-image';
            img.alt = pieces[piece.type].name;
            square.appendChild(img);

            if (selectedSquare && selectedSquare.row === row && selectedSquare.col === col) {
                square.classList.add('selected');
            }
        }
    });
}

// Déplacer une pièce
function movePiece(from, to, piece) {
    const capturedPiece = board[to.row][to.col];

    // Roque
    if (piece.type === 'king' && Math.abs(to.col - from.col) === 2) {
        // Petit roque
        if (to.col === 6) {
            board[to.row][5] = board[to.row][7];
            board[to.row][7] = null;
        }
        // Grand roque
        else if (to.col === 2) {
            board[to.row][3] = board[to.row][0];
            board[to.row][0] = null;
        }
    }

    // Prise en passant
    if (piece.type === 'pawn' && enPassantTarget &&
        to.row === enPassantTarget.row && to.col === enPassantTarget.col) {
        const captureRow = piece.color === 'white' ? to.row - 1 : to.row + 1;
        board[captureRow][to.col] = null;
    }

    // Déplacer la pièce
    board[to.row][to.col] = piece;
    board[from.row][from.col] = null;
    currentGameMoves++;

    // Mise à jour des flags de mouvement
    if (piece.type === 'king') {
        if (piece.color === 'white') hasMoved.whiteKing = true;
        else hasMoved.blackKing = true;
    }
    if (piece.type === 'rook') {
        if (piece.color === 'white') {
            if (from.col === 0) hasMoved.whiteRookLeft = true;
            if (from.col === 7) hasMoved.whiteRookRight = true;
        } else {
            if (from.col === 0) hasMoved.blackRookLeft = true;
            if (from.col === 7) hasMoved.blackRookRight = true;
        }
    }

    // Gérer la prise en passant future
    enPassantTarget = null;
    if (piece.type === 'pawn' && Math.abs(to.row - from.row) === 2) {
        enPassantTarget = {
            row: piece.color === 'white' ? from.row + 1 : from.row - 1,
            col: from.col
        };
    }

    // Promotion du pion
    if (piece.type === 'pawn' && (to.row === 7 || to.row === 0)) {
        promotePawn(to.row, to.col, piece.color);
    }

    // Ajouter à l'historique
    addMoveToHistory(from, to, piece, capturedPiece);
}

// Promotion du pion
function promotePawn(row, col, color) {
    const choice = prompt('Promotion du pion ! Choisissez :\n1 = Dame\n2 = Tour\n3 = Fou\n4 = Cavalier', '1');
    let pieceType = 'queen';

    switch (choice) {
        case '2': pieceType = 'rook'; break;
        case '3': pieceType = 'bishop'; break;
        case '4': pieceType = 'knight'; break;
        default: pieceType = 'queen';
    }

    board[row][col] = { type: pieceType, color: color };
}

// Afficher les mouvements possibles
function showPossibleMoves(pieceType, row, col, color) {
    const moves = getLegalMoves(pieceType, row, col, color);

    moves.forEach(([r, c]) => {
        const square = document.querySelector(`.square[data-row="${r}"][data-col="${c}"]`);
        if (square) {
            square.classList.add('possible-move');
        }
    });
}

// Obtenir les mouvements légaux (qui ne laissent pas le roi en échec)
function getLegalMoves(pieceType, row, col, color) {
    const possibleMoves = getPossibleMoves(pieceType, row, col, color);
    const legalMoves = [];

    // Filtrer les coups qui laisseraient le roi en échec
    for (const [targetRow, targetCol] of possibleMoves) {
        // Simuler le coup
        const tempPiece = board[targetRow][targetCol];
        const tempHasMoved = JSON.parse(JSON.stringify(hasMoved));

        board[targetRow][targetCol] = { type: pieceType, color: color };
        board[row][col] = null;

        // Mettre à jour les flags de mouvement temporairement
        if (pieceType === 'king') {
            if (color === 'white') hasMoved.whiteKing = true;
            else hasMoved.blackKing = true;
        }
        if (pieceType === 'rook') {
            if (color === 'white') {
                if (col === 0) hasMoved.whiteRookLeft = true;
                if (col === 7) hasMoved.whiteRookRight = true;
            } else {
                if (col === 0) hasMoved.blackRookLeft = true;
                if (col === 7) hasMoved.blackRookRight = true;
            }
        }

        // Vérifier si le roi est en échec après le coup
        const inCheck = isInCheck(color);

        // Restaurer l'état
        board[row][col] = { type: pieceType, color: color };
        board[targetRow][targetCol] = tempPiece;
        hasMoved = tempHasMoved;

        // Si le coup ne met pas le roi en échec, c'est un coup légal
        if (!inCheck) {
            legalMoves.push([targetRow, targetCol]);
        }
    }

    return legalMoves;
}

// Calculer les mouvements possibles
function getPossibleMoves(pieceType, row, col, color) {
    const moves = [];
    const direction = color === 'white' ? 1 : -1;

    switch (pieceType) {
        case 'king':
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    if (dr === 0 && dc === 0) continue;
                    const newRow = row + dr;
                    const newCol = col + dc;
                    if (isValidSquare(newRow, newCol)) {
                        const targetPiece = board[newRow][newCol];
                        if (!targetPiece || targetPiece.color !== color) {
                            moves.push([newRow, newCol]);
                        }
                    }
                }
            }

            // Roque
            if (color === 'white' && !hasMoved.whiteKing) {
                // Petit roque
                if (!hasMoved.whiteRookRight && !board[0][5] && !board[0][6]) {
                    if (!isSquareAttacked(0, 4, 'black') &&
                        !isSquareAttacked(0, 5, 'black') &&
                        !isSquareAttacked(0, 6, 'black')) {
                        moves.push([0, 6]);
                    }
                }
                // Grand roque
                if (!hasMoved.whiteRookLeft && !board[0][1] && !board[0][2] && !board[0][3]) {
                    if (!isSquareAttacked(0, 4, 'black') &&
                        !isSquareAttacked(0, 3, 'black') &&
                        !isSquareAttacked(0, 2, 'black')) {
                        moves.push([0, 2]);
                    }
                }
            }
            if (color === 'black' && !hasMoved.blackKing) {
                // Petit roque
                if (!hasMoved.blackRookRight && !board[7][5] && !board[7][6]) {
                    if (!isSquareAttacked(7, 4, 'white') &&
                        !isSquareAttacked(7, 5, 'white') &&
                        !isSquareAttacked(7, 6, 'white')) {
                        moves.push([7, 6]);
                    }
                }
                // Grand roque
                if (!hasMoved.blackRookLeft && !board[7][1] && !board[7][2] && !board[7][3]) {
                    if (!isSquareAttacked(7, 4, 'white') &&
                        !isSquareAttacked(7, 3, 'white') &&
                        !isSquareAttacked(7, 2, 'white')) {
                        moves.push([7, 2]);
                    }
                }
            }
            break;

        case 'queen':
            // Combinaison de tour et fou
            addLinearMoves(moves, row, col, [
                [1, 0], [-1, 0], [0, 1], [0, -1],  // Tour
                [1, 1], [1, -1], [-1, 1], [-1, -1]  // Fou
            ], color);
            break;

        case 'rook':
            addLinearMoves(moves, row, col, [
                [1, 0], [-1, 0], [0, 1], [0, -1]
            ], color);
            break;

        case 'bishop':
            addLinearMoves(moves, row, col, [
                [1, 1], [1, -1], [-1, 1], [-1, -1]
            ], color);
            break;

        case 'knight':
            const knightMoves = [
                [2, 1], [2, -1], [-2, 1], [-2, -1],
                [1, 2], [1, -2], [-1, 2], [-1, -2]
            ];
            knightMoves.forEach(([dr, dc]) => {
                const newRow = row + dr;
                const newCol = col + dc;
                if (isValidSquare(newRow, newCol)) {
                    const targetPiece = board[newRow][newCol];
                    if (!targetPiece || targetPiece.color !== color) {
                        moves.push([newRow, newCol]);
                    }
                }
            });
            break;

        case 'pawn':
            // Avancer d'une case
            const forwardRow = row + direction;
            if (isValidSquare(forwardRow, col) && !board[forwardRow][col]) {
                moves.push([forwardRow, col]);

                // Avancer de deux cases depuis la position de départ
                const startRow = color === 'white' ? 1 : 6;
                const doubleRow = row + (direction * 2);
                if (row === startRow && !board[doubleRow][col]) {
                    moves.push([doubleRow, col]);
                }
            }

            // Captures en diagonale
            const captureLeft = [forwardRow, col - 1];
            const captureRight = [forwardRow, col + 1];

            if (isValidSquare(captureLeft[0], captureLeft[1])) {
                const target = board[captureLeft[0]][captureLeft[1]];
                if (target && target.color !== color) {
                    moves.push(captureLeft);
                }
                // Prise en passant
                if (enPassantTarget &&
                    captureLeft[0] === enPassantTarget.row &&
                    captureLeft[1] === enPassantTarget.col) {
                    moves.push(captureLeft);
                }
            }

            if (isValidSquare(captureRight[0], captureRight[1])) {
                const target = board[captureRight[0]][captureRight[1]];
                if (target && target.color !== color) {
                    moves.push(captureRight);
                }
                // Prise en passant
                if (enPassantTarget &&
                    captureRight[0] === enPassantTarget.row &&
                    captureRight[1] === enPassantTarget.col) {
                    moves.push(captureRight);
                }
            }
            break;
    }

    return moves;
}

// Vérifier si une case est attaquée (sans considérer le roque)
function isSquareAttacked(row, col, byColor) {
    // Vérifier si la case (row, col) est attaquée par une pièce de couleur byColor
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const piece = board[r][c];
            if (piece && piece.color === byColor) {
                // Utiliser getAttackMoves (non-récursif) pour éviter récursion infinie
                const moves = getAttackMoves(piece.type, r, c, byColor);
                // Filtrer les mouvements de roque (roi se déplaçant de 2 colonnes)
                const legalAttackMoves = moves.filter(([mr, mc]) => {
                    if (piece.type === 'king' && Math.abs(mc - c) === 2) {
                        return false; // Exclure les roques
                    }
                    return true;
                });
                if (legalAttackMoves.some(([mr, mc]) => mr === row && mc === col)) {
                    return true;
                }
            }
        }
    }
    return false;
}

// Obtenir les cases attaquées par une pièce sans utiliser isSquareAttacked (évite récursion)
function getAttackMoves(pieceType, row, col, color) {
    const moves = [];
    switch (pieceType) {
        case 'king':
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    if (dr === 0 && dc === 0) continue;
                    const newRow = row + dr;
                    const newCol = col + dc;
                    if (isValidSquare(newRow, newCol)) moves.push([newRow, newCol]);
                }
            }
            break;
        case 'queen':
            addLinearMoves(moves, row, col, [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]], color);
            break;
        case 'rook':
            addLinearMoves(moves, row, col, [[1,0],[-1,0],[0,1],[0,-1]], color);
            break;
        case 'bishop':
            addLinearMoves(moves, row, col, [[1,1],[1,-1],[-1,1],[-1,-1]], color);
            break;
        case 'knight':
            [[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]].forEach(([dr, dc]) => {
                const newRow = row + dr;
                const newCol = col + dc;
                if (isValidSquare(newRow, newCol)) moves.push([newRow, newCol]);
            });
            break;
        case 'pawn':
            const forward = color === 'white' ? 1 : -1;
            const r1 = row + forward;
            if (isValidSquare(r1, col - 1)) moves.push([r1, col - 1]);
            if (isValidSquare(r1, col + 1)) moves.push([r1, col + 1]);
            break;
    }
    return moves;
}

// Trouver le roi
function findKing(color) {
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const piece = board[r][c];
            if (piece && piece.type === 'king' && piece.color === color) {
                return { row: r, col: c };
            }
        }
    }
    return null;
}

// Vérifier si le roi est en échec
function isInCheck(color) {
    const king = findKing(color);
    if (!king) return false;
    const opponentColor = color === 'white' ? 'black' : 'white';
    return isSquareAttacked(king.row, king.col, opponentColor);
}

// Vérifier échec et mat
function isCheckmate(color) {
    if (!isInCheck(color)) return false;

    // Vérifier si le joueur a un coup légal
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const piece = board[r][c];
            if (piece && piece.color === color) {
                // Utiliser getLegalMoves pour avoir les coups vraiment légaux
                const legalMoves = getLegalMoves(piece.type, r, c, color);
                if (legalMoves.length > 0) {
                    return false; // Il y a au moins un coup légal, ce n'est pas l'échec et mat
                }
            }
        }
    }
    return true; // Pas de coup légal et roi en échec = échec et mat
}

// Vérifier pat (stalemate)
function isStalemate(color) {
    if (isInCheck(color)) return false;

    // Vérifier si le joueur a au moins un coup légal
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const piece = board[r][c];
            if (piece && piece.color === color) {
                // Utiliser getLegalMoves pour avoir les coups vraiment légaux
                const legalMoves = getLegalMoves(piece.type, r, c, color);
                if (legalMoves.length > 0) return false;
            }
        }
    }
    return true; // Aucun coup légal et roi pas en échec = pat
}

// Vérifier l'état du jeu
function checkGameStatus() {
    const opponentColor = currentTurn === 'white' ? 'black' : 'white';

    if (isCheckmate(opponentColor)) {
        isGameOver = true;
        const winner = currentTurn === 'white' ? 'Blancs' : 'Noirs';
        statusText.textContent = `Échec et mat ! Les ${winner} ont gagné !`;

        // ✨ NOUVEAU : Sauvegarder la partie
        if (window.ChessSchoolProgress) {
            window.ChessSchoolProgress.saveGamePlayed(true, currentGameMoves);
        }

        setTimeout(() => {
            alert(`Échec et mat ! Les ${winner} ont gagné la partie !`);
        }, 500);
    } else if (isStalemate(opponentColor)) {
        isGameOver = true;
        statusText.textContent = 'Pat ! Partie nulle.';

        // ✨ NOUVEAU : Sauvegarder la partie (nulle)
        if (window.ChessSchoolProgress) {
            window.ChessSchoolProgress.saveGamePlayed(false, currentGameMoves);
        }

        setTimeout(() => {
            alert('Pat ! La partie est nulle.');
        }, 500);
    } else if (isInCheck(opponentColor)) {
        statusText.textContent = 'Échec !';
    } else {
        statusText.textContent = 'Partie en cours';
    }
}

// Ajouter des mouvements linéaires (tour, fou, dame)
function addLinearMoves(moves, row, col, directions, color) {
    directions.forEach(([dr, dc]) => {
        let newRow = row + dr;
        let newCol = col + dc;
        while (isValidSquare(newRow, newCol)) {
            const targetPiece = board[newRow][newCol];

            if (!targetPiece) {
                // Case vide, on peut y aller
                moves.push([newRow, newCol]);
            } else {
                // Il y a une pièce
                if (targetPiece.color !== color) {
                    // Pièce adverse, on peut capturer
                    moves.push([newRow, newCol]);
                }
                // On ne peut pas aller plus loin
                break;
            }

            newRow += dr;
            newCol += dc;
        }
    });
}

// Vérifier si une case est valide
function isValidSquare(row, col) {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
}

// Mise à jour des informations de tour
function updateTurnInfo() {
    const turnColor = currentTurn === 'white' ? 'Blancs' : 'Noirs';
    const emoji = currentTurn === 'white' ? '' : '';
    turnInfo.innerHTML = `
        <h4>${emoji} Tour des ${turnColor}</h4>
      `;
}

// Ajouter un coup à l'historique
function addMoveToHistory(from, to, piece, captured) {
    const fromNotation = String.fromCharCode(97 + from.col) + (from.row + 1);
    const toNotation = String.fromCharCode(97 + to.col) + (to.row + 1);
    const pieceSymbol = pieces[piece.type][piece.color];
    const captureSymbol = captured ? 'x' : '-';

    const moveNumber = Math.floor(moveHistory.length / 2) + 1;
    const moveText = `${moveNumber}. ${pieceSymbol}${fromNotation}${captureSymbol}${toNotation}`;

    moveHistory.push(moveText);
    updateMoveHistory();
}

// Mettre à jour l'affichage de l'historique
function updateMoveHistory() {
    if (moveHistory.length === 0) {
        moveHistoryEl.innerHTML = '<p style="color: #999; font-style: italic;">Aucun coup joué</p>';
    } else {
        moveHistoryEl.innerHTML = moveHistory.map(move => `<div>${move}</div>`).join('');
        moveHistoryEl.scrollTop = moveHistoryEl.scrollHeight;
    }
}

// Compteur de coups pour la partie en cours
let currentGameMoves = 0;

// Charger une position depuis une chaîne FEN (format standard)
function setBoardFromFEN(fen) {
    const parts = fen.split(' ');
    const placement = parts[0];
    const activeColor = parts[1] || 'w';

    const rows = placement.split('/');
    if (rows.length !== 8) return;

    // Réinitialiser le tableau
    board = Array(8).fill(null).map(() => Array(8).fill(null));

    for (let r = 0; r < 8; r++) {
        const fenRank = rows[r];
        let c = 0;
        for (let i = 0; i < fenRank.length; i++) {
            const ch = fenRank[i];
            if (/[1-8]/.test(ch)) {
                const empties = parseInt(ch, 10);
                for (let k = 0; k < empties; k++) {
                    board[7 - r][c] = null;
                    c++;
                }
            } else {
                const isLower = ch === ch.toLowerCase();
                const color = isLower ? 'black' : 'white';
                const letter = ch.toLowerCase();
                let type = null;
                switch (letter) {
                    case 'p': type = 'pawn'; break;
                    case 'r': type = 'rook'; break;
                    case 'n': type = 'knight'; break;
                    case 'b': type = 'bishop'; break;
                    case 'q': type = 'queen'; break;
                    case 'k': type = 'king'; break;
                }
                if (type) {
                    board[7 - r][c] = { type: type, color: color };
                } else {
                    board[7 - r][c] = null;
                }
                c++;
            }
        }
    }

    currentTurn = activeColor === 'b' ? 'black' : 'white';
    selectedSquare = null;
    gameHistory = [];
    moveHistory = [];
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
    updateBoard();
    updateTurnInfo();
    updateMoveHistory();
}

// Fonction publique pour charger un puzzle (FEN)
function loadPuzzle(fen, turn) {
    setBoardFromFEN(fen);
    if (turn) currentTurn = turn === 'black' ? 'black' : 'white';
    updateBoard();
    updateTurnInfo();
    statusText.textContent = 'Position du problème';
}

// Rendre disponible pour d'autres pages
window.loadPuzzle = loadPuzzle;

// Initialisation après chargement du DOM : lier les éléments, attacher les listeners et initialiser l'échiquier
document.addEventListener('DOMContentLoaded', () => {
    chessboard = document.getElementById('chessboard');
    turnInfo = document.getElementById('turn-info');
    statusText = document.getElementById('status-text');
    moveHistoryEl = document.getElementById('move-history');
    newGameBtn = document.getElementById('new-game');
    undoBtn = document.getElementById('undo-move');

    if (newGameBtn) {
        newGameBtn.addEventListener('click', () => {
            if (moveHistory.length > 0) {
                if (!confirm('Voulez-vous vraiment recommencer une nouvelle partie ?')) return;
                if (window.ChessSchoolProgress && !isGameOver) {
                    window.ChessSchoolProgress.saveGamePlayed(false, currentGameMoves);
                }
            }
            currentGameMoves = 0;
            initStartPosition();
        });
    }

    if (undoBtn) {
        undoBtn.addEventListener('click', () => {
            if (gameHistory.length > 0) {
                const lastState = gameHistory.pop();
                board = lastState.board;
                hasMoved = lastState.hasMoved;
                enPassantTarget = lastState.enPassantTarget;
                moveHistory.pop();
                currentTurn = currentTurn === 'white' ? 'black' : 'white';
                selectedSquare = null;
                isGameOver = false;
                clearHighlights();
                updateBoard();
                updateTurnInfo();
                updateMoveHistory();
                statusText.textContent = 'Partie en cours';
            }
        });
    }

    // Créer l'échiquier et position initiale
    createBoard();
    initStartPosition();
    // Indiquer que l'échiquier est prêt pour que d'autres scripts puissent charger des puzzles
    window.chessboardReady = true;
    document.dispatchEvent(new Event('chessboardReady'));
});