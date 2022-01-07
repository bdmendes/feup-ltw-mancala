import Game from "./scripts/game.js";
import Room from "./scripts/room.js";
import {Player, Computer} from "./scripts/player.js";

document.getElementById("startGame").addEventListener("click", () => {
    setTimeout(() => {
        document.getElementById("play").addEventListener("click", () => {
            for (let row of document.getElementsByClassName("hole-row")) {
                while (row.firstChild) {
                    row.firstChild.remove();
                }
            }

            const cavities = parseInt(document.forms[0].cavities.value);
            const seeds = parseInt(document.forms[0].seeds.value);
            const is_turn = parseInt(document.forms[0].user_turn.value);
            let difficulty = parseInt(document.forms[0].user_turn.value);

            console.log(cavities, seeds, is_turn);

            let game = new Game(is_turn, cavities, seeds);
            let computer = new Computer(difficulty);
            let player1 = new Player('', '', '');
            window.room = new Room("1234", game, computer, player1);
            window.room.game.loadView();
            window.room.setEventListners();

            window.hidePopup(document.getElementById("settings"));
        });
    }, 1);
});
