const Router = require("koa-router");
const {checkIfTileIsInMap, popRandom, verifyPlayerIsInTurn} = require("../functions/common");
const { Op } = require("sequelize");

const router = new Router();


router.get("warrior.check_turn_options", "/:id/options", async (ctx) => {
    try{ 
        const warrior = await ctx.orm.Warrior.findByPk(ctx.params.id);
        let canBuildCity = true;
        try {
            await checkIfWarriorCanBuildCity(warrior);
        } catch(error) {
            canBuildCity = false;
        }
        const moves = await getValidMoves(warrior);
        ctx.response.body = {canBuildCity, moves};
        ctx.status = 200;
    } catch(error) {
        console.log(error);
        ctx.body = error.message;
        ctx.status = 400;
    }
});

async function checkIfWarriorCanBuildCity(warrior){
    let game = await warrior.getGame();
    let player = await warrior.getPlayer();

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
    return true;
};

async function getValidMoves(warrior){
    let x = warrior.x;
    let y = warrior.y;
    let game = await warrior.getGame();
    let {up, down, left, right} = getAdjacentTilesInMap(game, x, y);
    up = up != null;
    down = down != null;
    left = left != null;
    right = right != null;

    return {up, down, left, right};
}

function getAdjacentTilesInMap(game, x, y){
    let adyacentTiles = getAdjacentTiles(x, y);
    let adyacentTilesInMap = {};
    for (let key of Object.keys(adyacentTiles)){
        if (checkIfTileIsInMap(game, adyacentTiles[key].x, adyacentTiles[key].y)){
            adyacentTilesInMap[key] = adyacentTiles[key];
        } else {
            adyacentTiles[key] = null;
        }
    }
    return adyacentTilesInMap;
}

function getAdjacentTiles(x, y){
    return {up: {x, y:y-1}, down: {x, y:y+1}, left: {x: x-1, y}, right: {x: x+1, y}}
}

router.post("warrior.execute_action", "/:id/action", async (ctx) => {
    try{ 
        const warrior = await ctx.orm.Warrior.findByPk(ctx.params.id);
        const action = ctx.request.body.action;
        await verifyAndExecuteWarriorAction(ctx.orm, warrior, action);
        ctx.status = 200;
    } catch(error) {
        console.log(error);
        ctx.body = error.message;
        ctx.status = 400;
    }
});

async function verifyAndExecuteWarriorAction(orm, warrior, action){
    await verifyWarriorCanMove(warrior);
    if (action == "skip"){
        await warrior.update({canMove: false});
    } else if (action == "build"){
        await checkIfWarriorCanBuildCity(warrior);
        await buildCity(orm, warrior);
    } else if (action == "up" || action == "down" || action == "left" || action == "right"){
        let move = await checkWarriorMove(warrior, action);
        if (move.attack){
            await executeAttack(warrior, move['attack'].x, move['attack'].y);
        } else {
            await executeMove(warrior, move['move'].x, move['move'].y);
        }
    }
}

async function verifyWarriorCanMove(warrior){
    
    let player = await warrior.getPlayer();
    await verifyPlayerIsInTurn(player);

    if (!warrior.canMove){
        throw new Error("Warrior can't move this turn");
    }
}

async function buildCity(orm, warrior){
    let player = await warrior.getPlayer();
    let game = await warrior.getGame();
    await orm.City.create({x: warrior.x, y: warrior.y, playerId: player.id, gameId: game.id});
    await player.update({gold: player.gold - 100});
    await warrior.destroy();
}

async function checkWarriorMove(warrior, action){
    let game = await warrior.getGame();
    let player = await warrior.getPlayer();
    let move;
    const { up, down, left, right } = getAdjacentTilesInMap(game, warrior.x, warrior.y)
    if (action == "up"){
        move = up;
    } else if (action == "down"){
        move = down;
    } else if (action == "left"){
        move = left;
    } else if (action == "right"){
        move = right;
    }
    if (await checkIfTileContainsEnemyUnits(player, move.x, move.y)){
        return {attack: {x: move.x, y: move.y}}
    } else {
        return {move: {x: move.x, y: move.y}}
    }
};

async function checkIfTileContainsEnemyUnits(player, x, y){
    let enemyWarriors = await getEnemyWarriorsInTile(player, x, y);
    let enemyCity = await getEnemyCitiesInTile(player, x, y);
    return enemyWarriors.length > 0 || enemyCity.length > 0;
};

async function getEnemyWarriorsInTile(player, x, y){
    let game = await player.getGame();
    return await game.getWarriors({
        where: {x, y, playerId: {[Op.ne]: player.id}}
    })
};

async function getEnemyCitiesInTile(player, x, y){
    let game = await player.getGame();
    return await game.getCities(
        {where: {x, y, playerId: {[Op.ne]: player.id}}
    })
};

async function executeMove(warrior, x, y){
    const player = await warrior.getPlayer();
    let collectedGold = await collectGoldTile(player, x, y);
    await warrior.update({x, y, canMove: false});
    return {warrior, ...collectedGold}
};

async function collectGoldTile(player, x, y){
    const game = await player.getGame();
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
};

async function executeAttack(warrior, x, y){
    let player = await warrior.getPlayer();
    let enemyWarriors = await getEnemyWarriorsInTile(player, x, y);
    if (enemyWarriors.length == 0){
        let city = await stealCity(player, x, y);
        await executeMove(warrior, x, y);
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

async function stealCity(player, x, y){
    let enemyCities = await getEnemyCitiesInTile(player, x, y);
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

module.exports = router;