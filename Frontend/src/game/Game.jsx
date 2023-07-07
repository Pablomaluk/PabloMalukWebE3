import "./styles.css"
import Map from "../map/Map";
import OptionsWindow from "../options/OptionsWindow";

function Game() {
    return (
        <div className="game">
            <Map />
            <OptionsWindow />
        </div>
    )
}

export default Game;