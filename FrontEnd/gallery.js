// Variables
const filtersContainer = document.querySelector(".filters");
const gallery = document.querySelector(".gallery");
const editBanner = document.querySelector(".edit");
const projectEdit = document.querySelector(".projects__edit");
const editButton = document.querySelector(".edit__button");
const filtersButton = document.querySelector(".filters");
const logout = document.querySelector(".logout");

editMode();

// Fonction pour récupérer les catégories
async function fetchCategories() {
    const response = await fetch("http://localhost:5678/api/categories");
    if (response.ok) {
        return response.json();
    }
    throw new Error("Impossible de récupérer les catégories");
}

// Fonction pour récupérer les projets
async function fetchProjects() {
    const response = await fetch("http://localhost:5678/api/works");
    if (response.ok) {
        return response.json();
    }
    throw new Error("Impossible de contacter le serveur");
}

// Fonction pour afficher les filtres
async function displayFilters() {
    try {
        const categories = await fetchCategories();
        
        // Ajouter un bouton pour "Tout"
        const allButton = document.createElement("button");
        allButton.classList.add("filter", "active");
        allButton.id = "Tout";
        allButton.textContent = "Tout";
        filtersContainer.appendChild(allButton);

        // Créer un bouton pour chaque catégorie
        categories.forEach(category => {
            const filterButton = document.createElement("button");
            filterButton.classList.add("filter");
            filterButton.id = category.name; // Utilise le nom de la catégorie comme ID
            filterButton.textContent = category.name;
            filtersContainer.appendChild(filterButton);
        });

        // Ajouter l'événement de filtre pour chaque bouton
        addFilterEventListeners();
    } catch (error) {
        console.error(error.message);
    }
}

// Fonction pour ajouter les événements aux filtres
function addFilterEventListeners() {
    const filters = document.querySelectorAll(".filters button");

    filters.forEach(filter => {
        filter.addEventListener("click", function(event) {
            const tag = event.currentTarget.id;

            // Retirer la classe active de tous les boutons
            filters.forEach(btn => btn.classList.remove("active"));
            // Ajouter la classe active au bouton cliqué
            event.currentTarget.classList.add("active");

            const images = document.querySelectorAll(".gallery figure");
            images.forEach(image => {
                const imgElement = image.querySelector("img");
                if (imgElement.dataset.category === tag || tag === "Tout") {
                    image.style.display = "block"; // Afficher l'image
                } else {
                    image.style.display = "none"; // Masquer l'image
                }
            });
        });
    });
}

// Fonction pour afficher les projets
export async function displayProjects() {
    try {
        const images = await fetchProjects(); // Attendre les images
        displayImages(images); // Afficher les images
    } catch (error) {
        console.error(error.message); // Gérer l'erreur
    }
}

// Créer la galerie
function displayImages(images) {
    gallery.innerHTML = "";
    images.forEach(image => {
        const imageContainer = document.createElement("figure");

        const imgElement = document.createElement("img");
        imgElement.src = image.imageUrl;
        imgElement.alt = image.title || "Image sans description";
        imgElement.dataset.category = image.category.name;

        const captionElement = document.createElement("figcaption");
        captionElement.textContent = image.title || 'Aucune légende disponible';

        imageContainer.appendChild(imgElement);
        imageContainer.appendChild(captionElement);
        gallery.appendChild(imageContainer);
    });
}

// Afficher les projets
displayProjects();


// Fonction pour mettre à jour le texte du lien de déconnexion et ajouter une marge
function editMode() {
    const token = window.localStorage.getItem("token");
    if (token !== null) {
        logout.innerText = "logout";
        editBanner.style.display = "flex";
        editButton.style.display = "block";
        filtersButton.style.display = "none";
        projectEdit.classList.add("projects__edit--visible");
    } else {
        logout.innerText = "login";
        filtersButton.style.display = "flex";
        projectEdit.classList.remove("projects__edit--visible");
    }
}

// Déconnexion de l'utilisateur
logout.addEventListener("click", function(event) {
    localStorage.removeItem("token");
});

// Récupérer les catégories, afficher les filtres et les projets
fetchCategories()
    .then(() => {
        displayFilters();  // Afficher les filtres
        return fetchProjects(); // Puis récupérer et afficher les projets
    })
    .then(images => {
        displayImages(images); // Afficher les projets dans la galerie
    })
    .catch(error => {
        console.error(error.message); // Gérer les erreurs
    });