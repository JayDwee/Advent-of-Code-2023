// Day 3: Gear Ratios
const fs = require('fs');

var total = 0;
const inputFile = fs.readFileSync('day-3/input', 'utf-8');

var lines = inputFile.split(/\r?\n/);

for (const lineNumber of lines.keys()) {
    var line = lines[lineNumber];
    i = 0;
    while (i < line.length) {
        var foundNumbers = [];
        if (/\*/.test(line[i])) {
            console.log(`Found * ${lineNumber} ${i}`);
            for (searchLine of lines.slice(lineNumber == 0 ? 0 : lineNumber-1, lineNumber+2)){
                console.log(`searching ${searchLine.substring(i-1,i+2)}`)
                for (searchCharIdx of [i-1,i,i+1]){
                    if (/[0-9]/.test(searchLine[searchCharIdx]) && !(searchCharIdx != i-1 && /[0-9]/.test(searchLine[searchCharIdx-1]))){
                        startFoundNumberIdx = searchCharIdx;
                        endFoundNumberIdx = searchCharIdx;
                        while (/[0-9]/.test(searchLine[startFoundNumberIdx])){
                            startFoundNumberIdx--;
                        }
                        startFoundNumberIdx++;
                        while (/[0-9]/.test(searchLine[endFoundNumberIdx])){
                            endFoundNumberIdx++;
                        }
                        console.log(`found number ${searchLine.substring(startFoundNumberIdx, endFoundNumberIdx)} ${searchCharIdx}`)
                        foundNumbers.push(searchLine.substring(startFoundNumberIdx, endFoundNumberIdx));
                    }
                }
            }

            console.log(`found numbers: ${foundNumbers.length} ${foundNumbers}`);
            if (foundNumbers.length == 2) {
                total += foundNumbers[0] * foundNumbers[1];
            }
        }
        i++;
    }

}

console.log(total);