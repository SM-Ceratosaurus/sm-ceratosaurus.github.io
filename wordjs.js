const WORDS = ["APPLE", "TRAIN", "PLANT", "HOUSE", "BRICK"];
    const MAX_ROWS = 6;
    const MAX_COLS = 5;

    const GameState = {
      PLAYING: "Playing",
      WIN: "Win",
      LOSE: "Lose"
    };

    let secretWord;
    let currentRow;
    let currentCol;
    let guesses;
    let gameState;

    const board = document.getElementById("game-board");
    const message = document.getElementById("message");
    const restartBtn = document.getElementById("restart-btn");

    function initBoard() {
      board.innerHTML = "";

      for (let r = 0; r < MAX_ROWS; r++) {
        for (let c = 0; c < MAX_COLS; c++) {
          const tile = document.createElement("div");
          tile.classList.add("tile");
          tile.id = `tile-${r}-${c}`;
          board.appendChild(tile);
        }
      }
    }

    function startGame() {
		secretWord = WORDS[Math.floor(Math.random() * WORDS.length)];

		currentRow = 0;
		currentCol = 0;
		guesses = [];

	for (let i = 0; i < MAX_ROWS; i++) {
		guesses.push("");
	}

	gameState = GameState.PLAYING;

	message.textContent = "";

	initBoard();

	console.log("Secret Word:", secretWord);
	}

    function updateTile(row, col, letter) {
      const tile = document.getElementById(`tile-${row}-${col}`);
      tile.textContent = letter;
    }

    function handleKey(key) {
      if (gameState !== GameState.PLAYING) {
        return;
      }

      if (/^[a-zA-Z]$/.test(key)) {
        if (currentCol < MAX_COLS) {
          guesses[currentRow] += key.toUpperCase();
          updateTile(currentRow, currentCol, key);
          currentCol++;
        }
      }

      else if (key === "Backspace") {
        if (currentCol > 0) {
          currentCol--;
          guesses[currentRow] =
            guesses[currentRow].slice(0, -1);

          updateTile(currentRow, currentCol, "");
        }
      }

      else if (key === "Enter") {
        submitGuess();
      }
    }

    function submitGuess() {
      const guess = guesses[currentRow];

      if (guess.length !== MAX_COLS) {
        message.textContent = "Word must be 5 letters!";
        return;
      }

      for (let i = 0; i < MAX_COLS; i++) {
        const tile = document.getElementById(
          `tile-${currentRow}-${i}`
        );

        const letter = guess[i];

        if (letter === secretWord[i]) {
          tile.classList.add("correct");
        }
        else if (secretWord.includes(letter)) {
          tile.classList.add("present");
        }
        else {
          tile.classList.add("absent");
        }
      }

      if (guess === secretWord) {
        gameState = GameState.WIN;
        message.textContent = "🎉 You Win!";
        return;
      }

      currentRow++;
      currentCol = 0;

      if (currentRow >= MAX_ROWS) {
        gameState = GameState.LOSE;
        message.textContent =
          `💀 You Lose! Word was "${secretWord}"`;
      }
    }

    document.addEventListener("keydown", (e) => {
	if (
		/^[a-zA-Z]$/.test(e.key) ||
		e.key === "Backspace" ||
		e.key === "Enter"
		) {
    e.preventDefault();
  }

  handleKey(e.key);
});

    restartBtn.addEventListener("click", () => {
      startGame();
    });

    startGame();