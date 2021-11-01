import { MatchResult, Player, Result, ScoreBoard } from './types';
import { getRound, getMatchResult } from './util';

//wrapper que exporta la ejecucion del torneo.
export const playTournament = (players: Player[]): Result[] => {
    return playRounds(players, 1);
};

//Funcion que los juegos de una ronda.
//Se trata de una funcion recursiva que empareja 2 a 2 a los jugadores que se le pasa por parametro y los enfrenta mediante la funcion playMatch()
//Los ganadores y resultados de cada enfrentamiento se almacenan,
//y si todavia queda mas de 1 ganador se vuelve a llamar si misma para enfrentar a los ganadores almacenados en la siguiente ronda.
//Para ello se concatenan los resultados de la ronda actual con la ejecucion de si misma pasando los ganadores y el incremento de la ronda como parametros (Es decir los resultados de la siguiente ronda)
//En caso de que solamente quede 1 ganador, significa que ya hemos llegado a la final. y solamente se devuelve el resultado de la ronda.
const playRounds = (players: Player[], round: number): Result[] => {
    //Lista de ganadores
    const winners: Player[] = [];
    //Lista de resultados.
    const results: Result[] = [];
    //Ejecucion 2 a 2 jugadores
    for (let i = 0; i <= players.length - 2; i += 2) {
        //Se jeuga el partido de los dos jugadores consecutivos.
        const matchResult: MatchResult = playMatch(players[i], players[i + 1], getRound(players.length, round));
        //Se almacena el ganador del partido
        winners.push(matchResult.winner);
        //Se almacena el resultado del partido
        results.push(matchResult.result);
    }
    //Si el numero de ganadores es mayor que 1 se concatenan los resultados de la ronda actual
    //con los resultados de ejecutarse a si misma pasando los ganadores y la siguiente ronda por parametro (Es decir los resultados de las siguientes rondas)
    //En caso contrario solamente se devuelve el resultado del partido, ya que significa que era la final y solamente queda 1 ganador.
    return winners.length > 1 ? results.concat(playRounds(winners, ++round)) : results;
};

//Funcion que ejecuta el partido (Con las reglas determinadas) entre los dos jugadores que se pasan por parametro.
//La funcion devuelve el jugador ganador del partido.
const playMatch = (playerA: Player, playerB: Player, round: string): MatchResult => {
    //Establecemos la tabla de puntuaciones con los datos de los jugadores y sus puntuaciones
    let scoreboard: ScoreBoard[] = [
        { player: playerA, score: 0 },
        { player: playerB, score: 0 },
    ];
    //Seleccionamos un golpeador al azar.
    //Se escoge un indice al azar entre 0 y 1 para seleccionar como golpeador incial a uno de los jugadores del array de puntuaciones.
    let hitterIndex: number = Math.round(Math.random());
    //Mientras en el scoreboard no exista un jugador  con una puntuacion mayor o igual a 4 se ejecuta el partido.
    while (!scoreboard.some((sc) => sc.score >= 4)) {
        //Calculo de la distancia de golpeo multiplicando la fuerza del golpeador y un numero aleatorio entre 0 y 1.
        let distance: number = scoreboard[hitterIndex].player.strength * Math.random();
        //Calculo de la distancia de recibo multiplicando la velocidad del jugador que no es golpeador (golpeador XOR 1) y un numero aleatorio entre 0 y 1.
        let receiveDistance: number = scoreboard[hitterIndex ^ 1].player.speed * Math.random();
        //Booleano que indica si se ha recibido el globo o no.
        //Es true en caso de que la distancia de recibo sea mayor que la de golpeo, y false en caso contrario.
        let isReceived: boolean = distance < receiveDistance;
        //Cortocircuito para sumar un punto al golpeador en caso de que no se haya recibido el globo.
        //Es decir que el incremento de la parte derecha solamente se ejecuta cuando la evaluacion de la izquierda es true
        //o lo que es lo mismo, cuando isReceived es false (No se ha conseguido recibir el globo)
        !isReceived && scoreboard[hitterIndex].score++;
        //Operacion XOR que cambia el indice del jugador que golpea,
        //1 -> 0
        //0 -> 1
        hitterIndex ^= 1;
    }
    //Se devuelve en formato MatchResult para procesarlo mas facilmente de cara a generar el JSON y el posterior CSV.
    return getMatchResult(scoreboard, round);
};
