"use strict"

window.addEventListener("DOMContentLoaded", async () => {

    // Om JavaScript inte funkar eller är avstängt gör detta att ett varningsmeddelande visas. Om JS funkar så visas inte rutan
    document.querySelector(".jsMissing").style.display = "none";

    // tar bort(snarare väljer att inte visa) element som kräver js om js inte funkar
    document.querySelectorAll(".merinfo").forEach((info) => {
        info.style.display = "inline";
    });


    // Laddar projekten, förutsatt att JS körs och det inte är IE(Fetch används)

    await laddaProjekt()


    // "Tar bort" sorteringen. Väljer att inte använda querySelectorAll(".merinfo, .sortering") och slå samman med ovan, då detta blir tydligare. 
    document.querySelector(".sortering").style.display = "block"

    document.querySelector(".sorteringsalternativ").addEventListener("click", sorteraProjekt)

    // kollar om sidan visas i testmiljön och tar bort banner samt visar platshållarbilder
    // devEnv()


    // För att kunna "återställa" projektlista
    document.querySelector(".sortering .fa-undo-alt").addEventListener("click", () => {
        const allaProjekt = document.querySelectorAll(".projekt article")

        // console.log()

        for (const projekt of allaProjekt) {
            projekt.classList.remove("sortHide")
            projekt.classList.add("sortShow")
        }
    }, {
        passive: "true"
    })

    // för modals - öppna och stänga
    let merInfos = document.querySelectorAll(".merinfo");
    for (let merInfo of merInfos) {

        merInfo.addEventListener("click", oppnaModal);
    };

    // för stora bilder vid hover
    document.querySelectorAll(".screenshot").forEach((shot) => {
        shot.addEventListener("mouseenter", (e) => {
            // TODO: funktionen behöver göras om så att den inte skapar nya instanser i trädet utan enbart förändrar målets storlek
            // showLarge(e)
        })
    })

});