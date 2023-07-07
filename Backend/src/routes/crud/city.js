const Router = require("koa-router");

const router = new Router();

router.post("city.create", "/", async (ctx) => {
    // {gameId, playerId, x, y}
    try{
        const player = await ctx.orm.Player.create(ctx.request.body);
        ctx.body = player;
        ctx.status = 201;
    } catch(error) {
        ctx.body = error;
        ctx.status = 400;
    }
})

router.get("city.show", "/:id", async (ctx) => {
    try{
        const city = await ctx.orm.City.findOne({where: {id: ctx.params.id}});
        ctx.body = city;
        ctx.status = 201;
    } catch(error) {
        ctx.body = error;
        ctx.status = 400;
    }
})

router.post("city.player", "/", async (ctx) => {
    try{
        const player = await ctx.orm
        .City.findOne({where: {id: ctx.params.id}})
        .getPlayer();
        ctx.body = player;
        ctx.status = 201;
    } catch(error) {
        ctx.body = error;
        ctx.status = 400;
    }
})

router.post("city.change_owner", "/:id/change_owner", async (ctx) => {
    try{
        const city = await ctx.orm.City.findByPk(ctx.params.id);
        const newOwnerId = ctx.request.body.playerId;
        city.update({playerId: newOwnerId});
        ctx.body = city;
        ctx.status = 200;
    } catch(error) {
        ctx.body = error;
        ctx.status = 400;
    }
})

module.exports = router;