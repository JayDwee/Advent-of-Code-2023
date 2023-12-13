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
        let potentialColumns : Map<number, number> = new Map()
        for (const c of Array(lines[0].length-1).keys())
            potentialColumns.set(c, 2)
        let searchedRows : number = 0
        while ( searchedRows < lines.length) {
            let symmetries : number[] = findSymmetry(lines[searchedRows], Array.from(potentialColumns.keys()))
            potentialColumns.forEach((value, key) => {
                if (!symmetries.includes(key))
                    potentialColumns.set(key, value - 1)
                if (potentialColumns.get(key) == 0)
                    potentialColumns.delete(key)
                }) 
            searchedRows++
        }
        
        let potentialRows : Map<number,number> = new Map()
        for (const c of Array(lines.length-1).keys())
            potentialRows.set(c, 2)
        let searchedColumns : number = 0
        while (searchedColumns  < lines[0].length) {
            let symmetries : number[] = findSymmetry(lines.map(l => l[searchedColumns]).join(""), Array.from(potentialRows.keys()))
            potentialRows.forEach((value, key) => {
                if (!symmetries.includes(key))
                    potentialRows.set(key, value - 1)
                if (potentialRows.get(key) == 0)
                    potentialRows.delete(key)
                })
            searchedColumns++
        }
        
        while ( searchedRows < lines.length) {
            let symmetries : number[] = findSymmetry(lines[searchedRows], Array.from(potentialColumns.keys()))
            potentialColumns.forEach((value, key) => {
                if (!symmetries.includes(key))
                    potentialColumns.set(key, value - 1)
                if (potentialColumns.get(key) == 0)
                    potentialColumns.delete(key)
                }) 
            searchedRows++
        }

        log(pattern)
        log(potentialColumns)
        log(potentialRows)
        let win : number | undefined = undefined
        potentialColumns.forEach((value, key) => {if (value == 1) win = key})
        if (win !== undefined) {
            total += win+1
            log("found Columns", win, potentialColumns)
        } else {
            win = -Infinity
            potentialRows.forEach((value, key) => {if (value == 1) win = key})
            total += (win+1)*100
            log("found Row", win, potentialRows)
        }
    }
    log("total:", total)
}

main()
