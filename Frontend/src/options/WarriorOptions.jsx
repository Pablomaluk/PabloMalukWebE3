import "./styles.css";
import { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { SelectedUnitContext, UpdateContext } from "../common/context";
import up from "../imgs/up.png";
import down from "../imgs/down.png";
import left from "../imgs/left.png";
import right from "../imgs/right.png";
import upUnavailable from "../imgs/up-unavailable.png";
import downUnavailable from "../imgs/down-unavailable.png";
import leftUnavailable from "../imgs/left-unavailable.png";
import rightUnavailable from "../imgs/right-unavailable.png";
import warriorImg from "../imgs/warrior.png";


function WarriorOptions({warrior}){
    const [warriorOptions, setWarriorOptions] = useState(null);
    const {setSelectedUnit} = useContext(SelectedUnitContext);
    const {updateVar, Update} = useContext(UpdateContext);
    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/warrior/${warrior.id}/options`)
        .then((response) => {
            setWarriorOptions(response.data);
        }).catch((error)=>{
          console.log(error);
        });
      }, [updateVar]);


      function UpArrow({warrior, moves}){
        if (moves.up){
            return (<img className="arrow-available" src={up} style={{
                marginLeft: 'auto', marginRight: 'auto', width: '50px',
                marginTop: 'auto'
            }} onClick={() => selectOption({warrior, option:"up"})} />)}
        return (<img className="arrow-unavailable" src={upUnavailable}
                style={{marginLeft: 'auto', marginRight: 'auto', width: '50px',
                marginTop: 'auto'}}/>)
    }
    
    function MiddleRow({warrior, moves}){
        return (
            <div className="warrior-middle-options">
                <LeftArrow warrior={warrior} moves={moves}/>
                <WarriorIcon level={warrior.level}/>
                <RightArrow warrior={warrior} moves={moves}/>
            </div>
        )
    }
    
    function LeftArrow({warrior, moves}){
        if (moves.left){
            return (<img className="arrow-available" src={left} style={
                {marginLeft:'auto', marginRight: '5px', width: '50px',
                 marginTop: 'auto', marginBottom: 'auto'}
            } onClick={() => selectOption({warrior, option:"left"})} />)
        }
        return (<img className="arrow-unavailable" src={leftUnavailable} style={
            {marginLeft:'auto', marginRight: '5px', width: '50px',
            marginTop: 'auto', marginBottom: 'auto'}}/>)
    }
    
    function WarriorIcon({level}){
        return (<div className="warrior-icon">
            <h4 className="warrior-icon-text">LV{level}</h4>
            <img className="warrior-middle-img" src={warriorImg}/>
        </div>)
    }
    
    function RightArrow({warrior, moves}){
        if (moves.right){
            return (<img className="arrow-available" src={right} style={
                {marginRight:'auto', marginLeft: '5px', width: '50px',
                 marginTop: 'auto', marginBottom: 'auto'}
            } onClick={() => selectOption({warrior, option:"right"})} />)
        }
        return (<img className="arrow-unavailable" src={rightUnavailable} style={
            {marginRight:'auto', marginLeft: '5px', width: '50px',
             marginTop: 'auto', marginBottom: 'auto'}}/>)
    }
    
    function DownArrow({warrior, moves}){
        if (moves.down){
            return (<img className="arrow-available" src={down} 
            onClick={() => selectOption({warrior, option:"down"})}
            style={{marginLeft: 'auto', marginRight: 'auto', width: '50px'}}/>)
        }
        return (<img className="arrow-unavailable" src={downUnavailable}
            style={{marginLeft: 'auto', marginRight: 'auto', width: '50px'}}/>)
    }
    
    function BottomRow({warrior, canBuild}){
        return (
            <div className="bottom-row">
                <BuildButton warrior={warrior} canBuild={canBuild}/>
                <button className="bottom-row-button-neutral" onClick={
                    () => {console.log(warrior);
                    selectOption({warrior, option:"skip"})}
                }><span>Skip turn</span></button>
            </div>
        )
    }
    
    function BuildButton({warrior, canBuild}){
        if (canBuild){
            console.log(warrior);
            return (<button className="bottom-row-button"
            onClick={()=>selectOption({warrior, option:"build"})}><span>Build City <br/> 100 </span></button>)
        }
        return (<button className="bottom-row-button-disabled"><span>Build City <br/> 100 </span></button>)
    }
    
    function selectOption({warrior, option}){
        axios.post(`${import.meta.env.VITE_API_URL}/warrior/${warrior.id}/action`, {
            action: option
        }).then(()=>{
            setSelectedUnit(null);
            Update();
        }).catch((error)=>{
            console.log(error);})
        
    }

    if (warriorOptions){
        return (
        <div className="warrior-options">
            <UpArrow moves={warriorOptions.moves} warrior={warrior}/>
            <MiddleRow moves={warriorOptions.moves} warrior={warrior}/>
            <DownArrow moves={warriorOptions.moves} warrior={warrior}/>
            <BottomRow canBuild={warriorOptions.canBuildCity} warrior={warrior} />
        </div>)}
}



export default WarriorOptions;