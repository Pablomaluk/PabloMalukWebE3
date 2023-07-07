import "./styles.css"
import { useContext } from 'react';
import {SelectedUnitContext, MovesContext, SelectedTileContext} from '../common/context.jsx';

function OptionsWindow(){
    const selectedTile = useContext(SelectedTileContext);
    if (!selectedTile){
        return (<div className="options"></div>)
    } else if(selectedTile == "city"){
        return (<CityOptions />)
    } else if(selectedTile == "warrior"){
        return (<WarriorOptions />)
    } else {
        return (<div>Empty</div>);
    }
}

export default OptionsWindow;