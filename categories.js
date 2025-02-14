document.addEventListener("DOMContentLoaded", () => {
    fetch("https://www.themealdb.com/api/json/v1/1/categories.php").then(response => response.json()).then(data => {
        let container = document.getElementById("categories-container");
        container.innerHTML = "";
        data.categories.forEach(category => {
            let div = document.createElement("div");
            div.classList.add("category-card");
            div.innerHTML = ` <img src="${category.strCategoryThumb}" alt="${category.strCategory}"> <h3>${category.strCategory}</h3> <p>${category.strCategoryDescription.substring(0, 100)}...</p> <a href="categorie.html?category=${category.strCategory}" class="btn">Voir les plats</a> `;
            container.appendChild(div);
        });
    }).catch(error => console.error("Erreur lors de la récupération des catégories :", error));
});

