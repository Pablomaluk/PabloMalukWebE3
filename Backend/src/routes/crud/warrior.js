const Router = require("koa-router");

const router = new Router();

router.post("warrior.create", "/create", async (ctx) => {
    // {gameId, playerId, x, y}
    try{
        const warrior = await ctx.orm.Warrior.create(ctx.request.body);
        ctx.body = warrior;
        ctx.status = 201;
    } catch(error) {
        console.log(error);
        ctx.body = error.message;
        ctx.status = 400;
    }
})

module.exports = router;