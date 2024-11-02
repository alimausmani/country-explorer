const countryList = document.getElementById("country-list");
const searchInput = document.getElementById("search");
const regionFilter = document.getElementById("region-filter");
const loadMoreButton = document.getElementById("load-more");
const favoritesCounter = document.getElementById("favorites-counter");

let countries = [];
let filteredCountries = [];
let displayedCountries = 0;
const countriesPerPage = 10;
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

async function fetchCountries() {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all");
    countries = await response.json();
    filteredCountries = countries;
    displayCountries();
    updateFavoritesCounter();
  } catch (error) {
    console.error("Error fetching countries:", error);
  }
}

function displayCountries() {
  const countriesToDisplay = filteredCountries.slice(displayedCountries, displayedCountries + countriesPerPage);
  countriesToDisplay.forEach(country => {
    const countryCard = document.createElement("div");
    countryCard.className = "country-card";
    countryCard.innerHTML = `
      <img src="${country.flags.png}" alt="${country.name.common} flag" />
      <h2>${country.name.common}</h2>
      <p>Population: ${country.population.toLocaleString()}</p>
      <p>Region: ${country.region}</p>
      <button onclick="viewCountryDetails('${country.name.common}')">View Details</button>
      <button class="favorite-button" onclick="toggleFavorite('${country.name.common}')">
        ${favorites.includes(country.name.common) ? "Remove from Favorites" : "Add to Favorites"}
      </button>
    `;
    countryList.appendChild(countryCard);
  });
  displayedCountries += countriesToDisplay.length;
}


function filterCountries() {
  const searchValue = searchInput.value.toLowerCase();
  const selectedRegion = regionFilter.value;

  filteredCountries = countries.filter(country => {
    const matchesSearch = country.name.common.toLowerCase().includes(searchValue);
    const matchesRegion = selectedRegion === "all" || country.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  displayedCountries = 0;
  countryList.innerHTML = "";
  displayCountries();
}

function toggleFavorite(countryName) {
  if (favorites.includes(countryName)) {
    favorites = favorites.filter(name => name !== countryName);
  } else if (favorites.length < 5) {
    favorites.push(countryName);
  } else {
    alert("You can only have up to 5 favorites.");
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));
  updateFavoritesCounter();
  filterCountries();
}

function updateFavoritesCounter() {
  favoritesCounter.textContent = favorites.length;
}

window.addEventListener("load", () => {
  favorites = [];
  localStorage.removeItem("favorites");
  updateFavoritesCounter();
});

function viewCountryDetails(countryName) {
  const country = countries.find(c => c.name.common === countryName);
  localStorage.setItem("selectedCountry", JSON.stringify(country));
  window.location.href = "country-details.html";
}

searchInput.addEventListener("input", filterCountries);
regionFilter.addEventListener("change", filterCountries);
loadMoreButton.addEventListener("click", displayCountries);

fetchCountries();

