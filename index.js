import Game from "./scripts/game.js";

document.getElementById('startGame').addEventListener('click', () => {
    setTimeout(() => {
        document.getElementById('play').addEventListener("click", () => {
            for(let row of document.getElementsByClassName('hole-row')){
              while(row.firstChild){
                row.firstChild.remove();
              }
            }
          
            const cavities = parseInt(document.forms[0].cavities.value);
            const seeds = parseInt(document.forms[0].seeds.value);
            const is_turn = parseInt(document.forms[0].user_turn.value);

            console.log(cavities, seeds, is_turn);

            let game = new Game(is_turn, cavities, seeds);
            game.loadView();
            game.calculateBestPlay(2);

            window.hidePopup(document.getElementById("settings"));
        });
    }, 1);
});
