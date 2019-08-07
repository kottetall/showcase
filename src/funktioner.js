function devEnv() {
    if (window.location.hostname != "localhost" && window.location.hostname != "127.0.0.1") {
        taBortPlatsHallareBilder()
        laggTillConstructionBanner()
    }
}

function laggTillConstructionBanner() {
    document.getElementById("construction").style.display = "block"
}

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

function dolj(element) {
    //verkar krävas för att kunna ta bort lyssnaren på body - onödigt att lyssna efter tangenter när modals stängts
    element.style.display = "none";
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

function oppnaModal(e) {
    e.preventDefault();
    let id = "#projekt" + e.srcElement.dataset["projekt"]

    // öppnar modal
    let modal = document.querySelector(id);
    modal.style.display = "block";
    // gör så att första texten öppnas automatiskt
    let link = document.querySelector(id + " .meny");
    // link.focus();
    link.click()

    //lägger till eventlistener för klick på kryssrutan
    let kryssruta = document.querySelector(id + " i");
    kryssruta.addEventListener("click", (e) => {
        // TODO! slå ihop detta event med multi!
        dolj(modal);
    });

    //eventlist. för modal - tangenter och tryck utanför. Separat funktion
    multiEventListener(modal, dolj);

    let navigering = document.querySelectorAll(id + " .meny");
    for (let nav of navigering) {
        nav.addEventListener("click", (e) => {
            e.preventDefault()
            let malId = e.target.hash;
            let ursprung = document.querySelector(id + " .active");
            let ursprungId = ursprung.hash;
            ursprung.classList.remove("active");
            e.target.classList.add("active");

            document.querySelector(ursprungId).style.display = "none";
            document.querySelector(malId).style.display = "block";
        });
    }
}

function sorteraProjekt(e) {
    // döljer alla artiklar som inte har ikon med samma titel som ikonen som triggade funktionen 
    if (e.target.tagName === "I") {
        const sortering = e.target.title
        const allaProjekt = document.querySelectorAll(".projekt article")

        for (const projekt of allaProjekt) {
            const visa = projekt.querySelector("[title~=" + sortering + "]")
            if (visa) {
                projekt.style.display = "block"
            } else {
                projekt.style.display = "none"
            }
        }
    }
}