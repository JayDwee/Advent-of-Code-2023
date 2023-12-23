// Day 23: A Long Walk
import { readFileSync } from "fs";

class Coordinate{ 
    constructor(public x : number, public y : number){}
    clone(){return new Coordinate(this.x, this.y);}
    cacheKey(){return `${this.x},${this.y}`}
}

class TrailPath{
    private trailMap: TrailMap;
    public path: Coordinate[] = [];
    public seenCache: Map<string, boolean> = new Map();

    constructor(trailMap: TrailMap){
        this.trailMap = trailMap;
    }

    private isAvailable(step : Coordinate) : boolean{
        const key : string = step.cacheKey();
        if(this.seenCache.has(key)){
            return false;
        }
        if (step.x < 0 || step.x >= this.trailMap.map[0].length)
            return false;
        if (step.y < 0 || step.y >= this.trailMap.map.length)
            return false;
        if (this.trailMap.map[step.y][step.x] === '#')
            return false;

        return true;
    }

    availableSteps() : Coordinate[] {
        const current : Coordinate = this.path[this.path.length - 1];
        const possibleSteps : Coordinate[] = []
        switch(this.trailMap.map[current.y][current.x]){
            case "^":
                possibleSteps.push(new Coordinate(current.x, current.y - 1));
                break;
            case ">":
                possibleSteps.push(new Coordinate(current.x + 1, current.y));
                break;
            case "v":
                possibleSteps.push(new Coordinate(current.x, current.y + 1));
                break;
            case "<":
                possibleSteps.push(new Coordinate(current.x - 1, current.y));
                break;
            default:
                if (current.y != 0 && ['.','^'].includes(this.trailMap.map[current.y-1][current.x]))
                    possibleSteps.push(new Coordinate(current.x, current.y-1))
                if (current.y != trailMap.map.length-1 && ['.','v'].includes(this.trailMap.map[current.y+1][current.x]))
                    possibleSteps.push(new Coordinate(current.x, current.y+1))
                if (current.x != 0 && ['.','<'].includes(this.trailMap.map[current.y][current.x-1]))
                    possibleSteps.push(new Coordinate(current.x-1, current.y))
                if (current.x != trailMap.map[0].length-1 && ['.','>'].includes(this.trailMap.map[current.y][current.x+1]))
                    possibleSteps.push(new Coordinate(current.x+1, current.y))
                break;
        }
        return possibleSteps.filter(step => this.isAvailable(step));
    }

    step(step : Coordinate) : void{
        this.path.push(step);
        this.seenCache.set(step.cacheKey(), true);
    }

    pathLength() : number{
        return this.path.length;
    }

    lastCoord() : Coordinate{
        return this.path[this.path.length - 1];
    }

    clone() : TrailPath{
        const path : TrailPath = new TrailPath(this.trailMap);
        path.path = this.path.map(step => step.clone());
        path.seenCache = new Map(this.seenCache);
        return path;
    }

}

class TrailMap{
    public map : string[][];
    public start : Coordinate;
    public end : Coordinate;

    constructor(mapStr : string){
        this.map = mapStr.split(/\r?\n/).map(line => line.split(''));
        this.start = new Coordinate(this.map[0].indexOf('.'), 0);
        this.end = new Coordinate(this.map[this.map.length-1].indexOf('.'), this.map.length-1);
    }

    printPath(path : TrailPath){
        console.log(this.map.map((line: string[], y: number) => {return line.map((char: string, x: number) => {return path.seenCache.has(new Coordinate(x,y).cacheKey()) ? "O" : char}).join("")}).join("\n"));   
    }
}



const trailMap : TrailMap = new TrailMap(readFileSync('./day-23/input', 'utf8'));
const initialPath : TrailPath = new TrailPath(trailMap);
initialPath.step(trailMap.start);
const trails : TrailPath[] = [initialPath];
let lastSuccessfulTrail: TrailPath;

while(trails.length > 0){
    console.log(trails.length);
    const currentTrail = trails.shift()!;
    if (currentTrail.lastCoord().y == trailMap.end.y && currentTrail.lastCoord().x == trailMap.end.x){
        lastSuccessfulTrail = currentTrail;
        continue;
    }

    const availableSteps : Coordinate[] = currentTrail.availableSteps();
    if(availableSteps.length === 0){
        continue;
    }
    for(let step of availableSteps){
        const newTrail : TrailPath = currentTrail.clone();
        newTrail.step(step);
        trails.push(newTrail);
    }
}

console.log(trailMap.printPath(lastSuccessfulTrail!));
console.log(lastSuccessfulTrail!.pathLength()-1);