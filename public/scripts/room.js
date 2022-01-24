import { Computer, LocalPlayer, RemotePlayer } from "./player.js";
import { joinGame, leaveGame, notifyMove, openEventSource } from "./requests.js";
import Game from "./game.js";

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
        this.game.animating = false;
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
                const finishedPlaying = this.playAtPosition(hole);
                this.putMessage("Moving!");
                this.animating = true;
                setTimeout(() => {
                    this.game.animating = false;
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
        this.discardRequest = false;
        player.login(this);
    }

    enterGame() {
        joinGame(
            this.token,
            this.players[1].username,
            this.players[1].password,
            this.game.board[0].length,
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
            const json = JSON.parse(event.data);
            console.log(json);
            if (json.board == null) {
                return;
            }
            if (!window.room.ready) {
                window.room.ready = true;
                window.room.game.currentToPlay = json.board.turn === window.room.players[1].username ? 1 : 0;
                window.room.enterGameView();
                const playerNames = Object.keys(json.board.sides);
                console.log(playerNames);
                const opponentName =
                    playerNames[0] !== window.room.players[1].username ? playerNames[0] : playerNames[1];
                window.room.players[0].username = opponentName;
                document.getElementById("game_info").textContent =
                    opponentName + " vs " + window.room.players[1].username;
                return;
            }
            if (json.pit == null) {
                return;
            }
            if (window.room.game.currentToPlay === 0 && !window.room.discardRequest) {
                window.room.putMessage("Opponent is moving!");
                const position = window.room.game.board[0].length - 1 - json.pit;
                const delay = 1000 + 500 * window.room.game.board[0][position];
                const finished_playing = window.room.game.play(0, position);
                setTimeout(() => {
                    if (finished_playing) {
                        window.room.notifyMoveEnd();
                    } else {
                        window.room.putMessage("Smart opponent, thinking about their next move...");
                    }
                }, delay);
            }
            window.room.discardRequest = false;
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

    playAtPosition(position) {
        notifyMove(this.players[1].username, this.players[1].password, this.gameId, position);
        this.discardRequest = true;
        return this.game.play(1, position);
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

    playAtPosition(position) {
        return this.game.play(1, position);
    }
}

export { Room, RemoteRoom, ComputerRoom };
