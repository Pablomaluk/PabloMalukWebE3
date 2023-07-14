const Router = require("koa-router");
const { verifyPlayerIsInTurn, startTurn, checkIfPlayerIsInTurn,
        getPlayerInTurn, checkPlayerGameOver, getUserIdFromToken, 
        getPlayerFromGameAndUserId } = require("../functions/common.js");
const { Op } = require("sequelize");



const router = new Router();

router.get("player.show-info", "/:gameId/player-info", async (ctx) => {
    try{
        const userId = getUserIdFromToken(ctx);
        const player = await getPlayerFromGameAndUserId(ctx.orm, ctx.params.gameId, userId);
        const warriors = await player.getWarriors({
            attributes: {exclude:["createdAt", "updatedAt"]}
        });
        const availableWarriors = await player.getWarriors({
            where: {canMove: true},
            attributes: {exclude:["createdAt", "updatedAt"]}
        });
        const cities = await player.getCities({
            attributes: {exclude:["createdAt", "updatedAt"]}
        });
        let inTurn = await checkIfPlayerIsInTurn(player);
        ctx.body = {gold: player.gold, cities, warriors, availableWarriors, inTurn};
        ctx.status = 200;
    } catch(error) {
        ctx.body = error.message;
        ctx.status = 400;
    }
});

router.get("player.board-info", "/:gameId/board-info", async (ctx) => {
    try{
        const userId = getUserIdFromToken(ctx);
        const game = await ctx.orm.Game.findByPk(ctx.params.gameId);
        const player = await getPlayerFromGameAndUserId(ctx.orm, game.id, userId);
        const playerWarriors = await player.getWarriors({
            attributes: {exclude:["createdAt", "updatedAt"]}
        });
        const playerCities = await player.getCities({
            attributes: {exclude:["createdAt", "updatedAt"]}
        });
        const enemyWarriors = await game.getWarriors({
            where: {playerId: {[Op.ne]: player.id}},
            attributes: {exclude:["createdAt", "updatedAt"]}
        });
        const enemyCities = await game.getCities({
            where: {playerId: {[Op.ne]: player.id}},
            attributes: {exclude:["createdAt", "updatedAt"]}
        });
        const goldTiles = await game.getGold({
            attributes: {exclude:["createdAt", "updatedAt"]}
        });
        ctx.body = {playerWarriors, playerCities, enemyWarriors, enemyCities, goldTiles};
        ctx.status = 200;
    } catch(error) {
        console.log(error);
        ctx.body = error.message;
        ctx.status = 400;
    }
});


router.post("turn.end", "/:gameId/end-turn", async (ctx) => {
    try{
        const userId = getUserIdFromToken(ctx);
        const game = await ctx.orm.Game.findByPk(ctx.params.gameId);
        const player = await getPlayerFromGameAndUserId(ctx.orm, game.id, userId);
        await verifyPlayerIsInTurn(player)
        await blockPlayerWarriors(player);
        while (true){
            await changePlayerInTurn(game);
            const player = await getPlayerInTurn(game);
            if (!(await checkPlayerGameOver(player))){
                break;
            }
        }
        ctx.response.body = await startTurn(game);
        console.log(ctx.response.body);
    } catch(error) {
        console.log(error.message);
        ctx.body = error.message;
        ctx.status = 400;
    }
});

async function blockPlayerWarriors(player){
    let warriors = await player.getWarriors();
    for (let warrior of warriors){
        await warrior.update( { canMove: false } );
    }
    return warriors;
};

async function changePlayerInTurn(game){
    let playerInTurn = (game.playerInTurn+1) % game.playersCount;
    return await game.update( {playerInTurn} );
};


router.get("player-cities.list", "/:id/cities", async (ctx) => {
    try{
        const cities = await checkIfPlayerIdIsValid(ctx.orm, ctx.params.id)
        .then(player => player.getCities());
        ctx.body = cities;
        ctx.status = 200;
    } catch(error) {
        console.log(error);
        ctx.body = error;
        ctx.status = 400;
    }
});

router.get("player-warriors.list", "/:id/warriors", async (ctx) => {
    try{
        const warriors = await checkIfPlayerIdIsValid(ctx.orm, ctx.params.id)
            .then(player => player.getWarriors());
        ctx.body = warriors;
        ctx.status = 200;
    } catch(error) {
        console.log(error);
        ctx.body = error.message;
        ctx.status = 400;
    }
})

router.get("player-warriors.list", "/:id/available_warriors", async (ctx) => {
    try{
        const player = await checkIfPlayerIdIsValid(ctx.orm, ctx.params.id)
        const warriors = await player.getWarriors({
            where: {canMove: true}
        });
        ctx.body = warriors;
        ctx.status = 200;
    } catch(error) {
        console.log(error);
        ctx.body = error.message;
        ctx.status = 400;
    }
});


module.exports = router;