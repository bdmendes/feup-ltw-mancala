import { Computer, LocalPlayer, RemotePlayer } from "./player.js";
import { joinGame, leaveGame, openEventSource } from "./requests.js";

class Room {
    constructor(game, player0, player1) {
        if (this.constructor === Room) {
            throw new Error("Instantitate a concrete room");
        }
        this.game = game;
        this.players = [player0, player1];
        this.messageObject = document.getElementById("message");
        this.left = false;
        this.ready = false;
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
                    if (this.game.isGameOver()) {
                        this.putGameOverMessage();
                        this.game.endGame();
                        return;
                    }
                    if (finishedPlaying) {
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
            }, 1000);
        } else {
            this.putMessage("Make the first move. Click one of your cavities!");
        }
    }

    leave() {
        this.left = true;
    }

    enterGameView() {
        window.hidePopup(document.getElementById("settings"));
        window.room.game.loadView();
        window.room.setEventListeners();
    }
}

class RemoteRoom extends Room {
    constructor(game, player, token) {
        if (!(player instanceof RemotePlayer)) {
            throw new Error("Player 0 must be a remote player");
        }
        super(game, new RemotePlayer("opponent", "unknown"), player);
        this.token = token;
        player.login(this);
    }

    enterGame() {
        joinGame(
            this.token,
            this.players[1].username,
            this.players[1].password,
            this.game.board.length,
            this.game.board[0][0]
        ).then(async function (response) {
            const statusObject = document.getElementById("login_status");
            if (response.ok) {
                statusObject.textContent = "Game joined! Waiting for an opponent...";
                const json = await response.json();
                window.room.gameId = json.game;
                window.room.setupUpdate();
            } else {
                statusObject.textContent = "Error joining a game! Try again later";
            }
        });
    }

    setupUpdate() {
        this.eventSource = openEventSource(this.players[1].username, this.gameId);
        this.eventSource.onmessage = function (event) {
            if (!window.room.ready) {
                alert("hello");
                window.room.ready = true;
                window.room.enterGameView();
            }
            console.log(event.data);
        };
    }

    closeSource() {
        this.eventSource.close();
    }

    leave() {
        leaveGame(this.players[1].username, this.players[1].password, this.gameId).then((response) => {
            if (response.ok) {
                window.room.closeSource();
            }
        });
        super.leave();
    }
}

class ComputerRoom extends Room {
    constructor(game, player, difficulty) {
        if (!(player instanceof LocalPlayer)) {
            throw new Error("Player 0 must be a local player");
        }
        super(game, new Computer(difficulty), player);
        document.getElementById("game_info").textContent = "Computer vs Local Player";
        this.ready = true;
    }

    enterGame() {
        super.enterGame();
    }

    leave() {
        super.leave();
    }
}

export { Room, RemoteRoom, ComputerRoom };
