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

    let score = 0;
    let isJumping = false;
    let gameRunning = true;
    let cactusPosition = 800; // Position initiale à droite

    // Réinitialiser la position du dino
    dino.style.bottom = '50px';

    // Saut du dinosaure
    document.addEventListener('keydown', (e) => {
        if ((e.key === ' ' || e.key === 'ArrowUp') && !isJumping && gameRunning) {
            isJumping = true;
            jump();
        }
    });

    function jump() {
        let position = 0;
        const jumpUp = setInterval(() => {
            if (position >= 100) {
                clearInterval(jumpUp);
                const jumpDown = setInterval(() => {
                    if (position <= 0) {
                        clearInterval(jumpDown);
                        isJumping = false;
                        dino.style.bottom = '50px';
                    } else {
                        position -= 5;
                        dino.style.bottom = 50 + position + 'px';
                    }
                }, 20);
            } else {
                position += 5;
                dino.style.bottom = 50 + position + 'px';
            }
        }, 20);
    }

    // Déplacement du cactus
    const cactusMove = setInterval(() => {
        if (!gameRunning) return;

        cactusPosition -= 5;
        cactus.style.left = cactusPosition + 'px';

        // Si le cactus sort de l'écran, le replacer à droite et augmenter le score
        if (cactusPosition < -20) {
            cactusPosition = 800;
            score++;
            scoreElement.textContent = score;
        }

        // Détection de collision
        const dinoRect = dino.getBoundingClientRect();
        const cactusRect = cactus.getBoundingClientRect();

        if (
            dinoRect.right > cactusRect.left &&
            dinoRect.left < cactusRect.right &&
            dinoRect.bottom > cactusRect.top &&
            parseInt(dino.style.bottom) < 60
        ) {
            gameOver();
        }
    }, 20);

    function gameOver() {
        gameRunning = false;
        gameOverElement.classList.remove('hidden');
    }

    restartButton.addEventListener('click', () => {
        gameOverElement.classList.add('hidden');
        score = 0;
        scoreElement.textContent = score;
        cactusPosition = 800;
        cactus.style.left = cactusPosition + 'px';
        gameRunning = true;
    });
}