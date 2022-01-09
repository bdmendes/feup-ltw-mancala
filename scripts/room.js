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
                    if (row != 0) {
                        rows[row].children[hole].addEventListener("click", () => {
                            if (!this.game.play(row, hole)) {
                                if (this.game.isGameOver()) {
                                    this.unsetEventListeners();
                                }
                                return;
                            }
                            if (this.game.isGameOver()) {
                                this.unsetEventListeners();
                                return;
                            }
                            setTimeout(() => {
                                this.players[0].play(this.game);
                                if (this.game.isGameOver()) {
                                    this.unsetEventListeners();
                                    return;
                                }
                            }, 1000);
                        });
                    }
                } else {
                    rows[row].children[hole].addEventListener("click", () => {
                        this.game.play(row, hole);
                    });
                }
            }
        }
    }

    unsetEventListeners() {
        let holeRow = document.getElementsByClassName("hole-row");
        for (let hole = 0; hole < this.game.board[0].length; hole++) {
            for (let row = 0; row < this.game.board.length; row++) {
                let old = holeRow[row].children[hole];
                let clone = holeRow[row].children[hole].cloneNode();
                old.parentNode.replaceChild(clone, old);
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
