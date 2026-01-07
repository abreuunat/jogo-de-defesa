const game = document.getElementById("game");
const base = document.getElementById("base");
const lifeEl = document.getElementById("life");
const scoreEl = document.getElementById("score");
const waveEl = document.getElementById("wave");
const gameOverScreen = document.getElementById("gameOver");

let life = 5;
let score = 0;
let wave = 1;
let enemySpeed = 1.5;
let gameOver = false;

function createEnemy() {
  if (gameOver) return;

  const enemy = document.createElement("div");
  enemy.classList.add("enemy");
  enemy.style.left = "-40px";
  enemy.style.top = Math.random() * (game.clientHeight - 40) + "px";
  game.appendChild(enemy);

  const move = setInterval(() => {
    enemy.style.left = enemy.offsetLeft + enemySpeed + "px";

    if (enemy.offsetLeft + enemy.offsetWidth >= base.offsetLeft) {
      clearInterval(move);
      enemy.remove();
      life--;
      lifeEl.textContent = life;

      if (life <= 0) {
        endGame();
      }
    }
  }, 20);

  enemy.addEventListener("click", () => {
    clearInterval(move);
    enemy.remove();
    score += 10;
    scoreEl.textContent = score;
  });
}

function startWave() {
  let enemies = 5 + wave * 2;
  let created = 0;

  const interval = setInterval(() => {
    if (gameOver) {
      clearInterval(interval);
      return;
    }

    createEnemy();
    created++;

    if (created >= enemies) {
      clearInterval(interval);

      setTimeout(() => {
        if (gameOver) return;

        wave++;
        waveEl.textContent = wave;
        enemySpeed += 0.5;
        startWave();
      }, 3000);
    }
  }, 800);
}

function endGame() {
  gameOver = true;
  gameOverScreen.style.display = "flex";
}

startWave();
