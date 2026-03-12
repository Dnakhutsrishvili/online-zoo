import { Animal, Feedback } from "../../models/main";

const API_URL_ANIMAL   = "https://vsqsnqnxkh.execute-api.eu-central-1.amazonaws.com/prod/pets";
const API_URL_FEEDBACK = "https://vsqsnqnxkh.execute-api.eu-central-1.amazonaws.com/prod/feedback";
const API_URL_LOGIN    = "https://vsqsnqnxkh.execute-api.eu-central-1.amazonaws.com/prod/auth/login";

const dialog = document.getElementById("donation-dialog") as HTMLDialogElement;
const steps  = document.querySelectorAll<HTMLElement>("#donation-dialog .step");
const navItem=document.getElementById('user-item') as HTMLElement;
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

const containerTestimonials = document.getElementById("testimonial-slider");
const leftBtnTestimonials  = document.getElementById("testimonial-left");
const rightBtnTestimonials  = document.getElementById("testimonial-right");

if (containerTestimonials && leftBtnTestimonials && rightBtnTestimonials) {
  rightBtnTestimonials.addEventListener("click", () => {
    const isEnd =
      containerTestimonials.scrollLeft + containerTestimonials.clientWidth >= containerTestimonials.scrollWidth - 1;

    if (isEnd) {
      containerTestimonials.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      containerTestimonials.scrollBy({ left: 250, behavior: "smooth" });
    }
  });

  leftBtnTestimonials.addEventListener("click", () => {
    const isStart = containerTestimonials.scrollLeft <= 0;

    if (isStart) {
      containerTestimonials.scrollTo({
        left: containerTestimonials.scrollWidth,
        behavior: "smooth",
      });
    } else {
      containerTestimonials.scrollBy({ left: -250, behavior: "smooth" });
    }
  });
}


if (container && leftBtn && rightBtn) {
  rightBtn.addEventListener("click", () => {
    const isEnd =
      container.scrollLeft + container.clientWidth >= container.scrollWidth - 1;

    if (isEnd) {
      container.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      container.scrollBy({ left: 250, behavior: "smooth" });
    }
  });

  leftBtn.addEventListener("click", () => {
    const isStart = container.scrollLeft <= 0;

    if (isStart) {
      container.scrollTo({
        left: container.scrollWidth,
        behavior: "smooth",
      });
    } else {
      container.scrollBy({ left: -250, behavior: "smooth" });
    }
  });
}

type StoredUser = { name: string; email: string } | null;

function getUser(): StoredUser {
  try {
    const raw = localStorage.getItem("zoo_user");
if (navItem&&raw) {
  navItem.textContent = 'Profile';
} else {
  navItem.textContent = 'Sign up';
  navItem.setAttribute('href','./pages/registration/registration.html')
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
        name:  data?.data?.user.name  ||'',
        email: data?.data?.user.email || '',
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
const LOCAL_IMAGES: Record<number, string> = {
  1:  "../../assets/animal/animals/1_Giant_Panda.jpg",
  2:  "../../assets/animal/animals/2_Ring-Tailed_Lemur.jpg",
  3:  "../../assets/animal/animals/3_Gorilla.jpg",
  4:  "../../assets/animal/animals/4_Chinese_Alligator.jpg",
  5:  "../../assets/animal/animals/5_Bald_Eagle.jpg",
  6:  "../../assets/animal/animals/6_Koala.jpg",
  7:  "../../assets/animal/animals/7_African_Lion.jpg",
  8:  "../../assets/animal/animals/8_Sumatran_Tiger.jpg",
  9:  "../../assets/animal/animals/9_Red_Panda.jpg",
  10: "../../assets/animal/animals/10_Mountain_Gorilla.jpg",
  11: "../../assets/animal/animals/11_African_Elephant.jpg",
  12: "../../assets/animal/animals/12_Sea_Otter.jpg",
  13: "../../assets/animal/animals/13_Bengal_Tiger.jpg",
  14: "../../assets/animal/animals/14_Gray_Wolf.jpg",
  15: "../../assets/animal/animals/15_Fennec_Fox.jpg",
  16: "../../assets/animal/animals/16_Grizzly_Bear.jpg",
  17: "../../assets/animal/animals/17_Bottlenose_Dolphin.jpg",
  18: "../../assets/animal/animals/18_Snow_Leopard.jpg",
  19: "../../assets/animal/animals/19_Polar_Bear.jpg",
  20: "../../assets/animal/animals/20_Jaguar.jpg",
  21: "../../assets/animal/animals/21_Ring-Tailed_Lemur.jpg",
  22: "../../assets/animal/animals/22_White_Rhinoceros.jpg",
  23: "../../assets/animal/animals/23_Arctic_Fox.jpg",
  24: "../../assets/animal/animals/24_Saltwater_Crocodile.jpg",
  25: "../../assets/animal/animals/25_Scarlet_Macaw.jpg",
  26: "../../assets/animal/animals/26_Komodo_Dragon.jpg",
  27: "../../assets/animal/animals/27_Sloth.jpg",
  28: "../../assets/animal/animals/28_Cheetah.jpg",
};

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
  image: LOCAL_IMAGES[pet.id] || pet?.image || "../../assets/landing/coala-mobile.png",
}));

    document.getElementById("pets-skeleton")?.remove();

    animals.forEach((animal: Animal) => {
      const card = document.createElement("div");
      card.className = "animal-card";
      card.innerHTML = `
      <div>
        <h3 class="montserrat-regular">${animal.name}</h3>
        </div>
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


  } catch (error) {
    document.getElementById("testimonials-skeleton")?.remove();
    slider.innerHTML = `<p class="section-error">Something went wrong. Please, refresh the page.</p>`;
    console.error("Error loading testimonials:", error);
  }
}

async function loadPopup(): Promise<void> {
  const button = document.querySelector("#first-step") as HTMLButtonElement;
  const buttonSecond = document.querySelector("#second-step") as HTMLButtonElement;
  const select = document.getElementById("pet-select") as HTMLSelectElement;
  const donationInput = document.getElementById("donation") as HTMLInputElement;
  const nameInput = document.getElementById("name-input") as HTMLInputElement;
  const emailInput = document.getElementById("email-input") as HTMLInputElement;
const donationButtons = document.getElementsByClassName(
  "donation-amount"
) as HTMLCollectionOf<HTMLButtonElement>;
  button.disabled=true;
  buttonSecond.disabled=true;
Array.from(donationButtons).forEach(btn => {
  btn.addEventListener("click", () => {
    donationInput.value=btn.value
    button.disabled = false;
  });
});

  if(button&&donationInput){
  donationInput.addEventListener('input',(e:Event)=>{
    const value = donationInput.value;
      const isValid = /^\d*\.?\d+$/.test(value) && parseFloat(value) > 0;
      button.disabled = !isValid;
  })
  }

  try {
    const res = await fetch(API_URL_ANIMAL);
    if (!res.ok) throw new Error("Failed to fetch pets");
    const data = await res.json();
    const animals: Animal[] = (data.data as any[])
    animals.forEach((animal) => {
    const option = document.createElement("option");
    option.value = animal.id;
    option.textContent = animal.name;
    select.appendChild(option);
});

  const user = getUser();
if(user?.name&&user?.email){
  nameInput.value  = user?.name  || "";
  emailInput.value = user?.email || "";
  buttonSecond.disabled=false;
}
 

function validateName(value: string): boolean {
  return /^[a-zA-Z\s]+$/.test(value.trim());
}

function validateEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function checkFormValidity(): void {
  const nameValid  = validateName(nameInput.value);
  const emailValid = validateEmail(emailInput.value);
  buttonSecond.disabled  = !(nameValid && emailValid);
}

nameInput.addEventListener("input", () => {
  if (!validateName(nameInput.value)) {
    nameInput.setCustomValidity("Name can only contain letters and spaces.");
  } else {
    nameInput.setCustomValidity("");
  }
  checkFormValidity();
});

emailInput.addEventListener("input", () => {
  if (!validateEmail(emailInput.value)) {
    emailInput.setCustomValidity("Please enter a valid email address.");
  } else {
    emailInput.setCustomValidity("");
  }
  checkFormValidity();
});

  } catch (err) {
    console.error("Error fetching pets:", err);
  }
  

}

document.addEventListener("DOMContentLoaded", () => {
  initUserWidget();
  initSigninModal();
  renderPets();
  loadFeedback();
  loadPopup()
});