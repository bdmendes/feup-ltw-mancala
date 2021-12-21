import Game from "./scripts/game.js";
import Player from "./scripts/player.js";

window.onload = function () {
    console.log("Hello world");
    const game = new Game(
        new Player("Jose", "sirze", "123"),
        new Player("Bruno", "brocolo", 345)
    );
    console.log(game.players[0].name);
    game.play(1, 4);
    game.loadView();
};
