// scripts.js actualizado con imágenes al adivinar

let personajes = [];
let personajesecreto = null;
let divResultados = document.getElementById("resultados");
let divAcierto = document.getElementById("acierto");
let input = document.getElementById("InputNombre");
let sugerencias = document.getElementById("sugerencias");
let reiniciarBtn = document.getElementById("reiniciarBtn");
let divImagen = document.createElement("div");
divImagen.classList.add("imagen-personaje");

// Cargar personajes y elegir uno al azar
function cargarPersonajes() {
    fetch("characters.json")
        .then(respuesta => respuesta.json())
        .then(data => {
            personajes = data;
            elegirPersonajeSecreto();
        })
        .catch(error => {
            console.log("error al cargar personajes", error);
        });
}

function elegirPersonajeSecreto() {
    let cantidad = personajes.length;
    let idElegido = Math.floor(Math.random() * cantidad) + 1;
    personajesecreto = personajes.find(p => p.id === idElegido);
    console.log("Personaje a buscar elegido", personajesecreto.name);
}

function ConsultarPersonaje() {
    let fila = document.createElement("div");
    fila.classList.add("fila");

    let respuesta = input.value;
    let personajeEncontrado = personajes.find(p => p.name.toLowerCase() === respuesta.toLowerCase());
    if (!personajeEncontrado) {
        divAcierto.innerHTML = "❌ Ese personaje no existe.";
        return;
    }

    agregarCuadro(fila, personajeEncontrado.name, personajeEncontrado.name === personajesecreto.name);
    agregarCuadro(fila, "Raza", personajeEncontrado.species === personajesecreto.species);
    agregarCuadro(fila, "Género", personajeEncontrado.gender === personajesecreto.gender);
    agregarCuadro(fila, "Mascota", personajeEncontrado.pet === personajesecreto.pet);
    agregarCuadro(fila, "Color", personajeEncontrado.color === personajesecreto.color);
    agregarCuadro(fila, "Año", personajeEncontrado.year === personajesecreto.year);

    divResultados.appendChild(fila);

    if (personajeEncontrado.name.toLowerCase() === personajesecreto.name.toLowerCase()) {
        divAcierto.innerHTML = "🔥 ¡Adivinaste el personaje secreto! 🔥";

        if (personajesecreto.image) {
            let img = document.createElement("img");
            img.src = personajesecreto.image;
            img.alt = personajesecreto.name;
            divImagen.innerHTML = "";
            divImagen.appendChild(img);
            document.querySelector(".contenedor").appendChild(divImagen);
        }
    } else {
        divAcierto.innerHTML = "❌ Casi, seguí intentando.";
    }

    input.value = "";
    sugerencias.innerHTML = "";
}

function agregarCuadro(fila, texto, correcto) {
    let cuadrito = document.createElement("div");
    cuadrito.classList.add("cuadro");
    cuadrito.textContent = texto;
    cuadrito.classList.add(correcto ? "correcto" : "incorrecto");
    fila.appendChild(cuadrito);
}

input.addEventListener("input", () => {
    sugerencias.innerHTML = "";
    let texto = input.value.toLowerCase();
    if (texto.length === 0) return;

    let coincidencias = personajes.filter(p => p.name.toLowerCase().startsWith(texto));
    coincidencias.forEach(p => {
        let sugerencia = document.createElement("div");
        sugerencia.classList.add("sugerencia");
        sugerencia.textContent = p.name;
        sugerencia.addEventListener("click", () => {
            input.value = p.name;
            sugerencias.innerHTML = "";
        });
        sugerencias.appendChild(sugerencia);
    });
});

document.addEventListener("click", function(event) {
    if (!sugerencias.contains(event.target) && event.target !== input) {
        sugerencias.innerHTML = "";
    }
});

reiniciarBtn.addEventListener("click", reiniciarJuego);

function reiniciarJuego() {
    divResultados.innerHTML = "";
    divAcierto.innerHTML = "";
    input.value = "";
    sugerencias.innerHTML = "";
    divImagen.innerHTML = "";
    elegirPersonajeSecreto();
}

// Iniciar juego al cargar la página
cargarPersonajes();
