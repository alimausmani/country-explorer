
function removeFavorite(countryName) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  
  const updatedFavorite = favorites.filter((e)=>e!== countryName)
  
  localStorage.setItem("favorites", JSON.stringify(updatedFavorite));
  const countryData = JSON.parse(localStorage.getItem("selectedCountry"));
  if (countryData) {
    displayCountryDetails(countryData);}
}

function displayCountryDetails(country) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  const countryDetailsContainer = document.getElementById("country-details");

  countryDetailsContainer.innerHTML = "";

  const countryName = document.createElement("h2");
  countryName.textContent = country.name.common;

  const flag = document.createElement("img");
  flag.src = country.flags.png;
  flag.alt = `${country.name.common} flag`;
  flag.width = 150;

  const region = document.createElement("p");
  region.textContent = `Region: ${country.region}`;

  const population = document.createElement("p");
  population.textContent = `Population: ${country.population.toLocaleString()}`;

  const capital = document.createElement("p");
  capital.textContent = `Capital: ${country.capital ? country.capital[0] : "N/A"}`;
  const button = document.createElement("button");
  button.textContent = "Remove From Favorites";
  const buttonBack = document.createElement("button");
  buttonBack.textContent = "Back to Home"
  buttonBack.id="back-button"
  button.style.display="block"
  button.style.marginTop="10px"

  buttonBack.addEventListener("click", () => {
    window.history.back();
  });

  countryDetailsContainer.appendChild(flag);
  countryDetailsContainer.appendChild(countryName);
  countryDetailsContainer.appendChild(region);
  countryDetailsContainer.appendChild(population);
  countryDetailsContainer.appendChild(capital);
  countryDetailsContainer.appendChild(buttonBack);

  if(favorites?.includes(country.name.common)){
    button.addEventListener("click", () => {
      removeFavorite(country.name.common)
    });
  countryDetailsContainer.appendChild(button)
  }
}
document.addEventListener("DOMContentLoaded", () => {
  const countryData = JSON.parse(localStorage.getItem("selectedCountry"));
  if (countryData) {
    displayCountryDetails(countryData);
  } else {
    console.error("No country data found in localStorage.");
  }
});
