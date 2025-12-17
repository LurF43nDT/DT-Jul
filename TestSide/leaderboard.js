// Enkel toppliste basert på fullførte oppgaver per bruker
function updateLeaderboard(userData) {
  const container = document.getElementById("leaderboardList");
  if (!container) return;

  const totalTasks =
    typeof TASKS !== "undefined" && Array.isArray(TASKS)
      ? TASKS.length
      : 7;
  const sortedUsers = Object.entries(userData)
    .map(([name, data]) => ({
      name,
      completed: Array.isArray(data.completedTasks)
        ? data.completedTasks.length
        : 0,
    }))
    .sort((a, b) => b.completed - a.completed || a.name.localeCompare(b.name));

  container.innerHTML = "";

  if (sortedUsers.length === 0) {
    container.innerHTML =
      '<div class="user-item"><div class="user-name">Ingen deltakere ennå</div></div>';
    return;
  }

  sortedUsers.forEach((user, index) => {
    const percentage = Math.round((user.completed / totalTasks) * 100);
    const item = document.createElement("div");
    item.className = "user-item";
    item.innerHTML = `
      <div class="user-name">#${index + 1} ${user.name}</div>
      <div class="progress-bar-container">
        <div class="progress-bar" style="width: ${percentage}%;">
          ${user.completed}/${totalTasks} oppgaver (${percentage}%)
        </div>
      </div>
    `;
    container.appendChild(item);
  });
}

