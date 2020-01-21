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
    let id = "#projekt" + e.srcElement.dataset.projekt

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


function skapa(elm, options = {}, text) {
    const element = document.createElement(elm)

    if (text) {
        element.textContent = text
    }
    for (const opt in options) {
        element.setAttribute(opt, options[opt])
    }

    return element
}

function skapaIkon(klass, titel = "", storlek = "") {
    const options = {
        class: `${klass} ${storlek}`,
        title: titel
    }
    const i = skapa("i", options)
    return i
}

function skapaA(adress, text = "") {
    const options = {
        href: adress,
        target: "_blank",
        rel: "noopener"
    }
    const a = skapa("a", options, text)
    return a
}

function skapaImg(filnamn, header) {
    const options = {
        src: `/img/${filnamn}600b.jpg`,
        alt: `Skärmklipp av ${header}`,
        "data-projekt": filnamn
    }

    const img = skapa("img", options)
    return img
}

async function laddaProjekt() {
    const json = await fetch("src/projekt.json")
    const artiklar = await json.json()

    for (const artikel in artiklar.projekt) {
        if (artikel !== "default") { //För att inte visa "mallObjektet" i JSON-filen

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
            const rubrik = skapa("h1", {}, header)
            const container = skapa("div", {
                class: "container"
            })

            const divMeta = skapa("div")



            const a = live !== "" ? skapaA(live) : skapaA("#")
            a.className = "live"
            const lankBild = skapaImg(filnamn, header)
            lankBild.className = "screenshot"

            a.append(lankBild)

            let workInProgress = ""

            if (inprogress) {
                workInProgress = skapa("span")
                workInProgress.className = "workInProgress"
                workInProgress.append(skapaIkon("fas fa-tools"), "Arbete pågår med sidan", skapaIkon("fas fa-tools"))
            }

            const verktygsDiv = skapa("div", {
                class: "verktyg"
            })

            for (verk in verktyg) {
                if (verktyg[verk]) {
                    verktygsDiv.append(skapaIkon(artiklar.verktygslada[verk], verk))
                }
            }

            divMeta.append(a, workInProgress, verktygsDiv)

            const divProjektInformation = skapa("div", {
                class: "projektText"
            })

            const p = skapa("p", {}, sammanfattning)
            const projektLankar = skapa("div", {
                class: "projektLankar"
            })

            const merinfo = skapaA("#", "bakgrund")
            merinfo.className = "merinfo"
            merinfo.dataset.projekt = filnamn
            const githubLank = skapaA(github, "github")
            githubLank.className = "github"
            const liveLank = live ? skapaA(live, "live") : ""

            projektLankar.append(merinfo, githubLank, liveLank)

            divProjektInformation.append(p, projektLankar)

            container.append(divMeta, divProjektInformation)
            article.append(rubrik, container, skapa("hr"))
            document.querySelector(".projekt").append(article)


            // MODULER - DETALJSIDAN

            //TODO: skapa div för modals och koppla dem dit

            const projektBakgrund = skapa("article", {
                class: "projektBakgrund",
                id: `projekt${filnamn}`
            })

            const iClose = skapaIkon("far fa-window-close", "stäng fönster", "fa-2x")
            iClose.setAttribute("tabindex", "0")

            const rubrikMerInfo = skapa("h1", {}, header)

            const hallare = skapa("div")
            const hallareImg = skapa("div", {
                class: "hallareImg"
            })

            const exempelBild = skapaImg(filnamn, header)
            exempelBild.className = "screenshotBakgrund"

            hallareImg.append(exempelBild)


            const projektText = skapa("div", {
                class: "projektText"
            })

            const {
                behov,
                utmaningar,
                special
            } = detaljtext

            const ul = skapa("ul")
            const liBehov = skapa("li")
            const aBehov = skapa("a", {
                class: "meny active",
                href: `#behov${filnamn}`
            }, "behov")
            liBehov.append(aBehov)

            const liUtmaningar = skapa("li")
            const aUtmaningar = skapa("a", {
                class: "meny",
                href: `#utmaningar${filnamn}`,
            }, "utmaningar")

            liUtmaningar.append(aUtmaningar)
            ul.append(liBehov, liUtmaningar)


            const pBehov = skapa("p", {
                id: `behov${filnamn}`,
                class: "meny-item",
                active: ""
            }, behov)

            const pUtmaningar = skapa("p", {
                id: `utmaningar${filnamn}`,
                class: "meny-item"
            }, utmaningar)

            let pSpecial = "" //TODO: snygga till lösning

            if (special) {
                // TODO: gör så alla menyerna läggs till med loop och samma med länkar
                const liSpecial = skapa("li")
                const aSpecial = skapa("a", {
                    class: "meny",
                    href: `#special${filnamn}`
                }, "special")
                liSpecial.append(aSpecial)
                ul.append(liSpecial)

                pSpecial = skapa("p", {
                    id: `special${filnamn}`,
                    class: "meny-item"
                }, special)
            }

            projektLankarMerInfo = skapa("div", {
                class: "projektLankar"
            })

            const githubLankMerInfo = skapaA(github, "github")
            githubLankMerInfo.className = "github"
            const liveLankMerInfo = live ? skapaA(live, "live") : ""
            projektLankarMerInfo.append(githubLankMerInfo, liveLankMerInfo)
            projektText.append(ul, pBehov, pUtmaningar, pSpecial, skapa("hr"), projektLankarMerInfo)


            hallare.append(hallareImg, projektText)
            projektBakgrund.append(iClose, rubrikMerInfo, hallare)
            document.querySelector(".projektmoduler").append(projektBakgrund)




        }


























    }
}