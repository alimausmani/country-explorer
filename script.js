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

const API_KEY = "c1a2f87bbe49892c9bcd8f6da7696d0c";  // Replace with your actual API key

// Fetch countries using the countrylayer API
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

// Function to populate the language filter dropdown
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

// // Function to display countries
// function displayCountries() {
//     const countriesToDisplay = filteredCountries.slice(displayedCountries, displayedCountries + countriesPerPage);
//     countriesToDisplay.forEach(country => {
//         const countryCard = document.createElement("div");
//         countryCard.className = "country-card";
//         countryCard.innerHTML = `
//                     <img src="${country.flags.png}" alt="Flag of ${country.name.common}" />
//                     <h2>${country.name.common}</h2>
//                     <button onclick="viewCountryDetails('${country.name.common}')">View Details</button>
//                     <button class="favorite-button" onclick="toggleFavorite('${country.name.common}')">
//                         ${favorites.includes(country.name.common) ? "Remove from Favorites" : "❤️"}
//                     </button>
//         `;
//         countryList.appendChild(countryCard);
//     });
//     displayedCountries += countriesToDisplay.length;
// }



// Function to display countries
function displayCountries() {
    const countriesToDisplay = filteredCountries.slice(displayedCountries, displayedCountries + countriesPerPage);
    countriesToDisplay.forEach(country => {
        const countryCard = document.createElement("div");
        countryCard.className = "country-card";

        // Set the card content without the "View Details" button
        countryCard.innerHTML = `
            <img src="${country.flags.png}" alt="Flag of ${country.name.common}" />
            <h2>${country.name.common}</h2>
            <button class="favorite-button" onclick="event.stopPropagation(); toggleFavorite('${country.name.common}')">
                ${favorites.includes(country.name.common) ? "Remove from Favorites" : "❤️"}
            </button>
        `;

        // Make the entire card clickable to show details
        countryCard.onclick = () => viewCountryDetails(country.name.common);

        // Append the card to the list
        countryList.appendChild(countryCard);
    });
    displayedCountries += countriesToDisplay.length;
}

// Function to filter countries based on search, region, and language
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

// Function to display suggestions based on search input
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

// Function to handle selecting a suggestion
function selectSuggestion(countryName) {
    searchInput.value = countryName;
    filterCountries();
    suggestionsDropdown.style.display = "none";
}

// Function to toggle a country as a favorite
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

// Function to update the favorites counter
function updateFavoritesCounter() {
    favoritesCounter.textContent = favorites.length;
}

// Function to reset favorites and update the counter on page load
window.addEventListener("load", () => {
    favorites = [];
    localStorage.removeItem("favorites");
    updateFavoritesCounter();
});

// Function to redirect to the favorites page
function showFavoritesPage() {
    window.location.href = "favorites.html";
}

// Function to view details of a selected country
function viewCountryDetails(countryName) {
    const country = countries.find(c => c.name.common === countryName);
    localStorage.setItem("selectedCountry", JSON.stringify(country));
    window.location.href = "country-details.html";
}

// Event listeners for filters and search input
searchInput.addEventListener("input", filterCountries);
regionFilter.addEventListener("change", filterCountries);
languageFilter.addEventListener("change", filterCountries);
loadMoreButton.addEventListener("click", displayCountries);

// Fetch the country data from API
fetchCountries();
