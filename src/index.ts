const data = require('../data/players.json');

import { Player, Result } from './types';
import { json2csv } from 'json-2-csv';
import { playTournament } from './tournamentManager';
import fs from 'fs';

//Cargamos datos
const players: Player[] = Object.values(data);

//Ejecucion del torneo
const results: Result[] = playTournament(players);
//Se transforma el JSON resultante en CSV y se guarda en un archivo llamado worldCupResults.csv.
json2csv(
    results,
    (err, csv) => {
        fs.writeFileSync('worldCupResults.csv', String(csv));
    },
    { delimiter: { field: ';' } }
);
console.table(results);
