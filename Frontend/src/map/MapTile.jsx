import './styles.css';
import { useState, useEffect, useContext } from 'react';
import { SelectedUnitContext, SelectedTileContext, UpdateContext } from '../common/context.jsx';
import goldImg from '../imgs/gold.png';
import cityImg from '../imgs/city.png';
import warriorImg from '../imgs/warrior.png';
import enemyCityImg from '../imgs/enemy_city.png';
import enemyWarriorImg from '../imgs/enemy_warrior.png';



function MapTile({ mapTile }) {
  const [unit, setUnit] = useState(null);
  const [city, setCity] = useState(null);
  const [img, setImg] = useState(null);
  const {selectedUnit, setSelectedUnit} = useContext(SelectedUnitContext);
  const {selectedTile, setSelectedTile} = useContext(SelectedTileContext);
  const {updateVar, Update} = useContext(UpdateContext);
  const {tileWarriors, tileAvailableWarriors, tileCities, tileEnemyWarriors, tileEnemyCities, tileGold} = mapTile.content;
  const key = mapTile.id;

  function handleMapTileClick(setSelectedUnit, city, setSelectedTile, key){
    if (city){
      setSelectedTile(key);
      setSelectedUnit({city: tileCities[0]});
      Update()
    } else if (tileWarriors.length){
      setSelectedTile(key);
      setSelectedUnit({warriors: tileWarriors, availableWarriors: tileAvailableWarriors});
      Update();
    } else {
      setSelectedTile(null);
      setSelectedUnit(null);
      Update()
    }
    
  }

  function TileImg({unit, img}){
    if (unit == "gold"){
      return <img src={img}
            style={{height: "15px", width: "20px", marginTop: "22.5px", marginLeft: "28px"}} />
    } else if (unit == "city" || unit == "enemy_city"){
      return <img src={img}
            style={{height: "50px", width: "45px", marginTop: "3px", marginLeft: "12px"}} />
    } else if (unit == "warrior" || unit == "enemy_warrior"){
      return <img src={img}
            style={{height: "50px", width: "50px", marginTop: "3px", marginLeft: "12px"}} />
    }
    return <></>
  };

  useEffect(()=>{
    if (tileCities.length){
      setUnit("city");
      setCity(tileCities[0]);
      setImg(cityImg);
    } else if (tileEnemyCities.length){
      setUnit("enemy_city");
      setCity(null);
      setImg(enemyCityImg);
    } else if (tileWarriors.length){
      setUnit("warrior");
      setImg(warriorImg);
    } else if (tileEnemyWarriors.length){
      setUnit("enemy_warrior");
      setCity(null);
      setImg(enemyWarriorImg);
    } else if (tileGold.length){
      setUnit("gold");
      setImg(goldImg);
    } else {
      setUnit(null);
      setImg(null);
    }
  }, [mapTile, updateVar]);

  if (selectedTile == key && (unit == "city" || unit == "warrior")){
    return (<div className="selected-map-tile" onClick={
      () => handleMapTileClick(setSelectedUnit, city, setSelectedTile, key)}>
    <TileImg mapTile={mapTile} unit={unit} img={img} />
    </div>)
  }
  return (
  <div className="map-tile" onClick={
    ()=> {
      handleMapTileClick(setSelectedUnit, city, setSelectedTile, key)}
    }>
    <TileImg mapTile={mapTile} unit={unit} img={img} />
  </div>
  )
}

export default MapTile;