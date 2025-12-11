// Venter til hele HTML-siden er lastet inn før vi kjører JavaScript-koden
document.addEventListener("DOMContentLoaded", () => {
  // Henter knappen med id "download-knapp" fra side2.html
  const downloadButton = document.getElementById("download-knapp");

  // Hvis vi ikke finner knappen, gjør vi ingenting (unngår feil i konsollen)
  if (!downloadButton) return;

  // Legger til en "click"-hendelse på knappen
  downloadButton.addEventListener("click", () => {
    // 1) Velg filen som skal lastes ned (sti til filen i prosjektet ditt)
    const fileUrl = "/img/DT-Julerebus.png"; // Eksempel-fil, bytt til ønsket fil

    // 2) Lager et midlertidig <a>-element som vi bruker for å starte nedlastingen
    const a = document.createElement("a");
    a.href = fileUrl;

    // 3) Setter et foreslått filnavn når brukeren laster ned
    a.download = fileUrl.split("/").pop();

    // 4) Legger lenken inn i dokumentet, klikker på den med kode og fjerner den igjen
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // 5) Viser et enkelt popup-varsel til brukeren om at nedlastingen er startet
    alert("Nedlasting av fil er startet!");
  });
});
