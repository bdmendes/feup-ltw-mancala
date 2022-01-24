const crypto = require('crypto');
const fs = require('fs');

exports.register = (request, response, players ) => {
    if(typeof request['nick'] === 'undefined' || typeof request['password'] === undefined){
        new Error('Bad request');
        return;
    }

    if( request['nick'] === '' || request['password'] === ''){
        new Error('Bad request');
        return;
    }
    const password = crypto.createHash('md5').update(request['password']).digest('hex');
    if(request['nick'] in players){
        if(players[request['nick']] != password){
            response.writeHead(401, { "Content-Type": "application/json" });
            return;
        }
    }else{
        players[request['nick']] = password;
    }
    
    response.writeHead(200, { "Content-Type": "application/json" });
    fs.writeFile('./local/players.json', JSON.stringify(players), (err) => {if(err)console.log(err);});
    return;
}