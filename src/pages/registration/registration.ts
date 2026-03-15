import { validateLogin ,validateNameRegistration,validateEmailRegistration,validatePassword} from "../../utils";
const API_URL_REGISTER = "https://vsqsnqnxkh.execute-api.eu-central-1.amazonaws.com/prod/auth/register";

const form          = document.getElementById("register-form") as HTMLFormElement;
const loginInput    = document.getElementById("login")         as HTMLInputElement;
const nameInput     = document.getElementById("name")          as HTMLInputElement;
const emailInput    = document.getElementById("email")         as HTMLInputElement;
const passwordInput = document.getElementById("password")      as HTMLInputElement;
const confirmInput  = document.getElementById("confirm")       as HTMLInputElement;
const registerBtn   = document.getElementById("register-btn")  as HTMLButtonElement;
const serverError   = document.getElementById("server-error")  as HTMLElement;


function validateConfirm(value: string): string {
  if (!value) return "Please confirm your password.";
  if (value !== passwordInput.value) return "Passwords do not match.";
  return "";
}

function setInvalid(groupId: string, errorId: string, message: string): void {
  document.getElementById(groupId)?.classList.add("invalid");
  const el = document.getElementById(errorId);
  if (el) el.textContent = message;
}

function setValid(groupId: string, errorId: string): void {
  document.getElementById(groupId)?.classList.remove("invalid");
  const el = document.getElementById(errorId);
  if (el) el.textContent = "";
}

function updateButtonState(): void {
  const allValid =
    validateLogin(loginInput.value)    === "" &&
    validateNameRegistration(nameInput.value)      === "" &&
    validateEmailRegistration(emailInput.value)    === "" &&
    validatePassword(passwordInput.value) === "" &&
    validateConfirm(confirmInput.value)   === "";

  registerBtn.disabled = !allValid;
}

loginInput.addEventListener("blur", () => {
  const msg = validateLogin(loginInput.value);
  msg ? setInvalid("group-login", "error-login", msg)
      : setValid("group-login", "error-login");
  updateButtonState();
});

nameInput.addEventListener("blur", () => {
  const msg = validateNameRegistration(nameInput.value);
  msg ? setInvalid("group-name", "error-name", msg)
      : setValid("group-name", "error-name");
  updateButtonState();
});

emailInput.addEventListener("blur", () => {
  const msg = validateEmailRegistration(emailInput.value);
  msg ? setInvalid("group-email", "error-email", msg)
      : setValid("group-email", "error-email");
  updateButtonState();
});

passwordInput.addEventListener("blur", () => {
  const msg = validatePassword(passwordInput.value);
  msg ? setInvalid("group-password", "error-password", msg)
      : setValid("group-password", "error-password");

  if (confirmInput.value) {
    const confirmMsg = validateConfirm(confirmInput.value);
    confirmMsg ? setInvalid("group-confirm", "error-confirm", confirmMsg)
               : setValid("group-confirm", "error-confirm");
  }

  updateButtonState();
});

confirmInput.addEventListener("blur", () => {
  const msg = validateConfirm(confirmInput.value);
  msg ? setInvalid("group-confirm", "error-confirm", msg)
      : setValid("group-confirm", "error-confirm");
  updateButtonState();
});

loginInput.addEventListener("focus",    () => setValid("group-login",    "error-login"));
nameInput.addEventListener("focus",     () => setValid("group-name",     "error-name"));
emailInput.addEventListener("focus",    () => setValid("group-email",    "error-email"));
passwordInput.addEventListener("focus", () => setValid("group-password", "error-password"));
confirmInput.addEventListener("focus",  () => setValid("group-confirm",  "error-confirm"));

[loginInput, nameInput, emailInput, passwordInput, confirmInput].forEach((input) => {
  input.addEventListener("input", updateButtonState);
});

document.querySelectorAll<HTMLButtonElement>(".toggle-pw").forEach((btn) => {
  btn.addEventListener("click", () => {
    const input = document.getElementById(btn.dataset.target as string) as HTMLInputElement;
    if (input) input.type = input.type === "password" ? "text" : "password";
  });
});


form.addEventListener("submit", async (e: SubmitEvent) => {
  e.preventDefault();
  serverError.textContent = "";

  registerBtn.disabled = true;
  registerBtn.textContent = "Registering…";

  try {
    const response = await fetch(API_URL_REGISTER, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        login:    loginInput.value.trim(),
        name:     nameInput.value.trim(),
        email:    emailInput.value.trim(),
        password: passwordInput.value,
      }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      const message = data?.message || data?.error || "Registration failed. Please try again.";
      serverError.textContent = message;
      registerBtn.disabled = false;
      registerBtn.innerHTML = `REGISTER <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;
      return;
    }

    window.location.href = "/";

  } catch (err) {
    serverError.textContent = "Something went wrong. Please try again.";
    registerBtn.disabled = false;
    registerBtn.innerHTML = `REGISTER <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;
    console.error("Registration error:", err);
  }
});