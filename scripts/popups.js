import { getRanking } from "./requests.js";

function blurGameContainer() {
    document.getElementById("game-container").style.filter = "blur(5px)";
}

function unBlurGameContainer() {
    document.getElementById("game-container").style.removeProperty("filter");
}

function createPopup(id, title, content) {
    const popupContainer = document.createElement("div");
    popupContainer.setAttribute("class", "popup-container");

    const popup = document.createElement("div");
    popup.setAttribute("class", "popup");
    const close = document.createElement("span");
    close.textContent = "Close";
    close.id = "close";
    close.style.marginBottom = "5px";
    close.onclick = function () {
        hidePopup(popupContainer);
    };
    popup.appendChild(close);

    const popupTitle = document.createElement("div");
    popupTitle.setAttribute("class", "popup-title");
    let t = document.createElement("h1");

    const c = document.createElement("div");
    c.setAttribute("class", "popup-content");

    popupContainer.id = id;
    t.textContent = title;
    c.innerHTML = content;

    popupTitle.appendChild(t);
    popup.appendChild(popupTitle);
    popup.appendChild(c);
    popupContainer.appendChild(popup);

    return popupContainer;
}

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

function getPopup(id) {
    switch (id) {
        case "ranking":
            const ranking = `<div id="ranking_table">
                              <table>
                                <thead>
                                  <tr>
                                    <th class="t_username">Username</th>
                                    <th class="t_victories">Victories</th>
                                    <th class="t_games">Games</th>
                                </thead>
                                <tbody>
                                </tbody>
                                </tr>
                              </table>
                            </div>`;
            setTimeout(() => {
                getRanking()
                    .then(
                        (response) => {
                            if (response.ok) return response.json();
                            const err = document.createElement("h6");
                            err.style.marginTop = "20px";
                            err.textContent = "Bad server response";
                            document.getElementById("ranking_table").appendChild(err);
                        },
                        () => {
                            const err = document.createElement("h6");
                            err.style.marginTop = "20px";
                            err.textContent = "Network error";
                            document.getElementById("ranking_table").appendChild(err);
                        }
                    )
                    .then((json) => {
                        if (json === undefined) return;
                        const ranking = json.ranking;
                        console.log(ranking);
                        for (let i = 0; i < 10 && i < ranking.length; i++) {
                            const row = document.createElement("tr");
                            row.innerHTML =
                                "<th>" +
                                ranking[i].nick +
                                "</th>" +
                                "<th>" +
                                ranking[i].victories +
                                "</th>" +
                                "<th>" +
                                ranking[i].games +
                                "</th>";
                            document.getElementById("ranking_table").getElementsByTagName("tbody")[0].appendChild(row);
                        }
                    });
            }, 10);
            return createPopup("ranking", "Ranking", ranking);
        case "instructions":
            const instructions = `<h2>Board</h2>
          <p>
            There are 2 rows of cavities and 2 containers. Each player controls
            the cavities in its side and the container to its right.
          </p>
          <h2>Start</h2>
          <p>
            In the begining of the game the containers are empty and each cavity
            has the same number of seeds.
          </p>
          <h2>Game</h2>
          <p>
            Each player will, alternately, take the seeds in one of its cavities
            and sew one in each of the next cavities and in its container
            counterclockwisely. If the last seed is placed in the container, the
            current player has the next turn. If the last seed falls into a
            previously empty cavity controlled by the player, that seed and the
            seeds in the opposite cavity are placed in its container.
          </p>
          <h2>Ending</h2>
          <p>
            The game ends when a player can't sew due to lack of seeds. The
            other player places the seeds in its cavities in its container. Wins
            the player with more seeds in.
          </p>`;
            return createPopup("instructions", "Instructions", instructions);
        case "game_button":
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
            return createPopup("settings", "Start Game", tabs);
        default:
            return createPopup("test");
    }
}

export function showPopup(id) {
    for (let popup of document.getElementsByClassName("popup-container")) {
        popup.remove();
    }
    blurGameContainer();
    document.getElementsByTagName("nav")[0].insertAdjacentElement("afterend", getPopup(id));
}

function hidePopup(element) {
    element.remove();
    unBlurGameContainer();
}

window.hidePopup = hidePopup;
