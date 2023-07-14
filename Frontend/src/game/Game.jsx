import { useState } from 'react';
import "./styles.css"
import Map from "../map/Map";
import OptionsWindow from "../options/OptionsWindow";
import { SelectedUnitContext, SelectedTileContext, UpdateContext,
         SelectedWarriorListContext } from '../common/context.jsx';
import { CheckIfUserIsLoggedIn } from '../common/functions.jsx';


function Game() {
    //CheckIfUserIsLoggedIn();
    const [selectedUnit, setSelectedUnit] = useState(null);
    const [selectedTile, setSelectedTile] = useState(null);
    const [selectedWarriorList, setSelectedWarriorList] = useState("all");
    return (      
        <SelectedTileContext.Provider value={{selectedTile, setSelectedTile}}>
        <SelectedUnitContext.Provider value={{selectedUnit, setSelectedUnit}}>
        <SelectedWarriorListContext.Provider value={{selectedWarriorList, setSelectedWarriorList}}>
        <div className="game">
            <Map />
            <OptionsWindow />
        </div>
        </SelectedWarriorListContext.Provider>
        </SelectedUnitContext.Provider>
        </SelectedTileContext.Provider>
        
    )
}

export default Game;