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

    sections.forEach(section => {
        observer.observe(section);
    });

    // Gestion des liens de navigation
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 50,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Easter Egg : Activation avec Konami Code
let konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    // Quitter le jeu avec Échap
    if (e.key === 'Escape') {
        deactivateEasterEgg();
    }

    // Activation du Konami Code
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

    // Ajout de l'écouteur pour le bouton "Fermer"
    document.getElementById('close-game').addEventListener('click', deactivateEasterEgg);
}

function deactivateEasterEgg() {
    const easterEgg = document.getElementById('easter-egg');
    easterEgg.classList.remove('visible');

    // Réinitialiser le jeu
    const gameOverElement = document.getElementById('game-over');
    gameOverElement.classList.add('hidden');
}

function startGame() {
    const dino = document.getElementById('dino');
    const cactus = document.getElementById('cactus');
    const scoreElement = document.getElementById('score');
    const gameOverElement = document.getElementById('game-over');
    const restartButton = document.getElementById('restart');

    // Réinitialisation complète
    let score = 0;
    let isJumping = false;
    let gameRunning = true;
    let cactusPosition = 800;
    let gameSpeed = 5; // Vitesse initiale
    let speedIncreaseInterval = 5; // Augmenter la vitesse tous les 5 points
    let lastCactusTime = 0;
    let minCactusInterval = 100; // Intervalle minimum entre les cactus (ms)
    let maxCactusInterval = 2000; // Intervalle maximum entre les cactus (ms)
    let nextCactusTime = getRandomInterval();

    // Réinitialiser les éléments visuels
    dino.style.bottom = '50px';
    cactus.style.left = cactusPosition + 'px';
    scoreElement.textContent = '0';
    gameOverElement.classList.add('hidden');

    // Fonction pour générer un intervalle aléatoire entre min et max
    function getRandomInterval() {
        return Math.floor(Math.random() * (maxCactusInterval - minCactusInterval + 1)) + minCactusInterval;
    }

    // Fonction de saut
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

    // Écouteur pour le saut
    document.addEventListener('keydown', (e) => {
        if ((e.key === ' ' || e.key === 'ArrowUp') && gameRunning) {
            jump();
        }
    });

    // Boucle principale du jeu
    let gameLoop;
    let lastTime = 0;

    function startGameLoop(timestamp) {
        if (!lastTime) lastTime = timestamp;
        const deltaTime = timestamp - lastTime;
        lastTime = timestamp;

        if (!gameRunning) return;

        // Déplacer le cactus
        cactusPosition -= gameSpeed * (deltaTime / 20);
        cactus.style.left = cactusPosition + 'px';

        // Si le cactus sort de l'écran, le replacer à droite après un délai aléatoire
        if (cactusPosition < -20) {
            cactusPosition = 800;
        }

        // Vérifier si un nouveau cactus doit apparaître
        if (timestamp - lastCactusTime > nextCactusTime && cactusPosition >= 800) {
            lastCactusTime = timestamp;
            nextCactusTime = getRandomInterval();
            score++;
            scoreElement.textContent = score;

            // Augmenter la vitesse toutes les `speedIncreaseInterval` points
            if (score % speedIncreaseInterval === 0 && gameSpeed < 15) {
                gameSpeed += 0.5;
                // Réduire l'intervalle minimum entre les cactus pour augmenter la difficulté
                if (minCactusInterval > 500) {
                    minCactusInterval -= 100;
                }
            }
        }

        // Détection de collision
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
        }

        requestAnimationFrame(startGameLoop);
    }

    // Démarrer la boucle de jeu après un délai
    setTimeout(() => {
        requestAnimationFrame(startGameLoop);
    }, 1000);

    function gameOver() {
        gameRunning = false;
        cancelAnimationFrame(startGameLoop);
        gameOverElement.classList.remove('hidden');
    }

    // Bouton de redémarrage
    restartButton.onclick = () => {
        cancelAnimationFrame(startGameLoop);
        startGame();
    };
}