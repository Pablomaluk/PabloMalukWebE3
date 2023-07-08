const Router = require("koa-router");
const {getPlayerInTurn, checkGameOver, checkPlayerGameOver,
       startTurn, resetPlayerWarriors, blockPlayerWarriors,
       collectCityGold} = require("./common.js");

const router = new Router();

router.get("turn.start", "/:gameId/start_turn", async (ctx) => {
    try{
        const game = await ctx.orm.Game.findByPk(ctx.params.gameId);
        const player = await getPlayerInTurn(game);
        let warriors = await resetPlayerWarriors(player);
        let goldCollected = await collectCityGold(player);
        ctx.response.body = {player, warriors, ...goldCollected};
    } catch(error) {
        console.log(error);
        ctx.body = error.message;
        ctx.status = 400;
    }
});


router.get("turn.end", "/:gameId/end_turn", async (ctx) => {
    try{
        const game = await ctx.orm.Game.findByPk(ctx.params.gameId);
        if (await checkGameOver(game)){
            throw new Error("Game is over");
        }

        let player = await getPlayerInTurn(game);
        await blockPlayerWarriors(player);

        while (true){
            await changePlayerInTurn(game);
            const player = await getPlayerInTurn(game);
            if (!(await checkPlayerGameOver(player))){
                break;
            }
        }
        ctx.response.body = await startTurn(game);
    } catch(error) {
        console.log(error);
        ctx.body = error;
        ctx.status = 400;
    }
});


module.exports = router;