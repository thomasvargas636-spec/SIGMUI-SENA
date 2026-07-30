/**
 * loginForm.js
 * Client-side validation for the login form.
 * Real authentication will be wired once the backend is available;
 * for now this only prevents submission with invalid data.
 */

function initLoginForm() {
  const form = document.querySelector(".loginForm__form");
  if (!form) return;

  const emailInput = form.querySelector("#email");
  const passwordInput = form.querySelector("#password");
  const submitBtn = form.querySelector(".loginForm__submit");

  form.addEventListener("submit", (event) => {
    const isEmailValid = validateEmail(emailInput);
    const isPasswordValid = validatePassword(passwordInput);

    if (!isEmailValid || !isPasswordValid) {
      event.preventDefault();
      return;
    }

    submitBtn.disabled = true;
  });

  emailInput.addEventListener("blur", () => validateEmail(emailInput));
  passwordInput.addEventListener("blur", () => validatePassword(passwordInput));
}

function validateEmail(input) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = emailPattern.test(input.value.trim());
  toggleFieldError(input, isValid, "Enter a valid email address");
  return isValid;
}

function validatePassword(input) {
  const isValid = input.value.trim().length >= 8;
  toggleFieldError(input, isValid, "Password must be at least 8 characters");
  return isValid;
}

function toggleFieldError(input, isValid, message) {
  const errorEl = document.querySelector(`[data-error-for="${input.name}"]`);
  input.classList.toggle("is-invalid", !isValid);

  if (errorEl) {
    errorEl.textContent = isValid ? "" : message;
    errorEl.classList.toggle("is-visible", !isValid);
  }
}

document.addEventListener("DOMContentLoaded", initLoginForm);