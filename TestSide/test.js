// Data struktur for å holde oversikt
let currentUser = "";
let userData = {};

// Liste over tilgjengelige oppgaver (speiler mappene i TasksFiles/)
const TASKS = [
  { id: 1, name: "Stian" },
  { id: 2, name: "Lucifer" },
  { id: 3, name: "Simon" },
  { id: 4, name: "Ken" },
  { id: 5, name: "Andrea" },
  { id: 6, name: "Håkon" },
];

console.log("JavaScript loaded successfully!");

// Last inn data fra localStorage hvis tilgjengelig
function loadData() {
  const saved = localStorage.getItem("christmasProgress");
  if (saved) {
    userData = JSON.parse(saved);
  }
}

// Lagre data til localStorage
function saveData() {
  localStorage.setItem("christmasProgress", JSON.stringify(userData));
}
// Sidenavigasjon
function showPage(pageId) {
  document.querySelectorAll(".page").forEach((page) => {
    page.classList.remove("active");
  });
  document.getElementById(pageId).classList.add("active");
  hideMenu();
  window.scrollTo(0, 0);
}

// Håndter innlogging
function handleLogin(event) {
  event.preventDefault();
  const username = document.getElementById("username").value;

  if (!username.trim()) {
    alert("Skriv inn navnet ditt for å komme i gang.");
    return;
  }

  currentUser = username.trim();

  // Opprett bruker hvis de ikke eksisterer
  if (!userData[currentUser]) {
    userData[currentUser] = {
      completedTasks: [],
    };
    saveData();
  }

  alert("Velkommen, " + currentUser + "! 🎄");
  showPage("home");
  updateProgressPage();
}

// Marker oppgave som fullført
function completeTask(taskNumber) {
  if (!currentUser) {
    alert("Du må logge inn først!");
    showPage("login");
    return;
  }

  if (!userData[currentUser].completedTasks.includes(taskNumber)) {
    userData[currentUser].completedTasks.push(taskNumber);
    saveData();
    updateProgressPage();
    alert("🎉 Gratulerer! Oppgave " + taskNumber + " er fullført!");

    // Oppdater knappen visuelt
    const btn = event.target;
    btn.classList.add("completed");
    btn.innerHTML = "✓ Fullført!";
  } else {
    alert("Du har allerede fullført denne oppgaven! 🎄");
  }
}

// Oppdater oversiktssiden
function updateProgressPage() {
  loadData();

  const userList = document.getElementById("userProgressList");
  const totalUsers = Object.keys(userData).length;
  const totalTasks = TASKS.length;
  let totalCompleted = 0;

  userList.innerHTML = "";

  // Generer liste over alle brukere og deres fremdrift
  for (let username in userData) {
    const user = userData[username];
    const completed = user.completedTasks.length;
    const percentage =
      totalTasks > 0 ? Math.round((completed / totalTasks) * 100) : 0;
    totalCompleted += completed;

    const userItem = document.createElement("div");
    userItem.className = "user-item";

    let badges = "";
    TASKS.forEach((task) => {
      const isCompleted = user.completedTasks.includes(task.id);
      badges += `<span class="task-badge ${isCompleted ? "" : "incomplete"}">${
        isCompleted ? "✓" : "○"
      } ${task.name}</span>`;
    });

    userItem.innerHTML = `
                  <div class="user-name">${username}</div>
                  <div class="progress-bar-container">
                      <div class="progress-bar" style="width: ${percentage}%">
                          ${percentage}%
                      </div>
                  </div>
                  <div class="completed-tasks">
                      ${badges}
                  </div>
              `;

    userList.appendChild(userItem);
  }

  // Oppdater statistikk
  document.getElementById("totalUsers").textContent = totalUsers;
  document.getElementById("totalCompleted").textContent = totalCompleted;
  const completionRate =
    totalUsers > 0
      ? Math.round((totalCompleted / (totalUsers * totalTasks)) * 100)
      : 0;
  document.getElementById("completionRate").textContent = completionRate + "%";

  // Oppdater topp-listen dersom leaderboard.js er lastet
  if (typeof updateLeaderboard === "function") {
    updateLeaderboard(userData);
  }
}

// Header-meny
function toggleMenu(event) {
  event.preventDefault();
  const menu = document.getElementById("headerMenu");
  const trigger = event.currentTarget;
  const isOpen = menu.classList.toggle("open");
  trigger.setAttribute("aria-expanded", isOpen);
}

function hideMenu() {
  const menu = document.getElementById("headerMenu");
  const trigger = document.querySelector(".menu-trigger");
  if (!menu || !trigger) return;
  menu.classList.remove("open");
  trigger.setAttribute("aria-expanded", "false");
}

document.addEventListener("click", (event) => {
  const menu = document.getElementById("headerMenu");
  const trigger = document.querySelector(".menu-trigger");
  if (!menu || !trigger) return;
  if (!menu.contains(event.target) && !trigger.contains(event.target)) {
    hideMenu();
  }
});

// Last inn data ved oppstart
loadData();
updateProgressPage();
setupAndreaImageModal();

// Snøeffekt
function createSnowflake() {
  console.log("Creating snowflake...");
  const snowflake = document.createElement("div");
  snowflake.classList.add("snowflake");
  snowflake.innerHTML = "❄";
  snowflake.style.left = Math.random() * 100 + "%";
  snowflake.style.animationDuration = Math.random() * 3 + 2 + "s";
  snowflake.style.opacity = Math.random();
  snowflake.style.fontSize = Math.random() * 10 + 10 + "px";

  document.body.appendChild(snowflake);
  console.log("Snowflake added to body");

  setTimeout(() => {
    snowflake.remove();
  }, 5000);
}

setInterval(createSnowflake, 300);

// Fullskjerm og zoom for Andrea-bildet
function setupAndreaImageModal() {
  const preview = document.getElementById("andreaPreview");
  const modal = document.getElementById("imageModal");
  const fullImg = document.getElementById("andreaFullImg");
  const closeBtn = document.getElementById("imageModalClose");
  if (!preview || !modal || !fullImg || !closeBtn) return;

  let scale = 1;
  let translate = { x: 0, y: 0 };
  let dragging = false;
  let dragStart = { x: 0, y: 0 };

  function applyTransform() {
    fullImg.style.transform = `translate(${translate.x}px, ${translate.y}px) scale(${scale})`;
  }

  function resetTransform() {
    scale = 1;
    translate = { x: 0, y: 0 };
    applyTransform();
  }

  function openModal() {
    resetTransform();
    modal.classList.add("open");
  }

  function closeModal() {
    modal.classList.remove("open");
  }

  preview.addEventListener("click", openModal);
  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  fullImg.addEventListener("wheel", (e) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.1 : -0.1;
    scale = Math.min(Math.max(1, scale + delta), 4);
    applyTransform();
  });

  fullImg.addEventListener("pointerdown", (e) => {
    dragging = true;
    dragStart = {
      x: e.clientX - translate.x,
      y: e.clientY - translate.y,
    };
    fullImg.setPointerCapture(e.pointerId);
  });

  fullImg.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    translate = {
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    };
    applyTransform();
  });

  fullImg.addEventListener("pointerup", (e) => {
    dragging = false;
    fullImg.releasePointerCapture(e.pointerId);
  });

  fullImg.addEventListener("dblclick", () => {
    resetTransform();
  });
}
