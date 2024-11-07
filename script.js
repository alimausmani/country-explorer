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

const API_KEY = "c1a2f87bbe49892c9bcd8f6da7696d0c";  

async function fetchCountries() {
    try {
        const response = await fetch(`https://restcountries.com/v3.1/all`);
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
            <img src="${country.flags.png}" alt="Flag of ${country.name.common}" />
            <h2>${country.name.common}</h2>
            <button class="favorite-button" onclick="event.stopPropagation(); toggleFavorite('${country.name.common}')">
             Add to ❤️ Favorites
            </button>
        `;

        countryCard.onclick = () => viewCountryDetails(country.name.common);

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
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    if (favorites.includes(countryName)) {
        alert("This country is in wishList.");
    } else if (favorites.length < 5) {
        favorites.push(countryName);
    } else {
        alert("You can only have up to 5 favorites.");
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
    displayFavorites()
    updateFavoritesCounter();
}

function updateFavoritesCounter() {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    favoritesCounter.textContent = favorites.length;
   
    
    
}

window.addEventListener("load", () => {
  
    
    displayFavorites()
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
const favoritesContainer = document.getElementById("fav-list");




async function displayFavorites() {
    favoritesContainer.innerHTML = "";

    let favoritesx = JSON.parse(localStorage.getItem("favorites")) || [];
    console.log("Favoritesx",favoritesx.length)

  if (favoritesx.length == 0) {
    console.log("No favorites")
    favoritesContainer.innerHTML = "<p>No favorite countries added.</p>";
    return;
  }
  favoritesContainer.style.display = "flex";
  favoritesContainer.style.overflowX = "auto";
  favoritesContainer.style.padding = "10px";
  favoritesContainer.style.gap = "20px";
  favoritesContainer.style.scrollBehavior = "smooth";

  try {
    const response = await fetch("https://restcountries.com/v3.1/all");
    const countries = await response.json();

    favoritesx.forEach(favoriteName => {
      const country = countries.find(c => c.name.common === favoriteName);

      if (country) {
        const countryCard = document.createElement("div");
        countryCard.style.flex = "0 0 auto";
        countryCard.style.width = "250px";
        countryCard.style.border = "1px solid #ccc";
        countryCard.style.borderRadius = "8px";
        countryCard.style.padding = "10px";
        countryCard.style.textAlign = "center";
        countryCard.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
        countryCard.style.marginRight = "20px"; 

        countryCard.innerHTML = `
        
          <h2>${country.name.common}</h2>
        

         
        `;
        countryCard.onclick = () => viewCountryDetails(country.name.common);
        favoritesContainer.appendChild(countryCard);
      }
    });
  } catch (error) {
    console.error("Error fetching country details:", error);
    favoritesContainer.innerHTML = "<p>Error loading favorite countries.</p>";
  }
}


function removeFavorite(countryName) {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    
    const updatedFavorite = favorites.filter((e)=>e!== countryName)
    
    localStorage.setItem("favorites", JSON.stringify(updatedFavorite));
    displayFavorites()
    updateFavoritesCounter();
}
