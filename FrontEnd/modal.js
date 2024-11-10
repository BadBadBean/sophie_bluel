//import de la fonction displayProjects pour mettre à jour la galerie principale
import { displayProjects } from './gallery.js';

// Variables
const modalGallery = document.querySelector(".modal__gallery");
const editButtonModal = document.querySelector(".edit__button");
const modalWrapper = document.querySelector(".modal__wrapper");
const closeModalButton = document.querySelector(".fa-xmark");
const modal = document.querySelector(".modal");


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
    modalGallery.innerHTML = "";
    images.forEach(image => {
        const imageModalContainer = document.createElement("div");  // Un conteneur pour l'image et l'icône
        imageModalContainer.classList.add("modal__content");
        
        const imageModal = document.createElement("img");
        imageModal.src = image.imageUrl;
        imageModal.alt = image.title || "Image sans description";
        
        const deleteIcon = document.createElement("i");
        deleteIcon.classList.add("fa-solid");
        deleteIcon.classList.add("fa-trash-can");
        deleteIcon.id = image.id

        // Ajouter l'icône au conteneur
        imageModalContainer.appendChild(deleteIcon);
        imageModalContainer.appendChild(imageModal);
        
        modalGallery.appendChild(imageModalContainer);
    });
    deleteProject ()
}
// Afficher les projets
displayModalProjects();

//Afficher la modale
editButtonModal.addEventListener("click", function (event) {
    modalWrapper.style.display = "flex";
  });

// // Fermer la modale
closeModalButton.addEventListener("click", function (event) {
    modalWrapper.style.display = "none";
});

// Fermer la modale en cliquant en dehors de la modale
document.addEventListener("click", function (event) {
    if (!modal.contains(event.target) && !editButtonModal.contains(event.target)) {
        modalWrapper.style.display = "none";
    }
});

// Fonction pour supprimer un projet
function deleteProject() {
    const deleteIconButton = document.querySelectorAll(".fa-trash-can");
    deleteIconButton.forEach(icon => {
        icon.addEventListener("click", async function(event) {
            const id = icon.id;
            
            try {
                const response = await fetch(`http://localhost:5678/api/works/${id}`, {
                    method: "DELETE",
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("token")
                    }
                });

                if (response.ok) {
                    const imageModalContainer = icon.closest('.modal__content');
                    modalGallery.removeChild(imageModalContainer);
                    console.log("Projet supprimé");
                    displayProjects();
                } else {
                    console.error("Erreur lors de la suppression du projet");
                }
            } catch (error) {
                console.error("Impossible de supprimer le projet : ", error.message);
            }
        });
    });
}