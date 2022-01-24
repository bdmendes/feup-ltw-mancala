const fs = require("fs");

exports.serveRanking = (request, response) => {
   response.writeHead(200, { "Content-Type": "application/json" });
   return JSON.parse(fs.readFileSync("./local/ranking.json"));
}