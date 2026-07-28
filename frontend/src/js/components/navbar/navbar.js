/**
 * navbarGlobal.js
 * Handles the user dropdown toggle and sidebar menu toggle
 * for the global navbar component.
 */

function initNavbarGlobal() {
  const navbar = document.querySelector(".navbarGlobal");
  if (!navbar) return;

  const userTrigger = navbar.querySelector(".navbarGlobal__userTrigger");
  const dropdown = navbar.querySelector(".navbarGlobal__dropdown");
  const menuToggle = navbar.querySelector(".navbarGlobal__menuToggle");

  if (userTrigger && dropdown) {
    userTrigger.addEventListener("click", (event) => {
      event.stopPropagation();
      const isOpen = !dropdown.hasAttribute("hidden");
      toggleDropdown(dropdown, userTrigger, !isOpen);
    });

    document.addEventListener("click", (event) => {
      if (!navbar.contains(event.target)) {
        toggleDropdown(dropdown, userTrigger, false);
      }
    });
  }

  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      document.body.classList.toggle("sidebarOpen");
    });
  }

  const logoutBtn = navbar.querySelector(".navbarGlobal__logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", handleLogout);
  }
}

function toggleDropdown(dropdown, trigger, open) {
  if (open) {
    dropdown.removeAttribute("hidden");
  } else {
    dropdown.setAttribute("hidden", "");
  }
  trigger.setAttribute("aria-expanded", String(open));
}

function handleLogout() {
  // TODO: connect to auth service once the backend is ready
  console.log("Logout requested");
}

document.addEventListener("DOMContentLoaded", initNavbarGlobal);