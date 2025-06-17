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

    // Navigator


    const navItems = document.querySelectorAll("[data-nav]")
    const contentSections = document.querySelectorAll(".pokemon_home, .pokemon_list, .pokemon_dashboard, .pokemon_simulator, .pokemon_overview")

    function updateVisibility(event) {
        const selectedKey = event.target.getAttribute("data-nav");
        console.log(selectedKey);

        contentSections.forEach(section => {
            // First, set all sections to "none" to ensure no lingering visibility
            section.style.display = "none";
        });

        // Then, only display the selected section
        const activeSection = document.querySelector(`.${selectedKey}`);
        if (activeSection) {
            activeSection.style.display = "flex";
        }
    }


    navItems.forEach(item => {
        item.addEventListener("click", updateVisibility)
        item.addEventListener("change", updateVisibility)
        item.addEventListener("input", updateVisibility)
    })

    const left = document.querySelector(".left")
    const right = document.querySelector(".right")

    right.addEventListener("click", function () {
        alert("🚧 Feature not working yet! Version v2 coming soon.")
    })

    left.addEventListener("click", function () {
        alert("🚧 Feature not working yet! Version v2 coming soon.")
    })




    // THIS IS CRINGE AS FUCK PLS DONT DO THIS IN THE MY FUTURE SELF XD ----- RV MDM
    document.querySelectorAll(".pokemon_item").forEach(async item => {
        item.addEventListener("click", async () => {
            const pokemon_overview = document.querySelector(".pokemon_overview")

            // Hide the list
            document.querySelector(".pokemon_list").style.display = "none"

            // Show the overview
            pokemon_overview.style.display = "block"
            pokemon_overview.scrollTo(0, 0)

            // Extract Pokémon data attributes
            const pokemonData = item.dataset

            // Pokemon Profile

            document.querySelector(".pokemon_profile").src = await fetchPokemonImage(pokemonData.english_name)
            document.querySelector(".pokemon_overview_hexagon").src = await fetchPokemonChart(pokemonData.english_name)

            // Update overview sections with data
            document.querySelector(".pokemon_overview_name").textContent = pokemonData.english_name
            document.querySelector(".pokemon_overview_description").textContent = `${pokemonData.classification}`
            document.querySelector(".pokemon_overview_primary_type").innerHTML = await fetchTypeBadge(pokemonData.primary_type)
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

    // Create the alert container dynamically
    const startupAlert = document.createElement("div")
    startupAlert.className = "startup-alert"
    startupAlert.innerHTML = `
    <p>Created With: <strong>Rovic Magdamit (Rv Mdm), Justin Montealegre, Majeed Haque (Seven), James Gabata</strong></p>
    <button class="close-btn">✖</button>
`

    // Append the alert to the body
    document.body.appendChild(startupAlert)

    // Apply styles dynamically
    Object.assign(startupAlert.style, {
        position: "absolute",
        top: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        background: "linear-gradient(135deg, rgba(255, 72, 0, 0.9), rgba(255, 255, 255, 0.3))",
        color: "white",
        fontSize: "1rem",
        fontWeight: "bold",
        padding: "15px",
        borderRadius: "10px",
        textAlign: "center",
        boxShadow: "0px 4px 10px rgba(255, 165, 0, 0.4)",
        display: "none",
        maxWidth: "80%",
    })

    // Apply button styles dynamically
    const closeBtn = startupAlert.querySelector(".close-btn")
    Object.assign(closeBtn.style, {
        background: "transparent",
        border: "none",
        color: "white",
        fontSize: "1.2rem",
        fontWeight: "bold",
        cursor: "pointer",
        float: "right",
        marginLeft: "10px",
    })

    // Show the alert when the page loads
    window.onload = function () {
        startupAlert.style.display = "block"
    }

    // Hide the alert when the button is clicked
    closeBtn.addEventListener("click", () => {
        startupAlert.style.display = "none"
    })

    const frameremove = document.querySelector(".frameee")
    frameremove.addEventListener("click", () => {
        frameremove.remove()
    })

    // Create the iframe container dynamically
    const frameContainer = document.createElement("div")
    frameContainer.className = "frameee"
    frameContainer.innerHTML = `
    <iframe src="iframe/intro.html" class="frameremove" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 999; border: none;"></iframe>
`

    // Append it to the body on load
    
    document.body.appendChild(frameContainer)

    // Remove iframe when clicked
    frameContainer.addEventListener("click", () => {
        frameContainer.remove()
    })

})


async function fetchPokemonImage(identifier) {
    try {
        const response = await fetch(`/image_match?identifier=${encodeURIComponent(identifier)}`)

        if (!response.ok) throw new Error("❌ Failed to fetch Pokémon image.")

        // Read response directly as text
        const base64Image = await response.text()

        return base64Image // Should already be formatted correctly
    } catch (error) {
        console.error(error)
        return "nav_logo/pokeball.png"
    }
}


async function fetchPokemonChart(pokemonName) {
    try {
        console.log(`Fetching chart for: ${pokemonName}`) // Debugging log

        const response = await fetch(`/pokemon-chart?pokemon_name=${encodeURIComponent(pokemonName)}`)

        if (!response.ok) throw new Error("❌ Failed to fetch Pokémon chart.")

        // Read response directly as text since Flask returns a raw base64 string
        const base64Image = await response.text()

        return base64Image // Should already be formatted correctly
    } catch (error) {
        console.error(error)
        return null
    }
}

async function fetchTypeBadge(pokemonType) {
    try {
        console.log(`Fetching type badge for: ${pokemonType}`) // Debugging log

        const response = await fetch(`/type-badge?pokemon_type=${encodeURIComponent(pokemonType)}`)

        if (!response.ok) throw new Error("❌ Failed to fetch type badge.")

        // Read response directly as text since Flask returns an HTML-styled badge
        const badgeHtml = await response.text()

        return badgeHtml // Already formatted for direct use
    } catch (error) {
        console.error(error)
        return null
    }
}

