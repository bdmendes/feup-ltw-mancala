import { registerUser } from "./requests.js";

class Player {
    constructor(username, password) {
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

    login() {
        registerUser(this.username, this.password)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Could not register user`);
                }
                return response.json();
            })
            .then((json) => console.log(json));
    }
}

export { Player, Computer, LocalPlayer, RemotePlayer };
