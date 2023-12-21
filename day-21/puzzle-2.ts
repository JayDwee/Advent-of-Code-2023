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

    isRock(x: number, y:number) : boolean {
        // console.log(x,y)
        // console.log(x % this.map[0].length, y % this.map.length)
        y = Math.abs(y >= 0 ? y % this.map.length : ((this.map.length + (y % this.map.length)) % this.map.length))
        x = Math.abs(x >= 0 ? x % this.map[0].length : ((this.map[0].length + (x % this.map[0].length))% this.map[0].length))
        
        // console.log(x,y)
        // console.log(this.map[y].join(""))
        return this.map[y][x] == '#'

    }

    step() : void{
        this.stepCount++
        const newLastSeen : Array<Coordinate> = new Array()
        for (const coord of this.lastSeen) {
            let newCoords : Array<Coordinate> = new Array()
            if (!this.isRock(coord.y+1,coord.x)) {
                newCoords.push(new Coordinate(coord.x, coord.y+1))
            }
            if (!this.isRock(coord.y-1,coord.x)) {
                newCoords.push(new Coordinate(coord.x, coord.y-1))
            }
            if (!this.isRock(coord.y,coord.x+1)) {
                newCoords.push(new Coordinate(coord.x+1, coord.y))
            }
            if (!this.isRock(coord.y,coord.x-1)) {
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

    getExplored() : number { return this.explored.get(this.stepCount % 2)!.length }
}


const gardenMap : GardenMap = new GardenMap(readFileSync('./day-21/input', 'utf8'))
let fitValues : number[] = new Array()
// while (fitValues.length < 30){
    for (let i = 0; i < 38; i++) {
        gardenMap.step()
    }
    fitValues.push(gardenMap.getExplored())
    console.log('x','{'+[...fitValues.keys()].join()+'}')
    console.log('y','{'+fitValues.join()+'}')
// }
// console.log(gardenMap.isRock(0,-11))
console.log(50/11)
var x : number = (5000/11)-1
var a0 : number = 81.0638
var a1 : number = 148.721
var a2 : number = 31.1153
console.log(a0*(x)**2 + a1*(x) + a2)

// 63 261 644 1196 
// 261/63=4.14285714
// 644/261=2.46743295
// 1196/644=1.85714286

// Used Wolfram Alpha :/