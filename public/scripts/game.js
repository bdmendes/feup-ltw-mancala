class Game {
    constructor(firstToPlay = 1, boardSize = 5, startSeeds = 6) {
        this.board = [new Array(boardSize).fill(startSeeds), new Array(boardSize).fill(startSeeds)];
        this.storage = [0, 0];
        this.currentToPlay = firstToPlay;
        this.animate = new Array(this.board[0].length);
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

    endGame_() {
        for (let row of [0, 1]) {
            for (let j = 0; j < this.board[0].length; j++) {
                this.addSeedsBoard_(this.board[row][j], row, row === 0 ? -1 : this.board[0].length);
                this.addSeedsView_(this.board[row][j], row, row === 0 ? -1 : this.board[0].length, true);
                this.removeSeedsBoard_(row, j);
                this.removeSeedsView_(row, j);
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
            let newGame = Game.assembleGame(game.board, game.storage, game.currentToPlay);
            if (newGame.board[newGame.currentToPlay][i] === 0) {
                continue;
            }
            let gain = 0;
            gain += newGame.play_(newGame.currentToPlay, i, false);
            if (newGame.currentToPlay === curr) {
                gain += newGame.play_(newGame.currentToPlay, Game.calculateBestPlay_(newGame, depth)[0], false);
            }
            gain -= Game.calculateBestPlay_(newGame, depth - 1)[1];
            if (gain > maxGain) {
                maxGain = gain;
                bestPosition = i;
            }
        }
        return [bestPosition, maxGain];
    }

    play(player, position) {
        const lastPlayer = this.currentToPlay;
        if (player !== this.currentToPlay) {
            return false;
        }
        this.play_(player, position);
        return lastPlayer !== this.currentToPlay;
    }

    play_(player, position, view = true) {
        let remainingSeeds = this.board[player][position];
        if (remainingSeeds === 0) return 0;

        let cof = player === 0 ? -1 : 1;
        let seedViewAdditions = [];
        let seedViewRemovals = [];
        const originalCof = cof;
        const playerSide = (currCof) => currCof === originalCof;
        this.removeSeedsBoard_(player, position);
        if (view) {
            this.removeSeedsView_(player, position);
        }

        let playerSeedGain = 0;
        while (remainingSeeds > 0) {
            position += cof;
            if (position === -1 || position === this.board[0].length) {
                if (playerSide(cof)) {
                    remainingSeeds--;
                    this.addSeedsBoard_(1, player, position);
                    seedViewAdditions.push([1, player, position]);
                    playerSeedGain++;
                }
                cof *= -1;
            } else {
                remainingSeeds--;
                this.addSeedsBoard_(1, cof === -1 ? 0 : 1, position);
                seedViewAdditions.push([1, cof === -1 ? 0 : 1, position]);
                if (remainingSeeds === 0 && this.board[player][position] === 1 && playerSide(cof)) {
                    let seedsStorage = this.board[0][position] + this.board[1][position];
                    this.addSeedsBoard_(seedsStorage, player, player === 0 ? -1 : this.board[0].length);
                    seedViewAdditions.push([seedsStorage, player, player === 0 ? -1 : this.board[0].length]);
                    this.removeSeedsBoard_(0, position);
                    this.removeSeedsBoard_(1, position);
                    seedViewRemovals.push([0, position]);
                    seedViewRemovals.push([1, position]);
                    playerSeedGain += seedsStorage;
                }
            }
        }

        if (view) {
            this.modifyMultipleSeedsView_(seedViewAdditions, seedViewRemovals);
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

    addSeedsBoard_(numberSeeds, player, position) {
        if (numberSeeds <= 0) return;
        if (position === -1) this.storage[0] += numberSeeds;
        else if (position === this.board[0].length) this.storage[1] += numberSeeds;
        else this.board[player][position] += numberSeeds;
    }

    modifyMultipleSeedsView_(addParams, removeParams) {
        if (addParams.length === 1 && removeParams.length >= 1) {
            this.modifyMultipleSeedsView_([], removeParams);
            this.modifyMultipleSeedsView_(addParams, []);
            return;
        }
        if (addParams.length === 0) {
            if (removeParams.length == 0) return;
            const [head, ...tail] = removeParams;
            this.removeSeedsView_(...head);
            this.modifyMultipleSeedsView_(addParams, tail);
        } else {
            const [head, ...tail] = addParams;
            this.addSeedsView_(...head);
            setTimeout(() => this.modifyMultipleSeedsView_(tail, removeParams), 500);
        }
    }

    addSeedsView_(numberSeeds, player, position, fall = true) {
        if (numberSeeds === 0) return;

        const seed = document.createElement("div");
        seed.classList.add("seed");
        if (fall) {
            seed.classList.add("fall");
        }
        const topPad = Math.round(Math.random() * 10);
        const leftPad = Math.round(Math.random() * 10);
        seed.style.top = topPad + "px";
        seed.style.left = leftPad + "px";
        const rotation = Math.round(Math.random() * 60) - 30;
        seed.style.transform = " rotate(" + rotation + "deg)";
        const hole = this.getHoleNode_(player, position);
        hole.appendChild(seed);

        this.addSeedsView_(numberSeeds - 1, player, position, fall);
    }

    removeSeedsBoard_(player, position) {
        if (position === -1) this.storage[0] = 0;
        else if (position === this.board[0].length) this.storage[1] = 0;
        else this.board[player][position] = 0;
    }

    removeSeedsView_(player, position) {
        const hole = this.getHoleNode_(player, position);
        const children = hole.children;
        for (let i = children.length; i-- > 0; ) {
            if (!children[i].classList.contains("seed")) continue;
            hole.removeChild(children[i]);
        }
    }

    loadView() {
        const storageHoles = document.getElementsByClassName("hole");
        for (let storageHole of storageHoles) {
            storageHole.textContent = "";
        }

        const rows = document.getElementsByClassName("hole-row");
        for (let i = 0; i < this.board[0].length; i++) {
            for (let row of [0, 1]) {
                const hole = document.createElement("div");
                hole.classList.add("hole");
                let numberSeeds = this.board[row][i];
                this.board[row][i] = 0;
                if (row === 1) {
                    const canvas = document.createElement("canvas");
                    canvas.classList.add("hole_canvas");
                    hole.insertAdjacentElement("afterbegin", canvas);
                    hole.addEventListener("mouseover", () => {
                        if (this.currentToPlay === 0 || this.board[1][i] === 0) return;
                        const h = canvas.height / 20;
                        const draw = (start) => {
                            if (start === 0) {
                                this.animate[i] = true;
                            }
                            if (!this.animate[i] || start >= canvas.height) {
                                return;
                            }
                            const context = canvas.getContext("2d");
                            context.fillStyle = "blue";
                            context.fillRect(0, start, canvas.width, h + 1);
                            setTimeout(() => draw(start + h), 5);
                        };
                        draw(0);
                    });
                    hole.addEventListener("mouseleave", () => {
                        this.animate[i] = false;
                        const context = canvas.getContext("2d");
                        context.clearRect(0, 0, canvas.width, canvas.height);
                    });
                    hole.addEventListener("click", () => {
                        this.animate[i] = false;
                        const context = canvas.getContext("2d");
                        context.clearRect(0, 0, canvas.width, canvas.height);
                    });
                }
                rows[row].appendChild(hole);
                this.addSeedsBoard_(numberSeeds, row, i);
                this.addSeedsView_(numberSeeds, row, i, false);
            }
        }
    }
}

export default Game;
