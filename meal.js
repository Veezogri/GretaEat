document.addEventListener("DOMContentLoaded", function() {
    const params = new URLSearchParams(window.location.search);
    const mealId = params.get("id");
    if (mealId) {
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`).then(response => response.json()).then(data => {
            if (data.meals) {
                const meal = data.meals[0];
                document.getElementById("meal-name").textContent = meal.strMeal;
                const mealDetailsElement = document.getElementById("meal-details");
                let ingredients = "";
                for (let i = 1; i <= 20; i++) {
                    const ingredient = meal[`strIngredient${i}`];
                    const measure = meal[`strMeasure${i}`];
                    if (ingredient) {
                        ingredients += `<li>${ingredient} - ${measure}</li>`;
                    }
                }
                mealDetailsElement.innerHTML = ` <img src="${meal.strMealThumb}" alt="${meal.strMeal}"> <h3>Catégorie : ${meal.strCategory}</h3> <h3>Origine : ${meal.strArea}</h3> <h3>Ingrédients :</h3> <ul>${ingredients}</ul> <h3>Instructions :</h3> <p>${meal.strInstructions}</p> `;
            } else {
                document.getElementById("meal-name").textContent = "Plat non trouvé";
                document.getElementById("meal-details").innerHTML = "<p>Aucun détail disponible pour ce plat.</p>";
            }
        }).catch(error => {
            console.error("Erreur lors de la récupération des détails du plat :", error);
            document.getElementById("meal-name").textContent = "Erreur";
            document.getElementById("meal-details").innerHTML = "<p>Une erreur s'est produite lors de la récupération des détails du plat.</p>";
        });
    } else {
        document.getElementById("meal-name").textContent = "Aucun identifiant de plat fourni";
        document.getElementById("meal-details").innerHTML = "<p>Veuillez fournir un identifiant de plat valide dans l'URL.</p>";
    }
});


document.addEventListener("DOMContentLoaded", function() {
    const params = new URLSearchParams(window.location.search);
    const category = params.get("category") || "";
    const letter = params.get("letter") || "";
    const searchQuery = params.get("search") || "";
    let apiUrl = "";
    if (category) {
        apiUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`;
    } else if (letter) {
        apiUrl = `https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`;
    } else if (searchQuery) {
        apiUrl = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchQuery}`;
    }
    if (apiUrl) {
        fetch(apiUrl).then(response => response.json()).then(data => {
            const mealsContainer = document.getElementById("meals-container");
            mealsContainer.innerHTML = "";
            if (data.meals) {
                data.meals.forEach(meal => {
                    const mealCard = document.createElement("div");
                    mealCard.classList.add("meal-card");
                    mealCard.innerHTML = ` <img src="${meal.strMealThumb}" alt="${meal.strMeal}"> <h3>${meal.strMeal}</h3> <a href="meal.html?id=${meal.idMeal}" class="btn">Voir la recette</a> `;
                    mealsContainer.appendChild(mealCard);
                });
            } else {
                mealsContainer.innerHTML = "<p>Aucun plat trouvé.</p>";
            }
        }).catch(error => {
            console.error("Erreur lors de la récupération des plats :", error);
            document.getElementById("meals-container").innerHTML = "<p>Une erreur est survenue.</p>";
        });
    } else {
        document.getElementById("meals-container").innerHTML = "<p>Veuillez sélectionner une catégorie, une lettre ou entrer une recherche.</p>";
    }
});


