import { useContext, useState, useEffect } from 'react';
import {SelectedTileContext, SelectedUnitContext,
        SelectedWarriorListContext} from "../common/context";
import warriorImg from "../imgs/warrior.png"
import "./styles.css"


function WarriorList({warriors, availableWarriors}){
    const {selectedWarriorList, setSelectedWarriorList} = useContext(SelectedWarriorListContext);
    const [warriorList, setWarriorList] = useState(null);
    useEffect(()=>{
        if (selectedWarriorList === "all"){
            setWarriorList(warriors);
        } else {
            setWarriorList(availableWarriors);
        }
    }, [warriors, availableWarriors, selectedWarriorList])
    if (warriorList){
        return (
    <div className="warrior-list">
    <div className="warrior-list-buttons">
    <button className="button-neutral" onClick={
        ()=> {setSelectedWarriorList("all")}}
        style={{marginRight: '10px'}}> 
        <span>Show All<br/>Units: {warriors.length}</span> 
    </button>

    <button className="button" onClick={
        ()=> {setSelectedWarriorList("available")}}
        style={{marginLeft: '10px'}}> 
        <span>Show Available<br/>Units: {availableWarriors.length}</span> 
    </button>
    </div>
            {warriorList.map((warrior) => {
                return <Warrior key={warrior.id} warrior={warrior}/>
            })}
    </div>)
    }
}


function Warrior({warrior}){
    const {selectedTile, setSelectedTile} = useContext(SelectedTileContext);
    const {selectedUnit, setSelectedUnit} = useContext(SelectedUnitContext);
    let warriorAvailability = "Can't move";
    if (warrior.canMove){
        return (
        <div className="warrior-available" onClick = {
            () => handleWarriorSelection(setSelectedTile, setSelectedUnit, warrior)}
            style={{marginInline: 'auto'}}>
            <img className="warrior-img" src={warriorImg}/>
            <span className="warrior-text">Lv {warrior.level}</span>
        </div>)
    } else {
        return (
        <div className="warrior-unavailable" onClick = {
            () => handleWarriorSelection(setSelectedTile, setSelectedUnit, warrior)}
            style={{marginInline: 'auto'}}>
            <img className="warrior-img" src={warriorImg}/>
            <span>Lv {warrior.level}</span>
        </div>)
    }
}

function handleWarriorSelection(setSelectedTile, setSelectedUnit, warrior){
    setSelectedTile(warrior.x + warrior.y*10);
    if (warrior.canMove){
        setSelectedUnit({warrior});
    } else {
        setSelectedUnit(null);
    }
}

export default WarriorList;