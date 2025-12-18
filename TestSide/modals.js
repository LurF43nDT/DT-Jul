// This file contains the setup functions for the image modals.

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

// Enkel bilde-modal for Hint Grid
function setupHintGridModal() {
  const icon = document.getElementById("hintGridIcon");
  const modal = document.getElementById("simpleImageModal");
  const modalImg = document.getElementById("simpleModalImg");
  const closeBtn = document.getElementById("simpleModalClose");
  if (!icon || !modal || !modalImg || !closeBtn) return;

  function openModal() {
    modalImg.src = icon.src; // Sett bildekilden til modalen
    modal.classList.add("open");
  }

  function closeModal() {
    modal.classList.remove("open");
  }

  icon.addEventListener("click", openModal);
  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
}

function showSuccessPopup() {
  const modal = createModal("successModal", `
    <img src="./public/RightPassword.gif" alt="Correct Password" style="max-width: 100%; border-radius: 10px;">
  `);
  document.body.appendChild(modal);
  modal.classList.add("open");
}

function showErrorPopup() {
  const modal = createModal("errorModal", `
    <video src="./public/slått-kattepus.mp4" autoplay muted loop style="max-width: 100%; border-radius: 10px;"></video>
  `);
  document.body.appendChild(modal);
  modal.classList.add("open");
}

function createModal(id, content) {
  const modal = document.createElement("div");
  modal.id = id;
  modal.classList.add("simple-modal");
  modal.innerHTML = `
    <div class="simple-modal__content">
      <button class="simple-modal__close" aria-label="Lukk">&times;</button>
      ${content}
    </div>
  `;
  const closeBtn = modal.querySelector(".simple-modal__close");
  closeBtn.addEventListener("click", () => closeModal(modal));
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal(modal);
  });
  return modal;
}

function closeModal(modal) {
  modal.classList.remove("open");
  setTimeout(() => {
    modal.remove();
  }, 300);
}