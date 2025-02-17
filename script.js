document.addEventListener("DOMContentLoaded", () => {
    setupEventListeners();
    loadCategories();
    loadCategoryMeals();
    loadMealDetails();
    setupAlphabetButtons();
    setupSearchFunctionality();
    

    // ✅ Exécuter fetchMealsByArea() UNIQUEMENT si on est sur area.html
    if (window.location.href.includes("area.html")) {
        fetchMealsByArea();
    }

    if (window.location.href.includes("areas.html")) {
        LoadAreas();
    }

    if (document.getElementById("random-btn")) {
        setupEventListeners();
    }

    // ✅ Exécuter MealsByIngredient() UNIQUEMENT si on est sur ingredient.html
    if (window.location.href.includes("ingredient.html")) {
        const params = new URLSearchParams(window.location.search);
        const ingredient = params.get("ingredient");
    
        if (ingredient) {
            MealsByIngredient(ingredient);
        } else {
            const mealsContainer = document.getElementById("meals-container");
            if (mealsContainer) {
                mealsContainer.innerHTML = "<p>Aucun ingrédient spécifié.</p>";
            }
        }
    }
    
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

        // Récupérer les conteneurs
        const randomContainer = document.getElementById("container-random");
        const searchContainer = document.getElementById("meals-containerSearch");

        if (!randomContainer || !searchContainer) {
            throw new Error("Conteneurs introuvables.");
        }

        // ✅ Si une recherche a été effectuée, on la supprime avant d'afficher un plat aléatoire
        searchContainer.innerHTML = "";

        // ✅ Effacer le contenu précédent du randomContainer
        randomContainer.innerHTML = "";

        // Création d'une nouvelle div pour le plat aléatoire
        const cardrandom = document.createElement("div");
        cardrandom.classList.add("random-card");

        cardrandom.innerHTML = `
                <h2>${meal.strMeal}</h2>
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <p><strong>Catégorie :</strong> ${meal.strCategory}</p>
                <p><strong>Origine :</strong> ${meal.strArea}</p>
                <a href="meal.html?id=${meal.idMeal}">Voir la recette</a>
            
        `;

        // ✅ Ajouter la nouvelle carte au conteneur randomContainer
        randomContainer.appendChild(cardrandom);

    } catch (error) {
        console.error("Erreur lors de la récupération du plat aléatoire :", error);

        const randomContainer = document.getElementById("container-random");
        if (randomContainer) {
            randomContainer.innerHTML = "<p>Une erreur est survenue. Veuillez réessayer.</p>";
        }
    }
}


// 🟢 Fonction pour gérer les événements (ex: bouton random meal)
function setupEventListeners() {
    const randomBtn = document.getElementById("random-btn");
    if (randomBtn) {
        randomBtn.addEventListener("click", loadRandomMeal);
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
            <a href="categorie.html?category=${encodeURIComponent(category.strCategory)}" class="category-link">
                <img src="${category.strCategoryThumb}" alt="${category.strCategory}">
                <h3>${category.strCategory}</h3></a>
                
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
                <a href="meal.html?id=${meal.idMeal}" class="BoutonPage">Voir la recette</a>
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
        document.getElementById("meal-name").textContent = `Recette : ${meal.strMeal}`; ;

        let ingredientsList = "";
        let footerLinks = "";

        for (let i = 1; i <= 20; i++) {
            const ingredient = meal[`strIngredient${i}`];
            const measure = meal[`strMeasure${i}`];
            if (ingredient) {
                ingredientsList += `<li>${ingredient} - ${measure}</li>`;
                footerLinks += `<a href="ingredient.html?ingredient=${encodeURIComponent(ingredient)}" class="btn">${ingredient}</a> `;
            }
        }

        // ✅ Vérifier que le conteneur existe
        const mealContainer = document.getElementById("meal-details");
        if (!mealContainer) {
            console.error("❌ Conteneur 'meal-details' introuvable !");
            return;
        }

        // ✅ Création d'une div pour styliser le plat
        const mealcard = document.createElement("div");
        mealcard.classList.add("meal-cardmeal");
        mealcard.innerHTML = `
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <h3>Catégorie : <a href="categorie.html?category=${encodeURIComponent(meal.strCategory)}">${meal.strCategory}</a></h3>
            <h3>Origine : <a href="area.html?area=${encodeURIComponent(meal.strArea)}">${meal.strArea}</a></h3>
            <h3>Ingrédients :</h3>
            <ul>${ingredientsList}</ul>
            <h3>Instructions :</h3>
            <p>${meal.strInstructions}</p>
        `;

        // ✅ Nettoyage et ajout du plat
        mealContainer.innerHTML = "";
        mealContainer.appendChild(mealcard);

        // ✅ Ajout des liens des ingrédients dans le footer
        document.getElementById("meal-footer").innerHTML = `
            <h3>Voir d'autres recettes avec ces ingrédients :</h3>
            ${footerLinks}
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
                <a href="meal.html?id=${meal.idMeal}" class="BoutonPage">Voir la recette</a>
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
    const mealsContainer = document.getElementById("meals-containerSearch");

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

        const mealsContainer = document.getElementById("meals-containerSearch");
        const randomContainer = document.getElementById("container-random");

        if (!mealsContainer || !randomContainer) return;

        // ✅ Si un plat aléatoire a été généré, on l'efface avant d'afficher les résultats de recherche
        randomContainer.innerHTML = "";

        // Nettoyage du conteneur avant affichage des résultats de recherche
        mealsContainer.innerHTML = "";

        if (!data.meals) {
            mealsContainer.innerHTML = "<p>Aucun plat trouvé pour cette recherche.</p>";
            return;
        }

        // ✅ Génération des cartes de plats
        data.meals.forEach(meal => {
            const mealCard = document.createElement("div");
            mealCard.classList.add("meal-card");
            mealCard.innerHTML = `
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <h3>${meal.strMeal}</h3>
                <a href="meal.html?id=${meal.idMeal}" class="BoutonPage">Voir la recette</a>
            `;
            mealsContainer.appendChild(mealCard);
        });

    } catch (error) {
        console.error("Erreur lors de la récupération des plats :", error);
        document.getElementById("meals-containerSearch").innerHTML = "<p>Une erreur s'est produite lors de la récupération des plats.</p>";
    }
}



// 🟢 Fonction pour lister les zones géographiques 
async function LoadAreas() {
    try {
        const response = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?a=list");
        const data = await response.json();

        const areasContainer = document.getElementById("areas-container");
        if (!areasContainer) return;

        areasContainer.innerHTML = "";

        if (!data.meals) {
            areasContainer.innerHTML = "<p>Aucune zone trouvée.</p>";
            return;
        }

        data.meals.forEach(area => {
            const areaCard = document.createElement("div");
            areaCard.classList.add("area-card");

            // ✅ Création d'un lien <a> qui redirige vers area.html
            const areaLink = document.createElement("a");
            areaLink.href = `area.html?area=${encodeURIComponent(area.strArea)}`;
            areaLink.textContent = area.strArea;
            areaLink.classList.add("area-link");

            areaCard.appendChild(areaLink);
            areasContainer.appendChild(areaCard);
        });

    } catch (error) {
        console.error("Erreur lors de la récupération des zones :", error);
        document.getElementById("areas-container").innerHTML = "<p>Une erreur s'est produite lors de la récupération des zones.</p>";
    }
}





// 🟢 Fonction pour filter les plats par zone géographique
async function fetchMealsByArea() {
    const params = new URLSearchParams(window.location.search);
    const area = params.get("area");

    if (!area) {
        document.getElementById("meals-container").innerHTML = "<p>Aucune zone sélectionnée.</p>";
        return;
    }

    try {
        const apiUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`;
        console.log("📡 URL API envoyée :", apiUrl); // ✅ Vérifier l’URL envoyée à l’API

        const response = await fetch(apiUrl);
        const data = await response.json();

        const mealsContainer = document.getElementById("meals-container2");


        const titleheader = document.getElementById("titleheader");
        titleheader.innerHTML = `Plats de la zone sélectionnée : ${area}`;

        if (!data.meals) {
            mealsContainer.innerHTML += "<p>Aucun plat trouvé pour cette zone géographique.</p>";
            return;
        }

        data.meals.forEach(meal => {
            const mealCard = document.createElement("div");
            mealCard.classList.add("meal-card2");
            mealCard.innerHTML = `
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <h3>${meal.strMeal}</h3>
                <a href="meal.html?id=${meal.idMeal}" class="BoutonPage">Voir la recette</a>
            `;
            mealsContainer.appendChild(mealCard);
        });

    } catch (error) {
        console.error("❌ Erreur lors de la récupération des plats :", error);
        document.getElementById("meals-container").innerHTML = "<p>Une erreur s'est produite lors de la récupération des plats.</p>";
    }
}





// 🟢 Fonction pour afficher sous forme de vignettes, les plats appartenant à un ingrédient passé en paramètre dans l’URL. 


async function MealsByIngredient(ingredient){
    console.log("Ingrédient reçu :", ingredient); // ✅ Vérifier si l’ingrédient est bien passé

    try{
        const reponse = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`);
        const data = await reponse.json();

        console.log("URL API :", `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`); // ✅ Vérifier l'URL de la requête
        console.log("Données API :", data); // ✅ Vérifier la réponse API

        const mealsContainer = document.getElementById("meals-container");
        if (!mealsContainer) return;

        mealsContainer.innerHTML = "";

        if (!data.meals) {
            mealsContainer.innerHTML = "<p>Aucun plat trouvé pour cet ingrédient.</p>";
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

    }
    catch (error) {
        console.error("Erreur lors de la récupération des plats :", error);
        document.getElementById("meals-container").innerHTML = "<p>Une erreur s'est produite lors de la récupération des plats.</p>";
    }
}









