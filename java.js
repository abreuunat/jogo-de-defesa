const game = document.getElementById("game");
const base = document.getElementById("base");
const lifeEl = document.getElementById("life");
const scoreEl = document.getElementById("score");
const waveEl = document.getElementById("wave");
const gameOverScreen = document.getElementById("gameOver");
const restartBtn = document.getElementById("restartBtn");

let life = 5;
let score = 0;
let wave = 1;
let enemySpeed = 60; // pixels per second base
let gameOver = false;

const enemies = [];
let lastTime = null;

function spawnEnemy() {
  if (gameOver) return;
  const el = document.createElement('div');
  el.className = 'enemy';
  const size = 36 + Math.random()*16;
  el.style.width = size + 'px';
  el.style.height = size + 'px';
  el.style.left = -size - 10 + 'px';
  const y = Math.random() * (game.clientHeight - size);
  el.style.top = y + 'px';
  game.appendChild(el);

  const speed = enemySpeed * (0.85 + Math.random()*0.6);
  const obj = {el, x: -size - 10, y, w: size, h: size, speed};
  enemies.push(obj);

  el.addEventListener('click', (e) => {
    e.stopPropagation();
    destroyEnemy(obj, true);
  });
}

function destroyEnemy(enemyObj, byPlayer){
  const {el, x, y, w} = enemyObj;
  // particles
  for(let i=0;i<8;i++){
    const p = document.createElement('div');
    p.className='particle';
    p.style.left = (x + w/2) + 'px';
    p.style.top = (y + w/2) + 'px';
    p.style.background = byPlayer ? '#7dd3fc' : '#ffcccb';
    game.appendChild(p);
    const ang = Math.random()*Math.PI*2;
    const dist = 30 + Math.random()*60;
    requestAnimationFrame(()=>{
      p.style.transform = `translate(${Math.cos(ang)*dist}px, ${Math.sin(ang)*dist}px)`;
      p.style.opacity = '0';
    });
    setTimeout(()=>p.remove(), 600);
  }

  el.remove();
  const idx = enemies.indexOf(enemyObj);
  if (idx !== -1) enemies.splice(idx,1);

  if(byPlayer){
    score += 10;
    scoreEl.textContent = score;
  } else {
    life--;
    lifeEl.textContent = life;
    base.classList.add('shake');
    setTimeout(()=>base.classList.remove('shake'),420);
    if(life<=0) endGame();
  }
}

function update(time){
  if(!lastTime) lastTime = time;
  const dt = (time - lastTime)/1000; // seconds
  lastTime = time;

  for(let i=enemies.length-1;i>=0;i--){
    const en = enemies[i];
    en.x += en.speed * dt;
    en.el.style.left = en.x + 'px';

    const baseLeft = base.offsetLeft;
    if(en.x + en.w >= baseLeft){
      destroyEnemy(en, false);
    }
  }

  if(!gameOver) requestAnimationFrame(update);
}

function startWave(){
  if(gameOver) return;
  let toSpawn = 5 + wave*2;
  let spawned = 0;
  const spawnInterval = setInterval(()=>{
    if(gameOver) { clearInterval(spawnInterval); return; }
    spawnEnemy();
    spawned++;
    if(spawned>=toSpawn){
      clearInterval(spawnInterval);
      setTimeout(()=>{
        if(gameOver) return;
        wave++;
        waveEl.textContent = wave;
        enemySpeed += 12; // increase px/s
        startWave();
      },2000);
    }
  }, 700);
}

function endGame(){
  gameOver = true;
  gameOverScreen.style.display = 'flex';
}

restartBtn.addEventListener('click', ()=>{
  location.reload();
});

// click on background to create small pulse
game.addEventListener('click', (e)=>{
  const px = document.createElement('div');
  px.className='particle';
  px.style.left = e.offsetX + 'px';
  px.style.top = e.offsetY + 'px';
  px.style.width = '6px'; px.style.height='6px';
  game.appendChild(px);
  requestAnimationFrame(()=>{px.style.transform='translate(0,-30px)'; px.style.opacity='0';});
  setTimeout(()=>px.remove(),400);
});

// init
lifeEl.textContent = life;
scoreEl.textContent = score;
waveEl.textContent = wave;
requestAnimationFrame(update);
startWave();
