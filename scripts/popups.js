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
    const whoStartsBegin = `<span>Who starts?</span>
                      <div><input
                    type="radio"
                    name="user_turn"
                    id="user1"
                    value="1"
                    checked
                  />
                  <label for="user1">You</label
                  ><input
                    type="radio"
                    name="user_turn"
                    id="user2"
                    value="0"
                  /><label for="user2">`;
    const whoStartsEnd = `</label><input
                type="radio"
                name="user_turn"
                id="rdm"
                value="3"
                /><label for="rdm">Random</label></div>`;

    switch (playMode) {
        case "single_player":
            return whoStartsBegin + "Computer" + whoStartsEnd;
        case "multi_player":
            return `<span>Room token</span><div>
                    <input type="text" name="code" id="code" placeholder="Enter code" /></div>`;
        default:
            return "";
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
            <label for="username">Username:</label>
            <input type="text" name="username" id="username" placeholder="Username"/>
            <br>
            <label for="password">Password:</label>
            <input type="password" name="password" id="password" placeholder="Password"/>`;
            document.getElementById("options").insertAdjacentElement("afterend", login);
            if (difficulty.style.display !== "none") {
                difficulty.style.display = "none";
            }
        }
    }

    document.getElementById("variable").innerHTML = startOptionHTML(tab);
}

function getPopup(id) {
    switch (id) {
        case "ranking":
            const ranking = `<table>
              <tr>
                <th scope="col">Username</th>
                <th scope="col">Score</th>
              </tr>
              <tr>
                <td>Sirze</td>
                <td>20</td>
              </tr>
                <td>brod56</td>
                <td>19</td>
              </tr>
              <tr>
                <td>brod56</td>
                <td>19</td>
              </tr>
              <tr>
                <td>brod56</td>
                <td>19</td>
              </tr>
              <tr>
                <td>brod56</td>
                <td>19</td>
              </tr>
              <tr>
                <td>brod56</td>
                <td>19</td>
              </tr>
              <tr>
                <td>brod56</td>
                <td>19</td>
              </tr>
              <tr>
                <td>brod56</td>
                <td>19</td>
              </tr>
              <tr>
                <td>brod56</td>
                <td>19</td>
              </tr>
              <tr>
                <td>brod56</td>
                <td>19</td>
              </tr>
          </table>`;
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
        
                <div id="variable">` +
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

function showPopup(id) {
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
