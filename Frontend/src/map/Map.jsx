import './styles.css';
import { useState, useEffect } from 'react';
import { SelectedUnitContext, SelectedTileContext } from '../common/context.jsx';
import MapTile from './MapTile';
import {IterateOverArrayAndReturnTileElements} from '../common/functions';
import axios from 'axios';


function MapTiles() {
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedTile, setSelectedTile] = useState(null);
  const [mapTiles, setMapTiles] = useState(null);
  const boardSize = 10;
  const gameId = 1;
  const playerId = 1;

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/game/${gameId}/player/${playerId}/board-info`)
    .then((response) => {
      setMapTiles(generateMapTiles(boardSize, response.data));
    }).catch((error)=>{
      console.log(error);
    });
  }, []);

  if (mapTiles){
    
    return (
      <SelectedTileContext.Provider value={{selectedTile, setSelectedTile}}>
        <SelectedUnitContext.Provider value={{selectedUnit, setSelectedUnit}}>
          <div className= "map">
            {mapTiles.map((mapTile) => {
              return <MapTile key={mapTile.id} mapTile={mapTile} />
            })}
          </div>
        </SelectedUnitContext.Provider>
      </SelectedTileContext.Provider>
    );
  }
}

function generateMapTiles(boardSize, data){
  const {playerWarriors, playerCities, enemyWarriors, enemyCities, goldTiles} = data;
  let mapTiles = [];
  for (let y = 0; y < boardSize; y++) {
    for (let x = 0; x < boardSize; x++) {
      let id = x+y*boardSize;
      let tileWarriors = IterateOverArrayAndReturnTileElements(playerWarriors, x, y);
      let tileCities = IterateOverArrayAndReturnTileElements(playerCities, x, y);
      let tileEnemyWarriors = IterateOverArrayAndReturnTileElements(enemyWarriors, x, y);
      let tileEnemyCities = IterateOverArrayAndReturnTileElements(enemyCities, x, y);
      let tileGold = IterateOverArrayAndReturnTileElements(goldTiles, x, y);
      mapTiles.push({x, y, id, content: 
        {tileWarriors, tileCities, tileEnemyWarriors, tileEnemyCities, tileGold}});
    }
  }
  return mapTiles;
};

export default MapTiles;