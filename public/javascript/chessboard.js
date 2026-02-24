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

// ... (le contenu complet de chessboard.js est copié ici) ...
