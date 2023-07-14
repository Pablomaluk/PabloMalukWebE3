const { getUserIdFromToken } = require("../functions/common");
const createGameAndUpdateLobby = require("../functions/create_game");

const Router = require("koa-router");

const router = new Router();

router.get("lobby.show", "/show", async (ctx) => {
    try {
        let lobby = await getLobby(ctx.orm);
        ctx.body = lobby;
        ctx.status = 200;
    } catch(error) {
        ctx.body = error.message;
        console.log(error.message);
        ctx.status = 400;
    }
});

router.get("lobby.status", "/status", async (ctx) => {
    try {
        let userId = getUserIdFromToken(ctx);
        let lobby = await getLobby(ctx.orm);
        if (!checkIfUserIsInLobby({lobby, userId})){
            throw new Error("User not in lobby");
        }
        if (lobby.gameId){
            ctx.body = {gameId: lobby.gameId};
            ctx.status = 200;
            await removePlayerFromLobby({lobby, userId})
            return;
        }
        let ready = checkIfUserIsReady({lobby, userId});
        let playersReady = getPlayersReady({lobby});
        ctx.body = {players: lobby.usersNumber, ready, playersReady};
        ctx.status = 200;
    } catch(error) {
        ctx.body = error.message;
        console.log(error.message);
        ctx.status = 400;
    }
});

async function removePlayerFromLobby({lobby, userId}){
    if (lobby.userId1 && lobby.userId1 == userId){
        await lobby.update({userId1: null, usersNumber: lobby.usersNumber - 1, user1IsReady: false});
    } else if (lobby.userId2 && lobby.userId2 == userId){
        await lobby.update({userId2: null, usersNumber: lobby.usersNumber - 1, user1IsReady: false});
    } else if (lobby.userId3 && lobby.userId3 == userId){
        await lobby.update({userId3: null, usersNumber: lobby.usersNumber - 1, user1IsReady: false});
    } else if (lobby.userId4 && lobby.userId4 == userId){
        await lobby.update({userId4: null, usersNumber: lobby.usersNumber - 1, user1IsReady: false});
    }
    if (lobby.usersNumber == 0){
        await lobby.update({gameId: null});
    }
}


router.get("lobby.join", "/join", async (ctx) => {
    try {
        let userId = getUserIdFromToken(ctx);
        let lobby = await getLobby(ctx.orm);
        await addUserToLobby({lobby, userId});
        ctx.status = 200;
    } catch(error) {
        ctx.body = error.message;
        console.log(error.message);
        ctx.status = 400;
    }
});


async function getLobby(orm){
    return await orm.Lobby.findByPk(1);
}

async function addUserToLobby({lobby, userId}){
    if (checkIfLobbyIsFull(lobby)) throw new Error("Lobby is full");
    if (checkIfUserIsInLobby({lobby, userId})) return;
    if (!lobby.userId1){
        await lobby.update({userId1: userId, usersNumber: lobby.usersNumber + 1});
    } else if (!lobby.userId2){
        await lobby.update({userId2: userId, usersNumber: lobby.usersNumber + 1});
    } else if (!lobby.userId3){
        await lobby.update({userId3: userId, usersNumber: lobby.usersNumber + 1});
    } else if (!lobby.userId4){
        await lobby.update({userId4: userId, usersNumber: lobby.usersNumber + 1});
    };
};

function checkIfLobbyIsFull(lobby){
    return lobby.usersNumber == 4;
};

function checkIfUserIsInLobby({lobby, userId}){
    if (lobby.userId1 && lobby.userId1 == userId){
        return true;
    } else if (lobby.userId2 && lobby.userId2 == userId){
        return true;
    } else if (lobby.userId3 && lobby.userId3 == userId){
        return true;
    } else if (lobby.userId4 && lobby.userId4 == userId){
        return true;
    }
    return false;
};

function getPlayersReady({lobby}){
    let playersReady = 0;
    if (lobby.user1IsReady){
        playersReady++};
    if (lobby.user2IsReady){
        playersReady++;
    }
    if (lobby.user3IsReady){
        playersReady++;
    }
    if (lobby.user4IsReady){
        playersReady++;
    }
    return playersReady;
}

function checkIfUserIsReady({lobby, userId}){
    if (lobby.userId1 && lobby.userId1 == userId){
        return lobby.user1IsReady;
    } else if (lobby.userId2 && lobby.userId2 == userId){
        return lobby.user2IsReady;
    } else if (lobby.userId3 && lobby.userId3 == userId){
        return lobby.user3IsReady;
    } else if (lobby.userId4 && lobby.userId4 == userId){
        return lobby.user4IsReady;
    }
    return false;
}

router.get("lobby.leave", "/leave", async (ctx) => {
    try {
        let userId = getUserIdFromToken(ctx);
        let lobby = await getLobby(ctx.orm);
        await removeUserFromLobby({lobby, userId});
        ctx.status = 200;
    } catch(error) {
        ctx.body = error.message;
        console.log(error.message);
        ctx.status = 400;
    }
});

async function removeUserFromLobby({lobby, userId}){
    if (lobby.userId1 && lobby.userId1 == userId){
        await lobby.update({userId1: null, user1IsReady: false, usersNumber: lobby.usersNumber - 1});
    } else if (lobby.userId2 && lobby.userId2 == userId){
        await lobby.update({userId2: null, user2IsReady: false, usersNumber: lobby.usersNumber - 1});
    } else if (lobby.userId3 && lobby.userId3 == userId){
        await lobby.update({userId3: null, user3IsReady: false, usersNumber: lobby.usersNumber - 1});
    } else if (lobby.userId4 && lobby.userId4 == userId){
        await lobby.update({userId4: null, user4IsReady: false, usersNumber: lobby.usersNumber - 1});
    } else {
        throw new Error("User is not in lobby");
    }
};

router.get("lobby.ready", "/ready", async (ctx) => {
    try {
        let userId = getUserIdFromToken(ctx);
        let lobby = await getLobby(ctx.orm);
        await setLobbyUserReady({lobby, userId});
        ctx.status = 200;
        if (checkIfLobbyIsReady(lobby)){
            await createGameAndUpdateLobby({orm: ctx.orm, lobby});
            return;
        };
    } catch(error) {
        ctx.body = error.message;
        console.log(error.message);
        ctx.status = 400;
    }
});

async function setLobbyUserReady({lobby, userId}){
    if (lobby.userId1 && lobby.userId1 == userId){
        await lobby.update({user1IsReady: true});
    } else if (lobby.userId2 && lobby.userId2 == userId){
        await lobby.update({user2IsReady: true});
    } else if (lobby.userId3 && lobby.userId3 == userId){
        await lobby.update({user3IsReady: true});
    } else if (lobby.userId4 && lobby.userId4 == userId){
        await lobby.update({user4IsReady: true});
    } else {
        throw new Error("User is not in lobby");
    }
};

function checkIfLobbyIsReady(lobby){
    if (!checkIfLobbyHasAtLeastTwoUsers(lobby)) return false;
    if (lobby.userId1 && !lobby.user1IsReady) return false;
    if (lobby.userId2 && !lobby.user2IsReady) return false;
    if (lobby.userId3 && !lobby.user3IsReady) return false;
    if (lobby.userId4 && !lobby.user4IsReady) return false;
    return true;
};

function checkIfLobbyHasAtLeastTwoUsers(lobby){
    return lobby.usersNumber >= 2;
};


module.exports = router;