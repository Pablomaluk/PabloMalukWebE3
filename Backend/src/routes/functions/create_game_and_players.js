const Router = require("koa-router");
const { popRandom, startTurn } = require("./common.js");

const router = new Router();

router.post("create_players_and_game_from_user_ids", "/create", async (ctx) => {
    const { userIds } = ctx.request.body;
    const boardSize = 10;
    const orm = ctx.orm;
    try {
        if (!userIds){
            throw new Error("Endpoint requires user ids and board size");
        }

        const game = await createGame(orm, userIds, boardSize);
        const players = await createPlayers(orm, userIds, game.id);
        const tiles = await createStartingBoard(orm, game.id, players, boardSize);
        await startTurn(game);
        ctx.response.body = {game, players, tiles};
        ctx.status = 201;
    } catch(error) {
        console.log(error);
        ctx.response.body = error.message;
        ctx.status = 400;
    }
});

        
async function createGame(orm, userIds, boardSize){
    let playersCount = userIds.length;
    if (userIds.length < 2 || userIds.length > 4){
        throw new Error("There must be between 2 and 4 user ids");
    }
    if (boardSize < 7 || boardSize > 12){
        throw new Error("Board size must be between 7 and 12");
    }
    return await orm.Game.create({playersCount, boardSize});
};

async function createPlayers(orm, userIds, gameId){
    let playersCount = userIds.length;
    let players = [];
    let playerNumbers = [...Array(playersCount).keys()];

    try {

    for (const playerNumber of playerNumbers) {
        const player = await orm.Player.create(
            {gamePlayerNumber: playerNumber, gameId, 
                userId: userIds[playerNumber]});
        players.push(player);
    };
    return players;
    
    } catch(error) {
        throw new Error("There was an invalid user id");
    }
};

async function createStartingBoard(orm, gameId, players, boardSize){
    let goldTiles = await createGoldTiles(orm, gameId, boardSize);
    let cityTiles = await createInitialCities(orm, gameId, players, boardSize);
    let warriorTiles = await createInitialWarriors(orm, gameId, players, boardSize);
    return {goldTiles, cityTiles, warriorTiles};
};


async function createGoldTiles(orm, gameId, boardSize){
    let goldTiles = await createDefaultGoldTiles(orm, gameId, boardSize);
    goldTiles = goldTiles.concat(await createRandomGoldTiles(orm, gameId, boardSize));
    return goldTiles;

};

async function createDefaultGoldTiles(orm, gameId, boardSize){
    defaultGoldCorners = [[1, 0], [1, boardSize-1], [boardSize-2, 0], [boardSize-2, boardSize-1],
        [0, 1], [0, boardSize-2], [boardSize-1, 1], [boardSize-1, boardSize-2]];
    let goldTiles = [];
    for (const corner of defaultGoldCorners) {
        const goldTile = await orm.Gold.create({gameId, x: corner[0], y: corner[1], amount:50});
        goldTiles.push(goldTile);
    };
    return goldTiles;
};

async function createRandomGoldTiles(orm, gameId, boardSize){
    let goldProb = 0.7;
    const allTiles = [];
    for (let x=1; x<boardSize; x++){
        for (let y=1; y<boardSize; y++){
            if (x != y){
                allTiles.push([x, y]);
            };
        };
    };

    let randomNumber = Math.random();
    const goldCount = Math.round(randomNumber * goldProb * allTiles.length);
    const goldTiles = [];


    for (let tileCount=0; tileCount < goldCount; tileCount++){
        let pos = popRandom(allTiles);
        let x = pos[0];
        let y = pos[1];
        let amount = generateRandomGoldAmount();
        goldTiles.push(await orm.Gold.create({gameId, x, y, amount}));
    }
    return goldTiles;
};

function generateRandomGoldAmount(){
    let goldAmounts = [5, 10, 25, 50, 100, 250];
    return goldAmounts[Math.floor(Math.random() * goldAmounts.length)];

};


async function createInitialCities(orm, gameId, players, boardSize){
    let cities = [];
    let initialCityCorners = [[0, 0], [boardSize-1, boardSize-1], [0, boardSize-1], [boardSize-1, 0]];
    for (let player of players){
        let city = await orm.City.create({gameId, x: initialCityCorners[player.gamePlayerNumber][0],
            y: initialCityCorners[player.gamePlayerNumber][1], playerId: player.id})
        cities.push(city);
    };
    return cities;

};

async function createInitialWarriors(orm, gameId, players, boardSize){
    let warriors = [];
    let initialWarriorCorners = [[0, 0], [boardSize-1, boardSize-1], [0, boardSize-1], [boardSize-1, 0]];
    for (let player of players){
        let warrior = await orm.Warrior.create({gameId, x: initialWarriorCorners[player.gamePlayerNumber][0],
            y: initialWarriorCorners[player.gamePlayerNumber][1], playerId: player.id})
        warriors.push(warrior);
    };
    return warriors;
};

module.exports = router;