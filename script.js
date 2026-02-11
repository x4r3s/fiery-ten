const MAX_NUMBER = 10;
const MAX_TRIES = 5;

const state = {
  secretNumber: getRandomNumber(),
  attemptsLeft: MAX_TRIES,
  isGameOver: false,
  hasShownRestart: false,
};

const attemptsValue = document.getElementById("attemptsValue");
const gameMessage = document.getElementById("gameMessage");
const guessGrid = document.getElementById("guessGrid");
const restartGameButton = document.getElementById("restartGameButton");
const footerYear = document.getElementById("footerYear");

const messagePrefixes = {
  info: "",
  win: "🏆 ",
  lose: "💀 ",
  warn: "🌶️ ",
};

function getRandomNumber() {
  return Math.floor(Math.random() * MAX_NUMBER) + 1;
}

function setMessage(text, type = "info") {
  const prefix = messagePrefixes[type] ?? "";
  gameMessage.textContent = `${prefix}${text}`;
}

function setGuessButtonsDisabled(isDisabled) {
  guessGrid.querySelectorAll(".num").forEach((button) => {
    button.disabled = isDisabled;
  });
}

function renderAttempts() {
  attemptsValue.textContent = state.attemptsLeft;
}

function showRestartButton() {
  if (!state.hasShownRestart) {
    restartGameButton.hidden = false;
    state.hasShownRestart = true;
  }
}

function finishGame(text, type) {
  state.isGameOver = true;
  setGuessButtonsDisabled(true);
  setMessage(text, type);
}

function handleGuess(guess) {
  if (state.isGameOver) {
    return;
  }

  if (guess === state.secretNumber) {
    finishGame("Victory! Starting a new number on restart.", "win");
    showRestartButton();
    return;
  }

  state.attemptsLeft -= 1;
  renderAttempts();
  showRestartButton();

  if (state.attemptsLeft > 0) {
    setMessage(`Not this one. Try again. Attempts left: ${state.attemptsLeft}.`, "warn");
    return;
  }

  finishGame(`No attempts left. The number was ${state.secretNumber}. Press restart for a new round.`, "lose");
}

function restartGame() {
  state.secretNumber = getRandomNumber();
  state.attemptsLeft = MAX_TRIES;
  state.isGameOver = false;
  state.hasShownRestart = false;

  renderAttempts();
  setGuessButtonsDisabled(false);
  restartGameButton.hidden = true;
  setMessage("New game started. Pick a number.");
}

function bindEvents() {
  guessGrid.addEventListener("click", (event) => {
    const button = event.target.closest(".num");
    if (!button) {
      return;
    }

    const guess = Number(button.dataset.guess);
    if (!Number.isInteger(guess)) {
      return;
    }

    handleGuess(guess);
  });

  restartGameButton.addEventListener("click", restartGame);
}

function init() {
  renderAttempts();
  bindEvents();

  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }
}

init();
