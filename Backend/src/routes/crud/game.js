const Router = require("koa-router");
const {checkIfGameIdIsValid} = require("../functions/common.js");

const router = new Router();


router.get("game.show", "/:id", async (ctx) => {
    try{
        const game = await checkIfGameIdIsValid(ctx.orm, ctx.params.id);
        const players = await game.getPlayers();
        const warriors = await game.getWarriors();
        const cities = await game.getCities();
        const goldTiles = await game.getGold();
        ctx.body = {game, players, warriors, cities, goldTiles};
        ctx.status = 200;
    } catch(error) {
        console.log(error);
        ctx.body = error.message;
        ctx.status = 400;
    }
});

router.get("game-players.list", "/:id/players", async (ctx) => {
    try{
        const game = await checkIfGameIdIsValid(ctx.orm, ctx.params.id);
        const players = await game.getPlayers();
        ctx.body = players;
        ctx.status = 200;
    } catch(error) {
        ctx.body = error.message;
        ctx.status = 400;
    }
});

router.get("game-players.list", "/:id/players_alive", async (ctx) => {
    try{
        const game = await checkIfGameIdIsValid(ctx.orm, ctx.params.id);
        const players = await game.getPlayers(
            {where: { gameOver: false}}
        );
        ctx.body = players;
        ctx.status = 200;
    } catch(error) {
        ctx.body = error.message;
        ctx.status = 400;
    }
});

router.get("game.playerInTurn", "/:id/player_in_turn", async (ctx) => {
    try{
        const game = await checkIfGameIdIsValid(ctx.orm, ctx.params.id);
        const players = await game.getPlayers(
            {where: { gamePlayerNumber: game.playerInTurn }
        });
        ctx.body = players[0];
        ctx.status = 200;
    } catch(error) {
        ctx.body = error.message;
        ctx.status = 400;
    }
});

router.get("game-golds.list", "/:id/gold_tiles", async (ctx) => {
    try{
        const golds = await checkIfGameIdIsValid(ctx.orm, ctx.params.id)
            .then(game => game.getGold());
        ctx.body = golds;
        ctx.status = 200;
    } catch(error) {
        console.log(error);
        ctx.body = error.message;
        ctx.status = 400;
    }
});

router.get("game-cities.list", "/:id/cities", async (ctx) => {
    try{
        const cities = await checkIfGameIdIsValid(ctx.orm, ctx.params.id)
        .then(game => game.getCities());
        ctx.body = cities;
        ctx.status = 200;
    } catch(error) {
        console.log(error);
        ctx.body = error.message;
        ctx.status = 400;
    }
});

router.get("game-warriors.list", "/:id/warriors", async (ctx) => {
    try{
        const warriors = await checkIfGameIdIsValid(ctx.orm, ctx.params.id)
        .then(game => game.getWarriors());
        ctx.body = warriors;
        ctx.status = 200;
    } catch(error) {
        console.log(error);
        ctx.body = error.message;
        ctx.status = 400;
    }
});



module.exports = router;