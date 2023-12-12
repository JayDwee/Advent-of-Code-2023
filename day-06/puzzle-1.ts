// Day 6: Wait For It
import * as fs from 'fs';

function solveQuadratic(a : number, b : number, c : number) : number[] {
    let x1 : number = (-b + Math.sqrt(b**2 - 4*a*c))/(2*a)
    let x2 : number = (-b - Math.sqrt(b**2 - 4*a*c))/(2*a)
    return [x1, x2]
}

class BoatRace {
    constructor(
        public time : number,
        public distance : number,
        public range? : number
        ) {}

    findWinningRange() : number {
        let roots : number[] = solveQuadratic(-1, this.time, -this.distance)
        roots.sort((a,b) => a-b)
        let lowRoot = roots[0]
        let highRoot = roots[1]

        if (Number.isInteger(lowRoot)) lowRoot = lowRoot + 1

        if (Number.isInteger(highRoot)) highRoot = highRoot - 1

        console.log(roots)
        this.range = Math.floor(highRoot) - Math.ceil(lowRoot) + 1
        return this.range
    }
}

function main() {
    const inputFile : string = fs.readFileSync('day-6/input', 'utf-8')
    const splitFile : number[][] = inputFile.split(/\r?\n/).map(line => line.replace(/[A-Za-z\:\ ]+/, '').split(/ +/).map(Number))
    console.log(splitFile)
    let boatRaces : BoatRace[] = []
    for (let i : number = 0; i < splitFile[0].length; i++) {
        boatRaces.push(new BoatRace(splitFile[0][i], splitFile[1][i]))
    }

    boatRaces.forEach(race => race.findWinningRange())
    
    console.log(boatRaces)

    console.log(boatRaces.reduce((a,b) => a * (b.range != undefined ? b.range : 1), 1))
}

main()