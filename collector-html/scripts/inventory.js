import { getTypeColor } from './utils.js';

const statIcons = {
  hp: "❤️",
  attack: "⚔️",
  defense: "🛡️",
  "special-attack": "✨",
  "special-defense": "💫",
  speed: "⚡"
};


function loadInventory() {
    const inventory = JSON.parse(localStorage.getItem("inventory")) || [];
    const container = document.getElementById("inventoryContainer");

    function applyFilters() {
        const name = document.getElementById("nameFilter").value.toLowerCase();
        const type = document.getElementById("typeFilter").value;
        const label = document.getElementById("labelFilter").value;

        const filtered = inventory.filter(poke => {
            const matchName = poke.name.toLowerCase().includes(name);
            const matchType = type ? poke.types.includes(type) : true;
            const matchLabel = label ? poke.label === label : true;
            return matchName && matchType && matchLabel;
        });

        container.innerHTML = filtered.length > 0
        ? filtered.map((poke, index) => `
            <div class="pokemon-result" data-index="${index}">
                <h2>${poke.name.toUpperCase()}</h2>
                <div class="types">
                    ${poke.types.split(", ").map(type => {
                        const color = getTypeColor(type.trim());
                        return `<span class="type-badge" style="background-color: ${color};">${type}</span>`;
                    }).join("")}
                </div>
                <div class="sprite-item ${poke.label === "Shiny" ? "shiny" : ""}">
                    <img src="${poke.sprite}" alt="${poke.name}" />
                    ${poke.label === "Shiny" ? "" : `<p>${poke.label.toUpperCase()}</p>`}
                </div>

            </div>
        `).join("")
        : "<p>Nenhum Pokémon encontrado.</p>";

        // Adicionar eventos de clique para abrir o modal
        document.querySelectorAll('.pokemon-result').forEach((el, i) => {
            el.addEventListener('click', () => {
                openPokemonModal(filtered[i]);
            });
        });

    }

    // Eventos de filtro
    document.getElementById("nameFilter").addEventListener("input", applyFilters);
    document.getElementById("typeFilter").addEventListener("change", applyFilters);
    document.getElementById("labelFilter").addEventListener("change", applyFilters);

    // Inicial
    applyFilters();
}

window.loadInventory = loadInventory;

async function openPokemonModal(poke) {
    const modal = document.getElementById("modalOverlay");
    const content = document.getElementById("modalContent");

    // Buscar informações completas da API
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${poke.name}`);
    const data = await res.json();

    // Gerar HTML para tipos
    const typeBadges = data.types.map(t => {
        const color = getTypeColor(t.type.name);
        return `<span class="type-badge" style="background-color: ${color};">${t.type.name}</span>`;
    }).join("");

    // Habilidades
    const abilities = data.abilities.map(a => a.ability.name).join(", ");

    // Stats
    const stats = data.stats.map(s => `
    <div class="stat">
        <span class="stat-icon">${statIcons[s.stat.name]}</span> 
        <strong>${s.stat.name.toUpperCase()}</strong>: ${s.base_stat}
    </div>
    `).join("");


    // Mostrar modal
    content.innerHTML = `
        <span id="closeModal" class="modal-close">&times;</span>
        <h2>${poke.name.toUpperCase()}</h2>
        <div class="types">${typeBadges}</div>
        <div class="sprite-item ${poke.label === "Shiny" ? "shiny" : ""}">
            <img src="${poke.sprite}" alt="${poke.name}" />
            <p>${poke.label === "Shiny" ? "&nbsp;" : poke.label.toUpperCase()}</p>
        </div>


        <div class="info">
            <p><strong>Altura:</strong> ${data.height / 10} m</p>
            <p><strong>Peso:</strong> ${data.weight / 10} kg</p>
            <p><strong>Habilidades:</strong> ${abilities}</p>
            <div class="stats">
                <h4>Status Base:</h4>
                ${stats}
            </div>
        </div>
    `;

    modal.style.display = "flex";

    document.getElementById("closeModal").onclick = () => {
        modal.style.display = "none";
    };

    modal.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };
}


window.openPokemonModal = openPokemonModal;
