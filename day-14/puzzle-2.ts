// Day 14: Parabolic Reflector Dish
import { readFileSync } from 'fs'

type Dish = Array<Array<string>>

function moveO(dish: Dish, fromRow: number, fromCol: number, toRow: number, toCol: number): void {
    dish[fromRow][fromCol] = ".";
    dish[toRow][toCol] = "O";
  }

function rollNorth(dish: Dish): void {
    for (const colNumber of dish[0].keys()){
        let available : number = 0
        for (const rowNumber of dish.keys()) {
            if (dish[rowNumber][colNumber] == "O" && available < rowNumber) {
                dish[available][colNumber] = "O"
                dish[rowNumber][colNumber] = "."
                available++
            } else if (dish[rowNumber][colNumber] == "#" || dish[rowNumber][colNumber] == "O") {
                available = rowNumber+1
            }
        }
    }
}

function rollSouth(dish: Dish): void {
    const offset = dish.length-1
    for (const colNumber of dish[0].keys()){
        let available : number = 0
        for (const rowNumber of dish.keys()) {
            if (dish[offset-rowNumber][colNumber] == "O" && available < rowNumber) {
                dish[offset-available][colNumber] = "O"
                dish[offset-rowNumber][colNumber] = "."
                available++
            } else if (dish[offset-rowNumber][colNumber] == "#" || dish[offset-rowNumber][colNumber] == "O") {
                available = rowNumber+1
            }
        }
    }
}

function rollWest(dish: Dish): void {
    for (const rowNumber of dish.keys()) {
        let available : number = 0
        for (const colNumber of dish[0].keys()){
        if (dish[rowNumber][colNumber] == "O" && available < colNumber) {
                dish[rowNumber][available] = "O"
                dish[rowNumber][colNumber] = "."
                available++
            } else if (dish[rowNumber][colNumber] == "#" || dish[rowNumber][colNumber] == "O") {
                available = colNumber+1
            }
        }
    }
}

function rollEast(dish: Dish): void {
    const offset = dish[0].length-1
    for (const rowNumber of dish.keys()) {
        let available : number = 0
        for (const colNumber of dish[0].keys()){
        if (dish[rowNumber][offset-colNumber] == "O" && available < colNumber) {
                dish[rowNumber][offset-available] = "O"
                dish[rowNumber][offset-colNumber] = "."
                available++
            } else if (dish[rowNumber][offset-colNumber] == "#" || dish[rowNumber][offset-colNumber] == "O") {
                available = colNumber+1
            }
        }
    }
}

function cycle(dish: Dish): void {
    rollNorth(dish)
    rollWest(dish)
    rollSouth(dish)
    rollEast(dish)
}


function calculateResult(dish: Dish){
    let total : number = 0
    for (const columnNumber of dish.keys()) {
        for (const rowNumber of dish[0].keys() ) {
            if (dish[columnNumber][rowNumber] == "O")
                total+=dish[0].length - rowNumber+1
        }
    }
    return total
}

function logDish(dish: Dish){
    console.log(dish.map(line => line.join("")).join("\n"))
}

function detectCycleLoop(dish: Dish): number {
    let dishHistory : Map<number,Array<number>> = new Map<number,Array<number>>()
    for (let i = 1; i < 1000000000; ++i) {
        cycle(dish)
        console.log(i)
        logDish(dish)
        let dishResult = calculateResult(dish)
        if (dishHistory.get(dishResult) != undefined) {
            dishHistory.get(dishResult)!.push(i)
            if (dishHistory.get(dishResult)!.length > 100 && 1000000000%i == 0) {
                console.log(dishHistory)
                return dishResult
            }
        } else {
            dishHistory.set(dishResult,[i])
        }
    }

    return Infinity

}

function main() {
    let dish : Dish = readFileSync('./day-14/input', 'utf8').split(/\r?\n/).map(line => line.split(""))
    console.log(detectCycleLoop(dish))

}

main()
