import { Pet, PetDetail } from "../../models/animal";

const API_PETS      = "https://vsqsnqnxkh.execute-api.eu-central-1.amazonaws.com/prod/pets";
const API_PET_BY_ID = (id: string) =>
  `https://vsqsnqnxkh.execute-api.eu-central-1.amazonaws.com/prod/pets/${id}`;

const LOCAL_ICONS: Record<string, string> = {
  "1":  "../../assets/animal/animals/icons/1_Giant_Panda.svg",
  "2":  "../../assets/animal/animals/icons/2_Ring-Tailed_Lemur.svg",
  "3":  "../../assets/animal/animals/icons/3_Gorilla.svg",
  "4":  "../../assets/animal/animals/icons/4_Chinese_Alligator.svg",
  "5":  "../../assets/animal/animals/icons/5_Bald_Eagle.svg",
  "6":  "../../assets/animal/animals/icons/6_Koala.svg",
  "7":  "../../assets/animal/animals/icons/7_African_Lion.svg",
  "8":  "../../assets/animal/animals/icons/8_Sumatran_Tiger.svg",
  "9":  "../../assets/animal/animals/icons/9_Red_Panda.svg",
  "10": "../../assets/animal/animals/icons/10_Mountain_Gorilla.svg",
  "11": "../../assets/animal/animals/icons/11_African_Elephant.svg",
  "12": "../../assets/animal/animals/icons/12_Sea_Otter.svg",
  "13": "../../assets/animal/animals/icons/13_Bengal_Tiger.svg",
  "14": "../../assets/animal/animals/icons/14_Gray_Wolf.svg",
  "15": "../../assets/animal/animals/icons/15_Fennec_Fox.svg",
  "16": "../../assets/animal/animals/icons/16_Grizzly_Bear.svg",
  "17": "../../assets/animal/animals/icons/17_Bottlenose_Dolphin.svg",
  "18": "../../assets/animal/animals/icons/18_Snow_Leopard.svg",
  "19": "../../assets/animal/animals/icons/19_Polar_Bear.svg",
  "20": "../../assets/animal/animals/icons/20_Jaguar.svg",
  "21": "../../assets/animal/animals/icons/21_Ring-Tailed_Lemur.svg",
  "22": "../../assets/animal/animals/icons/22_White_Rhinoceros.svg",
  "23": "../../assets/animal/animals/icons/23_Arctic_Fox.svg",
  "24": "../../assets/animal/animals/icons/24_Saltwater_Crocodile.svg",
  "25": "../../assets/animal/animals/icons/25_Scarlet_Macaw.svg",
  "26": "../../assets/animal/animals/icons/26_Komodo_Dragon.svg",
  "27": "../../assets/animal/animals/icons/27_Sloth.svg",
  "28": "../../assets/animal/animals/icons/28_Cheetah.svg",
};

const LOCAL_IMAGES: Record<string, string> = {
  "1":  "../../assets/animal/animals/1_Giant_Panda.jpg",
  "2":  "../../assets/animal/animals/2_Ring-Tailed_Lemur.jpg",
  "3":  "../../assets/animal/animals/3_Gorilla.jpg",
  "4":  "../../assets/animal/animals/4_Chinese_Alligator.jpg",
  "5":  "../../assets/animal/animals/5_Bald_Eagle.jpg",
  "6":  "../../assets/animal/animals/6_Koala.jpg",
  "7":  "../../assets/animal/animals/7_African_Lion.jpg",
  "8":  "../../assets/animal/animals/8_Sumatran_Tiger.jpg",
  "9":  "../../assets/animal/animals/9_Red_Panda.jpg",
  "10": "../../assets/animal/animals/10_Mountain_Gorilla.jpg",
  "11": "../../assets/animal/animals/11_African_Elephant.jpg",
  "12": "../../assets/animal/animals/12_Sea_Otter.jpg",
  "13": "../../assets/animal/animals/13_Bengal_Tiger.jpg",
  "14": "../../assets/animal/animals/14_Gray_Wolf.jpg",
  "15": "../../assets/animal/animals/15_Fennec_Fox.jpg",
  "16": "../../assets/animal/animals/16_Grizzly_Bear.jpg",
  "17": "../../assets/animal/animals/17_Bottlenose_Dolphin.jpg",
  "18": "../../assets/animal/animals/18_Snow_Leopard.jpg",
  "19": "../../assets/animal/animals/19_Polar_Bear.jpg",
  "20": "../../assets/animal/animals/20_Jaguar.jpg",
  "21": "../../assets/animal/animals/21_Ring-Tailed_Lemur.jpg",
  "22": "../../assets/animal/animals/22_White_Rhinoceros.jpg",
  "23": "../../assets/animal/animals/23_Arctic_Fox.jpg",
  "24": "../../assets/animal/animals/24_Saltwater_Crocodile.jpg",
  "25": "../../assets/animal/animals/25_Scarlet_Macaw.jpg",
  "26": "../../assets/animal/animals/26_Komodo_Dragon.jpg",
  "27": "../../assets/animal/animals/27_Sloth.jpg",
  "28": "../../assets/animal/animals/28_Cheetah.jpg",
};

const ITEMS_COLLAPSED = 4;
let isExpanded        = false;
let allPets: Pet[]    = [];

const sidebarLoader  = document.getElementById("sidebar-loader")  as HTMLElement;
const sidebarList    = document.getElementById("sidebar-list")    as HTMLUListElement;
const sidebarError   = document.getElementById("sidebar-error")   as HTMLElement;
const contentOverlay = document.getElementById("content-overlay") as HTMLElement;
const contentError   = document.getElementById("content-error")   as HTMLElement;
const petSection     = document.getElementById("pet-section")     as HTMLElement;
const petFacts       = document.getElementById("pet-facts")       as HTMLElement;

const petTitle       = document.getElementById("pet-title")            as HTMLElement;
const petHero        = document.getElementById("pet-hero")             as HTMLImageElement;
const petCam1        = document.getElementById("pet-cam1")             as HTMLImageElement;
const petCam2        = document.getElementById("pet-cam2")             as HTMLImageElement;
const petCam3        = document.getElementById("pet-cam3")             as HTMLImageElement;
const donationTitle  = document.getElementById("donation-title")       as HTMLElement;
const donationDesc   = document.getElementById("donation-desc")        as HTMLElement;
const didYouKnow     = document.getElementById("did-you-know")         as HTMLElement;
const petBaby        = document.getElementById("pet-baby")             as HTMLImageElement;
const factCommonName = document.getElementById("fact-common-name")     as HTMLElement;
const factSciName    = document.getElementById("fact-scientific-name") as HTMLElement;
const factType       = document.getElementById("fact-type")            as HTMLElement;
const factDiet       = document.getElementById("fact-diet")            as HTMLElement;
const factHabitat    = document.getElementById("fact-habitat")         as HTMLElement;
const factRange      = document.getElementById("fact-range")           as HTMLElement;
const factDesc       = document.getElementById("fact-description")     as HTMLElement;

const FALLBACK_IMG = "../../assets/landing/coala-mobile.png";

function showOverlay(): void {
  contentOverlay.classList.remove("hidden");
  petSection.classList.remove("visible");
  petFacts.classList.remove("visible");
  contentError.classList.remove("visible");
}

function hideOverlay(): void {
  contentOverlay.classList.add("hidden");
}

function renderPetDetail(pet: PetDetail): void {
  const hero = pet.image || (pet.images && pet.images[0]) || FALLBACK_IMG;
  const cam1 = (pet.images && pet.images[1]) || hero;
  const cam2 = (pet.images && pet.images[2]) || hero;

  petTitle.textContent      = `live ${pet.commonName} cams`;
  petHero.src               = hero;
  petHero.alt               = pet.name;
  petCam1.src               = cam1;
  petCam2.src               = cam2;
  petCam3.src               = hero;
  donationTitle.textContent = `make the ${pet.commonName || pet.name} donation!`;
  donationDesc.textContent  = pet.description || "";
  didYouKnow.textContent    = pet.didYouKnow  || pet.description || "";
  petBaby.src               = hero;
  petBaby.alt               = pet.name;

  factCommonName.textContent = pet.commonName     || "—";
  factSciName.textContent    = pet.scientificName || "—";
  factType.textContent       = pet.type           || "—";
  factDiet.textContent       = pet.diet           || "—";
  factHabitat.textContent    = pet.habitat        || "—";
  factRange.textContent      = pet.range          || "—";
  factDesc.textContent       = pet.description    || "";

  petSection.classList.add("visible");
  petFacts.classList.add("visible");
}

async function loadPetDetail(id: string): Promise<void> {
  showOverlay();

  try {
    const res = await fetch(API_PET_BY_ID(id));
    if (!res.ok) throw new Error("Failed to fetch pet");

    const json           = await res.json();
    const pet: PetDetail = json.data ?? json;

    const petWithLocalImage: PetDetail = {
      ...pet,
      image: LOCAL_IMAGES[id]  || FALLBACK_IMG,
    };

    hideOverlay();
    renderPetDetail(petWithLocalImage);

  } catch (err) {
    hideOverlay();
    contentError.textContent = "Something went wrong. Please, refresh the page.";
    contentError.classList.add("visible");
    console.error("Pet detail error:", err);
  }
}

function renderSidebarItems(): void {
  sidebarList.innerHTML = "";

  const visiblePets = isExpanded ? allPets : allPets.slice(0, ITEMS_COLLAPSED);

  visiblePets.forEach((pet) => {
    const li      = document.createElement("li");
    li.className  = "sidebar-item";
    li.dataset.id = pet.id;
    li.innerHTML  = `
      <img
        src="${LOCAL_ICONS[pet.id] || ""}"
        alt="${pet.name}"
        title="${pet.name}"
        class="sidebar-icon"
      />
    `;

    li.addEventListener("click", () => {
      document.querySelectorAll<HTMLElement>(".sidebar-item")
        .forEach(el => el.classList.remove("active"));
      li.classList.add("active");
      loadPetDetail(pet.id);
    });

    sidebarList.appendChild(li);
  });
}

function buildSidebar(pets: Pet[]): void {
  allPets = pets;
  sidebarLoader.classList.add("hidden");

  renderSidebarItems();

  if (allPets.length > ITEMS_COLLAPSED) {
    const toggleBtn     = document.createElement("button");
    toggleBtn.id        = "sidebar-toggle";
    toggleBtn.className = "sidebar-arrow";
    toggleBtn.innerHTML = `<img src="../../assets/icons/arrow.png" alt="Toggle" />`;

    toggleBtn.addEventListener("click", () => {
      isExpanded = !isExpanded;

      const arrowImg = toggleBtn.querySelector("img") as HTMLImageElement;
      arrowImg.style.transform = isExpanded ? "rotate(180deg)" : "rotate(0deg)";

      renderSidebarItems();
    });

    sidebarList.parentElement?.appendChild(toggleBtn);
  }
}

async function init(): Promise<void> {
  try {
    const res = await fetch(API_PETS);
    if (!res.ok) throw new Error("Failed to fetch pets list");

    const json        = await res.json();
    const pets: Pet[] = json.data ?? json;

    buildSidebar(pets);

    if (pets.length > 0) {
      const firstItem = sidebarList.querySelector<HTMLElement>(".sidebar-item");
      firstItem?.classList.add("active");
      loadPetDetail(pets[0].id);
    }

  } catch (err) {
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