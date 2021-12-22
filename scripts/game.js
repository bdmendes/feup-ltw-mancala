class Game {
    constructor(player1, player2, firstToPlay = 1, boardSize = 5, startSeeds = 6) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = [
            // Player 0 (top)
            new Array(boardSize).fill(startSeeds),
            0,

            // Player 1 (bottom)
            new Array(boardSize).fill(startSeeds),
            0,
        ];
        this.currentToPlay = firstToPlay;
        this.loadRowsView_();
    }

    play_(player, position) {
        let remainingSeeds = this.board[player * 2][position];
        if (remainingSeeds === 0) return;

        let cof = player === 0 ? -1 : 1;
        const originalCof = cof;
        const playerSide = (currCof) => currCof === originalCof;
        this.removeSeeds_(player, position);

        while (remainingSeeds) {
            position += cof;
            if (position === -1 || position === this.board[0].length) {
                if (playerSide(cof)) {
                    remainingSeeds--;
                    this.addSeed_(player, position);
                }
                cof *= -1;
            } else {
                remainingSeeds--;
                this.addSeed_(cof === -1 ? 0 : 1, position);
                if (this.board[player * 2][position] === 1 && playerSide(cof)) {
                    let seedsStorage = this.board[0][position] + this.board[2][position];
                    while (seedsStorage--)
                        this.addSeed_(_, player === 0 ? -1 : this.board[0].length);
                    this.removeSeeds_(0, position);
                    this.removeSeeds_(1, position);
                }
            }
            // console.log(JSON.parse(JSON.stringify(this.board)));
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

    addSeed_(player, position) {
        if (position === -1) this.board[1]++;
        else if (position === this.board[0].length) this.board[3]++;
        else this.board[player * 2][position]++;

        const seed = document.createElement("div");
        seed.classList.add("seed");
        this.getHoleNode_(player, position).appendChild(seed);
    }

    removeSeeds_(player, position) {
        if (position === -1) this.board[1] = 0;
        else if (position === this.board[0].length) this.board[3] = 0;
        else this.board[player * 2][position] = 0;

        this.getHoleNode_(player, position).innerHTML = "";
    }

    loadRowsView_() {
        const rows = document.getElementsByClassName("hole-row");
        for (let i = 0; i < this.board[0].length; i++) {
            for (let rowNumber of [0, 1]) {
                const hole = document.createElement("div");
                hole.classList.add("hole");
                rows[rowNumber].appendChild(hole);
                let numberSeeds = this.board[rowNumber * 2][i];
                this.board[rowNumber * 2][i] = 0;
                while (numberSeeds--) {
                    this.addSeed_(rowNumber, i);
                }
            }
        }
    }
}

export default Game;
