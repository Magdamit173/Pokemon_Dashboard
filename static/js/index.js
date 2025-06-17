document.addEventListener("DOMContentLoaded", async () => {
    const search_nav = document.querySelector("[data-search_nav]")
    const lazyImages = document.querySelectorAll("img[data-src]")
    const pokemon_items = document.querySelectorAll(".pokemon_item")

    if (!search_nav) return

    // Lazy load images
    const imageObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return
            const img = entry.target
            img.src = img.dataset.src
            img.removeAttribute("data-src")
            imageObserver.unobserve(img)
        })
    })

    lazyImages.forEach(img => imageObserver.observe(img))

    let currentSearch = ""
    let currentTypes = new Array()

    const filterPokemon = () => {
        pokemon_items.forEach(item => {
            const number = item.children[1]?.textContent?.trim()?.toLowerCase() || ""
            const name = item.children[2]?.textContent?.trim()?.toLowerCase() || ""
            const type1 = item.children[3]?.textContent?.trim()?.toLowerCase() || ""
            const type2 = item.children[4]?.textContent?.trim()?.toLowerCase() || ""

            const matchesSearch = name.includes(currentSearch) || number.includes(currentSearch)

            const matchesType = (() => {
                if (currentTypes.length === 0) return true
                if (currentTypes.length === 1) {
                    return (
                        (currentTypes.includes(type1) && !type2) ||
                        (currentTypes.includes(type2) && !type1)
                    )
                }
                if (currentTypes.length === 2) {
                    return currentTypes.includes(type1) && currentTypes.includes(type2)
                }
                return false
            })()

            item.style.display = matchesType && matchesSearch ? "grid" : "none"
        })

    }

    search_nav.addEventListener("input", e => {
        currentSearch = e.target.value.trim().toLowerCase()
        filterPokemon()
    })

    await new MultiSelectTag("pokemon_types", {
        required: false,
        placeholder: "Search Types",
        onChange: selected => {
            currentTypes = selected.map(item => item.label.toLowerCase())
            filterPokemon()
        }
    })


    // THIS IS CRINGE AS FUCK PLS DONT DO THIS IN THE MY FUTURE SELF XD ----- RV MDM
    document.querySelectorAll(".pokemon_item").forEach(async item => {
        item.addEventListener("click",async () => {
            // Hide the list
            document.querySelector(".pokemon_list").style.display = "none"

            // Show the overview
            document.querySelector(".pokemon_overview").style.display = "block"

            // Extract Pokémon data attributes
            const pokemonData = item.dataset

            // Pokemon Profile

            document.querySelector(".pokemon_profile").src = await fetchPokemonImage(pokemonData.english_name)
            document.querySelector(".pokemon_overview_hexagon").src = await fetchPokemonChart(pokemonData.english_name)

            // Update overview sections with data
            document.querySelector(".pokemon_overview_name").textContent = pokemonData.english_name
            document.querySelector(".pokemon_overview_description").textContent = `${pokemonData.classification}`
            document.querySelector(".pokemon_overview_primary_type").innerHTML =  await fetchTypeBadge(pokemonData.primary_type)
            document.querySelector(".pokemon_overview_secondary_type").innerHTML = await fetchTypeBadge(pokemonData.secondary_type) || "None"

            document.querySelector(".pokemon_overview_title").textContent = `${pokemonData.english_name}'s Base Stat`
            document.querySelector(".pokemon_overview_hp").textContent = `${pokemonData.hp}`
            document.querySelector(".pokemon_overview_atk").textContent = `${pokemonData.attack}`
            document.querySelector(".pokemon_overview_def").textContent = `${pokemonData.defense}`
            document.querySelector(".pokemon_overview_sp_atk").textContent = `${pokemonData.sp_attack}`
            document.querySelector(".pokemon_overview_sp_def").textContent = `${pokemonData.sp_defense}`
            document.querySelector(".pokemon_overview_spd").textContent = `${pokemonData.speed}`
            document.querySelector(".pokemon_overview_total").textContent = `${pokemonData.total}`

            document.querySelector(".pokemon_overview_classification").textContent = pokemonData.classification
            document.querySelector(".pokemon_overview_generation").textContent = `${pokemonData.generation}`

            document.querySelector(".pokemon_overview_is_sublegendary").textContent = `${pokemonData.is_sublegendary == "1" ? "Yes" : "No"}`
            document.querySelector(".pokemon_overview_is_legendary").textContent = `${pokemonData.is_legendary == "1" ? "Yes" : "No"}`
            document.querySelector(".pokemon_overview_is_mythical").textContent = `${pokemonData.is_mythical == "1" ? "Yes" : "No"}`

            document.querySelector(".pokemon_overview_percent_male").textContent = `${pokemonData.percent_male}%`
            document.querySelector(".pokemon_overview_percent_female").textContent = `${pokemonData.percent_female}%`
            document.querySelector(".pokemon_overview_height_m").textContent = `${pokemonData.height_m}m`
            document.querySelector(".pokemon_overview_weight_kg").textContent = `${pokemonData.weight_kg}kg`
            document.querySelector(".pokemon_overview_capture_rate").textContent = `C${pokemonData.capture_rate}`
            document.querySelector(".pokemon_overview_base_egg_steps").textContent = `${pokemonData.base_egg_steps}`

            document.querySelector(".pokemon_overview_abilities_0").textContent = pokemonData.abilities_0
            document.querySelector(".pokemon_overview_abilities_1").textContent = pokemonData.abilities_1 !== "nan" ? pokemonData.abilities_1 : "None"
            document.querySelector(".pokemon_overview_abilities_2").textContent = pokemonData.abilities_2 !== "nan" ? pokemonData.abilities_2 : "None"
            document.querySelector(".pokemon_overview_abilities_hidden").textContent = pokemonData.abilities_hidden

            document.querySelector(".pokemon_overview_gigantamax").textContent = pokemonData.gigantamax !== "nan" ? pokemonData.gigantamax : "None"
            document.querySelector(".pokemon_overview_mega_evolution").textContent = pokemonData.mega_evolution !== "nan" ? pokemonData.mega_evolution : "None"
            document.querySelector(".pokemon_overview_mega_evolution_alt").textContent = pokemonData.mega_evolution_alt !== "nan" ? pokemonData.mega_evolution_alt : "None"

            document.querySelector(".pokemon_overview_evochain_0").textContent = pokemonData.evochain_0
            document.querySelector(".pokemon_overview_evochain_1").textContent = pokemonData.evochain_1 !== "nan" ? pokemonData.evochain_1 : "None"
            document.querySelector(".pokemon_overview_evochain_2").textContent = pokemonData.evochain_2 !== "nan" ? pokemonData.evochain_2 : "None"
            document.querySelector(".pokemon_overview_evochain_3").textContent = pokemonData.evochain_3 !== "nan" ? pokemonData.evochain_3 : "None"
            document.querySelector(".pokemon_overview_evochain_4").textContent = pokemonData.evochain_4 !== "nan" ? pokemonData.evochain_4 : "None"
            document.querySelector(".pokemon_overview_evochain_5").textContent = pokemonData.evochain_5 !== "nan" ? pokemonData.evochain_5 : "None"
            document.querySelector(".pokemon_overview_evochain_6").textContent = pokemonData.evochain_6 !== "nan" ? pokemonData.evochain_6 : "None"

            // Loop through all type resistances dynamically
            const typeList = ["normal", "fire", "water", "electric", "grass", "ice", "fighting", "poison", "ground", "flying", "psychic", "bug", "rock", "ghost", "dragon", "dark", "steel", "fairy"]
            typeList.forEach(type => {
                document.querySelector(`.pokemon_overview_against_${type}`).textContent = `${pokemonData[`against_${type}`]}`
            })
        })
    })

})


async function fetchPokemonImage(identifier) {
    try {
        const response = await fetch(`/image_match?identifier=${encodeURIComponent(identifier)}`);

        if (!response.ok) throw new Error("❌ Failed to fetch Pokémon image.");

        // Read response directly as text
        const base64Image = await response.text(); 

        return base64Image; // Should already be formatted correctly
    } catch (error) {
        console.error(error);
        return null;
    }
}


async function fetchPokemonChart(pokemonName) {
    try {
        console.log(`Fetching chart for: ${pokemonName}`); // Debugging log

        const response = await fetch(`/pokemon-chart?pokemon_name=${encodeURIComponent(pokemonName)}`);

        if (!response.ok) throw new Error("❌ Failed to fetch Pokémon chart.");

        // Read response directly as text since Flask returns a raw base64 string
        const base64Image = await response.text(); 

        return base64Image; // Should already be formatted correctly
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function fetchTypeBadge(pokemonType) {
    try {
        console.log(`Fetching type badge for: ${pokemonType}`); // Debugging log

        const response = await fetch(`/type-badge?pokemon_type=${encodeURIComponent(pokemonType)}`);

        if (!response.ok) throw new Error("❌ Failed to fetch type badge.");

        // Read response directly as text since Flask returns an HTML-styled badge
        const badgeHtml = await response.text(); 

        return badgeHtml; // Already formatted for direct use
    } catch (error) {
        console.error(error);
        return null;
    }
}

