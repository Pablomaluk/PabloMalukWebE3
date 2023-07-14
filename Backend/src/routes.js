const Router = require("koa-router");
const turn = require("./routes/functions/turn");
const player = require("./routes/crud/player");
const user = require("./routes/crud/user");
const warrior = require("./routes/crud/warrior");
const city = require("./routes/crud/city");
const warriorActions = require("./routes/functions/warrior_actions");
const lobby = require("./routes/crud/lobby");
const authRoutes = require("./routes/authentication");
const koaJwt = require("koa-jwt");
const dotenv = require('dotenv');
const { koaSwagger } = require("koa2-swagger-ui");
const yamljs = require("yamljs");


const spec = yamljs.load("./openapi.yml");
dotenv.config();
const router = new Router();


router.get("/docs", koaSwagger({ routePrefix: false, swaggerOptions: { spec } }));
router.use('', authRoutes.routes());

router.use(koaJwt({ secret: process.env.JWT_SECRET }));

router.use('/lobby', lobby.routes());
router.use('/game', player.routes());

//router.use('/game', turn.routes());
router.use('/user', user.routes());
router.use('/warrior', warrior.routes());
router.use('/city', city.routes());
router.use('/game', warriorActions.routes());



module.exports = router;