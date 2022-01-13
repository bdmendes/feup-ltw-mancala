import { getInstructionsContent } from "./popups/instructions.js";
import { getRankingContent } from "./popups/ranking.js";
import { getSettingsContent } from "./popups/settings.js";

function blurGameContainer() {
    document.getElementById("game-container").style.filter = "blur(5px)";
}

function unBlurGameContainer() {
    document.getElementById("game-container").style.removeProperty("filter");
}

function createPopup(id, title, content) {
    const popupContainer = document.createElement("div");
    popupContainer.setAttribute("class", "popup-container");

    const popup = document.createElement("div");
    popup.setAttribute("class", "popup");
    const close = document.createElement("span");
    close.textContent = "Close";
    close.id = "close";
    close.style.marginBottom = "5px";
    close.onclick = function () {
        hidePopup(popupContainer);
    };
    popup.appendChild(close);

    const popupTitle = document.createElement("div");
    popupTitle.setAttribute("class", "popup-title");
    let t = document.createElement("h1");

    const c = document.createElement("div");
    c.setAttribute("class", "popup-content");

    popupContainer.id = id;
    t.textContent = title;
    c.innerHTML = content;

    popupTitle.appendChild(t);
    popup.appendChild(popupTitle);
    popup.appendChild(c);
    popupContainer.appendChild(popup);

    return popupContainer;
}

function getPopup(id) {
    switch (id) {
        case "ranking":
            return createPopup("ranking", "Ranking", getRankingContent());
        case "instructions":
            return createPopup("instructions", "Instructions", getInstructionsContent());
        case "game_button":
            return createPopup("settings", "Start Game", getSettingsContent());
        default:
            return createPopup("test");
    }
}

function showPopup(id) {
    for (let popup of document.getElementsByClassName("popup-container")) {
        popup.remove();
    }
    blurGameContainer();
    document.getElementsByTagName("nav")[0].insertAdjacentElement("afterend", getPopup(id));
}

function hidePopup(element) {
    element.remove();
    unBlurGameContainer();
}

window.showPopup = showPopup;
window.hidePopup = hidePopup;
