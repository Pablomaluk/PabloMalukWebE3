import { useState } from 'react';
import "./styles.css"
import Map from "../map/Map";
import OptionsWindow from "../options/OptionsWindow";
import { SelectedUnitContext, SelectedTileContext, UpdateContext,
         SelectedWarriorListContext } from '../common/context.jsx';


function Game() {
    const [selectedUnit, setSelectedUnit] = useState(null);
    const [selectedTile, setSelectedTile] = useState(null);
    const [updateVar, setUpdateVar] = useState(1);
    const [selectedWarriorList, setSelectedWarriorList] = useState("all");
    const Update = () => {setUpdateVar(updateVar+1);}
    return (      
        <SelectedTileContext.Provider value={{selectedTile, setSelectedTile}}>
        <SelectedUnitContext.Provider value={{selectedUnit, setSelectedUnit}}>
        <UpdateContext.Provider value={{updateVar, Update}}>
        <SelectedWarriorListContext.Provider value={{selectedWarriorList, setSelectedWarriorList}}>
        <div className="game">
            <Map />
            <OptionsWindow />
        </div>
        </SelectedWarriorListContext.Provider>
        </UpdateContext.Provider>
        </SelectedUnitContext.Provider>
        </SelectedTileContext.Provider>
        
    )
}

export default Game;