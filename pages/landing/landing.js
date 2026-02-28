const dialog = document.getElementById("donation-dialog");

const steps = document.querySelectorAll("#donation-dialog .step");
let currentStep = 0;

function showStep(index) {
  steps.forEach((step, i) => step.classList.toggle("active", i === index));
}

document.querySelectorAll(".next-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    if (currentStep < steps.length - 1) currentStep++;
    showStep(currentStep);
  });
});

document.querySelectorAll(".prev-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    if (currentStep > 0) currentStep--;
    showStep(currentStep);
  });
});
document.querySelectorAll(".donate").forEach(btn => {
  btn.addEventListener("click", () => {
    dialog.showModal();
  });
});


dialog.addEventListener("click", (e) => {
  if (e.target === dialog) {
    dialog.close();
  }
});
document.getElementsByClassName("complate-donation")[0].addEventListener("click", () => {
  dialog.close();
});