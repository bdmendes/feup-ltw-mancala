class Player {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
}

class Computer extends Player {
    constructor(depth) {
        super("computer", "computer");
        this.depth = depth;
    }

    async play(game) {
        if (game.isGameOver()) return;
        const bestMove = game.calculateBestPlay(this.depth)[0];
        const delay = 1000 + game.board[0][bestMove] * 500;
        const finishedPlaying = game.play(0, bestMove);
        if (!finishedPlaying) {
            setTimeout(() => this.play(game), delay);
        }
    }
}

class RemotePlayer extends Player {
    constructor(username) {}
}

export { Player, Computer, RemotePlayer };
