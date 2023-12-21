// Day 21: Step Counter
import { readFileSync } from 'fs'

class Coordinate{
    constructor(public x : number, public y : number){}
}

class GardenMap{
    private map : Array<Array<string>> = new Array()
    private explored: Map<number,Array<Coordinate>> = new Map()
    private stepCount: number = 0
    private lastSeen: Array<Coordinate> = new Array()

    constructor(input : string){
        input.split(/\r?\n/).forEach(line => {
            this.map.push(line.split(""))
            if (line.includes('S')) {
                this.lastSeen.push(new Coordinate(line.indexOf('S'), this.map.length-1))
            }
        })
        this.explored.set(0, new Array())
        this.explored.set(1, new Array())
    }

    step() : void{
        this.stepCount++
        const newLastSeen : Array<Coordinate> = new Array()
        for (const coord of this.lastSeen) {
            let newCoords : Array<Coordinate> = new Array()
            if (this.map[coord.y+1][coord.x] != '#') {
                newCoords.push(new Coordinate(coord.x, coord.y+1))
            }
            if (this.map[coord.y-1][coord.x] != '#') {
                newCoords.push(new Coordinate(coord.x, coord.y-1))
            }
            if (this.map[coord.y][coord.x+1] != '#') {
                newCoords.push(new Coordinate(coord.x+1, coord.y))
            }
            if (this.map[coord.y][coord.x-1] != '#') {
                newCoords.push(new Coordinate(coord.x-1, coord.y))
            }
            const alreadyExplored : Array<Coordinate> = this.explored.get(this.stepCount%2)!
            for (const exploredCoord of alreadyExplored) {
                newCoords = newCoords.filter(coord => coord.x != exploredCoord.x || coord.y != exploredCoord.y)
            }
            alreadyExplored.push(...newCoords)
            newLastSeen.push(...newCoords)
        }
        this.lastSeen = newLastSeen

    }

    printSizes() : void{
        console.log(this.explored.get(this.stepCount % 2)!.length)
    }
}


const gardenMap : GardenMap = new GardenMap(readFileSync('./day-21/input', 'utf8'))
for (let i = 0; i < 6; i++) {
    gardenMap.step()
}
gardenMap.printSizes()