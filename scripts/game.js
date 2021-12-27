class Game {
    constructor(firstToPlay = 1, boardSize = 5, startSeeds = 6) {
        this.board = [new Array(boardSize).fill(startSeeds), new Array(boardSize).fill(startSeeds)];
        this.storage = [0, 0];
        this.currentToPlay = firstToPlay;
        this.loadRowsView_();
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

    play(player, position) {
        if (player != this.currentToPlay) {
            alert("Player is not to play!");
            return;
        }
        this.play_(player, position);
        if (this.isGameOver()) {
            alert("Game is over! Player " + this.getWinner() + " wins!");
        }
    }

    play_(player, position) {
        let remainingSeeds = this.board[player][position];
        if (remainingSeeds === 0) return;

        let cof = player === 0 ? -1 : 1;
        const originalCof = cof;
        const playerSide = (currCof) => currCof === originalCof;
        this.removeSeeds_(player, position);

        while (remainingSeeds > 0) {
            position += cof;
            if (position === -1 || position === this.board[0].length) {
                if (playerSide(cof)) {
                    remainingSeeds--;
                    this.addSeeds_(1, player, position);
                }
                cof *= -1;
            } else {
                remainingSeeds--;
                this.addSeeds_(1, cof === -1 ? 0 : 1, position);
                if (remainingSeeds === 0 && this.board[player][position] === 1 && playerSide(cof)) {
                    let seedsStorage = this.board[0][position] + this.board[1][position];
                    this.addSeeds_(seedsStorage, player, player === 0 ? -1 : this.board[0].length);
                    this.removeSeeds_(0, position);
                    this.removeSeeds_(1, position);
                }
            }
        }

        if (position === -1 && player === 0) return;
        if (position === this.board[0].length && player === 1) return;
        this.currentToPlay = (this.currentToPlay + 1) % 2;
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

    addSeeds_(numberSeeds, player, position, fall = true) {
        while (numberSeeds--) {
            if (position === -1) this.storage[0]++;
            else if (position === this.board[0].length) this.storage[1]++;
            else this.board[player][position]++;

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

    removeSeeds_(player, position) {
        if (position === -1) this.storage[0] = 0;
        else if (position === this.board[0].length) this.storage[1] = 0;
        else this.board[player][position] = 0;
        this.getHoleNode_(player, position).innerHTML = "";
    }

    loadRowsView_() {
        const rows = document.getElementsByClassName("hole-row");
        for (let i = 0; i < this.board[0].length; i++) {
            for (let row of [0, 1]) {
                const hole = document.createElement("div");
                hole.classList.add("hole");
                hole.addEventListener("click", () => this.play(row, i));
                rows[row].appendChild(hole);
                let numberSeeds = this.board[row][i];
                this.board[row][i] = 0;
                this.addSeeds_(numberSeeds, row, i, false);
            }
        }
    }
}

export default Game;
