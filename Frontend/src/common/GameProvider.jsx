import { useState, useEffect } from 'react';
import { GameContext } from './context';

function GameProvider({children}){
    const [gameId, setGameId] = useState(localStorage.getItem('gameId')) || null;

    useEffect(()=>{
        console.log("Set game id", gameId);
        localStorage.setItem('gameId', gameId);
    }, [gameId]);

    function endGame(){
        setGameId(null);
    };

    return (
        <GameContext.Provider value = {{gameId, setGameId, endGame}}>
            {children}
        </GameContext.Provider>
    )
}

export default GameProvider;