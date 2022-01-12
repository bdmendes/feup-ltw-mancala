function updateDifficulty(range) {
    const difficulties = ["Easy", "Medium", "Hard"];
    const idx = parseInt(range.value) - 1;
    range.nextElementSibling.value = difficulties[idx];
}

function startOptionHTML(playMode) {
    const player1Button = `<input type="radio" name="user_turn" id="player1" value="1" checked/>
        <label for="player1">You</label>`;
    const player0Button = (name) =>
        `<input type="radio" name="user_turn" id="player0" value="0"/>
        <label for="player0">` +
        name +
        `</label>`;
    const randomButton = `<input type="radio" name="user_turn" id="random" value="-1"/>
        <label for="random">Random</label>`;

    if (playMode === "single_player") {
        return (
            "<span>Who starts?</span>" + "<div>" + player1Button + player0Button("Computer") + randomButton + "</div>"
        );
    } else {
        return `<span>Room token</span>
                  <div>
                    <input type="text" name="code" id="code" placeholder="Enter room token" />
                  </div>`;
    }
}

function updateTab(tab) {
    let login = document.getElementById("login");
    const difficulty = document.getElementById("difficulty_option");

    if (tab == "single_player") {
        if (login !== null) {
            login.remove();
        }
        if (difficulty.style.display === "none") {
            difficulty.style.display = "block";
        }
    } else {
        if (login === null) {
            login = document.createElement("div");
            login.id = "login";
            login.innerHTML = `
              <label for="username">Username</label>
              <input type="text" name="username" id="username" placeholder="Enter your username"/>
              <br>
              <label for="password">Password</label>
              <input type="password" name="password" id="password" placeholder="Enter your password"/>
              <h6 id="login_status" style="margin-top: 20px; text-align:center;"></h6>`;
            document.getElementById("options").insertAdjacentElement("afterend", login);
            if (difficulty.style.display !== "none") {
                difficulty.style.display = "none";
            }
        }
    }

    document.getElementById("who_starts").innerHTML = startOptionHTML(tab);
}

export function getSettingsContent() {
    const tabs =
        `<form>
            <div class="tab-selector">
              <div>
                <input type="radio" name="mode" id="single_player" value="single_player" checked /><label onclick="updateTab(this.getAttribute('for'));" for="single_player">Singleplayer</label>
                <input type="radio" name="mode" id="multi_player" value="multi_player" /><label
                onclick="updateTab(this.getAttribute('for'));" for="multi_player">Multiplayer</label>
              </div>
              </div>
              <div class="tab">
                <div id="options">
                <label for="cavities">Cavities</label>
                <div>
                  <input type="range" name="cavities" id="cavities" value="4" min="4" max="8" onchange="this.nextElementSibling.value = this.value;"/>
                  <output>4</output>
                </div>
        
                <label for="seeds">Seeds per cavity</label>
                <div>
                  <input type="range" name="seeds" id="seeds" value="4" min="4" max="6" onchange="this.nextElementSibling.value = this.value;"/>
                <output>4</output>
                </div>
                
                <div id="difficulty_option" style="display: block;">
                    <label for="difficulty">Difficulty</label>
                    <div>
                    <input type="range" name="difficulty" id="difficulty" value="1" min="1" max="3" onchange="updateDifficulty(this);"/>
                    <output>Easy</output>
                    </div>
                </div>
        
                <div id="who_starts">` +
        startOptionHTML("single_player") +
        `
                </div>
                </div>
                <button id="play" type="button">Play!</button>
              </div>
              </form>`;
    return tabs;
}

window.updateTab = updateTab;
window.updateDifficulty = updateDifficulty;
