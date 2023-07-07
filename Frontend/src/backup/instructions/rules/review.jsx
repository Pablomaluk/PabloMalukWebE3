import './styles.css'
import tablero from './../../../assets/tablero1.png'



function Review() {
    return(
        <>
            <h3>
                <p>
                    Empire Conquest es un juego de estrategia de 2 a 4 jugadores en el que deberás destruir la base de los enemigos
                    y así ser el último jugador con su base en pie.
                </p>
                <p>
                    Tomarás el rol del comandante de tu pueblo el cual tendrá que administrar recursos,
                    construir edificios, entrenar tropas y comandarlas para atacar y/o defenderte de tus rivales.
                </p> 
                <p>
                    Se te asignará uno de los 4 territorios de las esquinas al azar, el cual será tu ubicación inicial en la partida.
                </p> 
                <p>
                    Durante tu turno podrás construir edificios, entrenar unidades, mover tus unidades y
                    atacar a las unidades o edificios enemigos.
                </p>
                <p>
                    Construir y entrenar unidades te costará recursos por lo que
                    deberás salir en busca de territorios que posean estos recursos.
                </p>
            </h3>
        <img src={tablero} alt="Tablero" className="img"/>
        <h4>Ejemplo de partida con los jugadores J1, J2. J3 y J4</h4>
        </>
    )
}

export default Review