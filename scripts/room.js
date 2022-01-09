import { Computer, RemotePlayer } from "./player.js";

class Room {
    constructor(game, player0, player1) {
        this.game = game;
        this.players = [player0, player1];
    }

    setEventListeners() {
        let rows = document.getElementsByClassName("hole-row");
        for (let hole = 0; hole < this.game.board[0].length; hole++) {
            for (let row = 0; row < this.game.board.length; row++) {
                if (this.players[0] instanceof Computer || this.players[0] instanceof RemotePlayer) {
                    if (row === 0) continue;
                    rows[row].children[hole].addEventListener("click", () => {
                        if (this.game.isGameOver()) return;
                        const numberSeeds = this.game.board[row][hole];
                        const delay = 2000 + numberSeeds * 500;
                        const finishedPlaying = this.game.play(row, hole);
                        if (finishedPlaying) {
                            setTimeout(() => {
                                this.players[0].play(this.game);
                            }, delay);
                        }
                    });
                } else {
                    rows[row].children[hole].addEventListener("click", () => {
                        this.game.play(row, hole);
                    });
                }
            }
        }
    }
}

class RemoteRoom extends Room {
    constructor(game, player0) {
        super(null, null, null);
    }
}

export { Room, RemoteRoom };
