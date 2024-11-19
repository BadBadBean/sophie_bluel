// Variables
const form = document.getElementById("form")

// Event Listener sur le formulaire de connexion
form.addEventListener("submit", (e) => {
   e.preventDefault()
   const email = document.getElementById("email").value;
   const password = document.getElementById("password").value;
   login(email, password);
})

// fonction pour la connexion et le stockage du token
function login(email, password) {
    const url = "http://localhost:5678/api/users/login";

    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: email,
            password: password,
        }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Erreur dans la connexion");
        }
        return response.json();
    })
    .then(data => {
        console.log("Connexion réussie", data);
        localStorage.setItem("token", data.token);
        window.location = "index.html";
    })
    .catch(error => {
        console.error("Erreur :", error);
        alert("Connexion échouée. Vérifiez vos identifiants.");
    });
}