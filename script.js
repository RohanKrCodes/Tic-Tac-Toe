document.addEventListener("DOMContentLoaded", function () {
  const app = document.getElementById("app");
  const winnerDisplay = document.getElementById("winner");
  const restartBtn = document.getElementById("restartBtn");
  const modeSelector = document.getElementById("modeSelector");
  const xWinsDisplay = document.getElementById("xWins");
  const oWinsDisplay = document.getElementById("oWins");
  const drawsDisplay = document.getElementById("draws");

  let currentPlayer = "X";
  let board = ["", "", "", "", "", "", "", "", ""];
  let gameMode = "double"; // Default to double player mode
  let xWins = 0;
  let oWins = 0;
  let draws = 0;
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // columns
    [0, 4, 8],
    [2, 4, 6], // diagonals
  ];

  function checkWinner() {
    for (let combo of winningCombinations) {
      const [a, b, c] = combo;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  }

  function checkDraw() {
    return board.every((cell) => cell !== "") && !checkWinner();
  }

  function handleClick(cellIndex) {
    if (board[cellIndex] === "" && !checkWinner()) {
      board[cellIndex] = currentPlayer;
      renderBoard();

      const winner = checkWinner();
      if (winner) {
        winnerDisplay.innerText = `Player ${winner} wins!`;
        if (winner === "X") {
          xWins++;
        } else {
          oWins++;
        }
      } else if (checkDraw()) {
        winnerDisplay.innerText = "It's a draw!";
        draws++;
      } else {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        if (gameMode === "single" && currentPlayer === "O") {
          makeAIMove();
        }
      }
      updateStats();
    }
  }

  function makeAIMove() {
    let emptyCells = [];
    let winMove = null;
    let blockMove = null;

    for (let i = 0; i < board.length; i++) {
      if (board[i] === "") {
        emptyCells.push(i);
      }
    }

    // Check for a winning move or a blocking move
    for (let combo of winningCombinations) {
      const [a, b, c] = combo;
      if (
        (board[a] === "O" && board[b] === "O" && board[c] === "") ||
        (board[a] === "O" && board[c] === "O" && board[b] === "") ||
        (board[b] === "O" && board[c] === "O" && board[a] === "")
      ) {
        winMove = board[c] === "" ? c : board[b] === "" ? b : a;
      } else if (
        (board[a] === "X" && board[b] === "X" && board[c] === "") ||
        (board[a] === "X" && board[c] === "X" && board[b] === "") ||
        (board[b] === "X" && board[c] === "X" && board[a] === "")
      ) {
        blockMove = board[c] === "" ? c : board[b] === "" ? b : a;
      }
    }

    if (winMove !== null) {
      board[winMove] = "O";
    } else if (blockMove !== null) {
      board[blockMove] = "O";
    } else {
      const strategicMoves = [4, 0, 2, 6, 8];
      for (let move of strategicMoves) {
        if (emptyCells.includes(move)) {
          board[move] = "O";
          break;
        }
      }
      if (board.join("").length === 1) {
        board[emptyCells[Math.floor(Math.random() * emptyCells.length)]] = "O";
      }
    }

    renderBoard();
    const winner = checkWinner();
    if (winner) {
      if (winner === "X") {
        xWins++;
      } else {
        oWins++;
      }
      winnerDisplay.innerText = `Player ${winner} wins!`;
    } else if (checkDraw()) {
      winnerDisplay.innerText = "It's a draw!";
      draws++;
    }
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    updateStats();
  }

  function updateStats() {
    xWinsDisplay.innerText = xWins;
    oWinsDisplay.innerText = oWins;
    drawsDisplay.innerText = draws;
  }

  function renderBoard() {
    app.innerHTML = ""; // Clear the board
    const table = document.createElement("table");
    table.classList.add("board");
    for (let i = 0; i < 3; i++) {
      const row = document.createElement("tr");
      row.classList.add("row");
      for (let j = 0; j < 3; j++) {
        const cellIndex = i * 3 + j;
        const cell = document.createElement("td");
        cell.classList.add("cell");
        cell.innerText = board[cellIndex];
        cell.addEventListener("click", () => handleClick(cellIndex));
        row.appendChild(cell);
      }
      table.appendChild(row);
    }
    app.appendChild(table);
  }

  function restartGame() {
    currentPlayer = "X";
    board = ["", "", "", "", "", "", "", "", ""];
    winnerDisplay.innerText = "";
    renderBoard();
    if (gameMode === "single" && currentPlayer === "O") {
      makeAIMove();
    }
    updateStats();
  }

  restartBtn.addEventListener("click", restartGame);

  modeSelector.addEventListener("change", function () {
    gameMode = modeSelector.value;
    restartGame();
  });

  renderBoard();
});
