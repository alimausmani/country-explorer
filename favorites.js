const favoritesContainer = document.getElementById("favorites-container");

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

async function displayFavorites() {
  favoritesContainer.innerHTML = "";

  if (favorites.length === 0) {
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

    favorites.forEach(favoriteName => {
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
          <img src="${country.flags.png}" alt="${country.name.common} flag" style="width: 100%; height: auto; border-radius: 5px;" />
          <h2>${country.name.common}</h2>
          <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
          <p><strong>Region:</strong> ${country.region}</p>
          <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : "N/A"}</p>
          <p><strong>Subregion:</strong> ${country.subregion || "N/A"}</p>
          <p><strong>Languages:</strong> ${country.languages ? Object.values(country.languages).join(", ") : "N/A"}</p>
          <p><strong>Currency:</strong> ${
            country.currencies
              ? Object.values(country.currencies).map(curr => curr.name).join(", ")
              : "N/A"
          }</p>
        `;
        favoritesContainer.appendChild(countryCard);
      }
    });
  } catch (error) {
    console.error("Error fetching country details:", error);
    favoritesContainer.innerHTML = "<p>Error loading favorite countries.</p>";
  }
}

window.addEventListener("load", displayFavorites);
