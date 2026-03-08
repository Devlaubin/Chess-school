// Utility helpers for rendering chess pieces as images instead of emojis
// Any page that wants to convert a chess piece symbol (♔,♟, etc.) into a
// graphical icon can call the global helper functions defined here.

(function () {
    // mapping from emoji symbol to image URL (SVG icons hosted on Wikimedia Commons)
    const map = {
        '♔': 'https://upload.wikimedia.org/wikipedia/commons/4/42/Chess_klt45.svg',
        '♕': 'https://upload.wikimedia.org/wikipedia/commons/1/15/Chess_qlt45.svg',
        '♖': 'https://upload.wikimedia.org/wikipedia/commons/7/72/Chess_rlt45.svg',
        '♗': 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Chess_blt45.svg',
        '♘': 'https://upload.wikimedia.org/wikipedia/commons/7/70/Chess_nlt45.svg',
        '♙': 'https://upload.wikimedia.org/wikipedia/commons/4/45/Chess_plt45.svg',
        '♚': 'https://upload.wikimedia.org/wikipedia/commons/f/f0/Chess_kdt45.svg',
        '♛': 'https://upload.wikimedia.org/wikipedia/commons/4/47/Chess_qdt45.svg',
        '♜': 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Chess_rdt45.svg',
        '♝': 'https://upload.wikimedia.org/wikipedia/commons/9/98/Chess_bdt45.svg',
        '♞': 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Chess_ndt45.svg',
        '♟': 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Chess_pdt45.svg'
    };

    window.pieceImageMap = map;

    /**
     * Return true when the given string corresponds to a known chess piece.
     * @param {string} symbol
     * @returns {boolean}
     */
    window.isChessPiece = function (symbol) {
        return typeof symbol === 'string' && map.hasOwnProperty(symbol);
    };

    /**
     * Create a DOM element representing a piece. If the symbol is recognised,
     * an <img> is returned, otherwise a <span> containing the text is used.
     * @param {string} symbol
     * @returns {HTMLElement}
     */
    window.createPieceElement = function (symbol) {
        if (isChessPiece(symbol)) {
            const img = document.createElement('img');
            img.src = map[symbol];
            img.className = 'piece-img';
            img.alt = symbol;
            return img;
        }

        const span = document.createElement('span');
        span.textContent = symbol;
        span.className = 'piece-fallback';
        return span;
    };

    /**
     * Convenience when building mixed content: returns a document fragment or
     * element that can be appended directly to the DOM.
     * @param {string} symbol
     * @returns {Node}
     */
    window.renderSymbol = function (symbol) {
        if (isChessPiece(symbol)) {
            return createPieceElement(symbol);
        }
        const text = document.createTextNode(symbol);
        return text;
    };
})();
