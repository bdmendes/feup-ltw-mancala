import { registerUser } from "./requests.js";

class Player {
    constructor(username) {
        if (this.constructor === Player) {
            throw new Error("Instantitate a concrete player");
        }
        this.username = username;
    }
}

class Computer extends Player {
    constructor(depth) {
        super("computer");
        this.depth = depth;
    }

    play(room) {
        if (room.game.isGameOver()) return;
        room.putMessage("Computer is moving...");
        const bestMove = room.game.calculateBestPlay(this.depth)[0];
        const delay = 1000 + room.game.board[0][bestMove] * 500;
        const finishedPlaying = room.game.play(0, bestMove);
        if (!finishedPlaying) {
            setTimeout(() => {
                this.play(room);
            }, delay);
        } else {
            setTimeout(() => room.notifyMoveEnd(), delay);
        }
    }
}

class LocalPlayer extends Player {}

class RemotePlayer extends Player {
    constructor(username, password) {
        super(username);
        this.password = password;
    }

    login(room) {
        const statusMessage = document.getElementById("login_status");
        statusMessage.textContent = "Logging in...";
        registerUser(this.username, this.password).then(
            (response) => {
                statusMessage.textContent = response.ok
                    ? "Login successful, joining a game..."
                    : "User registered with a different password";
                if (response.ok) {
                    room.enterGame();
                }
            },
            () => {
                statusMessage.textContent = "Network error";
            }
        );
    }

    play(room) {
        room.putMessage("Waiting for the opponent's move...");
    }
}

export { Player, Computer, LocalPlayer, RemotePlayer };
