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
}

// Jeu du Dinosaure
function startGame() {
    const dino = document.getElementById('dino');
    const cactus = document.getElementById('cactus');
    const scoreElement = document.getElementById('score');
    const gameOverElement = document.getElementById('game-over');
    const restartButton = document.getElementById('restart');

    let score = 0;
    let isJumping = false;
    let gameRunning = true;

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
    let cactusPosition = 800;
    const cactusMove = setInterval(() => {
        if (!gameRunning) return;

        cactusPosition -= 5;
        cactus.style.right = cactusPosition + 'px';

        if (cactusPosition < -20) {
            cactusPosition = 800;
            score++;
            scoreElement.textContent = score;
        }

        // Collision
        if (
            cactusPosition > 480 &&
            cactusPosition < 520 &&
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
        cactus.style.right = cactusPosition + 'px';
        gameRunning = true;
    });
}