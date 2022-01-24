const http = require("http");
const url = require("url");
const fs = require("fs");
const crypto = require("crypto");
const path = require("path");
const { serveRanking } = require("./router/ranking");
const { register } = require("./router/register");

const mimeTypes = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".wav": "audio/wav",
    ".mp4": "video/mp4",
    ".woff": "application/font-woff",
    ".ttf": "application/font-ttf",
    ".eot": "application/vnd.ms-fontobject",
    ".otf": "application/font-otf",
    ".wasm": "application/wasm",
};

function processJson(request, response, callback) {
    let body = "";
    request.setEncoding("utf8");
    request.on("data", (chunk) => {
        body += chunk;
    });
    request.on("end", () => {
        try {
            const requestData = JSON.parse(body);
            const responseData = callback(requestData, response, players);
            response.end(JSON.stringify(responseData), "utf-8");
        } catch (_) {
            response.writeHead(400);
            response.end(
                JSON.stringify({
                    error: "Invalid request data",
                })
            );
        }
    });
}

function serveFile(pathName, response) {
    console.log("serving " + pathName);
    if (pathName === "/") {
        pathName += "index.html";
    }
    const extName = String(path.extname(pathName)).toLowerCase();
    const contentType = mimeTypes[extName] || "application/octet-stream";
    fs.readFile("./public" + pathName, (error, content) => {
        if (error) {
            response.writeHead(404);
            response.end(JSON.stringify(error));
            return;
        }
        response.writeHead(200, { "Content-Type": contentType });
        response.end(content, "utf-8");
    });
}

let players = JSON.parse(fs.readFileSync("./local/players.json"));

http.createServer((request, response) => {
    const parsedUrl = url.parse(request.url, true, false);
    switch (request.method) {
        case "POST":
            switch (parsedUrl.pathname) {
                case "/register":
                    processJson(request, response, register);
                    break;
                case "/ranking":
                    processJson(request, response, serveRanking);
                    break;
                default:
                    response.writeHead(404, { "Content-Type": "application/json" });
                    response.end(
                        JSON.stringify({
                            error: "Unknown route",
                        })
                    );
            }
            break;
        case "GET":
            switch (parsedUrl.pathname) {
                case '/':
                    fs.readFile("index.html", (error, content) => {
                        if (error) {
                            response.writeHead(404);
                            response.end(JSON.stringify(error));
                            return;
                        }
                        response.writeHead(200, { "Content-Type": "text/html" });
                        response.end(content, "utf-8");
                    });
                    break;
                default:
                    serveFile(parsedUrl.pathname, response);
                    break;
            }
            break;
        default:
            response.writeHead(404, { "Content-Type": "application/json" });
            response.end(
                JSON.stringify({
                    error: "Unsupported method",
                })
            );
            break;
    }
}).listen(9109);
