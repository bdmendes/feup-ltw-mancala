class Player {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
}

class Computer extends Player {
    constructor(difficulty) {
        super("computer", "computer");
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

    async play(game) {
        while(!game.play(0, this.getPlay(game))){
            if(game.isGameOver()){return;}
            await this.sleep(1000);
        }
    }

    async sleep(interval){return new Promise((resolve) => setTimeout(resolve, interval));}

    getPlay(game){
        if(this.difficulty == 3){
            return game.calculateBestPlay(2)[0];
        }
        if(this.difficulty == 2){
            return game.calculateBestPlay(1)[0];
        }
        
        return Math.floor(Math.random() * game.board[0].length);
    }
}


class RemotePlayer extends Player{
    constructor(username){

    }
}

export {Player, Computer, RemotePlayer}; 
