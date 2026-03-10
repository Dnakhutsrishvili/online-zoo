import { Animal, Feedback } from "../../models/main";

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

const API_URL_ANIMAL   = "https://vsqsnqnxkh.execute-api.eu-central-1.amazonaws.com/prod/pets";
const API_URL_FEEDBACK = "https://vsqsnqnxkh.execute-api.eu-central-1.amazonaws.com/prod/feedback";

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
  renderPets();
  loadFeedback();
});