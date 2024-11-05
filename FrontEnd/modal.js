// Variables
const modalGallery = document.querySelector(".modal__gallery");


// Fonction pour récupérer les projets
async function modalProjects() {
    const response = await fetch("http://localhost:5678/api/works");
    if (response.ok) {
        return response.json();
    }
    throw new Error("Impossible de contacter le serveur");
}

// Fonction pour afficher les projets
async function displayModalProjects() {
    try {
        const images = await modalProjects(); // Attendre les images
        displayModalImages(images); // Afficher les images
    } catch (error) {
        console.error(error.message); // Gérer l'erreur
    }
}

// Fonction pour créer la galerie
function displayModalImages(images) {
    images.forEach(image => {
        const imageModalContainer = document.createElement("div");  // Un conteneur pour l'image et l'icône
        imageModalContainer.classList.add("modal__content");
        
        const imageModal = document.createElement("img");
        imageModal.src = image.imageUrl;
        imageModal.alt = image.title || "Image sans description";
        
        const deleteIcon = document.createElement("i");
        deleteIcon.classList.add("fa-solid");
        deleteIcon.classList.add("fa-trash-can");

        // Ajouter l'icône au conteneur
        imageModalContainer.appendChild(deleteIcon);
        imageModalContainer.appendChild(imageModal);
        
        modalGallery.appendChild(imageModalContainer);
    });
}

// Afficher les projets
displayModalProjects();

//Afficher la modale


//Fermer la modale