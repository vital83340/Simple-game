(function () {
  const playfield = document.getElementById('playfield');
  const startBtn = document.getElementById('startBtn');
  const dot = document.getElementById('dot');
  const scoreEl = document.getElementById('score');
  const timeEl = document.getElementById('time');
  const bestEl = document.getElementById('best');
  const resetBestBtn = document.getElementById('resetBest');

  /** @type {number} */
  let score = 0;
  /** @type {number} */
  let timeLeft = 30;
  /** @type {number | null} */
  let timerId = null;
  /** @type {boolean} */
  let gameRunning = false;

  const BEST_KEY = 'tapdot_best_v1';
  const storedBest = Number(localStorage.getItem(BEST_KEY) || '0');
  bestEl.textContent = String(storedBest);

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function moveDotWithinPlayfield() {
    const fieldRect = playfield.getBoundingClientRect();
    const dotRect = dot.getBoundingClientRect();

    const padding = 6;
    const minX = fieldRect.left + padding;
    const maxX = fieldRect.right - dotRect.width - padding;
    const minY = fieldRect.top + padding;
    const maxY = fieldRect.bottom - dotRect.height - padding;

    const x = randomInt(minX, Math.max(minX, maxX));
    const y = randomInt(minY, Math.max(minY, maxY));

    const offsetX = x - fieldRect.left;
    const offsetY = y - fieldRect.top;

    dot.style.left = `${offsetX}px`;
    dot.style.top = `${offsetY}px`;
  }

  function showToast(message) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = message;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 1200);
  }

  function startGame() {
    if (gameRunning) return;
    gameRunning = true;
    score = 0;
    timeLeft = 30;
    scoreEl.textContent = '0';
    timeEl.textContent = String(timeLeft);

    startBtn.hidden = true;
    dot.hidden = false;

    moveDotWithinPlayfield();

    timerId = window.setInterval(() => {
      timeLeft -= 1;
      timeEl.textContent = String(timeLeft);

      if (timeLeft <= 0) {
        endGame();
      }
    }, 1000);
  }

  function endGame() {
    if (!gameRunning) return;
    gameRunning = false;
    if (timerId !== null) window.clearInterval(timerId);
    timerId = null;
    startBtn.hidden = false;
    dot.hidden = true;

    const best = Number(localStorage.getItem(BEST_KEY) || '0');
    if (score > best) {
      localStorage.setItem(BEST_KEY, String(score));
      bestEl.textContent = String(score);
      showToast('New Best!');
    } else {
      showToast(`Score: ${score}`);
    }
  }

  function incrementScore() {
    if (!gameRunning) return;
    score += 1;
    scoreEl.textContent = String(score);
    moveDotWithinPlayfield();
  }

  // Input handlers
  startBtn.addEventListener('click', startGame);
  startBtn.addEventListener('touchstart', (e) => { e.preventDefault(); startGame(); }, { passive: false });

  dot.addEventListener('click', incrementScore);
  dot.addEventListener('touchstart', (e) => { e.preventDefault(); incrementScore(); }, { passive: false });
  dot.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') incrementScore(); });

  // Keep dot inside bounds on resize/rotate
  window.addEventListener('resize', () => { if (gameRunning) moveDotWithinPlayfield(); });
  window.addEventListener('orientationchange', () => { if (gameRunning) moveDotWithinPlayfield(); });

  resetBestBtn.addEventListener('click', () => {
    localStorage.removeItem(BEST_KEY);
    bestEl.textContent = '0';
    showToast('Best reset');
  });
})();