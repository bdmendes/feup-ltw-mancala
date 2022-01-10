import Game from "./scripts/game.js";
import { RemoteRoom, ComputerRoom } from "./scripts/room.js";
import { Computer, HumanPlayer, RemotePlayer } from "./scripts/player.js";
import { joinGame, notifyMove, registerUser } from "./scripts/requests.js";

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
    let difficulty, turn, code, username, password, cavities, seeds, firstToPlay;
    if (mode === "single_player") {
        difficulty = parseInt(form.difficulty.value);
        turn = parseInt(form.user_turn.value);
        switch (turn) {
            case 1:
                firstToPlay = 0;
                break;
            case 2:
                firstToPlay = 1;
                break;
            default:
                firstToPlay = Math.floor(Math.random() * 2) % 2;
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
        window.room = new ComputerRoom(
            new Game(firstToPlay, cavities, seeds),
            new HumanPlayer("guest", ""),
            difficulty
        );
    } else {
        let user1 = new Player(username, password);
        window.room = new RemoteRoom(null, null);
    }

    /* Start */
    window.hidePopup(document.getElementById("settings"));
    window.room.game.loadView();
    window.room.setEventListeners();
}

window.onload = function () {
    document.getElementById("game_button").addEventListener("click", () => {
        setTimeout(() => {
            document.getElementById("play").addEventListener("click", () => {
                if (window.room != null) {
                    if (
                        !window.confirm(
                            "Current game progress will be lost. Are you sure you want to leave and create a new game?"
                        )
                    ) {
                        return;
                    }
                }
                if (window.room != null) {
                    window.room.leave();
                }
                clearHoles();
                setupGame(document.forms[0]);
            });
        }, 1);
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
