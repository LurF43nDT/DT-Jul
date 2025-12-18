// Data struktur for å holde oversikt
let currentUser = "";
let userData = {};

// Last inn nåværende bruker fra localStorage
function loadCurrentUser() {
  const saved = localStorage.getItem("currentUser");
  if (saved) {
    currentUser = saved;
  }
}

// Lagre nåværende bruker til localStorage
function saveCurrentUser() {
  localStorage.setItem("currentUser", currentUser);
}

// Liste over tilgjengelige oppgaver (speiler mappene i TasksFiles/)
const TASKS = [
  { id: 1, name: "Matematisk Juletraume" },
  { id: 2, name: "Vanvettig god jul" },
  { id: 3, name: "Present Hunt" },
  { id: 4, name: "Lydbølger" },
  { id: 5, name: "Fellesnevner" },
  { id: 6, name: "My eye spy" },
  { id: 7, name: "Bestemors Kjøkken" },
  { id: 8, name: "Hueville" },
  { id: 9, name: "Web Puzzle" },
];

console.log("JavaScript loaded successfully!");

// Last inn data fra localStorage hvis tilgjengelig
function loadData() {
  const saved = localStorage.getItem("christmasProgress");
  if (saved) {
    userData = JSON.parse(saved);
  }
  loadCurrentUser();
}

// Lagre data til localStorage
function saveData() {
  localStorage.setItem("christmasProgress", JSON.stringify(userData));
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
  saveCurrentUser();

  // Opprett bruker hvis de ikke eksisterer
  if (!userData[currentUser]) {
    userData[currentUser] = {
      completedTasks: [],
    };
    saveData();
  }

  alert("Velkommen, " + currentUser + "! 🎄");
  showPage("tasks");
  updateProgressPage();
  updateTaskButtonStates();
}

// Marker eller fjern markering av oppgave som fullført
function completeTask(taskNumber, event) {
  if (!currentUser) {
    alert("Du må logge inn først!");
    showPage("login");
    return;
  }

  const btn = event.target;
  const isCompleted = userData[currentUser].completedTasks.includes(taskNumber);

  if (isCompleted) {
    // Fjern fra fullførte oppgaver
    userData[currentUser].completedTasks = userData[
      currentUser
    ].completedTasks.filter((id) => id !== taskNumber);
    saveData();
    updateProgressPage();

    // Oppdater knappen visuelt
    btn.classList.remove("completed");
    btn.innerHTML = "✓ Marker som gjort";

    alert("Oppgave " + taskNumber + " er ikke lenger markert som fullført.");
  } else {
    // Legg til som fullført
    userData[currentUser].completedTasks.push(taskNumber);
    saveData();
    updateProgressPage();

    // Oppdater knappen visuelt
    btn.classList.add("completed");
    btn.innerHTML = "✓ Fullført!";

    alert("🎉 Gratulerer! Oppgave " + taskNumber + " er fullført!");
  }
}

// Oppdater knappestater basert på lagrede data
function updateTaskButtonStates() {
  if (!currentUser) return;

  for (let i = 1; i <= TASKS.length; i++) {
    const btn = document.querySelector(`#task${i} .complete-btn`);
    if (btn) {
      const isCompleted = userData[currentUser].completedTasks.includes(i);
      if (isCompleted) {
        btn.classList.add("completed");
        btn.innerHTML = "✓ Fullført!";
      } else {
        btn.classList.remove("completed");
        btn.innerHTML = "✓ Marker som gjort";
      }
    }
  }
}

// Last inn data ved oppstart
loadData();

// Sjekk om bruker allerede er logget inn
if (currentUser && userData[currentUser]) {
  showPage("tasks");
  updateTaskButtonStates();
} else {
  showPage("home"); // Vis hjemmesiden hvis ikke logget inn
}

updateProgressPage();
setupHintGridModal();
setupAndreaImageModal();

// Download funksjon
function downloadFile(filename, content) {
  const element = document.createElement("a");
  const file = new Blob([content], { type: "text/plain" });
  element.href = URL.createObjectURL(file);
  element.download = filename;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

// Håndter innsending av slutt-passord
function submitFinalPassword(event) {
  event.preventDefault();
  const RIKTIG_PASSORD_HASH =
    "2230a7fbc1c746aa0107d9d16db637fd9b20eb632ef5ae42cca6f5ba861b16e8";
  const input = document.getElementById("finalPasswordInput");
  if (!input) return;
  const value = input.value.trim();
  if (!value) {
    alert("Skriv inn passordet før du sender inn.");
    return;
  }
  if (Sha256.hash(value.toLowerCase()) === RIKTIG_PASSORD_HASH) {
    showSuccessPopup();
  } else {
    showErrorPopup();
  }
}
