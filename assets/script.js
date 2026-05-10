const welcome = document.getElementById("welcome");
const page = document.getElementById("page");
const avatarBtn = document.getElementById("avatarBtn");
const canvas = document.getElementById("bgCanvas");
const ctx = canvas.getContext("2d", { alpha: true });

const secretOverlay = document.getElementById("secret-overlay");
const closeSecretBtn = document.getElementById("closeSecret");
const sigAvatar = document.getElementById("sigAvatar");

function showPage() {
  setTimeout(() => {
    welcome?.classList.add("hide");
    page?.classList.add("ready");
  }, 1200);

  setTimeout(() => {
    if (welcome) welcome.style.display = "none";
  }, 1600);
}
showPage();

function fitCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(window.innerWidth * dpr);
  canvas.height = Math.floor(window.innerHeight * dpr);
  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
fitCanvas();
window.addEventListener("resize", fitCanvas);

const palette = [
  [255, 77, 77],
  [88, 101, 242],
  [37, 211, 102],
  [225, 48, 108],
  [255, 188, 92],
  [128, 133, 255]
];

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const isMobile = matchMedia("(max-width: 760px)").matches;
const particles = [];
const particleCount = isMobile ? 28 : 52;

for (let i = 0; i < particleCount; i++) {
  const c = pick(palette);
  particles.push({
    x: rand(0, window.innerWidth),
    y: rand(0, window.innerHeight),
    vx: rand(-0.16, 0.16),
    vy: rand(-0.1, 0.1),
    r: rand(1.1, 3.2),
    a: rand(0.08, 0.26),
    color: `rgba(${c[0]},${c[1]},${c[2]},`,
    drift: rand(0.004, 0.014)
  });
}

function animateCanvas() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;

    p.vx += Math.sin((p.y + p.x) * p.drift) * 0.003;
    p.vy += Math.cos((p.x - p.y) * p.drift) * 0.003;

    if (p.x < -20) p.x = window.innerWidth + 20;
    if (p.x > window.innerWidth + 20) p.x = -20;
    if (p.y < -20) p.y = window.innerHeight + 20;
    if (p.y > window.innerHeight + 20) p.y = -20;

    ctx.beginPath();
    ctx.fillStyle = p.color + p.a + ")";
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  }

  requestAnimationFrame(animateCanvas);
}
animateCanvas();

function createBurst(x, y, count = 18) {
  const colors = [
    "#ff4d4d",
    "#ffb36b",
    "#5865F2",
    "#25D366",
    "#E1306C",
    "#1877F2",
    "#FFFC00",
    "#1DB954"
  ];

  for (let i = 0; i < count; i++) {
    const el = document.createElement("span");
    const size = 5 + Math.random() * 8;
    const dx = (Math.random() * 240 - 120).toFixed(1) + "px";
    const dy = (Math.random() * 220 - 120).toFixed(1) + "px";
    const rot = (Math.random() * 760 - 380).toFixed(1) + "deg";
    const shape = Math.random() > 0.72 ? "circle" : Math.random() > 0.5 ? "star" : "rect";

    el.className = `burst-piece ${shape}`;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.width = `${size}px`;
    el.style.height = `${size + Math.random() * 8}px`;
    el.style.background = pick(colors);
    el.style.setProperty("--dx", dx);
    el.style.setProperty("--dy", dy);
    el.style.setProperty("--rot", rot);

    document.body.appendChild(el);
    el.addEventListener("animationend", () => el.remove());
  }
}

function tapPulse(btn) {
  btn.classList.remove("pulse");
  void btn.offsetWidth;
  btn.classList.add("pulse");
}

function openSecret() {
  if (!secretOverlay) return;
  secretOverlay.hidden = false;
  requestAnimationFrame(() => {
    secretOverlay.classList.add("is-open");
  });
  document.body.classList.add("no-scroll");
}

function closeSecret() {
  if (!secretOverlay) return;
  secretOverlay.classList.remove("is-open");
  document.body.classList.remove("no-scroll");

  setTimeout(() => {
    secretOverlay.hidden = true;
  }, 220);
}

let avatarClicks = 0;
let avatarTimer = null;

avatarBtn?.addEventListener("click", (e) => {
  tapPulse(avatarBtn);
  createBurst(e.clientX || window.innerWidth / 2, e.clientY || window.innerHeight / 2, 18);

  avatarClicks++;
  clearTimeout(avatarTimer);

  avatarTimer = setTimeout(() => {
    avatarClicks = 0;
  }, 600);

  if (avatarClicks === 3) {
    avatarClicks = 0;
    openSecret();
  }
});

closeSecretBtn?.addEventListener("click", closeSecret);

secretOverlay?.addEventListener("click", (e) => {
  if (e.target === secretOverlay) closeSecret();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeSecret();
});

document.querySelectorAll(".card-link").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width) * 100;
    const my = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty("--mx", `${mx}%`);
    card.style.setProperty("--my", `${my}%`);
  });

  card.addEventListener("mouseenter", () => {
    document.querySelectorAll(".card-link.selected").forEach((x) => x.classList.remove("selected"));
    card.classList.add("selected");
  });

  card.addEventListener("click", (e) => {
    e.preventDefault();

    document.querySelectorAll(".card-link.selected").forEach((x) => x.classList.remove("selected"));
    card.classList.add("selected");

    createBurst(e.clientX || window.innerWidth / 2, e.clientY || window.innerHeight / 2, 24);

    const link = card.dataset.link || card.href;
    setTimeout(() => {
      window.location.href = link;
    }, 140);
  });
});

window.addEventListener("pointerdown", (e) => {
  if (e.target.closest(".card-link") || e.target.closest(".profile-trigger") || e.target.closest("#secret-overlay")) return;
  createBurst(e.clientX, e.clientY, 10);
});

sigAvatar?.addEventListener("click", (e) => {
  sigAvatar.classList.remove("pressed");
  void sigAvatar.offsetWidth;
  sigAvatar.classList.add("pressed");
});