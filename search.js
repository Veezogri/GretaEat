document.addEventListener("DOMContentLoaded", function() {
    const searchInput = document.getElementById("search-input");
    const searchBtn = document.getElementById("search-btn");
    const mealsContainer = document.getElementById("meals-container");

    function fetchMealsByName(name) {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`).then(response => response.json()).then(data => {
            mealsContainer.innerHTML = "";
            if (data.meals) {
                data.meals.forEach(meal => {
                    const mealCard = document.createElement("div");
                    mealCard.classList.add("meal-card");
                    mealCard.innerHTML = ` <img src="${meal.strMealThumb}" alt="${meal.strMeal}"> <h3>${meal.strMeal}</h3> <a href="meal.html?id=${meal.idMeal}" class="btn">Voir la recette</a> `;
                    mealsContainer.appendChild(mealCard);
                });
            } else {
                mealsContainer.innerHTML = "<p>Aucun plat trouvé pour cette recherche.</p>";
            }
        }).catch(error => {
            console.error("Erreur lors de la récupération des plats :", error);
            mealsContainer.innerHTML = "<p>Une erreur s'est produite lors de la récupération des plats.</p>";
        });
    }
    searchBtn.addEventListener("click", function() {
        const query = searchInput.value.trim();
        if (query) {
            fetchMealsByName(query);
        } else {
            mealsContainer.innerHTML = "<p>Veuillez entrer un nom de plat à rechercher.</p>";
        }
    });
    searchInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            searchBtn.click();
        }
    });
});