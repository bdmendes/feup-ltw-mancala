class Game {
  constructor(player1, player2, boardSize) {
    this.player1 = player1;
    this.player2 = player2;
    this.player1Holes = new Array(boardSize).fill(6);
    this.player2Holes = new Array(boardSize).fill(6);
    this.player1Storage = 0;
    this.player2Storage = 0;
  }
}

export default Game;