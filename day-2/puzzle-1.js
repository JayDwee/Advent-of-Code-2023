// Day 2: Cube Conundrum
const fs = require('fs');
limits = {
    "red": 12,
    "green": 13,
    "blue": 14
}

var total = 0;

const inputFile = fs.readFileSync('day-2/input', 'utf-8');
inputFile.split(/\r?\n/).forEach(line =>  {
    var game = line.split(/\: /);
    var gameNumber = Number(game[0].substring(5));
    var gameIsPossible = true;
    game[1].split(/\; /).forEach(turn => {
        var turnColourDict = {};
        turn.split(/, /).forEach(colour => {
            var splitColour = colour.split(/ /);
            if (turnColourDict[splitColour[1]] !== undefined){
                turnColourDict[splitColour[1]] = turnColourDict[splitColour[1]] + Number(splitColour[0]);
            } else {
                turnColourDict[splitColour[1]] = Number(splitColour[0]);
            }
        });

        for (const [key, value] of Object.entries(turnColourDict)) {
            console.log(gameNumber + " " + key + " " + value);
            if (value > limits[key]){
                gameIsPossible = false;
            }
        }
    })
    total = total + (gameIsPossible ? gameNumber : 0);
});

console.log(total);