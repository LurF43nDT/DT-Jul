// This file contains functions related to UI manipulation and page navigation.

// Sidenavigasjon
function showPage(pageId) {
  document.querySelectorAll(".page").forEach((page) => {
    page.classList.remove("active");
  });
  document.getElementById(pageId).classList.add("active");
  hideMenu();
  window.scrollTo(0, 0);
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