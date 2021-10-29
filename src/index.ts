const data = require('../data/players.json');

import { MatchResult, Player, Result, ScoreBoard } from './types';

import { json2csv } from 'json-2-csv';

import fs from 'fs';

//Cargamos datos
const players: Player[] = Object.values(data);
//inicializamos los resultados finales.
const results: Result[] = [];

//Funcion que simula el torneo.
//Se trata de una funcion recursiva que empareja 2 a 2 a los jugadores que se le pasa por parametro y los enfrenta mediante la funcion playMatch()
//En caso de que todavia queden jugadores suficinetes, se vuelve a llamar a si misma con los jugadores que quedan. 
//
const playTournament = (players: Player[], round: number): Player => {
  const winners: Player[] = [];
  for (let i = 0; i <= players.length - 2; i += 2) {
    let matchResult: MatchResult = playMatch(
      players[i],
      players[i + 1],
      getRound(players.length, round)
    );
    winners.push(matchResult.winner);
    results.push(matchResult.result);
  }
  return winners.length > 1 ? playTournament(winners, ++round) : winners[0];
};

//Funcion que ejecuta el partido (Con las reglas determinadas) entre los dos jugadores que se pasan por parametro.
//La funcion devuelve el jugador ganador del partido.
const playMatch = (
  playerA: Player,
  playerB: Player,
  round: string
): MatchResult => {
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
    let distance: number =
      scoreboard[hitterIndex].player.strength * Math.random();
    //Calculo de la distancia de recibo multiplicando la velocidad del jugador que no es golpeador (golpeador XOR 1) y un numero aleatorio entre 0 y 1.
    let receiveDistance: number =
      scoreboard[hitterIndex ^ 1].player.speed * Math.random();
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
  return getMatchResult(scoreboard, round);
};

//Funcion auxiliar para transformar los datos para mostrarlos correctamente en el CSV.
//Tambien se agrega el ganador para no realizar calculos adiciones y usarlo para avanzar las siguientes rondas.
const getMatchResult = (
  scoreboard: ScoreBoard[],
  round: string
): MatchResult => {
  const winner: Player =
    scoreboard[0].score >= 4 ? scoreboard[0].player : scoreboard[1].player;
  return {
    winner,
    result: {
      'Round': round,
      'Player 1 Name': scoreboard[0].player.name,
      'Player 1 Country': scoreboard[0].player.country,
      'Player 1 Score': scoreboard[0].score,
      'Player 2 Name': scoreboard[1].player.name,
      'Player 2 Country': scoreboard[1].player.country,
      'Player 2 Score': scoreboard[1].score,
      'Winner Name': winner.name,
      'Country Name': winner.country,
    },
  };
};
//Funcion auxiliar para transformar el numero de ronda al formato correcto.
const getRound = (playersLeft: number, roundNumber: number) : string => {
  if (playersLeft <= 4) {
    return playersLeft <= 2 ? 'F' : 'S';
  } else {
    return roundNumber.toString();
  }
};


//Ejecucion del programa
playTournament(players, 1);
//Se transforma el JSON resultado en CSV y se guarda en un archivo.
json2csv(
  results,
  (err, csv) => {
    fs.writeFileSync('dataworldCupResults.csv', String(csv));
  },
  { delimiter: { field: ';' } }
);
console.table(results);
