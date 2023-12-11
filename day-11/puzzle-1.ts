// Day 11: Cosmic Expansion
import * as fs from 'fs'

function main(){
    let inputFile : string = fs.readFileSync('./day-11/input', 'utf8')
    let splitFile : string[] = inputFile.split(/\r?\n/)
    let galaxies : number[][] = []
    let galaxiesColumn : number[] = []
    let lineIncrease = 0
    for (const lineNumber of splitFile.keys()) {
        if (splitFile[lineNumber].indexOf('#') < 0) {
            lineIncrease++
        }
        for (const charNumber of splitFile[lineNumber].split('').keys()) {
            if (splitFile[lineNumber][charNumber] == '#') {
                galaxies.push([lineNumber+lineIncrease, charNumber])
                galaxiesColumn.push(charNumber)
            }
        }
    }

    let columnMap : {[Index: number]: number}= {}
    let columnIncrease : number = 0
    for (const columnNumber of Array(splitFile[0].length).keys()) {
        if (!galaxiesColumn.includes(columnNumber)) {
            columnIncrease++
        } else {
            columnMap[columnNumber] = columnNumber + columnIncrease
        }
    }

    for (const galaxy of galaxies) {
        galaxy[1] = columnMap[galaxy[1]]
    }

    console.log(columnMap)
    console.log(galaxies)

    let galaxiesNumber = galaxies.length
    let total = 0
    for (const galaxyNumber of Array(galaxiesNumber).keys()) {
        let currentGalaxy = galaxies.pop()
        for (const neighbor of galaxies) {
            total += Math.abs(currentGalaxy![0] - neighbor[0]) + Math.abs(currentGalaxy![1] - neighbor[1])
        }
    }
    console.log(total)
}

main()