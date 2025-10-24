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

function getChatType() {
  const params = new URLSearchParams(window.location.search);
  return params.get("chat") || "fb";
}

function showPrizePopup(prize) {
  prizeText.textContent = prize;
  prizeOverlay.classList.add("show");
  
  setTimeout(() => {
    prizeOverlay.classList.remove("show");
  }, 3000);
}

function openInApp(url) {
  // Створюємо тимчасове посилання
  const link = document.createElement('a');
  link.href = url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  
  // Додаємо в DOM, клікаємо і видаляємо
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