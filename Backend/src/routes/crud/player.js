const Router = require("koa-router");
const { checkIfPlayerIdIsValid } = require("../functions/common.js");


const router = new Router();

router.get("player.show", "/:id", async (ctx) => {
    try{
        const player = await checkIfPlayerIdIsValid(ctx.orm, ctx.params.id);
        ctx.body = player;
        ctx.status = 201;
    } catch(error) {
        ctx.body = error.message;
        ctx.status = 400;
    }
});

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
})



module.exports = router;