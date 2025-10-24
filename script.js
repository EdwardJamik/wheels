const wheel = document.getElementById("wheel");
const spinButton = document.getElementById("spinButton");
const fieldset = document.querySelector(".ui-wheel-of-fortune");
const prizeOverlay = document.getElementById("prizeOverlay");
const prizeText = document.getElementById("prizeText");

let isSpinning = false;
let previousEndDegree = 0;
let spinCount = 0;
let isGameFinished = false;

const prizes = [
  "5 % Sleva 💸",
  "Zatočit znovu 🔁",
  "2×VĚTŠÍ ŠANCE 💰",
  "1 Šance navíc 🎯",
  "Smůla 💩",
  "5 % Sleva 💸",
  "Zatočit znovu 🔁",
  "Smůla 💩",
  "1 Šance navíc 🎯",
  "Smůla 💩"
];

const segmentAngle = 360 / prizes.length;

const chatLinks = {
  inst: "https://ig.me/m/pekelnavyzva.cz?ref=fortune-wheel",
  tiktok: "https://tiktok.me/pekelnavyzva_cz?ref=w45935623&message=%E2%80%8C%EF%BB%BF%E2%80%8C%EF%BB%BF%E2%80%8B%EF%BB%BF%E2%80%8C%E2%80%8B%E2%80%8B%EF%BB%BF%E2%80%8C%E2%80%8C%E2%80%8B%EF%BB%BF%E2%80%8D%E2%80%8C%E2%80%8B%EF%BB%BF%E2%80%8B%EF%BB%BF%E2%80%8B%EF%BB%BF%E2%80%8C%E2%80%8C%E2%80%8B%EF%BB%BF%E2%80%8C%E2%80%8D%E2%80%8B%EF%BB%BF%E2%80%8B%E2%80%8D%E2%80%8B%EF%BB%BF%E2%80%8B%EF%BB%BFVYZVEDNOUT%20D%C3%81REK",
  fb: "https://m.me/774169532447049?ref=fortune-wheel",
  whatsapp: "https://wa.me/your_phone_number"
};

// Функція створення конфеті
function createConfetti() {
  const confettiContainer = document.createElement('div');
  confettiContainer.className = 'confetti-container';
  confettiContainer.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 10000;
    overflow: hidden;
  `;
  document.body.appendChild(confettiContainer);

  const colors = ['#FFD700', '#FF6347', '#4169E1', '#32CD32', '#FF69B4', '#FFA500', '#9370DB', '#00CED1'];
  const confettiCount = 150;

  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    const size = Math.random() * 10 + 5;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const left = Math.random() * 100;
    const animationDuration = Math.random() * 3 + 2;
    const delay = Math.random() * 0.5;
    const rotation = Math.random() * 360;
    const rotationSpeed = Math.random() * 360 + 180;

    confetti.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      background-color: ${color};
      left: ${left}%;
      top: -10%;
      opacity: 0;
      animation: confettiFall ${animationDuration}s ease-in ${delay}s forwards,
                 confettiRotate ${animationDuration}s linear ${delay}s infinite;
      transform: rotate(${rotation}deg);
      border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
    `;

    confettiContainer.appendChild(confetti);
  }

  // Додаємо анімації
  if (!document.getElementById('confetti-styles')) {
    const style = document.createElement('style');
    style.id = 'confetti-styles';
    style.textContent = `
      @keyframes confettiFall {
        0% {
          top: -10%;
          opacity: 1;
        }
        100% {
          top: 110%;
          opacity: 0;
        }
      }
      
      @keyframes confettiRotate {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Видаляємо конфеті через 5 секунд
  setTimeout(() => {
    confettiContainer.remove();
  }, 5000);
}

// Функція створення спалахів світла
function createSparkles() {
  const sparkleContainer = document.createElement('div');
  sparkleContainer.className = 'sparkle-container';
  sparkleContainer.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    width: 300px;
    height: 300px;
    transform: translate(-50%, -50%);
    pointer-events: none;
    z-index: 9998;
  `;
  document.body.appendChild(sparkleContainer);

  for (let i = 0; i < 20; i++) {
    const sparkle = document.createElement('div');
    const angle = (Math.PI * 2 * i) / 20;
    const distance = 150;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;

    sparkle.style.cssText = `
      position: absolute;
      width: 4px;
      height: 4px;
      background: white;
      border-radius: 50%;
      box-shadow: 0 0 10px 2px rgba(255, 255, 255, 0.8);
      left: 50%;
      top: 50%;
      animation: sparkleOut 1s ease-out forwards;
      animation-delay: ${i * 0.05}s;
    `;

    sparkleContainer.appendChild(sparkle);
  }

  if (!document.getElementById('sparkle-styles')) {
    const style = document.createElement('style');
    style.id = 'sparkle-styles';
    style.textContent = `
      @keyframes sparkleOut {
        0% {
          transform: translate(0, 0) scale(1);
          opacity: 1;
        }
        100% {
          transform: translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px) scale(0);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }

  setTimeout(() => {
    sparkleContainer.remove();
  }, 2000);
}

// Функція пульсації тексту виграшу
function animatePrizeText() {
  if (!document.getElementById('prize-pulse-styles')) {
    const style = document.createElement('style');
    style.id = 'prize-pulse-styles';
    style.textContent = `
      @keyframes prizePulse {
        0%, 100% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.1);
        }
      }
      
      @keyframes prizeGlow {
        0%, 100% {
          text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
        }
        50% {
          text-shadow: 0 0 20px rgba(255, 215, 0, 0.8),
                       0 0 40px rgba(255, 215, 0, 0.6),
                       2px 2px 8px rgba(0, 0, 0, 0.3);
        }
      }
      
      .prize-popup h2.animated {
        animation: prizePulse 0.6s ease-in-out 3,
                   prizeGlow 1s ease-in-out 3;
      }
    `;
    document.head.appendChild(style);
  }
  
  prizeText.classList.add('animated');
  setTimeout(() => {
    prizeText.classList.remove('animated');
  }, 3000);
}

function getChatType() {
  const params = new URLSearchParams(window.location.search);
  return params.get("chat") || "fb";
}

function showPrizePopup(prize) {
  prizeText.textContent = prize;
  prizeOverlay.classList.add("show");
  
  // Запускаємо всі ефекти
  createConfetti();
  createSparkles();
  animatePrizeText();
  
  // Додаємо вібрацію (якщо підтримується)
  if ('vibrate' in navigator) {
    navigator.vibrate([200, 100, 200]);
  }
  
  setTimeout(() => {
    prizeOverlay.classList.remove("show");
  }, 3000);
}

function openInApp(url) {
  const link = document.createElement('a');
  link.href = url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function convertButtonToLink() {
  const chatType = getChatType();
  const link = chatLinks[chatType] || chatLinks.fb;
  
  isGameFinished = true;
  
  spinButton.textContent = "VYZVEDNOUT DÁREK";
  spinButton.classList.add("prize-link");
  
  spinButton.removeEventListener("click", handleSpin);
  
  spinButton.onclick = function(e) {
    e.preventDefault();
    openInApp(link);
  };
}

function handleSpin() {
  if (isSpinning || isGameFinished) return;
  isSpinning = true;

  spinButton.classList.remove("active");
  fieldset.classList.remove("active");

  let prizeIndex, double = 0;

  if (spinCount === 0) {
    prizeIndex = prizes.findIndex(p => p.includes("Zatočit znovu"));
    double = 200;
  } else if (spinCount === 1) {
    prizeIndex = prizes.findIndex(p => p.includes("2×VĚTŠÍ ŠANCE"));
    double = 128;
  } else {
    prizeIndex = Math.floor(Math.random() * prizes.length);
  }

  const targetAngle = double - (prizeIndex * segmentAngle + segmentAngle / 2);
  const spins = 5;
  const newEndDegree = previousEndDegree + spins * double + targetAngle;
  previousEndDegree = newEndDegree;

  wheel.style.transition = "transform 6s cubic-bezier(0.44, -0.205, 0, 1.13)";
  wheel.style.transform = `rotate(${newEndDegree}deg)`;

  setTimeout(() => {
    isSpinning = false;
    fieldset.classList.add("active");

    const prize = prizes[prizeIndex];
    
    showPrizePopup(prize);

    if (prize.includes("Zatočit znovu")) {
      spinCount++;
      setTimeout(() => {
        spinButton.classList.add("active");
      }, 3000);
    } else if (prize.includes("2×VĚTŠÍ ŠANCE")) {
      spinCount++;
      setTimeout(() => {
        convertButtonToLink();
        spinButton.classList.add("active");
      }, 3000);
    } else {
      setTimeout(() => {
        spinButton.classList.add("active");
      }, 3000);
    }
  }, 6000);
}

spinButton.addEventListener("click", handleSpin);