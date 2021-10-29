# Instrucciones prueba técnica #BallonWorldCup - Traventia dev1

- **Tu tiempo es muy importante**. Esto no debería llevarte más de 1h-1h.30. Si consideras que vas a tardar más simplifica e incluso no implementes algunas funciones (puedes comentar la intención de lo que quieres que haga)
- Puedes desarrollar el programa en el lenguaje con el que te sientas más cómodo. Nos da igual que sea ts,js,java,Go,PHP,c,c++,python,C#...
- Puedes implementarlo en tantos archivos como consideres necesarios
- La prueba no es binaria. No está bien si funciona y mal si no. Puedes conseguir que funcione bien y que no nos convenza y al contrario. Evaluamos:
  - Legibilidad y orden del código
  - Solución propuesta
  - Arquitectura implementada
  - Modelado de datos
  - Decisiones que hayas tomado ante requisitos poco claros
- La prueba la revisaremos contigo y te harémos preguntas que también formarán parte de la evaluación (por ejemplo, cómo has ido desarrollandolo, cuál ha sido la mayor dificultad,...)
- Si tienes cualquier duda para la ejecución del proceso escribenos para aclarartela sin problemas.
- Nos puedes mandar el código por email o si lo prefieres puedes montar algún repo si quieres también que veamos los pasitos que has ido haciendo. No es obligatorio. Lo que menos te cueste.

## BalloonWorldCup Simulator

### Qué es Ballon World Cup

Ibai y Piqué han organizado el primer mundial de globos del mundo. En una partida de globos se enfrentan dos jugadores con un globo. Uno de los jugadores golpea el globo lo más lejos que pueda (hay obstáculos en el terreno de juego). El otro jugador tiene que lograr evitar que el globo toque el suelo y golpearlo para que sea entonces el otro jugador el que tenga que evitarlo. Si el globo toca el suelo, el último jugador en golpearlo recibe un punto. Gana una partida el primero que llega a 4 puntos.

https://twitter.com/balloonworldcup?lang=es

### Prueba técnica

El objetivo del programa a implementar es realizar el simulador de un mundial de globos. Encontrarás los jugadores participantes en el archivo players.json de este repositorio. Cada jugador tiene 2 características de juego: velocidad y fuerza. Dichas características tendrán un valor en coma flotante entre 0 y 10.0.

En una partida se enfrentan dos jugadores, jugador A y jugador B. La partida se termina cuando uno de los dos jugadores consigue 4 puntos (el ganador). Para conseguir un punto, uno de los jugadores debe "golpear" el globo y el otro (receptor) no debe alcanzarlo. Si lo alcanza, dicho jugador pasa a ser el que golpea y continúa el punto. En caso de no alcanzar el globo, el jugador que ha golpeado consigue el punto y comienza un nuevo punto empezando por el jugador que perdió el anterior.

El jugador A comienza "golpeando" y el jugador B tiene que alcanzar el globo. La distancia que alcanza el golpeador se calcula multiplicando su fuerza por un número aleatorio entre 0 y 1. Por ejemplo, en typescript:

```ts
const distance: number = player_strenght * Math.random();
```

Si el jugador receptor alcanza o no el globo depende de su velocidad y de la distancia que ha conseguido el golpeador. Se dirá que lo alcanza si el resultado de multiplicar su velodidad por un número aleatorio entre 0 y 1 es mayor que la distancia conseguida por el golpeador. Por ejemplo, en typescript:

```ts
const success: boolean = distance_of_shoot < player_speed * Math.random();
```

En total hay 32 jugadores. En la primera ronda se enfrentaran el 1<->2, 3<->4,.... en sucesivas rondas se enfrentarán los ganadores. No es necesario hacer sorteo ni aleatoriedades en los enfrentamientos. Se puede seguir el orden del propio archivo. El resultado de cada partido se almacenará en un repositorio, en concreto en un fichero csv (ten en cuenta que en el futuro dicho repositorio podría ser una base de datos) con el formato:
Round; Player 1 Name; Player 1 Country; Player 1 Points; Player 2 Name; Player 2 Country; Player 2 Points; Winner Name;

En Round o "Ronda" se pondrá el número de la ronda a la que corresponde ese partido, salvo en las semifinales que se pondrá S y en la final que se pondrá F. Por ejemplo, inicialmente los 32 jugadores jugarán 16 partidos en Ronda 1. Los 16 que quedan pasan a ronda 2 donde habrá 8 partidos. Los 8 ganadores jugarán la ronda 3 que tendrá 4 partidas. Los 4 ganadores se enfrantarán en semifilanes y los 2 ganadores en la gran final.

Puedes encontrar un ejemplo del csv generado en el archivo worldCupResults.csv

Suerte!
