const Router = require('koa-router');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();
const router = new Router();

router.post("authentication.signup", "/signup", async (ctx) =>{
    const { email, username, password } = ctx.request.body;
    try {
        if (!email || !username || !password) {
            throw new Error("Missing fields");
        }
        let user = await checkIfUserExists(ctx.orm, email)
        if (user){
            throw new Error(`Email ${email} already in use`);
        }
        user = await ctx.orm.User.create({email, username, password});
        ctx.status = 201;
        ctx.body = {username, email};
    } catch (error) {
        ctx.body = { error: error.message };
        ctx.status = 400;
    }
})

router.post("authentication.login", "/login", async (ctx) =>{
    const { email, password } = ctx.request.body;
    try {
        if (!email || !password) {
            throw new Error("Missing fields");
        }
        let user = await checkIfUserExists(ctx.orm, email)
        if (!user){
            console.log(user);
            throw new Error(`Email ${email} not found`);
        }

        if (user.password != password){
            throw new Error(`Incorrect password`);
        }

        ctx.body = generateTokenBody(user);
        ctx.status = 200;
        
    } catch (error) {
        ctx.body = { error: error.message };
        ctx.status = 400;
    }
})

async function checkIfUserExists(orm, email){
    let user = await orm.User.findOne({ where: { email } });
    console.log(user);
    if (user){
        return user;
    }
    return false;
}

function generateTokenBody(user) {
    let expirationSeconds = 1 * 60 * 60 * 8;
    const token = jwt.sign(
        {scope: ['user']},
        process.env.JWT_SECRET,
        {subject: user.id.toString()},
        {expiresIn: expirationSeconds});
    return {access_token: token,
            token_type: "Bearer",
            expires_in: expirationSeconds};
}

module.exports = router;