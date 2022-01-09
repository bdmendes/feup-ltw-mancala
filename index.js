import Game from "./scripts/game.js";
import { Room, RemoteRoom } from "./scripts/room.js";
import { Player, Computer, HumanPlayer, RemotePlayer } from "./scripts/player.js";
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
    let difficulty, is_turn, code, username, password, cavities, seeds;
    if (mode === "single_player") {
        difficulty = parseInt(form.difficulty.value);
        is_turn = parseInt(form.user_turn.value);
    } else {
        code = form.code.value;
        username = form.username.value;
        password = form.password.value;
    }
    cavities = parseInt(form.cavities.value);
    seeds = parseInt(form.seeds.value);

    /* Create entities */
    if (mode == "single_player") {
        window.room = new Room(
            new Game(is_turn, cavities, seeds),
            new Computer(difficulty),
            new HumanPlayer("guest", "")
        );
    } else {
        let user1 = new Player(username, password);
        window.room = new RemoteRoom(null, null);
    }

    /* Start */
    window.room.game.loadView();
    window.room.setEventListeners();
    window.hidePopup(document.getElementById("settings"));
    if (!is_turn) {
        window.room.players[0].play(window.room.game);
    }
}

window.onload = function () {
    document.getElementById("startGame").addEventListener("click", () => {
        setTimeout(() => {
            document.getElementById("play").addEventListener("click", () => {
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
