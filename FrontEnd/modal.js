//import de la fonction displayProjects pour mettre à jour la galerie principale
import { displayProjects } from './gallery.js';

// Variables
const modalGallery = document.querySelector(".modal__images");
const editButtonModal = document.querySelector(".edit__button");
const modalWrapper = document.querySelector(".modal__wrapper");
const closeModalButton = document.querySelector(".modal__gallery .fa-xmark");
const closeModalButtonAdd = document.querySelector(".modal__addProject .fa-xmark");
const modal = document.querySelector(".modal__gallery");
const modalAddProject = document.querySelector(".modal__addProject");
const modalButton = document.querySelector(".modal__button");
const backButton = document.querySelector(".fa-arrow-left");
const fileInput = document.getElementById("input__add");
const titleInput = document.getElementById("title");
const categoryInput = document.getElementById("categories-select");
const imgEl = document.getElementById("img__preview");
const iconEl = document.querySelector(".fa-image");
const labelEl = document.querySelector(".file__label");
const modalForm = document.getElementById("modal__form");
const error = document.getElementById("error");
const validationButton = document.getElementById("validation__button");


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

// Fermer la modale
closeModalButton.addEventListener("click", function (event) {
    modalWrapper.style.display = "none";
});

// Fermer la modale sur la deuxième vue
closeModalButtonAdd.addEventListener("click", function (event) {
    modalWrapper.style.display = "none";
});

// Ouvrir la 2e vue de la modale
modalButton.addEventListener("click", function (event) {
    modal.style.display = "none";
    modalAddProject.style.display = "flex";
})

// Retour sur la 1ere vue de la modale
backButton.addEventListener("click", function (event) {
    modal.style.display = "flex";
    modalAddProject.style.display = "none";
})

// Fermer la modale en cliquant en dehors
document.addEventListener("click", function (event) {
    if (!modal.contains(event.target) && !modalAddProject.contains(event.target) && !editButtonModal.contains(event.target)) {
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

// messages d'erreur du formulaire
modalForm.addEventListener("submit", (e) => {
    e.preventDefault();

    //Envoi du formulaire
    const formData = new FormData(modalForm);

    // Afficher les données envoyées dans la console
    for (let item of formData) {
        console.log(item[0], item[1]);
    }

    fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
    console.log('Projet ajouté :', data);  // Afficher l'objet projet
    if (data.id) {
        // alert('Le projet a été ajouté avec succès !');
        modalForm.reset();
        document.getElementById('img__preview').src = '';
        validationButton.setAttribute("disabled", "true");
        iconEl.classList.remove("hidden");
        labelEl.classList.remove("hidden");
        error.classList.add("hidden");

        displayProjects(); // Met à jour la galerie principale
        displayModalProjects(); // Met à jour la galerie de la modale
    } else {
        console.error('Erreur lors de l\'ajout du projet : ', data);
    }
    })
    .catch(error => {
        console.error("Erreur lors de l'ajout du projet :", error);
    });
});

// Preview image
fileInput.addEventListener("change", (event) => {
    if (event?.target?.files && event.target.files[0]) {
        // Affiche l'aperçu de l'image
        imgEl.src = URL.createObjectURL(event.target.files[0]);

        // Masque l'icône et le label
        iconEl.classList.add("hidden");
        labelEl.classList.add("hidden");

        // Libère l'URL une fois l'image chargée
        imgEl.onload = () => URL.revokeObjectURL(imgEl.src);
    }
});

// Fonction pour vérifier si tous les champs sont remplis
function checkFormCompletion() {
    console.log("Vérification des champs..."); // Pour voir si la fonction est appelée
    if (titleInput.value !== "" && categoryInput.value !== "" && fileInput.value !== "") {
        validationButton.removeAttribute("disabled");
    } else {
        validationButton.setAttribute("disabled", "true");
    }
}

// Ajouter des écouteurs d'événements sur chaque champ pour vérifier en temps réel
titleInput.addEventListener("input", checkFormCompletion);
categoryInput.addEventListener("change", checkFormCompletion);
fileInput.addEventListener("change", checkFormCompletion);

// Initialiser la vérification à l'ouverture du formulaire
checkFormCompletion();
