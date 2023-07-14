const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");

// Used & Working

function popRandom(array) {
    let i = (Math.random() * array.length) | 0;
    return array.splice(i, 1)[0];
};

async function getPlayerInTurn(game){
    let player = await game.getPlayers( 
        {where: { gamePlayerNumber: game.playerInTurn }
    });
    return player[0];
};

async function startTurn(game){
    let player = await getPlayerInTurn(game);
    let warriors = await resetPlayerWarriors(player);
    let goldCollected = await collectCityGold(player);
    return {player, warriors, ...goldCollected};
};

async function resetPlayerWarriors(player){
    let warriors = await player.getWarriors();
    for (let warrior of warriors){
        await warrior.update( { canMove: true } );
    }
    return warriors;
};

async function collectCityGold(player){
    let cities = await player.getCities();
    let goldCollected = 0;
    for(let city of cities){
        goldCollected += city.level * 5;
        await player.update( { gold: player.gold + city.level * 5 } );
    }
    return {cities, goldCollected};
};

function checkIfTileIsInMap(game, x, y){
    return x >= 0 && x < game.boardSize && y >= 0 && y < game.boardSize;
};

async function checkPlayerGameOver(player){
    if (player.gameOver){
        return true;
    }

    let cities = await player.getCities();
    console.log(cities);
    if (!(cities.length)){
        await player.update({gameOver: true});
        await player.removeWarriors();
        return true;
    }

    return false;
}

async function checkGameOver(game){
    let players = await game.getPlayers({
        where: {gameOver: false}
    });
    if (players.length == 1){
        await game.update({gameOver: true});
        return true;
    }
    return false;
}

function checkCityOptionsCost(city){
    let upgradeCost;
    if (city.level < 5){
        upgradeCost = (city.level+1)*100;
    };
    let warriorCost = city.level * 15;
    return {upgradeCost, warriorCost};
}

async function verifyPlayerIsInTurn(player){
    let game = await player.getGame();
    if (game.playerInTurn != player.gamePlayerNumber){
        throw new Error("Player is not in turn");
    };
}

async function checkIfPlayerIsInTurn(player){
    let game = await player.getGame();
    return game.playerInTurn == player.gamePlayerNumber;
}

// Requests Verifications

function getUserIdFromToken(ctx){
    let token = ctx.request.header.authorization.split(" ")[1];
    let decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded && decoded.sub){
        return parseInt(decoded.sub);
    }
    throw new Error("Token is not valid");
}

async function getPlayerFromGameAndUserId(orm, gameId, userId){
    await checkIfGameIdIsValid(orm, gameId);
    let player = await orm.Player.findOne({
        where: { gameId, userId }
    })
    if (!player){
        throw new Error("User is not in this game");
    }
    return player;
}

async function checkIfGameIdIsValid(orm, gameId){
    let game = await orm.Game.findByPk(gameId);
    if (!game){
        throw new Error("Game id isnt valid");
    }
    if (game.gameOver){
        throw new Error("Game has already finished");
    }
};

async function checkIfWarriorIdIsValid(orm, game, warriorId){
    let warrior = await orm.Warrior.findByPk(warriorId);
    if (!warrior){
        throw new Error("Warrior doesnt exist");
    }
    if (warrior.gameId != game.id){
        throw new Error("Warrior doesnt belong to this game");
    }
    if (!warrior.canMove){
        throw new Error("Warrior cant move right now");
    }
    return warrior;
}

async function checkIfCityIdIsValid(orm, game, cityId){
    let city = await orm.City.findByPk(cityId);
    let player = await getPlayerInTurn(game);

    if (!city){
        throw new Error("City doesnt exist");
    }
    if (city.gameId != game.id){
        throw new Error("City doesnt belong to this game");
    }
    if (city.playerId != player.id){
        throw new Error("City doesnt belong to player in turn");
    }
    return city;
}


module.exports = {popRandom, getPlayerInTurn, checkIfTileIsInMap, verifyPlayerIsInTurn,
    checkPlayerGameOver, checkGameOver, checkIfGameIdIsValid, checkIfWarriorIdIsValid,
    checkIfCityIdIsValid, checkCityOptionsCost, startTurn,
    getUserIdFromToken, getPlayerFromGameAndUserId, checkIfPlayerIsInTurn};
