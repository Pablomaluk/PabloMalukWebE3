import './styles.css';
import { useState, useContext } from 'react';
import {GetAvailableWarriors, IterateOverArrayAndReturnTileElements, 
        handleFetch} from '../common/functions';
import { useInterval } from 'usehooks-ts'
import MapTile from './MapTile';
import { GameContext, AuthContext } from '../common/context';


function MapTiles() {
  const [mapTiles, setMapTiles] = useState(null);
  const boardSize = 10;
  const {gameId} = useContext(GameContext);
  const {token} = useContext(AuthContext);

  useInterval(async () => {
    let route = `game/${gameId}/board-info`;
    await handleFetch({method: "get", route, token})
    .then((response) => {
      setMapTiles(generateMapTiles(boardSize, response.data));
    }).catch((error)=>{
      console.log(error);
    });
  }, 300);

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