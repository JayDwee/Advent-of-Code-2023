// Day 3: Gear Ratios
const fs = require('fs');

var total = 0;
const inputFile = fs.readFileSync('day-3/input', 'utf-8');


// chars = new Set();
// for (const line of inputFile.split(/\r?\n/)) {
//     for (const char of line) {
//         if (!/[0-9\.]/.test(char)) {
//             chars.add(char);
//         }
//     }
// }
// console.log(chars);



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


            // var startI = i;
            // while (/[0-9]/.test(line[i])) {
            //     i++;
            // }
            // var endI = i;
            // var foundNumber = line.substring(startI,endI);
            // console.log("found number: "+foundNumber + " ln "+lineNumber);
            // for (searchLine of lines.slice(lineNumber == 0 ? 0 : lineNumber-1, lineNumber+2)){
            //     console.log("searching: "+searchLine.substring(startI-1, endI+1));
            //     if (/[\*\@\#\$\+\%\/\&\=\-]/.test(searchLine.substring(startI-1, endI+1))){
            //         total += Number(foundNumber);
            //         console.log("symbol fould: "+foundNumber);
            //         break;
            //     }
            // }
            console.log(`found numbers: ${foundNumbers.length} ${foundNumbers}`);
            if (foundNumbers.length == 2) {
                total += foundNumbers[0] * foundNumbers[1];
            }
        }
        i++;
    }

}

console.log(total);