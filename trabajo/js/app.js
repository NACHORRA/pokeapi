import { getList } from './poke.js'; // Asegúrate de que esta ruta sea correcta

const pokeContent = document.getElementById("pokeContent");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const noResults = document.getElementById("noResults");

const displayPokemons = (filteredPokemons) => {
    pokeContent.innerHTML = ""; 
    noResults.style.display = "none";  

    if (filteredPokemons.length === 0) {
        noResults.style.display = "block";  
    } else {
        filteredPokemons.forEach((pokemon) => {
            const content = document.createElement("div");
            content.className = "pokeCard";
            content.innerHTML = `
                <img src="${pokemon.image}" alt="${pokemon.name}">
                <h3>${pokemon.name}</h3>
                <h5>Tipo Principal: ${pokemon.types[0]}</h5>  <!-- Mostrar el primer tipo -->
                <p>Altura: ${pokemon.height.toFixed(2)} m</p>  <!-- Altura convertida a metros -->
                <p>Peso: ${pokemon.weight.toFixed(2)} kg</p>  <!-- Peso convertido a kilogramos -->
            `;
            pokeContent.append(content);;  
            localStorage.setItem("lastPokemon", JSON.stringify(filteredPokemons[0]));  
        });
    }
};


const handleSearch = async () => {
    const searchTerm = searchInput.value.toLowerCase();
    let allPokemons = [];
    let page = 0;
    let found = false;

    while (!found) {
        const result = await getList(page);
        allPokemons = allPokemons.concat(result.pokemons);
        const filteredPokemons = allPokemons.filter((pokemon) => 
            pokemon.name.toLowerCase().startsWith(searchTerm) || 
            pokemon.id.toString().startsWith(searchTerm)
        );

        if (filteredPokemons.length > 0) {
            displayPokemons(filteredPokemons);
            found = true; 
        } else if (result.next) {
            page++;
        } else {
            noResults.style.display = "block";
            found = true;
        }
    }
};
searchButton.addEventListener("click", handleSearch);

window.addEventListener("load", () => {
    const lastPokemon = localStorage.getItem("lastPokemon");
    if (lastPokemon) {
        displayPokemons([JSON.parse(lastPokemon)]);
    }
});
