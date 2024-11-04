// Variables
const filters = document.querySelectorAll(".filter");
const gallery = document.querySelector(".gallery");
const editBanner = document.querySelector(".edit");
const projectEdit = document.querySelector(".projects__edit");
const editButton = document.querySelector(".edit__button");
const filtersButton = document.querySelector(".filters");
const logout = document.querySelector(".logout");

editMode();

// Fonction pour récupérer les projets
async function fetchProjects() {
    const response = await fetch("http://localhost:5678/api/works");
    if (response.ok) {
        return response.json();
    }
    throw new Error("Impossible de contacter le serveur");
}

// Fonction pour afficher les projets
async function displayProjects() {
    try {
        const images = await fetchProjects(); // Attendre les images
        displayImages(images); // Afficher les images
    } catch (error) {
        console.error(error.message); // Gérer l'erreur
    }
}

// Créer la galerie
function displayImages(images) {
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

// Gestion des filtres
for (let filter of filters) {
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
}

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