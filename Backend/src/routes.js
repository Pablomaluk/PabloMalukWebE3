const Router = require("koa-router");
const createGame = require("./routes/functions/create_game_and_players");
const turn = require("./routes/functions/turn");
const game = require("./routes/crud/game");
const player = require("./routes/crud/player");
const user = require("./routes/crud/user");
const warrior = require("./routes/crud/warrior");
const city = require("./routes/crud/city");
const warriorActions = require("./routes/functions/warrior_actions");
const authRoutes = require("./routes/authentication");
const koaJwt = require("koa-jwt");
const dotenv = require('dotenv');

dotenv.config();
const router = new Router();


router.use('/game', createGame.routes());
router.use('/game', turn.routes());
router.use('/game', game.routes());
router.use('/player', player.routes());
router.use('/user', user.routes());
router.use('/warrior', warrior.routes());
router.use('/city', city.routes());
router.use('/game', warriorActions.routes());

//router.use(koaJwt({ secret: process.env.JWT_SECRET }));
//router.use('', authRoutes.routes());


module.exports = router;