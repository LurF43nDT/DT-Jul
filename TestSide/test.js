// Data struktur for å holde oversikt
let currentUser = "";
let userData = {};

// Liste over tilgjengelige oppgaver (speiler mappene i TasksFiles/)
const TASKS = [
  { id: 1, name: "Matematisk Juletraume" },
  { id: 2, name: "Vanvettig god jul" },
  { id: 3, name: "Present Hunt" },
  { id: 4, name: "Lydbølger" },
  { id: 5, name: "Fellesnevner" },
  { id: 6, name: "My eye spy" },
  { id: 7, name: "Bestemors Kjøkken" },
  { id: 8, name: "Grinch-rebus" },
  { id: 9, name: "Web Puzzle" },
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

// Lagre og hent slutt-passord lokalt
function saveFinalPassword(value) {
  localStorage.setItem("finalPassword", value);
}

function loadFinalPassword() {
  return localStorage.getItem("finalPassword") || "";
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

// Last inn data ved oppstart
loadData();
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
  const input = document.getElementById("finalPasswordInput");
  if (!input) return;
  const value = input.value.trim();
  if (!value) {
    alert("Skriv inn passordet før du sender inn.");
    return;
  }
  saveFinalPassword(value);
  alert("Passord lagret! Du kan lukke eller oppdatere siden uten å miste det.");
}
