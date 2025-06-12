document.addEventListener("DOMContentLoaded", async () => {
    const search_nav = document.querySelector("[data-search_nav]")
    const lazyImages = document.querySelectorAll("img[data-src]")
    const pokemon_items = document.querySelectorAll(".pokemon_item")

    if (!search_nav) return

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target
                img.src = img.dataset.src
                img.removeAttribute("data-src")
                observer.unobserve(img)
            }
        })
    })

    lazyImages.forEach(img => imageObserver.observe(img))

    search_nav.addEventListener("input", (e) => {
        const searchValue = e.target.value.trim().toLowerCase()
        console.log(searchValue)

        pokemon_items.forEach(item => {
            const itemText = item.children[2]?.textContent?.trim()?.toLowerCase() || ""
            item.style.display = searchValue.length === 0 || itemText.includes(searchValue) ? "grid" : "none"
        })
    })
})
