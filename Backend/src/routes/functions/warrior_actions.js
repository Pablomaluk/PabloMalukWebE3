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

module.exports = router;