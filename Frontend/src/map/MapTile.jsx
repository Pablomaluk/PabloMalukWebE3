import './styles.css';
import { useState, useEffect, useContext } from 'react';
import { SelectedUnitContext, SelectedTileContext } from '../common/context.jsx';
import gold from '../imgs/gold.png';
import city from '../imgs/city.png';
import warrior from '../imgs/warrior.png';
import enemyCity from '../imgs/enemy_city.png';
import enemyWarrior from '../imgs/enemy_warrior.png';



function MapTile({ mapTile }) {
  const [unit, setUnit] = useState(null);
  const [img, setImg] = useState(null);
  const {selectedUnit, setSelectedUnit} = useContext(SelectedUnitContext);
  const {selectedTile, setSelectedTile} = useContext(SelectedTileContext);
  const {tileWarriors, tileCities, tileEnemyWarriors, tileEnemyCities, tileGold} = mapTile.content;
  const key = mapTile.id;

  useEffect(()=>{
    if (tileCities.length){
      setUnit("city");
      setImg(city);
    } else if (tileEnemyCities.length){
      setUnit("enemy_city");
      setImg(enemyCity);
    } else if (tileWarriors.length){
      setUnit("warrior");
      setImg(warrior);
    } else if (tileEnemyWarriors.length){
      setUnit("enemy_warrior");
      setImg(enemyWarrior);
    } else if (tileGold.length){
      setUnit("gold");
      setImg(gold);
  }}, [mapTile, unit]);

  if (selectedTile == key && (unit == "city" || unit == "warrior")){
    return (<div className="selected-map-tile" onClick={
      ()=> handleMapTileClick(unit, setSelectedUnit, key, setSelectedTile)}>
    <TileImg mapTile={mapTile} unit={unit} img={img} />
    </div>)
  }
  return (
  <div className="map-tile" onClick={
    ()=> {
      handleMapTileClick(unit, setSelectedUnit, key, setSelectedTile)}
    }>
    <TileImg mapTile={mapTile} unit={unit} img={img} />
  </div>
  )
}

function handleMapTileClick(unit, setSelectedUnit, key, setSelectedTile){
  if (unit == "city" || unit == "warrior"){
    setSelectedTile(key);
  } else{
    setSelectedUnit(null);
    setSelectedTile(null);
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

export default MapTile;