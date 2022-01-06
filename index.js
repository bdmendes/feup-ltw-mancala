import Game from "./scripts/game.js";
import Player from "./scripts/player.js";

window.onload = function () {
  const game = new Game();
  game.board = [
    [0, 1, 0, 2],
    [1, 0, 1, 1],
  ];
  game.storage = [3, 4];
  game.loadView();
  game.calculateBestPlay(2);
};
