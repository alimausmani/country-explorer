const countryList = document.getElementById("country-list");
const searchInput = document.getElementById("search");
const suggestionsDropdown = document.getElementById("suggestions");
const regionFilter = document.getElementById("region-filter");
const languageFilter = document.getElementById("language-filter");
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

        populateLanguageFilter(countries);
        displayCountries();
        updateFavoritesCounter();
    } catch (error) {
        console.error("Error fetching countries:", error);
    }
}

function populateLanguageFilter(countries) {
    const languages = new Set();

    countries.forEach(country => {
        if (country.languages) {
            Object.values(country.languages).forEach(language => languages.add(language));
        }
    });

    languages.forEach(language => {
        const option = document.createElement("option");
        option.value = language;
        option.textContent = language;
        languageFilter.appendChild(option);
    });
}

function displayCountries() {
    const countriesToDisplay = filteredCountries.slice(displayedCountries, displayedCountries + countriesPerPage);
    countriesToDisplay.forEach(country => {
        const countryCard = document.createElement("div");
        countryCard.className = "country-card";
        countryCard.innerHTML = `
            <img src="${country.flags.png}" alt="${country.name.common} flag" />
            <h2>${country.name.common}</h2>
            <p><strong>Top Level Domain:</strong> ${country.tld ? country.tld.join(", ") : "N/A"}</p>
            <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : "N/A"}</p>
            <p><strong>Region:</strong> ${country.region}</p>
            <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
            <p><strong>Area:</strong> ${country.area ? country.area.toLocaleString() + " km²" : "N/A"}</p>
            <p><strong>Languages:</strong> ${country.languages ? Object.values(country.languages).join(", ") : "N/A"}</p>
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
    const selectedLanguage = languageFilter.value;

    filteredCountries = countries.filter(country => {
        const matchesSearch = country.name.common.toLowerCase().includes(searchValue);
        const matchesRegion = selectedRegion === "all" || country.region === selectedRegion;
        const matchesLanguage = selectedLanguage === "all" || (country.languages && Object.values(country.languages).includes(selectedLanguage));
        
        return matchesSearch && matchesRegion && matchesLanguage;
    });

    displayedCountries = 0;
    countryList.innerHTML = "";
    displayCountries();
    displaySuggestions(searchValue);
}
function displaySuggestions(searchValue) {
  suggestionsDropdown.innerHTML = "";
  if (searchValue) {
      const suggestions = filteredCountries
          .filter(country => country.name.common.toLowerCase().includes(searchValue))
          .slice(0, 5);

      suggestions.forEach(country => {
          const suggestionItem = document.createElement("div");
          suggestionItem.className = "suggestion-item";
          suggestionItem.textContent = country.name.common;
          suggestionItem.onclick = () => selectSuggestion(country.name.common);
          suggestionsDropdown.appendChild(suggestionItem);
      });

      const viewAllItem = document.createElement("div");
      viewAllItem.className = "suggestion-item";
      viewAllItem.textContent = "View all";
      viewAllItem.onclick = () => {
          searchInput.value = searchValue;
          filterCountries(); 
          suggestionsDropdown.style.display = "none"; 
      };
      suggestionsDropdown.appendChild(viewAllItem);

      suggestionsDropdown.style.display = suggestions.length ? "block" : "none";
  } else {
      suggestionsDropdown.style.display = "none"; 
  }
}


function selectSuggestion(countryName) {
    searchInput.value = countryName;
    filterCountries(); 
    suggestionsDropdown.style.display = "none";
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
}

function updateFavoritesCounter() {
    favoritesCounter.textContent = favorites.length;
}

window.addEventListener("load", () => {
    favorites = [];
    localStorage.removeItem("favorites");
    updateFavoritesCounter();
});

function showFavoritesPage() {
    window.location.href = "favorites.html";
}

function viewCountryDetails(countryName) {
    const country = countries.find(c => c.name.common === countryName);
    localStorage.setItem("selectedCountry", JSON.stringify(country));
    window.location.href = "country-details.html";
}

searchInput.addEventListener("input", filterCountries);
regionFilter.addEventListener("change", filterCountries);
languageFilter.addEventListener("change", filterCountries); 
loadMoreButton.addEventListener("click", displayCountries);

fetchCountries();
