// Day 12: Hot Springs

import { readFileSync } from 'fs';

function findRegExp(input: string) : RegExp {
    let regexpArray : string[] = input.split(",").map(num => "#{"+num+"}")
    return new RegExp("^\\.*"+regexpArray.join("\\.+")+"\\.*$")
}

function recurseFindOptionsAndCompare(input: string, regexp: RegExp) : number{
    if (!input.includes('?')) {
        return regexp.test(input) ? 1 : 0
    } 

    return recurseFindOptionsAndCompare(input.replace('?', '#'), regexp) + recurseFindOptionsAndCompare(input.replace('?', '.'), regexp)
}

function main() {
    const splitFile : string[] = readFileSync('./day-12/input', 'utf-8').split(/\r?\n/)
    let total = 0
    for (const lineNumber of splitFile.keys()) {
        let splitLine : string[] = splitFile[lineNumber].split(" ")
        total += recurseFindOptionsAndCompare(splitLine[0], findRegExp(splitLine[1]))
    }
    console.log(total)
}

main()
