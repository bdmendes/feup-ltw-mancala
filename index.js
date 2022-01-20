const http = require("http");
const url = require("url");
const { serveRanking } = require("./router/ranking");

function parseJson(request, response, callback) {
    let body = "";
    request.setEncoding("utf8");
    request.on("data", (chunk) => {
        body += chunk;
    });
    request.on("end", () => {
        try {
            const data = JSON.parse(body);
            callback(data, response);
        } catch (er) {
            console.log("Invalid received json at route " + request.url);
        }
    });
}

http.createServer((request, response) => {
    const parsedUrl = url.parse(request.url, true, false);
    switch (request.method) {
        case "POST":
            switch (parsedUrl.pathname) {
                case "/register":
                    break;
                case "/ranking":
                    parseJson(request, response, serveRanking);
                    break;
                default:
                    response.write("Unknown route");
                    response.end();
            }
            break;
        case "GET":
            break;
        default:
            response.write("Unsupported HTTP method\n");
            response.end();
            break;
    }
}).listen(9109);
