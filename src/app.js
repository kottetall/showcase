"use strict"

window.addEventListener("DOMContentLoaded", () => {
    // Om JavaScript inte funkar eller är avstängt gör detta att ett varningsmeddelande visas. Om JS funkar så visas inte rutan
    document.querySelector(".jsMissing").style.display = "none";

    // tar bort(snarare väljer att inte visa) element som kräver js om js inte funkar
    document.querySelectorAll(".merinfo").forEach((info) => {
        info.style.display = "inline";
    });

    // "Tar bort" sorteringen. Väljer att inte använda querySelectorAll(".merinfo, .sortering") och slå samman med ovan, då detta blir tydligare. 
    document.querySelector(".sortering").style.display = "block"

    document.querySelector(".sorteringsalternativ").addEventListener("click", sorteraProjekt)

    // kollar om sidan visas i testmiljön och tar bort banner samt visar platshållarbilder
    // devEnv()


    // För att kunna "återställa" projektlista
    document.querySelector(".sortering .fa-undo-alt").addEventListener("click", () => {
        const allaProjekt = document.querySelectorAll(".projekt article")

        for (const projekt of allaProjekt) {
            projekt.style.display = "block"
        }
    }, {
        passive: "true"
    })

    // för modals - öppna och stänga
    let merInfos = document.querySelectorAll(".merinfo");
    for (let merInfo of merInfos) {
        merInfo.addEventListener("click", oppnaModal);
    };

});