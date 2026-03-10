import { Animal,Feedback } from "../../models/main";
const loader    = document.getElementById("page-loader") as HTMLDivElement;
const loaderBar = document.getElementById("loader-bar")  as HTMLDivElement;

let loadProgress = 0;

function setProgress(pct: number): void {
  loadProgress = Math.min(pct, 100);
  loaderBar.style.width = `${loadProgress}%`;
}

function hideLoader(): void {
  setProgress(100);
  setTimeout(() => loader.classList.add("hidden"), 400);
}

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

async function loadFeedback(): Promise<void> {
  const slider          = document.getElementById("testimonial-slider") as HTMLDivElement;
  const buttonsContainer = document.getElementById("slider-buttons")   as HTMLDivElement;
  if (!slider || !buttonsContainer) return;

  const response = await fetch(API_URL_FEEDBACK);
  if (!response.ok) throw new Error("Failed to fetch feedback");

  const data = await response.json();
  setProgress(50); 

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
  const totalSlides  = data.data.length;
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
}

async function fetchPets(): Promise<Animal[]> {
  const res = await fetch(API_URL_ANIMAL);
  if (!res.ok) throw new Error("Failed to fetch pets");

  const data = await res.json();
  setProgress(90); 

  return (data.data as any[]).map((pet) => ({
    ...pet,
    image: pet?.image || "../../assets/landing/coala-mobile.png",
  }));
}

async function renderPets(): Promise<void> {
  const list    = document.getElementById("pc-view") as HTMLUListElement;
  const animals = await fetchPets();

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
}

document.addEventListener("DOMContentLoaded", async () => {
  setProgress(10);

  try {
    await Promise.all([loadFeedback(), renderPets()]);
  } catch (error) {
    console.error("Page load error:", error);
  } finally {
    hideLoader();
  }
});