const Router = require("koa-router");
const { popRandom, getPlayerInTurn, getAdjacentTiles, getEnemyWarriorsInTile, 
    getEnemyCitiesInTile, checkIfTileContainsEnemyUnits, checkGameOver, 
    checkPlayerGameOver, checkIfGameIdIsValid, checkIfWarriorIdIsValid,
    checkIfCityIdIsValid } = require("./common.js");

const router = new Router();


router.get("warrior.check_turn_options", "/:gameId/warrior/:warriorId/options", async (ctx) => {
    try{ 
        const game = await checkIfGameIdIsValid(ctx.orm, ctx.params.gameId);
        const warrior = await checkIfWarriorIdIsValid(ctx.orm, game, ctx.params.warriorId);
        const player = await warrior.getPlayer();
        let warriorCanBuildCity = true;
        let warriorCanLevelCity = true;

        try {
            await checkIfWarriorCanBuildCity(game, player, warrior);
        } catch {
            warriorCanBuildCity = false;
        }
        try {
            await checkIfWarriorCanLevelCity(game, player, warrior);
        } catch {
            warriorCanLevelCity = false;
        }
        const warriorValidMoves = await checkWarriorMoves(game, player, warrior);
        ctx.response.body = {warrior, warriorCanBuildCity, warriorCanLevelCity, ...warriorValidMoves};
        ctx.status = 200;
    } catch(error) {
        console.log(error);
        ctx.body = error.message;
        ctx.status = 400;
    }
});

async function checkIfWarriorCanBuildCity(game, player, warrior){
    if (player.gamePlayerNumber != game.playerInTurn){
        throw new Error("Warrior not in turn");
    }
    if (!warrior.canMove){
        throw new Error("Warrior cant move");
    }
    if (player.gold < 100){
        throw new Error("Player doesnt have enough gold");
    }
    let warriorIsInCity = await player.getCities({where: {x: warrior.x, y: warrior.y}})
                                  .then(cities => cities.length);
    if (warriorIsInCity){
        throw new Error("There is already a city in the warrior's position");
    }
};

async function checkIfWarriorCanLevelCity(game, player, warrior){
    let warriorIsInCity = await player.getCities({where: {x: warrior.x, y: warrior.y}})
                                  .then(cities => cities.length);
    if (!warriorIsInCity){ 
        throw new Error("Warrior is not inside a city"); 
    }
    if (player.gamePlayerNumber != game.playerInTurn){
        throw new Error("Warrior not in turn");
    }
    if (!warrior.canMove){
        throw new Error("Warrior cant move");
    }
    let city = await player.getCities({where: {x: warrior.x, y: warrior.y}});
    city = city[0];

    if (player.gold < ((city.level+1) * 100)){
        throw new Error("Player doesnt have enough gold");
    }
    if (city.level == 5){
        throw new Error("City is max level");
    }
    if (city.level > warrior.level){
        throw new Error("Warrior level is too low to upgrade city");
    }
    return city;
};

async function checkWarriorMoves(game, player, warrior){
    const adjacentTiles = getAdjacentTiles(game, warrior.x, warrior.y);
    const tilesThatCanBeMovedTo = [[warrior.x, warrior.y]];
    const tilesThatCanBeAttacked = [];

    for (let tile of adjacentTiles){
        if (await checkIfTileContainsEnemyUnits(game, player, tile[0], tile[1])){
            tilesThatCanBeAttacked.push(tile);
        } else {
            tilesThatCanBeMovedTo.push(tile);
        }
    }

    return {moves: tilesThatCanBeMovedTo, attacks: tilesThatCanBeAttacked};
};

router.post("warrior.build_city", "/:gameId/build_city", async (ctx) => {
    try{
        if (!ctx.request.body.warriorId){
            throw new Error("Warrior id not provided");
        }
        const game = await checkIfGameIdIsValid(ctx.orm, ctx.params.gameId);
        const warrior = await checkIfWarriorIdIsValid(ctx.orm, game, ctx.request.body.warriorId);
        const player = await warrior.getPlayer();

        await checkIfWarriorCanBuildCity(game, player, warrior);

        player.addCity({gameId: game.id, x: warrior.x, y: warrior.y});
        player.update({gold: player.gold - 100});
        warrior.destroy();
        ctx.status = 201;

    } catch(error) {
        console.log(error.message);
        ctx.body = error.message;
        ctx.status = 400;
    }
});


router.post("warrior.level_city", "/:gameId/level_city", async (ctx) => {
    try{
        if (!ctx.request.body.warriorId){
            throw new Error("Warrior id not provided");
        }
        const game = await checkIfGameIdIsValid(ctx.orm, ctx.params.gameId);
        const warrior = await checkIfWarriorIdIsValid(ctx.orm, game, ctx.request.body.warriorId);
        const player = await warrior.getPlayer();

        let city = await checkIfWarriorCanLevelCity(game, player, warrior);
        await player.update({gold: player.gold - ((city.level+1) * 100)});
        await city.update({level: city.level + 1});    
        await warrior.destroy();

        ctx.body = { city };
        ctx.status = 200;

    } catch(error) {
        console.log(error);
        ctx.body = error.message;
        ctx.status = 400;
    }
})

router.put("warrior.move", "/:gameId/warrior/:warriorId/move", async (ctx) => {
    try{
        if (!ctx.request.body.move){
            throw new Error("Move coordinates not provided");
        }
        if (ctx.request.body.move.length != 2){
            throw new Error("Move coordinates should be 2 integers");
        }
        if (typeof ctx.request.body.move[0] != "number" || typeof ctx.request.body.move[1] != "number"){
            throw new Error("Move coordinates should be 2 integers");
        }
        const game = await checkIfGameIdIsValid(ctx.orm, ctx.params.gameId);
        const warrior = await checkIfWarriorIdIsValid(ctx.orm, game, ctx.params.warriorId);
        const player = await warrior.getPlayer();
        const move = ctx.request.body.move;

        const {moves} = await checkWarriorMoves(game, player, warrior);
        console.log(moves);

        for (let allowedMove of moves){
            if (allowedMove[0] == move[0] && allowedMove[1] == move[1]){
                result = await moveWarriorToTile(game, warrior, move[0], move[1]);
                ctx.status = 200;
                ctx.response.body = result;
                return;
            }
        }

        throw new Error("Move is not valid");

    } catch(error) {
        console.log(error);
        ctx.body = error.message;
        ctx.status = 400;
    }
});

async function moveWarriorToTile(game, warrior, x, y){
    const player = await warrior.getPlayer();
    let collectedGold = await collectGoldTile(game, player, x, y);
    console.log(collectedGold);
    await warrior.update({x, y, canMove: false});
    console.log({warrior, ...collectedGold});
    return {warrior, ...collectedGold}
};

async function collectGoldTile(game, player, x, y){
    const goldTiles = await game.getGold({where: {x, y}});
    let collectedGold = 0;
    for (let goldTile of goldTiles){
        collectedGold += goldTile.amount;
        await player.update({gold: player.gold + goldTile.amount});
        await goldTile.destroy();
    }
    if (collectedGold){
        return {collectedGold};
    }
    
}

router.post("warrior.attack", "/:gameId/warrior/:warriorId/attack", async (ctx) => {
    try{
        if (!ctx.request.body.attack){
            throw new Error("Attack coordinates not provided");
        }
        if (ctx.request.body.attack.length != 2){
            throw new Error("Attack coordinates should be 2 integers");
        }
        if (typeof ctx.request.body.attack[0] != "number" || typeof ctx.request.body.attack[1] != "number"){
            throw new Error("Attack coordinates should be 2 integers");
        }
        const game = await checkIfGameIdIsValid(ctx.orm, ctx.params.gameId);
        const warrior = await checkIfWarriorIdIsValid(ctx.orm, game, ctx.params.warriorId);

        const player = await warrior.getPlayer();
        const attack = ctx.request.body.attack;

        const { attacks } = await checkWarriorMoves(game, player, warrior);

        for (let allowedAttack of attacks){
            if (allowedAttack[0] == attack[0] && allowedAttack[1] == attack[1]){
                ctx.response.body = await attackTile(game, player, warrior, attack[0], attack[1]);
                ctx.status = 200;
                return;
            }
        }
        throw new Error("Attack is not valid");

    } catch(error) {
        console.log(error);
        ctx.body = error.message;
        ctx.status = 400;
    }
});

async function attackTile(game, player, warrior, x, y){
    let enemyWarriors = await getEnemyWarriorsInTile(game, player, x, y);
    if (enemyWarriors.length == 0){
        let city = await stealCity(game, player, x, y);
        await moveWarriorToTile(game, warrior, x, y);
        return {result: "City Stolen", city};
    }

    let enemyWarrior = popRandom(enemyWarriors);
    if (warrior.level > enemyWarrior.level){
        await enemyWarrior.destroy();
        await warrior.update({canMove: false});
        return {result: "Attack successful. Enemy warrior was killed", winner: warrior};

    } else if (warrior.level == enemyWarrior.level){
        await warrior.destroy();
        await enemyWarrior.destroy();
        return {result: "Draw. Both warriors were killed"};

    } else {
        await warrior.destroy();
        return {result: "Attack failed. Warrior was killed", winner: enemyWarrior};
    }
    
}

async function stealCity(game, player, x, y){
    let enemyCities = await getEnemyCitiesInTile(game, player, x, y);
    if (enemyCities.length == 0){ 
        throw new Error("No enemy cities to steal"); 
    };
    let city = enemyCities[0];
    let enemy = await city.getPlayer();
    await city.update({playerId: player.id});
    if (await checkPlayerGameOver(enemy)){
        if (await checkGameOver(game)){
            await game.update({gameOver: true});
            throw new Error("Game over");
        }
    };
    return city;
}

router.post("turn.buy_warrior", "/:gameId/buy_warrior", async (ctx) => {
    try {
        if (!ctx.request.body.cityId){
            throw new Error("City id not provided");
        }
        const game = await checkIfGameIdIsValid(ctx.orm, ctx.params.gameId);
        const city = await checkIfCityIdIsValid(ctx.orm, game, ctx.request.body.cityId);
        const player = await getPlayerInTurn(game);

        if (player.gold >= city.level * 15){
            const warrior = await ctx.orm.Warrior.create({
                x: city.x, y: city.y, gameId: game.id, playerId: player.id,
                level: city.level});
            let cost = city.level * 15;
            await player.update( { gold: player.gold - cost } ); 
            ctx.response.body = {warrior, cost, gold: player.gold};
            ctx.status = 201;   
        } else {
            throw new Error("Not enough gold");
        };
    } catch(error) {
        console.log(error);
        ctx.body = error.message;
        ctx.status = 400;
    }
});

module.exports = router;