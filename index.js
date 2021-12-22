import Game from "./scripts/game.js";
import Player from "./scripts/player.js";

window.onload = function () {
    const game = new Game(
        new Player("Jose", "sirze", "123"),
        new Player("Bruno", "brocolo", 345)
    );
    console.log(JSON.parse(JSON.stringify(game.board)));
    game.play_(1, 0);
    game.play_(0, 0);
    game.play_(1, 4);
};
