// Day 2: Cube Conundrum
const fs = require('fs');

var total = 0;

const inputFile = fs.readFileSync('day-2/input', 'utf-8');
inputFile.split(/\r?\n/).forEach(line =>  {
    var game = line.split(/\: /);
    var gameNumber = Number(game[0].substring(5));
    var gameMinimums = {};
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
            if (gameMinimums[key] === undefined || value > gameMinimums[key] ){
                console.log("new minimum for " + key + " is " + value);
                gameMinimums[key] = value;
            } 
        }
    })
    console.log(gameNumber + " " + Object.values(gameMinimums).reduce((a,b) => a * b, 1))
    console.log(gameMinimums);
    total = total + Object.values(gameMinimums).reduce((a,b) => a * b, 1);
});

console.log(total);