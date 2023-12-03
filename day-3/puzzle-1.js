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
        if (/[0-9]/.test(line[i])) {
            var startI = i;
            while (/[0-9]/.test(line[i])) {
                i++;
            }
            var endI = i;
            var foundNumber = line.substring(startI,endI);
            console.log("found number: "+foundNumber + " ln "+lineNumber);
            for (searchLine of lines.slice(lineNumber == 0 ? 0 : lineNumber-1, lineNumber+2)){
                console.log("searching: "+searchLine.substring(startI-1, endI+1));
                if (/[\*\@\#\$\+\%\/\&\=\-]/.test(searchLine.substring(startI-1, endI+1))){
                    total += Number(foundNumber);
                    console.log("symbol fould: "+foundNumber);
                    break;
                }
            }
        }
        i++;
    }

}

console.log(total);