function Attack() {
    return(
        <>
            <h3>
                <p>
                    Cuando una o más de tus unidades sean movidas a un territorio que contengan unidades enemigas,
                    se realiza automaticamente un combate.
                </p>
                <p>
                    Tanto las unidades atacantes como las unidades defensoras se les llama batallones.
                </p>
                <p>
                    Cada unidad en el juego tiene unos valores de ataque y defensa. El ataque total de un batallón es igual a la suma 
                    de los ataques de todas las unidades en el batallón. Lo mismo ocurre con la defensa total de un batallón.
                </p>
                <p>
                    Luego de confirmar un movimiento que comience un combate, cada jugador tendrá que asignar daños.
                    Tanto el batallón atacante y defensor sufrirán daño igual al ataque total del batallón enemigo.
                </p>
                <p>
                    Cuando un batallon recibe daño en un combate, el jugador dueño del batallon deberá elegir unidades de manera
                    que la defensa total sea igual al daño recibido.
                </p>
                <p>
                    Ejemplo: Tenemos un batallon atacante que posee 1 Soldado y 1 Caballero y un batallon defensor que posee 2 Soldados.
                    Los Soldados tienen Ataque 1 | Defensa 1 y los Caballeros tienen Ataque 2 | Defensa 2. El ataque y defensa total del 
                    batallon atacante es 3 y el del defensor 2. El jugador dueño del batallón atacante deberá asignar 2 de daño y el
                    jugador dueño del batallón defensor deberá asignar 3 de daño. Como el ataque total del batallón atacante es superior
                    a la defensa total del batallon defensor, todas las unidades de este batallon son destruidas. En cambio el batallon
                    atacante solo recibe 2 de daño por lo que decide destruir su Caballero de Defensa 2 lo cual cubre todo el daño
                    recibido y le permite a su Soldado vivir.
                </p>
            </h3>
        </>
    )
}

export default Attack