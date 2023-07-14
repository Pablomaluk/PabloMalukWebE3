import "./styles.css"
import { useContext, useState, useEffect } from 'react';
import {SelectedUnitContext, SelectedTileContext, GameContext, AuthContext} from '../common/context.jsx';
import CityOptions from './CityOptions';
import WarriorOptions from './WarriorOptions';
import WarriorList from "./WarriorList";
import { handleFetch } from "../common/functions";
import { useInterval} from 'usehooks-ts';


function OptionsWindow(){
    const [player, setPlayer] = useState(null);
    const {selectedUnit} = useContext(SelectedUnitContext);
    const {selectedTile} = useContext(SelectedTileContext);
    const {gameId} = useContext(GameContext);
    const {token} = useContext(AuthContext);

    useInterval(async () => {
        let route = `game/${gameId}/player-info`;
        await handleFetch({method: "get", route, token})
        .then((response) => {
          setPlayer(response.data);
        }).catch((error)=>{
          console.log(error);
        });
      }, 300
    );

    function EndTurn(){
        handleFetch({method: 'post', route: `game/${gameId}/end-turn`, token})
    };

    function EndTurnButton(){
        return (
            <button className="end-turn-button" onClick={() => EndTurn()}>End Turn</button>
        )
    }
    

    if (player){
        console.log(player);
        if (!player.inTurn){
            return (
                <div className="options">
                <PlayerInfo player={player} />
                </div>)
        }
        if (!selectedUnit){
            return (
            <div className="options">
                <PlayerInfo player={player} />
                <WarriorList warriors={player.warriors} availableWarriors={player.availableWarriors}/>
                <EndTurnButton/>
            </div>)
        } else if(selectedUnit.city){
            return (
                <div className="options">
                <PlayerInfo player={player} />
                <CityOptions city={selectedUnit.city}/>
                <EndTurnButton/>
                </div>)
        } else if(selectedUnit.warriors){
            return (
                <div className="options">
                <PlayerInfo player={player} />
                <WarriorList warriors={selectedUnit.warriors} availableWarriors={selectedUnit.availableWarriors}/>
                <EndTurnButton/>
                </div>)
        } else if (selectedUnit.warrior){
            return (
                <div className="options">
                <PlayerInfo player={player} />
                <WarriorOptions warrior={selectedUnit.warrior}/>
                <EndTurnButton/>
                </div>)
        }
    }
}

function PlayerInfo({player}){
    const {gold, cities, warriors, availableWarriors} = player;
    return (
        <div className="player-info">
            <h3 className="player-info-attribute">Gold: {gold}</h3>
            <h3 className="player-info-attribute">Total Units: {warriors.length}</h3>
            <h3 className="player-info-attribute">Cities: {cities.length}</h3>
            <h3 className="player-info-attribute">Available Units: {availableWarriors.length}</h3>
        </div>
    )
}

export default OptionsWindow;