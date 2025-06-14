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
})
