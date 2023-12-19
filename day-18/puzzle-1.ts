// Day 18: Lavaduct Lagoon
import { readFileSync} from 'fs'

class Coordinate {
    constructor(public x : number, public y : number) {}

    clone() : Coordinate {
        return new Coordinate(this.x, this.y)
    }
}

function shoelaceAlgorithm(coords : Coordinate[]) : number {
    let total : number = 0
    for (let coord of coords.keys()) {
        total += coords[coord % coords.length].x * coords[(coord+1) % coords.length].y
        total -= coords[coord % coords.length].y * coords[(coord+1) % coords.length].x
    }
    return Math.abs(total/2)
}

class DigSite {
    coords : Coordinate[]
    position : Coordinate
    perimiter : number
    constructor(input : string) {
        this.coords = []
        this.position = new Coordinate(0,0)
        this.perimiter = 0
        let instructions : string[] = input.split(/\r?\n/)
        for (let instruction of instructions) {
            let distance : number = Number(instruction.split(" ")[1])
            switch (instruction[0]) {
                case 'L':
                    this.position.x -= distance
                    break
                case 'R':
                    this.position.x += distance
                    this.perimiter += distance
                    break
                case 'U':
                    this.position.y += distance
                    break
                case 'D':
                    this.position.y -= distance
                    this.perimiter += distance
                    break
                }
            this.coords.push(this.position.clone())
        }
        this.coords.reverse()
    }
}

let site : DigSite = new DigSite(readFileSync('./day-18/input', 'utf8'))
console.log(site.coords)
console.log(shoelaceAlgorithm(site.coords) + site.perimiter+1)
