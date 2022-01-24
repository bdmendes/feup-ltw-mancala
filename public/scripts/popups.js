import { getInstructionsContent } from "./popups/instructions.js";
import { getRankingContent, injectLocalRankingResults, injectServerRankingResults } from "./popups/ranking.js";
import { getSettingsContent } from "./popups/settings.js";

function blurGameContainer() {
    document.getElementById("game-container").style.filter = "blur(5px)";
}

function unBlurGameContainer() {
    document.getElementById("game-container").style.removeProperty("filter");
}

function getPopupContent(title) {
    switch (title) {
        case "Ranking":
            return getRankingContent();
        case "Instructions":
            return getInstructionsContent();
        case "Start Game":
            return getSettingsContent();
        default:
            return "Undefined popup";
    }
}

function showPopup(title) {
    const content = getPopupContent(title);
    const element = document.getElementById("main-popup-content");
    element.innerHTML = content;
    const popup = document.getElementById("main-popup");
    document.getElementById("main-popup-title").innerHTML = title;
    popup.style.display = "block";
    blurGameContainer();

    if (title === "Ranking") {
        injectServerRankingResults();
        injectLocalRankingResults();
    }
}

function hidePopup() {
    const popup = document.getElementById("main-popup");
    popup.style.display = "none";
    unBlurGameContainer();
}

window.showPopup = showPopup;
window.hidePopup = hidePopup;
