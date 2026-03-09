const dialog = document.getElementById("donation-dialog") as HTMLDialogElement;

const steps = document.querySelectorAll<HTMLElement>("#donation-dialog .step");
let currentStep: number = 0;

function showStep(index: number): void {
  steps.forEach((step, i) => {
    step.classList.toggle("active", i === index);
  });
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
  btn.addEventListener("click", () => {
    dialog.showModal();
  });
});

dialog.addEventListener("click", (e: MouseEvent) => {
  if (e.target === dialog) {
    dialog.close();
  }
});

const completeDonationBtn = document.getElementsByClassName(
  "complate-donation"
)[0] as HTMLButtonElement;

completeDonationBtn.addEventListener("click", () => {
  dialog.close();
});

type Animal = {
  id: string;
  name: string;
  commonName: string;
  description: string;
  image:string;
};

// async function fetchPets() {
//   try {
//     const res = await fetch(
//       "https://vsqsnqnxkh.execute-api.eu-central-1.amazonaws.com/prod/pets"
//     );

//     const animals = await res.json();
//     console.log(animals);
//     animals.array.forEach(animal => {
      
//     });

//     return animals.data; 
//   } catch (err) {
//     console.error("Error fetching pets:", err);
//   }
// }
const API_URL =
  "https://vsqsnqnxkh.execute-api.eu-central-1.amazonaws.com/prod/pets";

async function fetchPets(): Promise<Animal[]> {
  try {
    const res = await fetch(API_URL);

    if (!res.ok) throw new Error("Failed to fetch pets");

    const data = await res.json();
    console.log(data); 

    return data.data.map((pet: any) => ({
      ...pet,
      image: pet?.image || "../../assets/landing/coala-mobile.png", 
    }));
  } catch (err) {
    console.error("Error fetching pets:", err);
    return [];
  }
}

async function renderPets() {
  const list = document.getElementById("pc-view") as HTMLUListElement;

  const animals = await fetchPets();

  animals?.forEach((animal: Animal) => {
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

renderPets();

