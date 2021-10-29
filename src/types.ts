export type Player = {
    name: string;
    country: string;
    speed: number;
    strength: number;
};

export type ScoreBoard = { player: Player; score: number };

export type Result = {
    Round: string;
    'Player 1 Name': string;
    'Player 1 Country': string;
    'Player 1 Score': number;
    'Player 2 Name': string;
    'Player 2 Country': string;
    'Player 2 Score': number;
    'Winner Name': string;
    'Country Name': string;
};

export type MatchResult = {
    winner: Player;
    result: Result;
};
