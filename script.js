const emojiList = ['🍎', '🍌', '🍇', '🍓', '🍍', '🥝', '🍉', '🍑', '🍋', '🍊', '🥥', '🥭'];
let level = 1;
let score = 0;
let timerInterval;
let startTime = 0;
let firstCard = null;
let secondCard = null;
let lock = false;
let matches = 0;
let totalPairs = 0;

function shuffle(array) {
  return array.sort(() => 0.5 - Math.random());
}

function updateStats() {
  document.getElementById('score').innerText = score;
  document.getElementById('level').innerText = level;
}

function updateTimer() {
  const seconds = Math.floor((Date.now() - startTime) / 1000);
  document.getElementById('timer').innerText = seconds;
}

function createGrid(rows, cols) {
  const grid = document.getElementById('grid');
  grid.innerHTML = '';
 grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

  totalPairs = (rows * cols) / 2;
  matches = 0;

  let emojis = shuffle([...emojiList]).slice(0, totalPairs);
  let cards = shuffle([...emojis, ...emojis]);

  cards.forEach((emoji, index) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.emoji = emoji;
    card.dataset.index = index;
    card.addEventListener('click', revealCard);
    grid.appendChild(card);
  });
}

function revealCard(e) {
  if (lock) return;

  const card = e.target;
  if (card.classList.contains('revealed')) return;

  card.innerText = card.dataset.emoji;
  card.classList.add('revealed');

  if (!firstCard) {
    firstCard = card;
  } else {
    secondCard = card;
    checkMatch();
  }
}

function checkMatch() {
  lock = true;
  if (firstCard.dataset.emoji === secondCard.dataset.emoji) {
    score += 10;
    matches++;
    updateStats();
    resetTurn();

    if (matches === totalPairs) {
      setTimeout(() => {
        level++;
        updateStats();
        startGame();
      }, 1000);
    }
  } else {
    setTimeout(() => {
      firstCard.innerText = '';
      secondCard.innerText = '';
      firstCard.classList.remove('revealed');
      secondCard.classList.remove('revealed');
      resetTurn();
    }, 1000);
  }
}

function resetTurn() {
  firstCard = null;
  secondCard = null;
  lock = false;
}

function startGame() {
  clearInterval(timerInterval);
  startTime = Date.now();
  timerInterval = setInterval(updateTimer, 1000);

  // хүсвэл оноог reset хийж болно
  // score = 0;

  let rows = 4 + Math.floor((level - 1) / 2);
  let cols = 4 + ((level - 1) % 2);
  if ((rows * cols) % 2 !== 0) cols++;

  createGrid(rows, cols);
  updateStats();
}
