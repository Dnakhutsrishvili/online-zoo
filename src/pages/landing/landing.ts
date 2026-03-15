import { Feedback ,StoredUser} from "../../models/main";
import { Pet } from "../../models/animal";
import { SavedCard } from "../../models/card";
import { LOCAL_IMAGES } from "../../constants/paths";
import { validateLogin ,validatePassword ,validateName,validateEmail,formatCardLabel} from "../../utils";


const API_URL_ANIMAL   = "https://vsqsnqnxkh.execute-api.eu-central-1.amazonaws.com/prod/pets";
const API_URL_FEEDBACK = "https://vsqsnqnxkh.execute-api.eu-central-1.amazonaws.com/prod/feedback";
const API_URL_LOGIN    = "https://vsqsnqnxkh.execute-api.eu-central-1.amazonaws.com/prod/auth/login";
const API_DONATE       = "https://vsqsnqnxkh.execute-api.eu-central-1.amazonaws.com/prod/donation";

const dialog  = document.getElementById("donation-dialog") as HTMLDialogElement;
const steps   = document.querySelectorAll<HTMLElement>("#donation-dialog .step");
const navItem = document.getElementById("user-item") as HTMLElement;
let currentStep: number = 0;

function showStep(index: number): void {
  steps.forEach((step, i) => step.classList.toggle("active", i === index));
}

document.querySelectorAll<HTMLButtonElement>(".next-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (currentStep < steps.length - 1) currentStep++;
    showStep(currentStep);
  });
});

document.querySelectorAll<HTMLButtonElement>(".prev-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (currentStep > 0) currentStep--;
    showStep(currentStep);
  });
});

document.querySelectorAll<HTMLElement>(".donate").forEach((btn) => {
  btn.addEventListener("click", () => {
    currentStep = 0;
    showStep(currentStep);
    dialog.showModal();
  });
});

dialog.addEventListener("click", (e: MouseEvent) => {
  if (e.target === dialog) dialog.close();
});

const container              = document.getElementById("pc-view");
const leftBtn                = document.getElementById("left");
const rightBtn               = document.getElementById("right");
const containerTestimonials  = document.getElementById("testimonial-slider");
const leftBtnTestimonials    = document.getElementById("testimonial-left");
const rightBtnTestimonials   = document.getElementById("testimonial-right");

if (containerTestimonials && leftBtnTestimonials && rightBtnTestimonials) {
  rightBtnTestimonials.addEventListener("click", () => {
    const isEnd = containerTestimonials.scrollLeft + containerTestimonials.clientWidth >= containerTestimonials.scrollWidth - 1;
    if (isEnd) {
      containerTestimonials.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      containerTestimonials.scrollBy({ left: 250, behavior: "smooth" });
    }
  });

  leftBtnTestimonials.addEventListener("click", () => {
    const isStart = containerTestimonials.scrollLeft <= 0;
    if (isStart) {
      containerTestimonials.scrollTo({ left: containerTestimonials.scrollWidth, behavior: "smooth" });
    } else {
      containerTestimonials.scrollBy({ left: -250, behavior: "smooth" });
    }
  });
}

if (container && leftBtn && rightBtn) {
  rightBtn.addEventListener("click", () => {
    const isEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - 1;
    if (isEnd) {
      container.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      container.scrollBy({ left: 250, behavior: "smooth" });
    }
  });

  leftBtn.addEventListener("click", () => {
    const isStart = container.scrollLeft <= 0;
    if (isStart) {
      container.scrollTo({ left: container.scrollWidth, behavior: "smooth" });
    } else {
      container.scrollBy({ left: -250, behavior: "smooth" });
    }
  });
}


function getUser(): StoredUser {
  try {
    const raw = localStorage.getItem("zoo_user");
    if (navItem && raw) {
      navItem.textContent = "Profile";
    } else {
      navItem.textContent = "Sign up";
      navItem.setAttribute("href", "/registration");
    }
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function initUserWidget(): void {
  const btn        = document.getElementById("user-btn")         as HTMLButtonElement | null;
  const popup      = document.getElementById("user-popup")       as HTMLElement | null;
  const guestPanel = document.getElementById("popup-guest")      as HTMLElement | null;
  const userPanel  = document.getElementById("popup-user")       as HTMLElement | null;
  const userNameEl = document.getElementById("user-name")        as HTMLElement | null;
  const avatarEl   = document.getElementById("popup-avatar")     as HTMLElement | null;
  const infoName   = document.getElementById("popup-info-name")  as HTMLElement | null;
  const infoEmail  = document.getElementById("popup-info-email") as HTMLElement | null;
  const signoutBtn = document.getElementById("signout-btn")      as HTMLButtonElement | null;

  if (!btn || !popup) return;

  const user = getUser();

  if (user) {
    if (userNameEl) userNameEl.textContent = user.name;
    if (avatarEl)   avatarEl.textContent   = user.name.charAt(0).toUpperCase();
    if (infoName)   infoName.textContent   = user.name;
    if (infoEmail)  infoEmail.textContent  = user.email;
    userPanel?.classList.add("active");
  } else {
    guestPanel?.classList.add("active");
  }

  btn.addEventListener("click", (e: MouseEvent) => {
    e.stopPropagation();
    const isOpen = popup.classList.toggle("open");
    btn.setAttribute("aria-expanded", String(isOpen));
  });

  document.addEventListener("click", () => {
    popup.classList.remove("open");
    btn.setAttribute("aria-expanded", "false");
  });

  popup.addEventListener("click", (e: MouseEvent) => e.stopPropagation());

  signoutBtn?.addEventListener("click", () => {
    localStorage.removeItem("zoo_user");
    window.location.reload();
  });
}

function initSigninModal(): void {
  const openBtn       = document.getElementById("open-signin-modal")  as HTMLButtonElement | null;
  const modal         = document.getElementById("signin-modal")       as HTMLDialogElement | null;
  const closeBtn      = document.getElementById("close-signin-modal") as HTMLButtonElement | null;
  const form          = document.getElementById("signin-form")        as HTMLFormElement | null;
  const loginInput    = document.getElementById("signin-login")       as HTMLInputElement | null;
  const passwordInput = document.getElementById("signin-password")    as HTMLInputElement | null;
  const submitBtn     = document.getElementById("signin-submit")      as HTMLButtonElement | null;
  const serverErr     = document.getElementById("auth-server-error")  as HTMLElement | null;
  const popup         = document.getElementById("user-popup")         as HTMLElement | null;

  if (!modal || !form || !loginInput || !passwordInput || !submitBtn) return;

  function setInvalid(groupId: string, errorId: string, msg: string): void {
    document.getElementById(groupId)?.classList.add("invalid");
    const el = document.getElementById(errorId);
    if (el) el.textContent = msg;
  }

  function setValid(groupId: string, errorId: string): void {
    document.getElementById(groupId)?.classList.remove("invalid");
    const el = document.getElementById(errorId);
    if (el) el.textContent = "";
  }

  function updateBtn(): void {
    submitBtn!.disabled =
      validateLogin(loginInput!.value) !== "" ||
      validatePassword(passwordInput!.value) !== "";
  }

  openBtn?.addEventListener("click", (e: MouseEvent) => {
    e.stopPropagation();
    popup?.classList.remove("open");
    modal.showModal();
  });

  closeBtn?.addEventListener("click", () => modal.close());

  modal.addEventListener("click", (e: MouseEvent) => {
    if (e.target === modal) modal.close();
  });

  loginInput.addEventListener("blur", () => {
    const msg = validateLogin(loginInput.value);
    msg ? setInvalid("auth-group-login", "auth-error-login", msg)
        : setValid("auth-group-login", "auth-error-login");
    updateBtn();
  });

  passwordInput.addEventListener("blur", () => {
    const msg = validatePassword(passwordInput.value);
    msg ? setInvalid("auth-group-password", "auth-error-password", msg)
        : setValid("auth-group-password", "auth-error-password");
    updateBtn();
  });

  loginInput.addEventListener("focus", () => {
    setValid("auth-group-login", "auth-error-login");
    if (serverErr) serverErr.textContent = "";
  });

  passwordInput.addEventListener("focus", () => {
    setValid("auth-group-password", "auth-error-password");
    if (serverErr) serverErr.textContent = "";
  });

  [loginInput, passwordInput].forEach(inp => inp.addEventListener("input", updateBtn));

  document.querySelectorAll<HTMLButtonElement>(".auth-toggle-pw").forEach((btn) => {
    btn.addEventListener("click", () => {
      const inp = document.getElementById(btn.dataset.target as string) as HTMLInputElement;
      if (inp) inp.type = inp.type === "password" ? "text" : "password";
    });
  });

  form.addEventListener("submit", async (e: SubmitEvent) => {
    e.preventDefault();
    if (serverErr) serverErr.textContent = "";

    submitBtn.disabled    = true;
    submitBtn.textContent = "Signing in…";

    try {
      const response = await fetch(API_URL_LOGIN, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          login:    loginInput.value.trim(),
          password: passwordInput.value,
        }),
      });

      if (!response.ok) {
        if (serverErr) serverErr.textContent = "Incorrect login or password.";
        submitBtn.disabled = false;
        submitBtn.innerHTML = `SIGN IN <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;
        return;
      }

      const data = await response.json().catch(() => ({}));
      localStorage.setItem("zoo_user", JSON.stringify({
        name:  data?.data?.user.name  || "",
        email: data?.data?.user.email || "",
      }));

      modal.close();
      window.location.reload();

    } catch {
      if (serverErr) serverErr.textContent = "Incorrect login or password.";
      submitBtn.disabled = false;
      submitBtn.innerHTML = `SIGN IN <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;
    }
  });
}

function showPetsSkeleton(list: HTMLElement): void {
  const skeleton = document.createElement("div");
  skeleton.id        = "pets-skeleton";
  skeleton.className = "pets-skeleton";
  for (let i = 0; i < 4; i++) {
    skeleton.innerHTML += `
      <div class="pets-skeleton-card">
        <div class="skeleton sk-title"></div>
        <div class="skeleton sk-image"></div>
        <div class="skeleton sk-sub"></div>
        <div class="skeleton sk-text"></div>
        <div class="skeleton sk-text short"></div>
        <div class="skeleton sk-link"></div>
      </div>
    `;
  }
  list.appendChild(skeleton);
}

function showTestimonialsSkeleton(slider: HTMLElement): void {
  const skeleton = document.createElement("div");
  skeleton.id        = "testimonials-skeleton";
  skeleton.className = "testimonials-skeleton";
  for (let i = 0; i < 3; i++) {
    skeleton.innerHTML += `
      <div class="testimonials-skeleton-card">
        <div class="skeleton sk-avatar"></div>
        <div class="skeleton sk-date"></div>
        <div class="skeleton sk-line"></div>
        <div class="skeleton sk-line short"></div>
        <div class="skeleton sk-name"></div>
      </div>
    `;
  }
  slider.appendChild(skeleton);
}

async function fetchPets(): Promise<Pet[]> {
  const res = await fetch(API_URL_ANIMAL);
  if (!res.ok) throw new Error("Failed to fetch pets");
  const data = await res.json();
  return (data.data as any[]).map((pet) => ({
    ...pet,
    image: LOCAL_IMAGES[pet.id] || pet?.image || "/assets/landing/coala-mobile.png",
  }));
}

function renderPets(animals: Pet[]): void {
  const list = document.getElementById("pc-view") as HTMLElement;
  if (!list) return;

  document.getElementById("pets-skeleton")?.remove();

  animals.forEach((animal: Pet) => {
    const card     = document.createElement("div");
    card.className = "animal-card";
    card.innerHTML = `
      <div><h3 class="montserrat-regular">${animal.name}</h3></div>
      <img src="${animal.image}" alt="${animal.name}" />
      <h4 class="montserrat-regular">${animal.commonName}</h4>
      <p class="montserrat-regular">${animal.description}</p>
      <a href="#" class="montserrat-semi-bold">
        VIEW LIVE CAM
        <img src="/assets/icons/arrow.png" alt="Go to destination"/>
      </a>
    `;
    list.appendChild(card);
  });
}

async function loadFeedback(): Promise<void> {
  const slider           = document.getElementById("testimonial-slider") as HTMLDivElement;
  const buttonsContainer = document.getElementById("slider-buttons")     as HTMLDivElement;
  if (!slider || !buttonsContainer) return;

  showTestimonialsSkeleton(slider);

  try {
    const response = await fetch(API_URL_FEEDBACK);
    if (!response.ok) throw new Error("Failed to fetch feedback");

    const data = await response.json();
    document.getElementById("testimonials-skeleton")?.remove();

    (data.data as Feedback[]).forEach((item) => {
      const slide     = document.createElement("div");
      slide.className = "slide";
      slide.innerHTML = `
        <img src="/assets/icons/testemonial.png" alt="Testimonial ${item.name}" />
        <h4>${item.city}, ${item.month} ${item.year}</h4>
        <p>${item.text}</p>
        <h5>${item.name}</h5>
      `;
      slider.appendChild(slide);
    });

  } catch (error) {
    document.getElementById("testimonials-skeleton")?.remove();
    slider.innerHTML = `<p class="section-error">Something went wrong. Please, refresh the page.</p>`;
    console.error("Error loading testimonials:", error);
  }
}

function getSavedCards(): SavedCard[] {
  return JSON.parse(localStorage.getItem("zoo-saved-cards") || "[]");
}

function saveCardToStorage(card: SavedCard): void {
  const cards  = getSavedCards();
  const exists = cards.find(c => c.cardNumber === card.cardNumber);
  if (!exists) {
    cards.push(card);
    localStorage.setItem("zoo-saved-cards", JSON.stringify(cards));
  }
}


function showNotification(message: string, success: boolean): void {
  const existing = document.getElementById("donation-notification");
  if (existing) existing.remove();

  const notification     = document.createElement("div");
  notification.id        = "donation-notification";
  notification.className = `donation-notification ${success ? "success" : "error"}`;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => notification.remove(), 5000);
}

async function loadPopup(animals: Pet[]): Promise<void> {
  const firstStepBtn   = document.querySelector("#first-step")            as HTMLButtonElement;
  const secondStepBtn  = document.querySelector("#second-step")           as HTMLButtonElement;
  const completeDonBtn = document.getElementById("complete-donation-btn") as HTMLButtonElement;
  const select         = document.getElementById("pet-select")            as HTMLSelectElement;
  const donationInput  = document.getElementById("donation")              as HTMLInputElement;
  const nameInput      = document.getElementById("name-input")            as HTMLInputElement;
  const emailInput     = document.getElementById("email-input")           as HTMLInputElement;
  const cardNumberInput= document.getElementById("card-number")           as HTMLInputElement;
  const expiryInput    = document.getElementById("expiry-date")           as HTMLInputElement;
  const cvvInput       = document.getElementById("cvv")                   as HTMLInputElement;
  const savedCardsContainer = document.getElementById("saved-cards-container") as HTMLElement;
  const saveCardContainer   = document.getElementById("save-card-container")   as HTMLElement;

  const donationButtons = document.getElementsByClassName("donation-amount") as HTMLCollectionOf<HTMLButtonElement>;

  firstStepBtn.disabled  = true;
  secondStepBtn.disabled = true;
  completeDonBtn.disabled = true;

  Array.from(donationButtons).forEach(btn => {
    btn.addEventListener("click", () => {
      donationInput.value    = btn.value;
      firstStepBtn.disabled  = false;
    });
  });

  donationInput.addEventListener("input", () => {
    const value   = donationInput.value;
    const isValid = /^\d*\.?\d+$/.test(value) && parseFloat(value) > 0;
    firstStepBtn.disabled = !isValid;
  });
 

  function checkStep2Validity(): void {
    secondStepBtn.disabled = !(validateName(nameInput.value) && validateEmail(emailInput.value));
  }

  nameInput.addEventListener("input", () => {
    nameInput.setCustomValidity(validateName(nameInput.value) ? "" : "Name can only contain letters and spaces.");
    checkStep2Validity();
  });

  emailInput.addEventListener("input", () => {
    emailInput.setCustomValidity(validateEmail(emailInput.value) ? "" : "Please enter a valid email address.");
    checkStep2Validity();
  });

  function validateCardNumber(value: string): boolean {
    return /^\d{16}$/.test(value.replace(/\s/g, ""));
  }

  function validateExpiry(value: string): boolean {
    if (!/^\d{2}\/\d{2}$/.test(value)) return false;
    const [mm, yy]   = value.split("/").map(Number);
    if (mm < 1 || mm > 12) return false;
    const now        = new Date();
    const currentYY  = now.getFullYear() % 100;
    const currentMM  = now.getMonth() + 1;
    return yy > currentYY || (yy === currentYY && mm >= currentMM);
  }

  function validateCVV(value: string): boolean {
    return /^\d{3}$/.test(value);
  }

  function checkStep3Validity(): void {
    const cardValid   = validateCardNumber(cardNumberInput.value);
    const expiryValid = validateExpiry(expiryInput.value);
    const cvvValid    = validateCVV(cvvInput.value);
    completeDonBtn.disabled = !(cardValid && expiryValid && cvvValid);
  }

  cardNumberInput.addEventListener("input", () => {
    cardNumberInput.value = cardNumberInput.value.replace(/\D/g, "").slice(0, 16);
    cardNumberInput.setCustomValidity(validateCardNumber(cardNumberInput.value) ? "" : "Card number must be exactly 16 digits.");
    checkStep3Validity();
  });

  expiryInput.addEventListener("input", () => {
    let val = expiryInput.value.replace(/\D/g, "").slice(0, 4);
    if (val.length >= 3) val = val.slice(0, 2) + "/" + val.slice(2);
    expiryInput.value = val;
    expiryInput.setCustomValidity(validateExpiry(expiryInput.value) ? "" : "Enter a valid future date in MM/YY format.");
    checkStep3Validity();
  });

  cvvInput.addEventListener("keydown", (e) => {
    if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
  });

  cvvInput.addEventListener("input", () => {
    cvvInput.value = cvvInput.value.replace(/\D/g, "").slice(0, 3);
    cvvInput.setCustomValidity(validateCVV(cvvInput.value) ? "" : "CVV must be exactly 3 digits.");
    checkStep3Validity();
  });

  animals.forEach((animal) => {
    const option       = document.createElement("option");
    option.value       = animal.id;
    option.textContent = animal.name;
    select.appendChild(option);
  });

  const user = getUser();

  if (user?.name && user?.email) {
    nameInput.value        = user.name;
    emailInput.value       = user.email;
    secondStepBtn.disabled = false;

    const savedCards = getSavedCards();
    if (savedCards.length > 0 && savedCardsContainer) {
      const label        = document.createElement("label");
      label.className    = "montserrat-regular";
      label.textContent  = "Saved cards";

      const savedSelect  = document.createElement("select");
      savedSelect.id     = "saved-cards-select";
      savedSelect.className = "saved-cards-select";

      const defaultOpt       = document.createElement("option");
      defaultOpt.value       = "";
      defaultOpt.textContent = "Select a saved card...";
      savedSelect.appendChild(defaultOpt);

      savedCards.forEach((card, index) => {
        const opt       = document.createElement("option");
        opt.value       = String(index);
        opt.textContent = card.label;
        savedSelect.appendChild(opt);
      });

      savedSelect.addEventListener("change", () => {
        const index = parseInt(savedSelect.value);
        if (!isNaN(index)) {
          const card            = savedCards[index];
          cardNumberInput.value = card.cardNumber;
          expiryInput.value     = card.expiry;
          cvvInput.value        = card.cvv;
          checkStep3Validity();
        } else {
          cardNumberInput.value = "";
          expiryInput.value     = "";
          cvvInput.value        = "";
          checkStep3Validity();
        }
      });

      savedCardsContainer.appendChild(label);
      savedCardsContainer.appendChild(savedSelect);
    }

    if (saveCardContainer) {
      const wrapper      = document.createElement("div");
      wrapper.className  = "save-card-wrapper";

      const checkbox     = document.createElement("input");
      checkbox.type      = "checkbox";
      checkbox.id        = "save-card";

      const checkLabel   = document.createElement("label");
      checkLabel.htmlFor = "save-card";
      checkLabel.className  = "montserrat-regular";
      checkLabel.textContent = "Save card info for future donations";

      wrapper.appendChild(checkbox);
      wrapper.appendChild(checkLabel);
      saveCardContainer.appendChild(wrapper);
    }
  }

  completeDonBtn.addEventListener("click", async () => {
    const checkbox   = document.getElementById("save-card") as HTMLInputElement | null;
    const shouldSave = checkbox?.checked ?? false;
    const amount     = donationInput.value;
    const petName    = select.options[select.selectedIndex]?.textContent || "";

    if (shouldSave) {
      saveCardToStorage({
        cardNumber: cardNumberInput.value,
        expiry:     expiryInput.value,
        cvv:        cvvInput.value,
        label:      formatCardLabel(cardNumberInput.value),
      });
    }

    completeDonBtn.disabled = true;

    try {
      const res = await fetch(API_DONATE, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          petName,
          cardNumber: cardNumberInput.value,
          expiry:     expiryInput.value,
          cvv:        cvvInput.value,
        }),
      });

      if (!res.ok) throw new Error("Donation failed");

      dialog.close();
      showNotification(`Thank you for your donation of $${amount} to ${petName}!`, true);

    } catch {
      showNotification("Something went wrong. Please, try again later.", false);
      completeDonBtn.disabled = false;
    }
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  initUserWidget();
  initSigninModal();
  loadFeedback();

  const list = document.getElementById("pc-view") as HTMLElement;
  if (list) showPetsSkeleton(list);

  try {
    const animals = await fetchPets();
    renderPets(animals);
    await loadPopup(animals);
  } catch (err) {
    document.getElementById("pets-skeleton")?.remove();
    if (list) list.innerHTML = `<p class="section-error">Something went wrong. Please, refresh the page.</p>`;
    console.error("Error fetching pets:", err);
  }
});