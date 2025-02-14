document.addEventListener("DOMContentLoaded", () => {
    const alphabetContainer = document.getElementById("alphabet-container");
    const mealsContainer = document.getElementById("meals-container");
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    alphabet.forEach(letter => {
        const letterButton = document.createElement("button");
        letterButton.textContent = letter;
        letterButton.classList.add("alphabet-button");
        letterButton.addEventListener("click", () => fetchMealsByFirstLetter(letter));
        alphabetContainer.appendChild(letterButton);
    });

    function fetchMealsByFirstLetter(letter) {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`).then(response => response.json()).then(data => {
            mealsContainer.innerHTML = "";
            if (data.meals) {
                data.meals.forEach(meal => {
                    const mealCard = document.createElement("div");
                    mealCard.classList.add("meal-card");
                    mealCard.innerHTML = ` <img src="${meal.strMealThumb}" alt="${meal.strMeal}"> <h3>${meal.strMeal}</h3> <a href="meal.html?id=${meal.idMeal}" class="btn">Voir la recette</a> `;
                    mealsContainer.appendChild(mealCard);
                });
            } else {
                mealsContainer.innerHTML = "<p>Aucun plat trouvé pour cette lettre.</p>";
            }
        }).catch(error => {
            console.error("Erreur lors de la récupération des plats :", error);
            mealsContainer.innerHTML = "<p>Une erreur s'est produite lors de la récupération des plats.</p>";
        });
    }
});