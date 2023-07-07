function Training() {
    return(
        <>
            <h3>
                <p>
                    Tu Base y tus Armerías son los únicos edificios que pueden entrenar unidades. 
                    Tu Base permite solo entrenar trabajadores y tus Armerías permiten entrenar Soldados, Caballeros y Catapultas.
                </p>
                <p>
                    Para entrenar una unidad debes hacer click en el edificio correspondiente para abrir la interfaz de entrenamiento.
                    En esta interfaz se mostrarán las unidades que tu edificio puede entrenar junto con su coste. Las unidades tienen un
                    tiempo de espera, el cual dictamina la cantidad de turnos que faltan para que la unidad sea desplegada.
                    Las unidades siempre se despliegan en el territorio ocupado por tu Base o Armería respectiva.
                </p>
                <p>
                    Cada unidad posee un tamaño y cada territorio posee un espacio máximo. El tamaño sumado total de tus unidades en un
                    territorio no puede superar el espacio máximo de un territorio. El espacio máximo de un territorio es igual para
                    todos los jugadores en un principio, pero este puede ser incrementado con diferentes mejoras durante la partida. 
                </p>
            </h3>
        </>
    )
}

export default Training