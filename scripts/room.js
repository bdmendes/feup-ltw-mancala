import { Computer, LocalPlayer, RemotePlayer } from "./player.js";

class Room {
    constructor(game, player0, player1) {
        if (this.constructor === Room) {
            throw new Error("Instantitate a concrete room");
        }
        this.game = game;
        this.players = [player0, player1];
        this.messageObject = document.getElementById("message");
        this.left = false;
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
        if (this.left) return;
        if (this.game.isGameOver()) {
            this.putGameOverMessage();
            this.game.endGame();
            return;
        }
        this.putMessage("Make a move!");
    }

    setEventListeners() {
        let rows = document.getElementsByClassName("hole-row");
        for (let hole = 0; hole < this.game.board[0].length; hole++) {
            rows[1].children[hole].addEventListener("click", () => {
                if (this.left) return;
                if (this.game.isGameOver()) {
                    this.putMessage("Trying to play again, ahm? Look around you...");
                    return;
                }
                if (this.game.currentToPlay === 0) {
                    this.putMessage("Not your turn! Wait for the opponent to play!");
                    return;
                }
                const numberSeeds = this.game.board[1][hole];
                if (numberSeeds === 0) {
                    this.putMessage("You cannot play from an empty hole!");
                    return;
                }
                const delay = 1000 + numberSeeds * 500;
                const finishedPlaying = this.game.play(1, hole);
                this.putMessage("Moving!");
                setTimeout(() => {
                    if (finishedPlaying) {
                        if (this.game.isGameOver()) {
                            this.putGameOverMessage();
                            this.game.endGame();
                            return;
                        }
                        this.players[0].play(this);
                    } else {
                        this.putMessage("You have put the last seed in your container. Play again!");
                    }
                }, delay);
            });
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

    leave() {
        this.left = true;
    }
}

class RemoteRoom extends Room {
    constructor(game, player, token) {
        if (!(player instanceof RemotePlayer)) {
            throw new Error("Player 0 must be a remote player");
        }
        player.login();
        super(game, player, null);
        this.token = token;
    }
}

class ComputerRoom extends Room {
    constructor(game, player, difficulty) {
        if (!(player instanceof LocalPlayer)) {
            throw new Error("Player 0 must be a local player");
        }
        super(game, new Computer(difficulty), player);
    }
}

export { Room, RemoteRoom, ComputerRoom };
