import { getRanking } from "../requests.js";

export function getRankingContent() {
    const ranking = `<h2 style="text-align:center; margin: 10px 0 10px 0;">Online</h2>
    <div id="online_ranking_table">
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
  </div>
  <h2 style="text-align:center; margin: 10px 0 10px 0;">Local</h2>
  <div id="local_ranking_table">
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
    return ranking;
}

export function injectServerRankingResults() {
    getRanking()
        .then(
            (response) => {
                if (response.ok) return response.json();
                const err = document.createElement("h6");
                err.style.marginTop = "20px";
                err.style.textAlign = "center";
                err.textContent = "Bad server response";
                document.getElementById("online_ranking_table").appendChild(err);
            },
            () => {
                const err = document.createElement("h6");
                err.style.marginTop = "20px";
                err.style.textAlign = "center";
                err.textContent = "Network error";
                document.getElementById("online_ranking_table").appendChild(err);
            }
        )
        .then((json) => {
            if (json === undefined) return;
            const table = document.getElementById("online_ranking_table");
            const tbody = table.getElementsByTagName("tbody")[0];
            const ranking = json.ranking;
            for (let i = 0; i < 5 && i < ranking.length; i++) {
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
                tbody.appendChild(row);
            }
        });
}

export function injectLocalRankingResults() {
    const ranking_ = localStorage.getItem("ranking");
    if (!ranking_) {
        const err = document.createElement("h6");
        err.style.marginTop = "20px";
        err.style.textAlign = "center";
        err.textContent = "No data on local ranking";
        document.getElementById("local_ranking_table").appendChild(err);
        return;
    }
    const ranking = JSON.parse(ranking_).ranking;
    const table = document.getElementById("local_ranking_table");
    const tbody = table.getElementsByTagName("tbody")[0];
    for (let i = 0; i < 5 && i < ranking.length; i++) {
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
        tbody.appendChild(row);
    }
}
