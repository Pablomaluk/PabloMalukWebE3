# Para levantar backend: 
### - Rellenar parámetros sin valores asignados en archivo .env
### - Correr yarn mount

# Documentación:
### - http://localhost:3000/docs

# Endpoints:
## Hay varios endpoints en la documentación, pero muchos están para facilitar el testeo.
## Los cruciales son los siguientes:
### /game/create:
#### Debe recibir entre 2 y 4 userIds en una lista, y retornar un juego. La response debe contener todos los elementos del juego, que son los jugadores, las ciudades iniciales, los guerreros iniciales, y los cuadrados que contengan oro.

### player/:id/available_warriors:
#### Debe recibir un id de jugador, manejar que exista el jugador, y retornar todos los guerreros que pertenezcan al jugador y se puedan mover.

### game/:id/end_turn:
#### Debe recibir un id de juego, cambiar el jugador que está actualmente jugando, y realizar acciones de inicio de turno. Estas incluyen recolectar dinero por cada ciudad, y hacer que todos los guerreros pertenecientes al jugadores estén disponibles para moverse.

### game/:id/buy_warrior:
#### Debe recibir un id de juego y de ciudad. Debe crear un guerrero en la ubicación de la ciudad, con el mismo nivel que la ciudad, y perteneciente al dueño de la ciudad. Solo debe funcionar si el dueño de la ciudad es el jugador que actualmente está jugando. Además, no puede moverse en el turno que se compra.

### game/:id/warrior/:warriorId/options:
#### Debe recibir un id de juego y de guerrero, y retornar todos las posibles acciones. Estas incluyen construir una ciudad (si no hay ninguna en su cuadrado), mejorar una ciudad existente (si hay alguna en su cuadrado, se tiene suficiente oro, y no es nivel máximo), moverse a un cuadrado adyacente (si no tiene ciudades o unidades enemigas), o atacar un cuadrado adyacente (si contiene ciudades o unidades enemigas)

### game/:id/build_city:
#### Debe recibir un id de juego y de guerrero, y crear una ciudad en caso de que se cumplan los requerimientos. Si no se cumplen, retorna el requerimiento que falló (que se tenga suficiente oro, que el guerrero exista, que se pueda mover, que sea su turno, y que no haya una ciudad ya existente en su cuadrado)

### game/:id/level_city:
#### Debe recibir un id de juego y de guerrero, y mejorar una ciudad en caso de que se cumplan los requerimientos. Si no se cumplen, retorna el requerimiento que falló (que se tenga suficiente oro, que el guerrero exista, que se pueda mover, que sea su turno, que o haya una ciudad ya existente en su cuadrado, que la ciudad sea de un nivel menor o igual al guerrero, y que no sea de nivel máximo)

### game/:id/warrior/:warriorId/move:
#### Debe recibir un id de juego, id de guerrero, y una lista de 2 números como coordenadas de la nueva ubicación. Debe manejar que las coordenadas sean adyacentes a la posición actual, que no haya unidades enemigas, y que el guerrero se pueda mover. Debe mover la unidad, y en caso de que exista oro en la nueva cuadrilla, recolectarlo para el dueño. 

### game/:id/warrior/:warriorId/attack:
#### Debe recibir un id de juego, id de guerrero, y una lista de 2 números como coordenadas de la nueva ubicación. Debe manejar que las coordenadas sean adyacentes a la posición actual, que haya unidades enemigas, y que el guerrero se pueda mover. Debe atacar la cuadrilla. Debe morir el guerrero de menor nivel, o ambos si son iguales. Si hay una ciudad, y no tiene ninguna unidad dentro, entonces debe ser robada, cambiar de dueño al jugador atacante, y el guerrero ingresa a la ciudad.