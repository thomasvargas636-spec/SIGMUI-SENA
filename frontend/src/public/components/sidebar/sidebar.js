/**
 * principalSidebar.js
 * Closes the mobile sidebar automatically after a navigation link is clicked.
 * Active-link highlighting is handled server-side via the `currentRoute` local.
 */

function initPrincipalSidebar() {
  const sidebar = document.querySelector(".principalSidebar");
  if (!sidebar) return;

  const links = sidebar.querySelectorAll(".principalSidebar__link");
  links.forEach((link) => {
    link.addEventListener("click", () => {
      document.body.classList.remove("sidebarOpen");
    });
  });
}

document.addEventListener("DOMContentLoaded", initPrincipalSidebar);