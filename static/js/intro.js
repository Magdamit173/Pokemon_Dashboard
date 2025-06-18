document.addEventListener("DOMContentLoaded", () => {
    // Create the alert container dynamicallyAdd commentMore actions
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