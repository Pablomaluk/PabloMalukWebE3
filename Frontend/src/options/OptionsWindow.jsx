import "./styles.css"
import { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import {SelectedUnitContext, UpdateContext, SelectedTileContext} from '../common/context.jsx';
import CityOptions from './CityOptions';
import WarriorOptions from './WarriorOptions';
import WarriorList from "./WarriorList";

function OptionsWindow(){
    const playerId = 1;
    const [player, setPlayer] = useState(null);
    const {selectedUnit} = useContext(SelectedUnitContext);
    const {selectedTile} = useContext(SelectedTileContext);
    const {updateVar, Update} = useContext(UpdateContext);

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/player/${playerId}/game-info`)
        .then((response) => {
          setPlayer(response.data);
        }).catch((error)=>{
          console.log(error);
        });
      }, [updateVar]
    );

    function EndTurn({player}){
        axios.post(`${import.meta.env.VITE_API_URL}/player/${playerId}/end-turn`, {}
        ).then(() => {Update()})
    };

    function EndTurnButton({player}){
        return (
            <button className="end-turn-button" onClick={() => EndTurn({player})}>End Turn</button>
        )
    }
    

    if (player){
        if (!selectedUnit){
            return (
            <div className="options">
                <PlayerInfo player={player} />
                <WarriorList warriors={player.warriors} availableWarriors={player.availableWarriors}/>
                <EndTurnButton player={player}/>
            </div>)
        } else if(selectedUnit.city){
            return (
                <div className="options">
                <PlayerInfo player={player} />
                <CityOptions city={selectedUnit.city}/>
                <EndTurnButton player={player}/>
                </div>)
        } else if(selectedUnit.warriors){
            return (
                <div className="options">
                <PlayerInfo player={player} />
                <WarriorList warriors={selectedUnit.warriors} availableWarriors={selectedUnit.availableWarriors}/>
                <EndTurnButton player={player}/>
                </div>)
        } else if (selectedUnit.warrior){
            return (
                <div className="options">
                <PlayerInfo player={player} />
                <WarriorOptions warrior={selectedUnit.warrior}/>
                <EndTurnButton player={player}/>
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