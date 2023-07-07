const Router = require("koa-router");

const router = new Router();

router.post("gold.create", "/", async (ctx) => {
    // {gameId, x, y, amount}
    try{
        const player = await ctx.orm.Player.create(ctx.request.body);
        ctx.body = player;
        ctx.status = 201;
    } catch(error) {
        ctx.body = error;
        ctx.status = 400;
    }
})


module.exports = router;