import { Computer } from "./player.js";

class Room {
    constructor(game, player0, player1) {
        this.game = game;
        this.players = [player0, player1];
    }

    setEventListeners() {
        let rows = document.getElementsByClassName("hole-row");
        console.log(rows);
        for (let hole = 0; hole < this.game.board[0].length; hole++) {
            for (let row = 0; row < this.game.board.length; row++) {
                if (this.players[0] instanceof Computer) {
                    if (row != 0) {
                        rows[row].children[hole].addEventListener("click", () => {
                            if(!this.game.play(row, hole)){
                                return;
                            }
                            setTimeout(() => {
                                this.players[0].play(this.game);
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
}

export default Room;
