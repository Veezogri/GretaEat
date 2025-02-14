document.getElementById("random-btn").addEventListener("click", () => {
    fetch("https://www.themealdb.com/api/json/v1/1/random.php").then(response => response.json()).then(data => {
                let meal = data.meals[0];
                let container = document.getElementById("meal-container");
                let ingredients = "";
                for (let i = 1; i <= 20; i++) {
                    if (meal[`strIngredient${i}`]) {
                        ingredients += `<li>${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}</li>`; } } container.innerHTML = ` <h2>${meal.strMeal}</h2> <img src="${meal.strMealThumb}" alt="${meal.strMeal}"> <p><strong>Catégorie :</strong> ${meal.strCategory}</p> <p><strong>Origine :</strong> ${meal.strArea}</p> <h3>Ingrédients :</h3> <ul>${ingredients}</ul> <h3>Instructions :</h3> <p>${meal.strInstructions}</p> `; })
                        .catch(error => console.error("Erreur lors de la récupération des données :", error));
                        
});


