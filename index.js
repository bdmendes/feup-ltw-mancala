import Game from "./scripts/game.js";
import Room from "./scripts/room.js";
import { Player, Computer, RemotePlayer } from "./scripts/player.js";

document.getElementById("startGame").addEventListener("click", () => {
    setTimeout(() => {
        document.getElementById("play").addEventListener("click", () => {
            clearHoles();
            setupGame(document.forms[0]);
        });
    }, 1);
});

function clearHoles() {
    for (let row of document.getElementsByClassName("hole-row")) {
        while (row.firstChild) {
            row.firstChild.remove();
        }
    }
}

function setupGame(form) {
    const mode = form.mode.value;
    let difficulty;
    let is_turn;
    let code;
    let username;
    let password;
    let cavities;
    let seeds;
    if (mode == "sp") {
        difficulty = parseInt(form.difficulty.value);
        is_turn = parseInt(form.user_turn.value);
    } else {
        if (mode == "jn") {
            if (form.code != undefined) {
                code = form.code.value;
            }
        }
        if (mode == "cr") {
            if (form.is_turn != undefined) {
                is_turn = parseInt(form.user_turn.value);
            }
        }
        username = form.username.value;
        password = form.password.value;
    }

    if (code == undefined) {
        cavities = parseInt(form.cavities.value);
        seeds = parseInt(form.seeds.value);
    }

    if (is_turn == 3) {
        is_turn = Math.floor(Math.random() * 2);
    }

    if ((mode == "cr" || mode == "jn") && (username == undefined || password == undefined)) {
        return;
    }

    let user0;
    let user1;
    if (mode == "sp") {
        user0 = new Computer(difficulty);
        user1 = new Player("", "");
        window.room = new Room(new Game(is_turn, cavities, seeds), user0, user1);
    }

    if (mode == "cr" || mode == "jn") {
        user1 = new Player(username, password);
        window.room = new RemoteRoom(user1);
                
    }

    window.room.game.loadView();
    window.room.setEventListeners();
    window.hidePopup(document.getElementById("settings"));
    if (!is_turn) {
        window.room.players[0].play(window.room.game);
    }
}
