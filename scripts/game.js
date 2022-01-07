class Game {
    constructor(firstToPlay = 1, boardSize = 5, startSeeds = 6) {
        this.board = [new Array(boardSize).fill(startSeeds), new Array(boardSize).fill(startSeeds)];
        this.storage = [0, 0];
        this.currentToPlay = firstToPlay;
    }

    static assembleGame(board, storage, currentToPlay) {
        let game = new Game();
        game.board = JSON.parse(JSON.stringify(board));
        game.storage = JSON.parse(JSON.stringify(storage));
        game.currentToPlay = currentToPlay;
        return game;
    }

    isGameOver() {
        const totalSeeds = this.board[this.currentToPlay].reduce((a, b) => a + b, 0);
        return totalSeeds === 0;
    }

    getWinner() {
        if (this.storage[0] === this.storage[1]) return -1;
        return this.storage[0] > this.storage[1] ? 0 : 1;
    }

    endGame() {
        for (let row of [0, 1]) {
            for (let j = 0; j < this.board[0].length; j++) {
                this.addSeeds_(this.board[row][j], row, row === 0 ? -1 : this.board[0].length);
                this.removeSeeds_(row, j);
            }
        }
    }

    calculateBestPlay(depth) {
        let newGame = Game.assembleGame(this.board, this.storage, this.currentToPlay);
        return Game.calculateBestPlay_(newGame, depth, 1);
    }

    static calculateBestPlay_(game, depth) {
        if (game.isGameOver()) {
            return [-1, game.getWinner() === game.currentToPlay ? 999999 : -999999];
        }
        if (depth === 0) {
            return [0, 0];
        }

        const curr = game.currentToPlay;
        let maxGain = -999999;
        let bestPosition = -1;
        for (let i = 0; i < game.board[0].length; i++) {
            // console.log("Curr: " + curr + "; depth: " + depth + "; i: " + i);
            let newGame = Game.assembleGame(game.board, game.storage, game.currentToPlay);
            if (newGame.board[newGame.currentToPlay][i] === 0) {
                continue;
            }
            // console.log(JSON.parse(JSON.stringify(newGame.board)));
            let gain = 0;
            gain += newGame.play_(newGame.currentToPlay, i, false);
            if (gain > 0) //console.log("Gain detected: " + gain);
            if (newGame.currentToPlay === curr) {
                // console.log("Playing again...");
                gain += newGame.play_(newGame.currentToPlay, Game.calculateBestPlay_(newGame, depth)[0], false);
            }
            gain -= Game.calculateBestPlay_(newGame, depth - 1)[1];
            if (gain > maxGain) {
                maxGain = gain;
                bestPosition = i;
            }
        }
         /* console.log(
            "Final best gain for depth " +
                depth +
                "; player " +
                game.currentToPlay +
                ": position " +
                bestPosition +
                ", gain: " +
                maxGain
        ); */
        return [bestPosition, maxGain];
    }

    play(player, position) {
        let lastPlayer = this.currentToPlay;
        if (player != this.currentToPlay) {
            alert("Player" + this.currentToPlay + "is not to play!");
            return false;
        }
        this.play_(player, position);
        if (this.isGameOver()) {
            alert("Game is over! Player " + this.getWinner() + " wins!");
            this.endGame();
            return true;
        }

        return lastPlayer === this.currentToPlay ? false : true;
    }

    play_(player, position, view = true) {
        let remainingSeeds = this.board[player][position];
        if (remainingSeeds === 0) return 0;

        let cof = player === 0 ? -1 : 1;
        const originalCof = cof;
        const playerSide = (currCof) => currCof === originalCof;
        this.removeSeeds_(player, position, view);

        let playerSeedGain = 0;
        while (remainingSeeds > 0) {
            position += cof;
            if (position === -1 || position === this.board[0].length) {
                if (playerSide(cof)) {
                    remainingSeeds--;
                    this.addSeeds_(1, player, position, view);
                    playerSeedGain++;
                }
                cof *= -1;
            } else {
                remainingSeeds--;
                this.addSeeds_(1, cof === -1 ? 0 : 1, position, view, true);
                if (remainingSeeds === 0 && this.board[player][position] === 1 && playerSide(cof)) {
                    let seedsStorage = this.board[0][position] + this.board[1][position];
                    this.addSeeds_(seedsStorage, player, player === 0 ? -1 : this.board[0].length, view);
                    this.removeSeeds_(0, position, view);
                    this.removeSeeds_(1, position, view);
                    playerSeedGain += seedsStorage;
                }
            }
        }

        const ownStorage = (position === -1 && player === 0) || (position === this.board[0].length && player === 1);
        if (!ownStorage) this.currentToPlay = (this.currentToPlay + 1) % 2;
        return playerSeedGain;
    }

    getHoleNode_(player, position) {
        const storages = document.getElementsByClassName("storage");
        const holeRow = document.getElementsByClassName("hole-row")[player];
        if (position === -1) {
            return storages[0].getElementsByClassName("hole")[0];
        } else if (position === this.board[0].length) {
            return storages[1].getElementsByClassName("hole")[0];
        } else {
            return holeRow.getElementsByClassName("hole")[position];
        }
    }

    addSeeds_(numberSeeds, player, position, view = true, fall = true) {
        while (numberSeeds--) {
            if (position === -1) this.storage[0]++;
            else if (position === this.board[0].length) this.storage[1]++;
            else this.board[player][position]++;

            if (!view) continue;
            const seed = document.createElement("div");
            seed.classList.add("seed");
            if (fall) seed.classList.add("fall");
            const topPad = Math.round(Math.random() * 10);
            const leftPad = Math.round(Math.random() * 10);
            seed.style.top = topPad + "px";
            seed.style.left = leftPad + "px";
            const rotation = Math.round(Math.random() * 60) - 30;
            seed.style.transform = " rotate(" + rotation + "deg)";
            this.getHoleNode_(player, position).appendChild(seed);
        }
    }

    removeSeeds_(player, position, view = true) {
        if (position === -1) this.storage[0] = 0;
        else if (position === this.board[0].length) this.storage[1] = 0;
        else this.board[player][position] = 0;

        if (view) this.getHoleNode_(player, position).innerHTML = "";
    }

    loadView() {
        const storageHoles = document.getElementsByClassName("hole");
        for (let storageHole of storageHoles){
            storageHole.textContent = '';
        }

        const rows = document.getElementsByClassName("hole-row");
        for (let i = 0; i < this.board[0].length; i++) {
            for (let row of [0, 1]) {
                const hole = document.createElement("div");
                hole.classList.add("hole");
                rows[row].appendChild(hole);
                let numberSeeds = this.board[row][i];
                this.board[row][i] = 0;
                this.addSeeds_(numberSeeds, row, i, true, false);
            }
        }
    }
}

export default Game;