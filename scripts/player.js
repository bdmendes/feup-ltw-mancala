class Player {
    constructor(username, password) {
        if (this.constructor === Player) {
            throw new Error("Instantitate a concrete player");
        }
        this.username = username;
        this.password = password;
    }
}

class Computer extends Player {
    constructor(depth) {
        super("computer", "computer");
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

class HumanPlayer extends Player {}

class RemotePlayer extends Player {}

export { Player, Computer, HumanPlayer, RemotePlayer };
