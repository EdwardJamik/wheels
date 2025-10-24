const wheel = document.getElementById("wheel");
const spinButton = document.getElementById("spinButton");
const fieldset = document.querySelector(".ui-wheel-of-fortune");

let isSpinning = false;
let previousEndDegree = 0;
let spinCount = 0;

// Ті самі написи, що й у HTML
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

// --- Дістаємо subscriber_id з URL ---
function getSubscriberId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("user_id") || "1234567890";
}

async function sendManyChat(subscriberId) {
  const fieldId = 13791636;
  try {
    
    const response = await fetch("https://api.manychat.com/fb/subscriber/setCustomField", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer 774169532447049:594ede525b07c459c4f96614d4f1be96"
      },
      body: JSON.stringify({
        subscriber_id: subscriberId,
        field_id: fieldId,
        field_value: "done"
      })
    });
    const data = await response.json();
    console.log("✅ ManyChat response:", data);
  } catch (err) {
    console.error("❌ Помилка при надсиланні API:", err);
  }
}

function handleSpin() {
  if (isSpinning) return;
  isSpinning = true;

  spinButton.classList.remove("active");
  fieldset.classList.remove("active");

  let prizeIndex, double = 0;

  // --- Контроль результатів ---
  if (spinCount === 0) {
    // перший раз — "Zatočit znovu 🔁"
    prizeIndex = prizes.findIndex(p => p.includes("Zatočit znovu"));
    double = 200
  } else if (spinCount === 1) {
    // другий раз — "2×VĚTŠÍ ŠANCE 💰"
    prizeIndex = prizes.findIndex(p => p.includes("2×VĚTŠÍ ŠANCE"));
      double = 128
  } else {
    prizeIndex = Math.floor(Math.random() * prizes.length);
  }

  // ⚙️ Обчислення правильного кута для реального сектору
  // Колесо обертається за годинниковою, а сектори йдуть проти
  // Тому розрахунок робимо з інверсією
  const targetAngle = double - (prizeIndex * segmentAngle + segmentAngle / 2);

  const spins = 5;
  const newEndDegree = previousEndDegree + spins * double + targetAngle;
  previousEndDegree = newEndDegree;

  wheel.style.transition = "transform 6s cubic-bezier(0.44, -0.205, 0, 1.13)";
  wheel.style.transform = `rotate(${newEndDegree}deg)`;

  setTimeout(async () => {
    isSpinning = false;
    fieldset.classList.add("active");

    const prize = prizes[prizeIndex];

    if (prize.includes("Zatočit znovu")) {
      spinCount++;
      spinButton.classList.add("active"); // можна ще один спін
    } else if (prize.includes("2×VĚTŠÍ ŠANCE")) {
      spinCount++;
      spinButton.classList.remove("active");

      const subscriberId = getSubscriberId();
      await sendManyChat(subscriberId); // відправка в ManyChat
    } else {
      spinButton.classList.add("active");
    }
  }, 6000);
}

spinButton.addEventListener("click", handleSpin);
