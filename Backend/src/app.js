const Koa = require("koa");
const KoaLogger = require("koa-logger");
const { koaBody } = require("koa-body");
const koaCors = require("@koa/cors");

const orm = require('./models');
const router = require("./routes");

const app = new Koa();
app.context.orm = orm;

app.use(koaCors());
app.use(KoaLogger());
app.use(koaBody());
app.use(router.routes());

app.use((ctx, next) => {
    ctx.body = "Hola Mundo! Saludos desde IIC2513"; });

module.exports = app;
