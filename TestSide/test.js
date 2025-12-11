// Data struktur for å holde oversikt
let currentUser = "";
let userData = {};

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
  window.scrollTo(0, 0);
}

// Håndter innlogging
function handleLogin(event) {
  event.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // Her kan du legge til ekte autentisering senere
  if (username && password) {
    currentUser = username;

    // Opprett bruker hvis de ikke eksisterer
    if (!userData[username]) {
      userData[username] = {
        completedTasks: [],
      };
      saveData();
    }

    // Simuler vellykket innlogging
    alert("Velkommen, " + username + "! 🎄");
    showPage("home");
    updateProgressPage();
  }
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
  const totalTasks = 7;
  let totalCompleted = 0;

  userList.innerHTML = "";

  // Generer liste over alle brukere og deres fremdrift
  for (let username in userData) {
    const user = userData[username];
    const completed = user.completedTasks.length;
    const percentage = Math.round((completed / totalTasks) * 100);
    totalCompleted += completed;

    const userItem = document.createElement("div");
    userItem.className = "user-item";

    let badges = "";
    for (let i = 1; i <= totalTasks; i++) {
      const isCompleted = user.completedTasks.includes(i);
      badges += `<span class="task-badge ${isCompleted ? "" : "incomplete"}">${
        isCompleted ? "✓" : "○"
      } Oppgave ${i}</span>`;
    }

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
}

// Last inn data ved oppstart
loadData();
updateProgressPage();

// Snøeffekt
function createSnowflake() {
  const snowflake = document.createElement("div");
  snowflake.classList.add("snowflake");
  snowflake.innerHTML = "❄";
  snowflake.style.left = Math.random() * 100 + "%";
  snowflake.style.animationDuration = Math.random() * 3 + 2 + "s";
  snowflake.style.opacity = Math.random();
  snowflake.style.fontSize = Math.random() * 10 + 10 + "px";

  document.body.appendChild(snowflake);

  setTimeout(() => {
    snowflake.remove();
  }, 5000);
}

setInterval(createSnowflake, 300);
