import { MatchResult, Player, ScoreBoard } from './types';

//Funcion auxiliar para transformar los datos para mostrarlos correctamente en el CSV.
//Tambien se agrega el ganador para no realizar calculos adiciones y usarlo para avanzar las siguientes rondas.
export const getMatchResult = (
    scoreboard: ScoreBoard[],
    round: string
): MatchResult => {
    const winner: Player =
        scoreboard[0].score >= 4 ? scoreboard[0].player : scoreboard[1].player;
    return {
        winner,
        result: {
            Round: round,
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
export const getRound = (playersLeft: number, roundNumber: number): string => {
    if (playersLeft <= 4) {
        return playersLeft <= 2 ? 'F' : 'S';
    } else {
        return roundNumber.toString();
    }
};
