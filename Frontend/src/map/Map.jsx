import './styles.css';
import { useState, useEffect, useContext } from 'react';
import MapTile from './MapTile';
import {GetAvailableWarriors, IterateOverArrayAndReturnTileElements} from '../common/functions';
import {UpdateContext} from '../common/context';
import axios from 'axios';


function MapTiles() {
  const [mapTiles, setMapTiles] = useState(null);
  const boardSize = 10;
  const gameId = 1;
  const playerId = 1;
  const {updateVar} = useContext(UpdateContext);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/game/${gameId}/player/${playerId}/board-info`)
    .then((response) => {
      setMapTiles(generateMapTiles(boardSize, response.data));
    }).catch((error)=>{
      console.log(error);
    });
  }, [updateVar]);

  if (mapTiles){
    
    return (
          <div className= "map">
            {mapTiles.map((mapTile) => {
              return <MapTile key={mapTile.id} mapTile={mapTile} />
            })}
          </div>
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
      let tileAvailableWarriors = GetAvailableWarriors(tileWarriors);
      let tileCities = IterateOverArrayAndReturnTileElements(playerCities, x, y);
      let tileEnemyWarriors = IterateOverArrayAndReturnTileElements(enemyWarriors, x, y);
      let tileEnemyCities = IterateOverArrayAndReturnTileElements(enemyCities, x, y);
      let tileGold = IterateOverArrayAndReturnTileElements(goldTiles, x, y);
      mapTiles.push({x, y, id, content: 
        {tileWarriors, tileAvailableWarriors, tileCities, tileEnemyWarriors, tileEnemyCities, tileGold}});
    }
  }
  return mapTiles;
};

export default MapTiles;