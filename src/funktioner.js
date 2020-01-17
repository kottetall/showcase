function devEnv() {
    if (window.location.hostname != "localhost" && window.location.hostname != "127.0.0.1") {
        // taBortPlatsHallareBilder()
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
        // TODO: slå ihop detta event med multi!
        dolj(modal);
    });

    //TODO: Lägga till så att backbutton på mobil kan stänga modal

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
            // ändra från titel till data-verktyg
            const visa = projekt.querySelector("[title~=" + sortering + "]")
            if (visa) {
                projekt.style.display = "block"
            } else {
                projekt.style.display = "none"
            }
        }
    }
}
/*
TODO:
Snygga till skapa m.fl ex:
    skapa(elm,options = { klass, text, attributes = {src: värde, srcset: värde etc}})

*/

// function test(elm, options) {

//     const {
//         klass,
//         annat,
//         attributes,
//         attributes: {
//             src
//         }
//     } = options

//     if (elm) {
//         console.log("elm funkar", elm)
//     }
//     if (options.klass) {
//         console.log("klass funkar", options.klass)
//     }
//     if (attributes) {
//         console.log("attributes funkar", attributes)
//     }

//     if (src) {
//         console.log("src funkar", src)
//     }

// }


// test("Teststräng", {
//     klass: "klassens sak",
//     text: "ja",
//     attributes: {
//         src: "src verkar också funka som den ska"
//     }
// })

function skapa(elm, klass, text) {
    const element = document.createElement(elm)
    if (klass) {
        element.className = klass
    }
    if (text) {
        element.textContent = text
    }
    return element
}

function skapaIkon(klass, titel = "", storlek = "") {
    const i = skapa("i", `${klass} ${storlek}`)
    i.setAttribute("title", titel)
    return i
}

function skapaA(adress, text = "") {
    const a = skapa("a", "", text)
    a.setAttribute("href", adress)
    a.setAttribute("target", "_blank")
    a.setAttribute("rel", "noopener")
    return a
}

function skapaImg(filnamn, header) {
    const img = skapa("img")
    img.setAttribute("srcset", `/img/${filnamn}600b.webp 600w, /img/${filnamn}300b.webp 300w`)
    img.setAttribute("src", `/img/${filnamn}600b.jpg`)
    img.setAttribute("alt", `Skärmklipp av ${header}`)
    img.dataset.projekt = filnamn
    return img
}

async function laddaProjekt() {
    console.log("Funkar som det ska")
    const json = await fetch("src/projekt.json")
    const artiklar = await json.json()

    for (const artikel in artiklar.projekt) {
        const {
            filnamn,
            inprogress,
            verktyg,
            header,
            sammanfattning,
            detaljtext,
            live,
            github
        } = artiklar.projekt[artikel]

        // MAIN
        const article = skapa("article")
        const rubrik = skapa("h1", "", header)
        const container = skapa("div", "container")

        const divMeta = skapa("div")



        const a = skapaA(live)
        a.className = "live"
        const lankBild = skapaImg(filnamn, header)

        a.append(lankBild)

        let workInProgress = ""

        if (inprogress) {
            workInProgress = skapa("span")
            workInProgress.className = "workInProgress"
            workInProgress.append(skapaIkon("fas fa-tools"), "Arbete pågår med sidan", skapaIkon("fas fa-tools"))
        }

        const verktygsDiv = skapa("div", "verktyg")
        // verktygsDiv.className = "verktyg"

        for (verk in verktyg) {
            if (verktyg[verk]) {
                verktygsDiv.append(skapaIkon(artiklar.verktygslada[verk], verk))
            }
        }

        divMeta.append(a, workInProgress, verktygsDiv)

        const divProjektText = skapa("div", "projektText")

        const p = skapa("p", "", sammanfattning)
        const projektLankar = skapa("div", "projektLankar")

        const merinfo = skapaA("merinfo", "bakgrund")
        merinfo.dataset.projekt = filnamn
        const githubLank = skapaA(github, "github")
        githubLank.className = "github"
        const liveLank = live ? skapaA(live, "live") : ""

        projektLankar.append(merinfo, githubLank, liveLank)

        divProjektText.append(p, projektLankar)

        container.append(divMeta, divProjektText)
        article.append(rubrik, container)
        document.querySelector(".projekt").append(article)

    }
}