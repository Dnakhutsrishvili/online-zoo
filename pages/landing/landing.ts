import { Animal, Feedback } from "../../models/main";

const API_URL_ANIMAL   = "https://vsqsnqnxkh.execute-api.eu-central-1.amazonaws.com/prod/pets";
const API_URL_FEEDBACK = "https://vsqsnqnxkh.execute-api.eu-central-1.amazonaws.com/prod/feedback";
const API_URL_LOGIN    = "https://vsqsnqnxkh.execute-api.eu-central-1.amazonaws.com/prod/auth/login";

const dialog = document.getElementById("donation-dialog") as HTMLDialogElement;
const steps  = document.querySelectorAll<HTMLElement>("#donation-dialog .step");
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

document.querySelectorAll<HTMLButtonElement>(".donate").forEach((btn) => {
  btn.addEventListener("click", () => dialog.showModal());
});

dialog.addEventListener("click", (e: MouseEvent) => {
  if (e.target === dialog) dialog.close();
});

const completeDonationBtn = document.getElementsByClassName(
  "complate-donation"
)[0] as HTMLButtonElement;
completeDonationBtn.addEventListener("click", () => dialog.close());

const container = document.getElementById("pc-view");
const leftBtn   = document.getElementById("left");
const rightBtn  = document.getElementById("right");

if (container && leftBtn && rightBtn) {
  rightBtn.addEventListener("click", () =>
    container.scrollBy({ left: 150, behavior: "smooth" })
  );
  leftBtn.addEventListener("click", () =>
    container.scrollBy({ left: -150, behavior: "smooth" })
  );
}

type StoredUser = { name: string; email: string } | null;

function getUser(): StoredUser {
  try {
    const raw = localStorage.getItem("zoo_user");
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

  function validateLogin(v: string): string {
    if (!v) return "Login is required.";
    if (!/^[a-zA-Z]/.test(v)) return "Must start with a letter.";
    if (!/^[a-zA-Z]+$/.test(v)) return "Only English letters allowed.";
    if (v.length < 3) return "At least 3 characters.";
    return "";
  }

  function validatePassword(v: string): string {
    if (!v) return "Password is required.";
    return "";
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

    submitBtn.disabled = true;
    submitBtn.textContent = "Signing in…";

    try {
      const response = await fetch(API_URL_LOGIN, {
        method: "POST",
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
        name:  data?.name  || loginInput.value.trim(),
        email: data?.email || "",
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
  skeleton.id = "pets-skeleton";
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
  skeleton.id = "testimonials-skeleton";
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

async function renderPets(): Promise<void> {
  const list = document.getElementById("pc-view") as HTMLElement;
  if (!list) return;

  showPetsSkeleton(list);

  try {
    const res = await fetch(API_URL_ANIMAL);
    if (!res.ok) throw new Error("Failed to fetch pets");

    const data = await res.json();
    const animals: Animal[] = (data.data as any[]).map((pet) => ({
      ...pet,
      image: pet?.image || "../../assets/landing/coala-mobile.png",
    }));

    document.getElementById("pets-skeleton")?.remove();

    animals.forEach((animal: Animal) => {
      const card = document.createElement("div");
      card.className = "animal-card";
      card.innerHTML = `
        <h3 class="montserrat-regular">${animal.name}</h3>
        <img src="${animal.image}" alt="${animal.name}" />
        <h4 class="montserrat-regular">${animal.commonName}</h4>
        <p class="montserrat-regular">${animal.description}</p>
        <a href="#" class="montserrat-semi-bold">
          VIEW LIVE CAM
          <img src="../../assets/icons/arrow.png" alt="Go to destination"/>
        </a>
      `;
      list.appendChild(card);
    });
  } catch (err) {
    document.getElementById("pets-skeleton")?.remove();
    list.innerHTML = `<p class="section-error">Something went wrong. Please, refresh the page.</p>`;
    console.error("Error fetching pets:", err);
  }
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
      const slide = document.createElement("div");
      slide.className = "slide";
      slide.innerHTML = `
        <img src="../../assets/icons/testemonial.png" alt="Testimonial ${item.name}" />
        <h4>${item.city}, ${item.month} ${item.year}</h4>
        <p>${item.text}</p>
        <h5>${item.name}</h5>
      `;
      slider.appendChild(slide);
    });

    let currentIndex = 0;
    const totalSlides   = data.data.length;
    const visibleSlides = 3;

    const updateSlider = () => {
      const slideWidth = (slider.children[0] as HTMLElement).clientWidth + 16;
      slider.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
      Array.from(buttonsContainer.children).forEach((btn, i) =>
        btn.classList.toggle("active", i === currentIndex)
      );
    };

    for (let i = 0; i < totalSlides - visibleSlides + 1; i++) {
      const btn = document.createElement("button");
      btn.addEventListener("click", () => { currentIndex = i; updateSlider(); });
      if (i === 0) btn.classList.add("active");
      buttonsContainer.appendChild(btn);
    }

    updateSlider();
  } catch (error) {
    document.getElementById("testimonials-skeleton")?.remove();
    slider.innerHTML = `<p class="section-error">Something went wrong. Please, refresh the page.</p>`;
    console.error("Error loading testimonials:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initUserWidget();
  initSigninModal();
  renderPets();
  loadFeedback();
});