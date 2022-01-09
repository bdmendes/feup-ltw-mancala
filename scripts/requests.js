const twServer = "http://twserver.alunos.dcc.fc.up.pt:8008";

function post_(url, body) {
    return fetch(twServer + "/" + url, {
        method: "POST",
        body: JSON.stringify(body) ?? "",
    });
}

export function registerUser(nick, password) {
    const body = {
        nick: nick,
        password: password,
    };
    return post_("register", body);
}

export function joinGame(token, nick, password, size, initial) {
    const body = {
        group: token,
        nick: nick,
        password: password,
        size: size,
        initial: initial,
    };
    return post_("join", body);
}

export function leaveGame(nick, password, game) {
    const body = {
        nick: nick,
        password: password,
        game: game,
    };
    return post_("leave", body);
}

export function notifyMove(nick, password, game, move) {
    const body = {
        nick: nick,
        password: password,
        game: game,
        move: move,
    };
    return post_("notify", body);
}

export function getRanking() {
    return post_("ranking");
}

export function openEventSource() {
    return new EventSource(twServer + "/update");
}
