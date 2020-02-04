function taBortPlatsHallareBilder() {
    // går igenom och döljer alla platshållarbilder
    let bilder = document.querySelectorAll("img")
    for (let bild of bilder) {

        let src = bild.getAttribute("src")

        if (src.includes("missing")) {
            bild.style.display = "none"
        }
    }
}

function multiEventListener(element, funktionen) {
    // för att enkelt kunna lägga till flera olika eventlisteners. Element är det som ska stängas
    function typAvEvent(e) {
        // måste vara nestad för att multifunktionen ska få tillgång till element
        if (!e.key && !e.target.closest(".projektBakgrund") || e.key === "Escape") {
            funktionen(element);
            this.removeEventListener("keydown", typAvEvent);
            this.removeEventListener("mouseup", typAvEvent);
        }
    }
    // de events som ska trigga. Måste finnas motsvarigheter i func "typavevent"
    document.body.addEventListener("keydown", typAvEvent);
    document.body.addEventListener("mouseup", typAvEvent);
}

function sorteraProjekt(e) {
    // döljer alla artiklar som inte har ikon med samma titel som ikonen som triggade funktionen 
    if (e.target.tagName === "I") {
        const sortering = e.target.title
        const allaProjekt = document.querySelectorAll(".projekt article")

        for (const projekt of allaProjekt) {
            // ändra från titel till data-verktyg
            const visa = projekt.querySelector("[title~=" + sortering + "]")
            if (visa) {
                projekt.classList.add("sortShow")
                projekt.classList.remove("sortHide")

            } else {
                projekt.classList.add("sortHide")
                projekt.classList.remove("sortShow")
            }
        }
    }
}

function finnsYtterligareInfo(detaljtext) {
    for (let text in detaljtext) {
        if (detaljtext[text]) {
            return true
        }
    }
    return false
}