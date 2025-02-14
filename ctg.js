document.addEventListener("DOMContentLoaded", function() {
    const params = new URLSearchParams(window.location.search);
    const category = params.get("category");
    if (category) {
        fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`).then(response => response.json()).then(data => {
            console.log(data);
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
                mealsContainer.innerHTML = "<p>Aucun plat trouvé pour cette catégorie.</p>";
            }
        }).catch(error => {
            console.error("Erreur lors de la récupération des plats :", error);
            document.getElementById("meals-container").innerHTML = "<p>Une erreur s'est produite lors de la récupération des plats.</p>";
        });
    } else {
        document.getElementById("meals-container").innerHTML = "<p>Aucune catégorie spécifiée.</p>";
    }
});
        



