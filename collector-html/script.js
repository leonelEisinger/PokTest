function extractSprites(obj, path = "") {
    const sprites = [];

    for (const key in obj) {
        const value = obj[key];
        const currentPath = path ? `${path} -> ${key}` : key;

        if (!value) continue;

        if (typeof value === "string" && value.startsWith("http")) {
            const k = String(key);

            // Pular se for das costas ou de fêmea
            if (k.includes("back") || k.includes("female")) continue;

            // Manter apenas se for "shiny" ou "default"
            const isShiny = k.includes("shiny");
            const isDefault = k === "front_default";

            if (isShiny || isDefault) {
                // Label amigável sem "front_"
                let label = isShiny ? "Shiny" : "Normal";
                sprites.push({ label, url: value });
            }
        } else if (typeof value === "object") {
            sprites.push(...extractSprites(value, currentPath));
        }
    }

    return sprites;
}



let validPokemonList = [];

async function loadValidPokemonList() {
    if (validPokemonList.length > 0) return;

    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0");
    const data = await response.json();
    validPokemonList = data.results;
}

async function getRandomItem() {
    const btnOpen = document.getElementById("openBox");
    const loaderContainer = document.getElementById("loaderContainer");

    btnOpen.disabled = true;

    const loaderHTML = `
        <div class="loader">
            <div class="box box0"><div></div></div>
            <div class="box box1"><div></div></div>
            <div class="box box2"><div></div></div>
            <div class="box box3"><div></div></div>
            <div class="box box4"><div></div></div>
            <div class="box box5"><div></div></div>
            <div class="box box6"><div></div></div>
            <div class="box box7"><div></div></div>
            <div class="ground"><div></div></div>
        </div>
    `;
    loaderContainer.innerHTML = loaderHTML;

    setTimeout(async () => {
        await loadValidPokemonList();

        const randomPokemon = validPokemonList[Math.floor(Math.random() * validPokemonList.length)];
        const pokemonDetailsRes = await fetch(randomPokemon.url);
        const pokemonDetails = await pokemonDetailsRes.json();

        

        // Tipos
        const types = pokemonDetails.types.map(t => t.type.name).join(", ");

        // Pegar todos os sprites válidos
        const allSprites = extractSprites(pokemonDetails.sprites);

        // Sortear 1 sprite aleatório
        const randomSprite = allSprites[Math.floor(Math.random() * allSprites.length)];


        // Mostrar só 1 sprite
        loaderContainer.innerHTML = `
            <div class="pokemon-result">
                <h2>${randomPokemon.name.toUpperCase()}</h2>
                <p>Tipo(s): ${types}</p>
                <div class="sprite-item ${randomSprite.label === "Shiny" ? "shiny" : ""}">
                    <img src="${randomSprite.url}" alt="${randomPokemon.name}" />
                    <p>${randomSprite.label.toUpperCase()}</p>
                </div>
            </div>
        `;


        btnOpen.disabled = false;
    }, 2800);
}
