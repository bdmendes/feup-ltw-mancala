class Player {
    constructor(name, username, password) {
        this.name = name;
        this.username = username;
        this.password = password;
    }
}

class Computer extends Player {
    constructor(difficulty) {
        super("Computer", "computer", "computer");
        switch (difficulty) {
            case 2:
                this.difficulty = difficulty;
                break;
            case 3:
                this.difficulty = difficulty;
                break;
            case 1:
            default:
                this.difficulty = 1;
                break;
        };
    }

    play(game) {
        while(!game.play(0, this.getPlay(game))){
            this.wait();
        }
    }

    async wait(){await (() => new Promise((resolve) => setTimeout(resolve, 1000)))();}

    getPlay(game){
        if(this.difficulty == 3){
            return game.calculateBestPlay(2);
        }
        if(this.difficulty == 2){
            return Math.random % 2 ? game.calculateBestPlay(2) : Math.floor(Math.random() * game.board[0].length);
        }
        
        return Math.floor(Math.random() * game.board[0].length);
    }
}

export {Player, Computer}; 
