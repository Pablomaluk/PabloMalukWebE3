const Koa = require("koa");
const KoaLogger = require("koa-logger");
const { koaBody } = require("koa-body");
const koaCors = require("@koa/cors");
const { koaSwagger } = require("koa2-swagger-ui");
const yamljs = require("yamljs");

const orm = require('./models');
const spec = yamljs.load("./openapi.yml");
const router = require("./routes");
router.get("/docs", koaSwagger({ routePrefix: false, swaggerOptions: { spec } }));

const app = new Koa();
app.context.orm = orm;

app.use(koaCors());
app.use(KoaLogger());
app.use(koaBody());
app.use(router.routes());

app.use((ctx, next) => {
    ctx.body = "Hola Mundo! Saludos desde IIC2513"; });

module.exports = app;
