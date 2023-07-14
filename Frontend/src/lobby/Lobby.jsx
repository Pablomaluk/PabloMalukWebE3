import './styles.css'
import { useState, useEffect, useContext } from 'react';
import { useInterval } from 'usehooks-ts'
import { AuthContext, GameContext } from '../common/context';
import { useNavigate } from 'react-router-dom';
import { handleFetch } from '../common/functions';

function Lobby(){

    const [ready, setReady] = useState(false);
    const [players, setPlayers] = useState(1);
    const [playersReady, setPlayersReady] = useState(0);
    const {token} = useContext(AuthContext);
    const {gameId, setGameId} = useContext(GameContext);
    const navigate = useNavigate();

    useEffect(()=>{
        async function joinLobby(){
            let route = `lobby/join`;
            await handleFetch({method: "get", route, token}
            ).catch((error) => {
                console.log(error);
            });
        };
        async function handleDisconnect(event){
            event.preventDefault();
            let route = `lobby/leave`;
            await handleFetch({method: "get", route, token})
          };
        joinLobby();
        window.addEventListener('beforeunload', handleDisconnect);
    }, [])

    useInterval(async () => {
        let route = `lobby/status`;
        await handleFetch({method: "get", route, token}
        ).then((response) => {
            if (response.data.gameId){
                setGameId(response.data.gameId);
                navigate('/game');
            }
            setPlayers(response.data.players);
            setPlayersReady(response.data.playersReady);
            setReady(response.data.ready);
        })
    }, 100);

    async function handlePlayerReady(){
        let route = `lobby/ready`;
        handleFetch({method: "get", route, token});
    };

    if (!ready){
        return(
            <div>
                <h1 style={{marginLeft: '44%', marginTop:'10%'}}>Game Lobby</h1>
                <h3 style={{marginLeft: '44%', marginTop:'5%'}}>Players Connected: {players}</h3>
                <h3 style={{marginLeft: '45.5%'}}>Players Ready: {playersReady}</h3>
                <h3 style={{marginLeft: '42%'}}>Press ready to start the game</h3>
                <button className="button-lobby"
                    onClick={()=>{handlePlayerReady()}}>
                        <span style={{fontWeight: 'bold', fontSize: '20px'}}>Ready</span>
                </button>

            </div>
    )} else {
        return(
            <div>
                <h1 style={{marginLeft: '44%', marginTop:'10%'}}>Game Lobby</h1>
                <h3 style={{marginLeft: '44%', marginTop:'5%'}}>Players Connected: {players}</h3>
                <h3 style={{marginLeft: '45.5%'}}>Players Ready: {playersReady}</h3>
                <h3 style={{marginLeft: '40%'}}>Waiting for other players to be ready...</h3>
                <button className="button-disabled">
                    <span style={{fontWeight: 'bold', fontSize: '20px'}}>Ready</span>
                </button>

            </div>
    )}
}

export default Lobby;