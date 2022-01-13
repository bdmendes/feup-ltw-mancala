import { getRanking } from "../requests.js";

export function getRankingContent() {
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
    setTimeout(
        () =>
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
                    const table = document.getElementById("ranking_table");
                    const tbody = table.getElementsByTagName("tbody")[0];
                    const ranking = json.ranking;
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
                        tbody.appendChild(row);
                    }
                }),
        0
    );
    return ranking;
}
