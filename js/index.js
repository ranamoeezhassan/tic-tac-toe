const menu = document.querySelector(".menu");

menu.addEventListener("click", () => {
  menu.querySelector(".items").classList.toggle("hidden");
});
