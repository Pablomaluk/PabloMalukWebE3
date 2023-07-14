import "./styles.css"
import { useContext, useState } from 'react';
import { SelectedUnitContext, AuthContext } from "../common/context";
import WarriorList from "./WarriorList";
import { handleFetch } from "../common/functions";
import { useInterval } from 'usehooks-ts'

function CityOptions({city}){
    const [cityOptions, setCityOptions] = useState(null);
    const {setSelectedUnit} = useContext(SelectedUnitContext);
    const {token} = useContext(AuthContext);

    useInterval(() => {
        let route = `city/${city.id}/options`;
        handleFetch({method: 'get', route, token}
        ).then((response) => {
          setCityOptions(response.data);
        }).catch((error)=>{
          console.log(error);
        });
      }, 300);

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
        handleFetch({method: 'post', route: `city/${city.id}/level-up`, token});
    }

    function handleBuyWarriorClick(){
        handleFetch({method: 'post', route: `city/${city.id}/buy-warrior`, token});
    };

    if (cityOptions){
        const {upgradeCost, warriorCost, playerCanUpgradeCity,
            playerCanBuyWarrior, warriors, availableWarriors} = cityOptions;
        return (
        <div>
        <div className="player-info">
            <div style={
                {gridColumn: 'span 2', marginLeft: 'auto', marginRight: 'auto',
                marginBottom: '20px',
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