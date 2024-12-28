const board = Array(9).fill(null);
let currentPlayer = "X"; // "X" - Human, "O" - AI

document.querySelectorAll('.cell').forEach(cell => {
    cell.addEventListener('click', () => makeMove(cell.id));
});

function makeMove(cellId) {
    const index = parseInt(cellId.split('-')[1]);
    if (!board[index] && currentPlayer === "X") {
        board[index] = "X";
        document.getElementById(cellId).textContent = "X";
        document.getElementById(cellId).classList.add('taken');

        if (checkWinner()) {
            setTimeout(() => {
                alert("You win!");
                resetGame();
            }, 100);
        } else if (board.every(cell => cell)) {
            setTimeout(() => {
                alert("It's a draw!");
                resetGame();
            }, 100);
        } else {
            currentPlayer = "O";
            aiMove();
        }
    }
}

function aiMove() {
    const bestMove = getBestMove();
    board[bestMove] = "O";
    document.getElementById(`cell-${bestMove}`).textContent = "O";
    document.getElementById(`cell-${bestMove}`).classList.add('taken');

    if (checkWinner()) {
        setTimeout(() => {
            alert("AI wins!");
            resetGame();
        }, 100);
    } else if (board.every(cell => cell)) {
        setTimeout(() => {
            alert("It's a draw!");
            resetGame();
        }, 100);
    } else {
        currentPlayer = "X";
    }
}

function getBestMove() {
    let bestScore = -Infinity;
    let move;

    for (let i = 0; i < board.length; i++) {
        if (!board[i]) {
            board[i] = "O";
            let score = minimax(board, 0, false);
            board[i] = null;

            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }

    return move;
}

function minimax(board, depth, isMaximizing) {
    if (checkWinnerAI("O")) return 10 - depth; // AI wins
    if (checkWinnerAI("X")) return depth - 10; // Human wins
    if (board.every(cell => cell)) return 0; // Draw

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (!board[i]) {
                board[i] = "O";
                let score = minimax(board, depth + 1, false);
                board[i] = null;
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (!board[i]) {
                board[i] = "X";
                let score = minimax(board, depth + 1, true);
                board[i] = null;
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkWinnerAI(player) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]            // Diagonals
    ];
    return winPatterns.some(pattern =>
        pattern.every(index => board[index] === player)
    );
}

function checkWinner() {
    return checkWinnerAI("X") || checkWinnerAI("O");
}

function resetGame() {
    board.fill(null);
    currentPlayer = "X";
    document.querySelectorAll('.cell').forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('taken');
    });
          }
