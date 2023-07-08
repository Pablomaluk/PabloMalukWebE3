const Router = require("koa-router");
const { checkCityOptionsCost, verifyPlayerIsInTurn } = require("../functions/common");

const router = new Router();

router.post("city.create", "/", async (ctx) => {
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


router.get("city.options", "/:id/options", async (ctx) => {
    try{
        const city = await ctx.orm.City.findByPk(ctx.params.id,
            {attributes: {exclude: ["createdAt", "updatedAt"]}});
        const player = await city.getPlayer();
        const {upgradeCost, warriorCost} = checkCityOptionsCost(city);
        const playerCanUpgradeCity = player.gold >= upgradeCost;
        const playerCanBuyWarrior = player.gold >= warriorCost;

        const warriors = await player.getWarriors({
            where: {x: city.x, y: city.y},
            attributes: {exclude: ["createdAt", "updatedAt"]}
        })
        const availableWarriors = await player.getWarriors({
            where: {x: city.x, y: city.y, canMove:true},
            attributes: {exclude: ["createdAt", "updatedAt"]}
        })
        ctx.body = {upgradeCost, warriorCost, playerCanUpgradeCity,
            playerCanBuyWarrior, warriors, availableWarriors};
        ctx.status = 201;
    } catch(error) {
        ctx.body = error;
        ctx.status = 400;
    }
});

router.post("city.buy_warrior", "/:id/buy-warrior", async (ctx) => {
    try {
        const city = await ctx.orm.City.findByPk(ctx.params.id);
        const player = await city.getPlayer();
        const game = await city.getGame();
        await verifyPlayerIsInTurn(player);

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

router.post("city.level_up", "/:id/level-up", async (ctx) => {
    try {
        const city = await ctx.orm.City.findByPk(ctx.params.id);
        const player = await city.getPlayer();

        await verifyCityCanBeLeveled(player, city)

        await player.update({gold: player.gold - ((city.level+1) * 100)});
        await city.update({level: city.level + 1}); 

        ctx.response.body = {city, gold: player.gold};

    } catch(error) {
        console.log(error);
        ctx.body = error.message;
        ctx.status = 400;
    }
});

async function verifyCityCanBeLeveled(player, city){
    await verifyPlayerIsInTurn(player, city);
    if (player.gold < ((city.level+1) * 100)){
        throw new Error("Player doesnt have enough gold");
    }
    if (city.level == 5){
        throw new Error("City is max level");
    }
};

module.exports = router;