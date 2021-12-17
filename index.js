import Game from './scripts/game.js';
import Player from './scripts/player.js';

window.onload = function() {
  console.log('Hello world');
  const game = new Game(
      new Player('Jose', 'sirze', '123'), new Player('Bruno', 'brocolo', 345),
      6);
  console.log(game.player1.name);
}