const API_PETS      = "https://vsqsnqnxkh.execute-api.eu-central-1.amazonaws.com/prod/pets";
const API_PET_BY_ID = (id: string) =>
  `https://vsqsnqnxkh.execute-api.eu-central-1.amazonaws.com/prod/pets/${id}`;

// ── Types ─────────────────────────────────────────────────────────
type Pet = {
  id: string;
  name: string;
  commonName?: string;
  description?: string;
  image?: string;
};

type PetDetail = {
  id: string;
  name: string;
  commonName?: string;
  scientificName?: string;
  type?: string;
  diet?: string;
  habitat?: string;
  range?: string;
  description?: string;
  didYouKnow?: string;
  image?: string;
  images?: string[];
};

// ── DOM refs ──────────────────────────────────────────────────────
const sidebarLoader  = document.getElementById("sidebar-loader")  as HTMLElement;
const sidebarList    = document.getElementById("sidebar-list")    as HTMLUListElement;
const sidebarError   = document.getElementById("sidebar-error")   as HTMLElement;
const contentOverlay = document.getElementById("content-overlay") as HTMLElement;
const contentError   = document.getElementById("content-error")   as HTMLElement;
const petSection     = document.getElementById("pet-section")     as HTMLElement;
const petFacts       = document.getElementById("pet-facts")       as HTMLElement;

// section elements
const petTitle       = document.getElementById("pet-title")           as HTMLElement;
const petHero        = document.getElementById("pet-hero")            as HTMLImageElement;
const petCam1        = document.getElementById("pet-cam1")            as HTMLImageElement;
const petCam2        = document.getElementById("pet-cam2")            as HTMLImageElement;
const donationTitle  = document.getElementById("donation-title")      as HTMLElement;
const donationDesc   = document.getElementById("donation-desc")       as HTMLElement;
const didYouKnow     = document.getElementById("did-you-know")        as HTMLElement;
const petBaby        = document.getElementById("pet-baby")            as HTMLImageElement;
const factCommonName = document.getElementById("fact-common-name")    as HTMLElement;
const factSciName    = document.getElementById("fact-scientific-name")as HTMLElement;
const factType       = document.getElementById("fact-type")           as HTMLElement;
const factDiet       = document.getElementById("fact-diet")           as HTMLElement;
const factHabitat    = document.getElementById("fact-habitat")        as HTMLElement;
const factRange      = document.getElementById("fact-range")          as HTMLElement;
const factDesc       = document.getElementById("fact-description")    as HTMLElement;

const FALLBACK_IMG = "../../assets/landing/coala-mobile.png";

// ── Loader helpers ────────────────────────────────────────────────
function showOverlay(): void {
  contentOverlay.classList.remove("hidden");
  petSection.classList.remove("visible");
  petFacts.classList.remove("visible");
  contentError.classList.remove("visible");
}

function hideOverlay(): void {
  contentOverlay.classList.add("hidden");
}

// ── Populate the page with pet detail data ────────────────────────
function renderPetDetail(pet: PetDetail): void {
  const hero = pet.image || (pet.images && pet.images[0]) || FALLBACK_IMG;
  const cam1 = (pet.images && pet.images[1]) || hero;
  const cam2 = (pet.images && pet.images[2]) || hero;

  petTitle.textContent      = `live ${pet.name} cams`;
  petHero.src               = hero;
  petHero.alt               = pet.name;
  petCam1.src               = cam1;
  petCam2.src               = cam2;
  donationTitle.textContent = `make the ${pet.commonName || pet.name} donation!`;
  donationDesc.textContent  = pet.description || "";
  didYouKnow.textContent    = pet.didYouKnow  || pet.description || "";
  petBaby.src               = hero;
  petBaby.alt               = pet.name;

  factCommonName.textContent = pet.commonName    || "—";
  factSciName.textContent    = pet.scientificName|| "—";
  factType.textContent       = pet.type          || "—";
  factDiet.textContent       = pet.diet          || "—";
  factHabitat.textContent    = pet.habitat       || "—";
  factRange.textContent      = pet.range         || "—";
  factDesc.textContent       = pet.description   || "";

  petSection.classList.add("visible");
  petFacts.classList.add("visible");
}

// ── Fetch pet detail by ID ────────────────────────────────────────
async function loadPetDetail(id: string): Promise<void> {
  showOverlay();

  try {
    const res = await fetch(API_PET_BY_ID(id));
    if (!res.ok) throw new Error("Failed to fetch pet");

    const json = await res.json();
    // handle both { data: {...} } and flat response shapes
    const pet: PetDetail = json.data ?? json;

    hideOverlay();
    renderPetDetail(pet);

  } catch (err) {
    hideOverlay();
    contentError.textContent = "Something went wrong. Please, refresh the page.";
    contentError.classList.add("visible");
    console.error("Pet detail error:", err);
  }
}

// ── Build the side menu from pets list ────────────────────────────
function buildSidebar(pets: Pet[]): void {
  sidebarLoader.classList.add("hidden");
  sidebarList.innerHTML = "";

  pets.forEach((pet) => {
    const li = document.createElement("li");
    li.className = "sidebar-item montserrat-semi-bold";
    li.textContent = pet.name;
    li.dataset.id = pet.id;

    li.addEventListener("click", () => {
      document.querySelectorAll<HTMLElement>(".sidebar-item")
        .forEach(el => el.classList.remove("active"));
      li.classList.add("active");
      loadPetDetail(pet.id);
    });

    sidebarList.appendChild(li);
  });
}

// ── Init — fetch all pets, build sidebar, load first ─────────────
async function init(): Promise<void> {
  try {
    const res = await fetch(API_PETS);
    if (!res.ok) throw new Error("Failed to fetch pets list");

    const json = await res.json();
    const pets: Pet[] = json.data ?? json;

    buildSidebar(pets);

    if (pets.length > 0) {
      // mark first item active
      const firstItem = sidebarList.querySelector<HTMLElement>(".sidebar-item");
      firstItem?.classList.add("active");
      loadPetDetail(pets[0].id);
    }

  } catch (err) {
    // both panels show error
    sidebarLoader.classList.add("hidden");
    sidebarError.textContent = "Something went wrong. Please, refresh the page.";
    sidebarError.classList.add("visible");

    hideOverlay();
    contentError.textContent = "Something went wrong. Please, refresh the page.";
    contentError.classList.add("visible");

    console.error("Init error:", err);
  }
}

init();