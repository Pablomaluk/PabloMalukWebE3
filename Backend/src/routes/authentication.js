const Router = require('koa-router');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

dotenv.config();
const router = new Router();

router.post("authentication.signup", "/signup", async (ctx) =>{
    const { email, username, password } = ctx.request.body;
    try {
        if (!email || !username || !password) {
            throw new Error("Missing fields");
        }
        let user = await checkIfUserExists(ctx.orm, username)
        if (user){
            throw new Error(`Username ${username} already in use`);
        }
        let hashedPassword = await bcrypt.hash(password, 10);
        user = await ctx.orm.User.create({email, username, hashedPassword});
        ctx.status = 201;
        ctx.body = {username, email};
    } catch (error) {
        ctx.body = { error: error.message };
        console.log(error.message);
        ctx.status = 400;
    }
})

router.post("authentication.login", "/login", async (ctx) =>{
    const { username, password } = ctx.request.body;
    try {
        if (!username || !password) {
            throw new Error("Missing fields");
        }
        let user = await checkIfUserExists(ctx.orm, username)
        if (!user){
            console.log(user);
            throw new Error(`Username ${username} not found`);
        }
        let hashedPassword = user.password;
        let passwordIsCorrect = await bcrypt.compare(password, hashedPassword);

        if (!passwordIsCorrect){
            throw new Error(`Incorrect password`);
        }

        ctx.body = generateTokenBody(user);
        ctx.status = 200;
        
    } catch (error) {
        ctx.body = { error: error.message };
        console.log(error.message);
        ctx.status = 400;
    }
})

async function checkIfUserExists(orm, username){
    let user = await orm.User.findOne({ where: { username } });
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