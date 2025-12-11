// Enkel innloggingslogikk for innlogging.html
// Bytt denne strengen til det passordet du ønsker å bruke
const RIKTIG_PASSORD = "jul2024";

document.addEventListener("DOMContentLoaded", () => {
  const skjema = document.getElementById("login-skjema");
  const passordInput = document.getElementById("passord");
  const feilMelding = document.getElementById("feil-melding");

  if (!skjema || !passordInput || !feilMelding) return;

  skjema.addEventListener("submit", (event) => {
    event.preventDefault(); // Hindrer at siden laster inn på nytt

    const skrevetPassord = passordInput.value;

    if (skrevetPassord === RIKTIG_PASSORD) {
      // Riktig passord: send brukeren videre til "hemmelig" side
      // Bytt URL under til siden de skal inn på
      window.location.href = "../index.html";
    } else {
      // Feil passord: vis en feilmelding
      feilMelding.textContent = "Feil passord. Prøv igjen.";
      passordInput.value = "";
      passordInput.focus();
    }
  });
});
