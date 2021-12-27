class Room {
    constructor(token, game, player0, player1) {
        this.token = token;
        this.game = game;
        this.players = [player0, player1];
    }
}

export default Room;
