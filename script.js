// Animation au scroll
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => observer.observe(section));

    // Navigation fluide
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = document.querySelector(this.getAttribute('href'));
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 50,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Konami Code
const konamiCode = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') deactivateEasterEgg();
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            activateEasterEgg();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

function activateEasterEgg() {
    const easterEgg = document.getElementById('easter-egg');
    easterEgg.classList.add('visible');
    startGame();
    document.getElementById('close-game').onclick = deactivateEasterEgg;
}

function deactivateEasterEgg() {
    const easterEgg = document.getElementById('easter-egg');
    easterEgg.classList.remove('visible');
    document.getElementById('game-over').classList.add('hidden');
    stopGame();
}

// Variables de jeu globales pour pouvoir les réinitialiser proprement
let gameLoopId = null;
let jumpListener = null;

function startGame() {
    const dino = document.getElementById('dino');
    const cactus = document.getElementById('cactus');
    const scoreElement = document.getElementById('score');
    const gameOverElement = document.getElementById('game-over');
    const restartButton = document.getElementById('restart');

    let score = 0;
    let isJumping = false;
    let gameRunning = true;
    let cactusPosition = 800;
    let gameSpeed = 5;
    let speedIncreaseInterval = 5;
    let minCactusInterval = 100;
    let maxCactusInterval = 2000;
    let lastCactusTime = 0;
    let nextCactusTime = getRandomInterval();
    let lastTime = 0;

    dino.style.bottom = '50px';
    cactus.style.left = cactusPosition + 'px';
    scoreElement.textContent = '0';
    gameOverElement.classList.add('hidden');

    function getRandomInterval() {
        return Math.floor(Math.random() * (maxCactusInterval - minCactusInterval + 1)) + minCactusInterval;
    }

    function jump() {
        if (isJumping) return;
        isJumping = true;
        let jumpHeight = 0;
        const jumpUp = setInterval(() => {
            if (jumpHeight >= 100) {
                clearInterval(jumpUp);
                const jumpDown = setInterval(() => {
                    if (jumpHeight <= 0) {
                        clearInterval(jumpDown);
                        isJumping = false;
                        dino.style.bottom = '50px';
                    } else {
                        jumpHeight -= 5;
                        dino.style.bottom = 50 + jumpHeight + 'px';
                    }
                }, 20);
            } else {
                jumpHeight += 5;
                dino.style.bottom = 50 + jumpHeight + 'px';
            }
        }, 20);
    }

    // Nettoyage de l'ancien listener si existant
    if (jumpListener) document.removeEventListener('keydown', jumpListener);
    jumpListener = (e) => {
        if ((e.key === ' ' || e.key === 'ArrowUp') && gameRunning) jump();
    };
    document.addEventListener('keydown', jumpListener);

    function gameLoop(timestamp) {
        if (!lastTime) lastTime = timestamp;
        const deltaTime = timestamp - lastTime;
        lastTime = timestamp;

        if (!gameRunning) return;

        cactusPosition -= gameSpeed * (deltaTime / 20);
        cactus.style.left = cactusPosition + 'px';

        if (cactusPosition < -20) cactusPosition = 800;

        if (timestamp - lastCactusTime > nextCactusTime && cactusPosition >= 800) {
            lastCactusTime = timestamp;
            nextCactusTime = getRandomInterval();
            score++;
            scoreElement.textContent = score;
            if (score % speedIncreaseInterval === 0 && gameSpeed < 15) {
                gameSpeed += 0.5;
                if (minCactusInterval > 500) minCactusInterval -= 100;
            }
        }

        const dinoRect = dino.getBoundingClientRect();
        const cactusRect = cactus.getBoundingClientRect();
        const isColliding =
            dinoRect.right > cactusRect.left &&
            dinoRect.left < cactusRect.right &&
            dinoRect.bottom > cactusRect.top &&
            dinoRect.top < cactusRect.bottom &&
            !isJumping;

        if (isColliding) {
            gameOver();
            return;
        }

        gameLoopId = requestAnimationFrame(gameLoop);
    }

    setTimeout(() => {
        lastTime = 0;
        gameLoopId = requestAnimationFrame(gameLoop);
    }, 1000);

    function gameOver() {
        gameRunning = false;
        gameOverElement.classList.remove('hidden');
    }

    restartButton.onclick = () => {
        stopGame();
        startGame();
    };
}

function stopGame() {
    if (gameLoopId) cancelAnimationFrame(gameLoopId);
    if (jumpListener) document.removeEventListener('keydown', jumpListener);
}