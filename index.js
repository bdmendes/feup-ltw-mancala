import Game from "./scripts/game.js";
import { RemoteRoom, ComputerRoom } from "./scripts/room.js";
import { Computer, LocalPlayer, RemotePlayer } from "./scripts/player.js";
import { joinGame, notifyMove, registerUser } from "./scripts/requests.js";
import { showPopup } from "./scripts/popups.js";

function clearHoles() {
    for (let row of document.getElementsByClassName("hole-row")) {
        while (row.firstChild) {
            row.firstChild.remove();
        }
    }
}

function setupGame(form) {
    /* Parse form */
    const mode = form.mode.value;
    let difficulty, turn, code, username, password, cavities, seeds;
    if (mode === "single_player") {
        difficulty = parseInt(form.difficulty.value);
        turn = parseInt(form.user_turn.value);
        if (turn === -1) {
            turn = Math.floor(Math.random() * 2);
        }
    } else {
        code = form.code.value;
        username = form.username.value;
        password = form.password.value;
    }
    cavities = parseInt(form.cavities.value);
    seeds = parseInt(form.seeds.value);

    /* Create entities */
    if (mode == "single_player") {
        window.room = new ComputerRoom(new Game(turn, cavities, seeds), new LocalPlayer("guest", ""), difficulty);
        window.room.enterGame();
    } else {
        window.room = new RemoteRoom(new Game(0, cavities, seeds), new RemotePlayer(username, password), code);
    }
}

window.onload = function () {
    document.getElementById("instructions").addEventListener("click", () => {
        showPopup("instructions");
    });
    document.getElementById("ranking").addEventListener("click", () => {
        showPopup("ranking");
    });
    document.getElementById("game_button").addEventListener("click", () => {
        showPopup("game_button");
        document.getElementById("play").addEventListener("click", () => {
            if (window.room != null && window.room.ready) {
                if (
                    !window.confirm(
                        "Current game progress will be lost. Are you sure you want to leave and create a new game?"
                    )
                ) {
                    return;
                }
                window.room.leave();
            }
            clearHoles();
            setupGame(document.forms[0]);
        });
    });
    // test requests
    /*     registerUser("bdmendes", "compacto")
        .then((response) => response.json())
        .then((json) => console.log(json))
        .then(() => joinGame("300", "bdmendes", "compacto", 4, 4))
        .then((response) => response.json())
        .then((json) => notifyMove("bdmendes", "compacto", json.game, 1))
        .then((response) => response.json())
        .then((json) => console.log(json)); */
};
/* window.onbeforeunload = function () {
    return "Do you really want to exit the app? Current game progress will be lost.";
};
 */
