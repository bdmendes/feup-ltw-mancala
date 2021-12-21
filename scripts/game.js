class Game {
    constructor(player1, player2, boardSize = 5, startSeeds = 6) {
        this.players = [player1, player2];
        this.board = [
            new Array(boardSize).fill(startSeeds),
            0,
            new Array(boardSize).fill(startSeeds),
            0,
        ];
        console.log(this.board);
    }

    play(player, position) {
        if (position < 0 || position >= this.board[0].length) {
            throw "Invalid position";
        }
        if (player !== 1 && player !== 0) {
            throw "Invalid player";
        }
        const cof = player === 0 ? -1 : 1;
        this.board[player * 2][position] = 0;
    }

    loadView() {
        const rows = document.getElementsByClassName("hole-row");
        for (let i = 0; i < this.board[0].length; i++) {
            for (let rowNumber of [0, 1]) {
                const hole = document.createElement("div");
                hole.classList.add("hole");
                rows[rowNumber].appendChild(hole);
                let numberSeeds = this.board[rowNumber * 2][i];
                while (numberSeeds--) {
                    const seed = document.createElement("div");
                    seed.classList.add("seed");
                    seed.style.position = "relative";
                    hole.appendChild(seed);
                }
            }
        }
    }
}

export default Game;
