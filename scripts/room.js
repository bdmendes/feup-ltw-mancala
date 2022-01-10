import { Computer, HumanPlayer, RemotePlayer } from "./player.js";

class Room {
    constructor(game, player0, player1) {
        if (this.constructor === Room) {
            throw new Error("Instantitate a concrete room");
        }
        this.game = game;
        this.players = [player0, player1];
        this.messageObject = document.getElementById("message");
        document.getElementById("game_info").textContent = player0.username + " vs " + player1.username;
        document.getElementById("board").style.display = "flex";
        document.getElementById("game_button").textContent = "Leave";
    }

    putMessage(message) {
        this.messageObject.textContent = message;
    }

    putGameOverMessage() {
        document.getElementById("game_button").textContent = "Play Again";
        const winner = this.game.getWinner();
        const msg_ = winner === -1 ? "It's a draw!" : this.players[winner].username + " takes the win!";
        this.putMessage("The game is over! " + msg_);
    }

    notifyMoveEnd() {
        if (this.game.isGameOver()) return;
        this.putMessage("Make a move!");
    }

    setEventListeners() {
        let rows = document.getElementsByClassName("hole-row");
        for (let hole = 0; hole < this.game.board[0].length; hole++) {
            for (let row = 0; row < this.game.board.length; row++) {
                if (row === 0) continue;
                rows[row].children[hole].addEventListener("click", () => {
                    if (this.game.isGameOver()) {
                        this.putMessage("Trying to play again, ahm? Look around you...");
                        return;
                    }
                    if (this.game.currentToPlay === 0) {
                        this.putMessage("Not your turn! Wait for the opponent to play!");
                        return;
                    }
                    const numberSeeds = this.game.board[row][hole];
                    if (numberSeeds === 0) {
                        this.putMessage("You cannot play from an empty hole!");
                        return;
                    }
                    const delay = 1000 + numberSeeds * 500;
                    const finishedPlaying = this.game.play(row, hole);
                    this.putMessage("Moving!");
                    setTimeout(() => {
                        if (finishedPlaying) {
                            if (this.game.isGameOver()) {
                                this.putGameOverMessage();
                                return;
                            }
                            this.players[0].play(this);
                            if (this.game.isGameOver()) {
                                this.putGameOverMessage();
                            }
                        } else {
                            this.putMessage("You have put the last seed in your container. Play again!");
                        }
                    }, delay);
                });
            }
        }
        if (this.game.currentToPlay === 0) {
            this.putMessage("The opponent is starting!");
            setTimeout(() => {
                this.players[0].play(this);
            }, 2000);
        } else {
            this.putMessage("Make the first move. Click one of your cavities!");
        }
    }

    leave() {}
}

class RemoteRoom extends Room {
    constructor(game, player, token) {
        if (!(player instanceof HumanPlayer)) {
            throw new Error("Player 0 must be an human player");
        }
        super(game, player, null);
        this.token = token;
    }
}

class ComputerRoom extends Room {
    constructor(game, player, difficulty) {
        if (!(player instanceof HumanPlayer)) {
            throw new Error("Player 0 must be an human player");
        }
        super(game, new Computer(difficulty), player);
    }
}

export { Room, RemoteRoom, ComputerRoom };
