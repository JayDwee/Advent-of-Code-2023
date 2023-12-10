// Day 9: Mirage Maintenance
import * as fs from 'fs'

function calculateNewElement(history: number[][]) {
    let addNumber = 0
    while (history.length != 0) {
        const current  = history[history.length - 1]
        addNumber = current[current.length - 1] + addNumber
        history.pop()
    }
    return addNumber
}

function calculateLists(history: number[][]){
    if (history[history.length-1].every((val, i, arr) => val === arr[0])){
        return history
    }
    const last : number[]  = history[history.length-1]
    let newDiff : number[]  = []
    last.reduce((a, b) => {
        newDiff.push(b-a)
        return b})

    return calculateLists([...history, newDiff])
}


function main() {
    const input : string = fs.readFileSync('./day-9/input', 'utf8')
    const lines : string[] = input.split(/\r?\n/)
    let total = 0
    for (const line of lines) {
        let numbers : number[] = line.split(' ').map(Number).reverse()
        total += calculateNewElement(calculateLists([numbers]))
    }
    console.log(total)
}

main()