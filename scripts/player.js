import { sleep } from "./utils.js";

class Player {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }

    play(game) {
        return;
    }
}

class Computer extends Player {
    constructor(depth) {
        super("computer", "computer");
        this.depth = depth;
    }

    async play(game) {
        for (;;) {
            if (game.isGameOver()) break;
            console.log("hello0");
            const bestMove = game.calculateBestPlay(this.depth)[0];
            const finishedPlaying = game.play(0, bestMove);
            console.log(finishedPlaying);
            console.log(bestMove);
            console.log("hello1");
            if (finishedPlaying) break;
            await sleep(2000);
        }
    }
}

class RemotePlayer extends Player {
    constructor(username) {}
}

export { Player, Computer, RemotePlayer };
