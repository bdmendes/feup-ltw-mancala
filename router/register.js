const crypto = require("crypto");
const fs = require("fs");

exports.register = (request, response, players) => {
    if (
        typeof request["nick"] === "undefined" ||
        typeof request["password"] === undefined ||
        request["nick"] === "" ||
        request["password"] === ""
    ) {
        response.writeHead(400, { "Content-Type": "application/json" });
        response.end(
            JSON.stringify({
                error: "Invalid request",
            })
        );
        return;
    }
    const password = crypto.createHash("md5").update(request["password"]).digest("hex");
    if (request["nick"] in players) {
        if (players[request["nick"]] != password) {
            response.writeHead(401, { "Content-Type": "application/json" });
            response.end(
                JSON.stringify({
                    error: "Invalid credentials",
                })
            );
            return;
        }
    } else {
        players[request["nick"]] = password;
    }
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(
        JSON.stringify({
            success: "Login successful",
        })
    );
    fs.writeFile("./local/players.json", JSON.stringify(players), (err) => {
        if (err) console.log(err);
    });
    return;
};
