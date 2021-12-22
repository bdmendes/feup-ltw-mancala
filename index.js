import Game from "./scripts/game.js";
import Player from "./scripts/player.js";

window.onload = function () {
    const game = new Game(
        new Player("Jose", "sirze", "123"),
        new Player("Bruno", "brocolo", 345),
        1
    );
    console.log(JSON.parse(JSON.stringify(game.board)));
};
