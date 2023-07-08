import "./styles.css"
import { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import {SelectedUnitContext, UpdateContext} from "../common/context";
import WarriorList from "./WarriorList";

function CityOptions({city}){
    const [cityOptions, setCityOptions] = useState(null);
    const {setSelectedUnit} = useContext(SelectedUnitContext);
    const {updateVar, Update} = useContext(UpdateContext);

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/city/${city.id}/options`)
        .then((response) => {
          setCityOptions(response.data);
        }).catch((error)=>{
          console.log(error);
        });
      }, [updateVar]);

      function UpgradeButton({upgradeCost, playerCanUpgradeCity, city}){
        if (playerCanUpgradeCity){
            return (<button className="button" onClick={
                () => handleUpgradeClick()}>
            <span>Level up<br/>{upgradeCost}</span> </button>)
        }
        return (<button className="button-disabled"> <span>Level up<br/>{upgradeCost}</span> </button>)
    }
    
    function BuyWarriorButton({warriorCost, playerCanBuyWarrior, city}){
        if (playerCanBuyWarrior){
            return (<button className="button" onClick={
                () => handleBuyWarriorClick()}>
            <span>Buy Warrior<br/>{warriorCost}</span> </button>)
        }
        return (<button className="button-disabled"> <span>Buy Warrior<br/>{warriorCost}</span> </button>)
    }

    function handleUpgradeClick(){
        axios.post(`${import.meta.env.VITE_API_URL}/city/${city.id}/level-up`
        ).then(()=>Update());
    }

    function handleBuyWarriorClick(){
        axios.post(`${import.meta.env.VITE_API_URL}/city/${city.id}/buy-warrior`
        ).then(()=>Update());
    };

    if (cityOptions){
        const {upgradeCost, warriorCost, playerCanUpgradeCity,
            playerCanBuyWarrior, warriors, availableWarriors} = cityOptions;
        return (
        <div>
        <div className="player-info">
        <div style={
            {gridColumn: 'span 2', marginLeft: 'auto', marginRight: 'auto',
            color: 'black', paddingLeft: '20px', paddingRight: '20px', height: '40px'}
            }><h3>City Level {city.level}</h3>
        </div>
        <UpgradeButton upgradeCost={upgradeCost} playerCanUpgradeCity={playerCanUpgradeCity} city={city}/>
        <BuyWarriorButton warriorCost={warriorCost} playerCanBuyWarrior={playerCanBuyWarrior} city={city}/>
        </div>
        <WarriorList warriors={warriors} availableWarriors={availableWarriors}/>
        </div>)}
    
}

export default CityOptions;