// Day 13: Point of Incidence
import { log } from 'console'
import { readFileSync } from 'fs'

function findSymmetry(line : string, potentials: number[]) : number[] {
    let symmetries : number[] = []
    for (const i of potentials) {
        let symmetryBool = true
        for (let j : number = 0; j <= Math.min(i, line.length-i-2); j++) {
            if (line[i-j] != line[i+j+1]) {
                // log("symmetry failed", line[i-j], line[i+j+1], i, j)
                symmetryBool = false
                break
            }
            
        }
        // log("symmetryBool",line, i, symmetryBool)
        if (symmetryBool) {
            symmetries.push(i)
        }
    }
    return symmetries
}

function main() {
    let total : number = 0
    const patterns : string[] = readFileSync('./day-13/input', 'utf-8').split(/\r?\n\r?\n/)
    for (const pattern of patterns) {
        const lines : string[] = pattern.split(/\r?\n/)
        let potentialColumns : number[] = [...Array(lines[0].length-1).keys()]
        let searchedRows : number = 0
        while (potentialColumns.length > 1 && searchedRows < lines.length) {
            let symmetries : number[] = findSymmetry(lines[searchedRows], potentialColumns)
            potentialColumns = potentialColumns.filter(column => symmetries.includes(column))
            searchedRows++
        }
        
        let potentialRows : number[] = [...Array(lines.length-1).keys()]
        let searchedColumns : number = 0
        while (potentialRows.length > 1 && searchedColumns  < lines[0].length) {
            let symmetries : number[] = findSymmetry(lines.map(l => l[searchedColumns]).join(""), potentialRows)
            potentialRows = potentialRows.filter(row => symmetries.includes(row))
            searchedColumns++
        }
        
        while (potentialColumns.length > 0 && searchedRows < lines.length) {
            let symmetries : number[] = findSymmetry(lines[searchedRows], potentialColumns)
            potentialColumns = potentialColumns.filter(column => symmetries.includes(column))
            searchedRows++
        }

        log(pattern)
        if (potentialColumns.length > 0) {
            total += potentialColumns[0]+1
            log("found Columns", potentialColumns[0]+1)
        } else {
            total += (potentialRows[0]+1)*100
            log("found Row", (potentialRows[0]+1)*100)
        }
    }
    log("total:", total)
}

main()
