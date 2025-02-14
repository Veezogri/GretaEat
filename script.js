document.addEventListener("DOMContentLoaded", () => {
    setupEventListeners();
    loadRandomMeal();
    loadCategories();
    loadCategoryMeals();
    loadMealDetails();
    setupAlphabetButtons();
    setupSearchFunctionality();
});

// 🟢 Fonction pour charger un plat aléatoire
async function loadRandomMeal() {
    try {
        const response = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
        const data = await response.json();

        if (!data.meals) {
            throw new Error("Aucun plat trouvé.");
        }

        const meal = data.meals[0];
        const container = document.getElementById("meal-container");
        
        let ingredients = "";
        for (let i = 1; i <= 20; i++) {
            if (meal[`strIngredient${i}`]) {
                ingredients += `<li>${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}</li>`;
            }
        }

        container.innerHTML = `
            <h2>${meal.strMeal}</h2>
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <p><strong>Catégorie :</strong> ${meal.strCategory}</p>
            <p><strong>Origine :</strong> ${meal.strArea}</p>
            <h3>Ingrédients :</h3>
            <ul>${ingredients}</ul>
            <h3>Instructions :</h3>
            <p>${meal.strInstructions}</p>
        `;
    } catch (error) {
        console.error("Erreur lors de la récupération du plat aléatoire :", error);
        document.getElementById("meal-container").innerHTML = "<p>Une erreur est survenue. Veuillez réessayer.</p>";
    }
}

// 🟢 Fonction pour charger les catégories
async function loadCategories() {
    try {
        const response = await fetch("https://www.themealdb.com/api/json/v1/1/categories.php");
        const data = await response.json();

        const container = document.getElementById("categories-container");
        if (!container) return;

        container.innerHTML = "";

        if (!data.categories) {
            throw new Error("Aucune catégorie trouvée.");
        }

        data.categories.forEach(category => {
            let div = document.createElement("div");
            div.classList.add("category-card");
            div.innerHTML = `
                <img src="${category.strCategoryThumb}" alt="${category.strCategory}">
                <h3>${category.strCategory}</h3>
                <p>${category.strCategoryDescription.substring(0, 100)}...</p>
                <a href="categorie.html?category=${category.strCategory}" class="btn">Voir les plats</a>
            `;
            container.appendChild(div);
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des catégories :", error);
        document.getElementById("categories-container").innerHTML = "<p>Une erreur est survenue lors du chargement des catégories.</p>";
    }
}

// 🟢 Fonction pour charger les plats d'une catégorie spécifique
async function loadCategoryMeals() {
    const mealsContainer = document.getElementById("meals-container");
    
    // Vérifier si on est bien sur la page categorie.html
    if (!mealsContainer || !window.location.href.includes("categorie.html")) return;

    const params = new URLSearchParams(window.location.search);
    const category = params.get("category");

    if (!category) {
        mealsContainer.innerHTML = "<p>Aucune catégorie spécifiée.</p>";
        return;
    }

    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
        const data = await response.json();

        mealsContainer.innerHTML = ""; // Nettoyage du conteneur

        if (!data.meals) {
            mealsContainer.innerHTML = "<p>Aucun plat trouvé pour cette catégorie.</p>";
            return;
        }

        data.meals.forEach(meal => {
            const mealCard = document.createElement("div");
            mealCard.classList.add("meal-card");
            mealCard.innerHTML = `
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <h3>${meal.strMeal}</h3>
                <a href="meal.html?id=${meal.idMeal}" class="btn">Voir la recette</a>
            `;
            mealsContainer.appendChild(mealCard);
        });

    } catch (error) {
        console.error("Erreur lors de la récupération des plats :", error);
        mealsContainer.innerHTML = "<p>Une erreur est survenue lors de la récupération des plats.</p>";
    }
}


// 🟢 Fonction pour charger les détails d'un plat spécifique
async function loadMealDetails() {
    const params = new URLSearchParams(window.location.search);
    const mealId = params.get("id");

    if (!mealId) {
        const mealContainer = document.getElementById("meal-details");
        if (mealContainer) mealContainer.innerHTML = "<p>Aucun identifiant de plat fourni.</p>";
        return;
    }

    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
        const data = await response.json();

        if (!data.meals) {
            document.getElementById("meal-name").textContent = "Plat non trouvé";
            document.getElementById("meal-details").innerHTML = "<p>Aucun détail disponible pour ce plat.</p>";
            return;
        }

        const meal = data.meals[0];
        document.getElementById("meal-name").textContent = meal.strMeal;

        let ingredients = "";
        for (let i = 1; i <= 20; i++) {
            const ingredient = meal[`strIngredient${i}`];
            const measure = meal[`strMeasure${i}`];
            if (ingredient) {
                ingredients += `<li>${ingredient} - ${measure}</li>`;
            }
        }

        document.getElementById("meal-details").innerHTML = `
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <h3>Catégorie : ${meal.strCategory}</h3>
            <h3>Origine : ${meal.strArea}</h3>
            <h3>Ingrédients :</h3>
            <ul>${ingredients}</ul>
            <h3>Instructions :</h3>
            <p>${meal.strInstructions}</p>
        `;
    } catch (error) {
        console.error("Erreur lors de la récupération des détails du plat :", error);
        document.getElementById("meal-name").textContent = "Erreur";
        document.getElementById("meal-details").innerHTML = "<p>Une erreur s'est produite lors de la récupération des détails du plat.</p>";
    }
}



// 🟢 Fonction pour initialiser les boutons de l'alphabet
function setupAlphabetButtons() {
    const alphabetContainer = document.getElementById("alphabet-container");
    if (!alphabetContainer) return; // Vérifier si l'élément existe

    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    alphabet.forEach(letter => {
        const letterButton = document.createElement("button");
        letterButton.textContent = letter;
        letterButton.classList.add("alphabet-button");
        letterButton.addEventListener("click", () => fetchMealsByFirstLetter(letter));
        alphabetContainer.appendChild(letterButton);
    });
}

// 🟢 Fonction asynchrone pour récupérer les plats par première lettre
async function fetchMealsByFirstLetter(letter) {
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`);
        const data = await response.json();

        const mealsContainer = document.getElementById("meals-container");
        if (!mealsContainer) return; // Vérifier si l'élément existe

        mealsContainer.innerHTML = ""; // Vider le conteneur avant d'ajouter du contenu

        if (!data.meals) {
            mealsContainer.innerHTML = "<p>Aucun plat trouvé pour cette lettre.</p>";
            return;
        }

        // Génération des cartes de plats
        data.meals.forEach(meal => {
            const mealCard = document.createElement("div");
            mealCard.classList.add("meal-card");
            mealCard.innerHTML = `
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <h3>${meal.strMeal}</h3>
                <a href="meal.html?id=${meal.idMeal}" class="btn">Voir la recette</a>
            `;
            mealsContainer.appendChild(mealCard);
        });

    } catch (error) {
        console.error("Erreur lors de la récupération des plats :", error);
        document.getElementById("meals-container").innerHTML = "<p>Une erreur s'est produite lors de la récupération des plats.</p>";
    }
}


function setupSearchFunctionality() {
    const searchInput = document.getElementById("search-input");
    const searchBtn = document.getElementById("search-btn");
    const mealsContainer = document.getElementById("meals-container");

    if (!searchInput || !searchBtn || !mealsContainer) return; // Vérifier si les éléments existent

    // Événement au clic sur le bouton recherche
    searchBtn.addEventListener("click", () => {
        const query = searchInput.value.trim();
        if (query) {
            fetchMealsByName(query);
        } else {
            mealsContainer.innerHTML = "<p>Veuillez entrer un nom de plat à rechercher.</p>";
        }
    });

    // Événement pour activer la recherche avec "Entrée"
    searchInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            searchBtn.click();
        }
    });
}

// 🟢 Fonction asynchrone pour récupérer les plats par nom
async function fetchMealsByName(name) {
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`);
        const data = await response.json();

        const mealsContainer = document.getElementById("meals-container");
        if (!mealsContainer) return; // Vérifier si l'élément existe

        mealsContainer.innerHTML = ""; // Nettoyage du conteneur avant affichage

        if (!data.meals) {
            mealsContainer.innerHTML = "<p>Aucun plat trouvé pour cette recherche.</p>";
            return;
        }

        // Génération des cartes de plats
        data.meals.forEach(meal => {
            const mealCard = document.createElement("div");
            mealCard.classList.add("meal-card");
            mealCard.innerHTML = `
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <h3>${meal.strMeal}</h3>
                <a href="meal.html?id=${meal.idMeal}" class="btn">Voir la recette</a>
            `;
            mealsContainer.appendChild(mealCard);
        });

    } catch (error) {
        console.error("Erreur lors de la récupération des plats :", error);
        document.getElementById("meals-container").innerHTML = "<p>Une erreur s'est produite lors de la récupération des plats.</p>";
    }
}
// 🟢 Fonction pour gérer les événements (ex: bouton random meal)
function setupEventListeners() {
    const randomBtn = document.getElementById("random-btn");
    if (randomBtn) {
        randomBtn.addEventListener("click", loadRandomMeal);
    }
}

