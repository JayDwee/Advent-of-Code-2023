// Day 10: Pipe Maze
import * as fs from 'fs'

enum Direction {North, South, East, West}

function enumKeys<O extends object, K extends keyof O = keyof O>(obj: O): K[] {
    return Object.keys(obj).filter(k => Number.isNaN(+k)) as K[];
}

class PipeMap{
    private pipeMap : string[][] = []
    private sLoc : number[] = []
    private travelLoc : number[] = [] 
    private pipeLength : number = 1
    private clearedPipeMap : string[][] = []

    constructor(input : string){
        const lines : string[] = input.split(/\r?\n/)
        for (const lineNumber of lines.keys()) {
            const line = lines[lineNumber]
            let chars = line.split('')
            const sIdx = chars.findIndex(c => c == 'S')
            if (sIdx != -1) {
                this.sLoc = [sIdx, lineNumber]
                this.travelLoc = [sIdx, lineNumber]
            }
            this.pipeMap.push(chars)
        }
        // console.log(this.pipeMap)
    }

    move(dir : Direction){
        while (true) {
        console.log(this.pipeLength, dir, this.travelLoc)
        let locationChar : string = this.pipeMap[this.travelLoc[1]][this.travelLoc[0]]
        let newDir : Direction | undefined;
        switch (locationChar) {
            case '|':
                if ([Direction.North, Direction.South].includes(dir)){
                    newDir = dir
                }
                break
            case '-':
                if ([Direction.East, Direction.West].includes(dir)){
                    newDir = dir
                }
                break
            case 'L':
                if (Direction.West == dir) {
                    newDir = Direction.North
                } else if (Direction.South == dir) {
                    newDir = Direction.East
                }
                break
            case "J":
                if (Direction.South == dir) {
                    newDir = Direction.West
                } else if (Direction.East == dir) {
                    newDir = Direction.North
                }
                break
            case "7":
                if (Direction.East == dir) {
                    newDir = Direction.South
                } else if (Direction.North == dir) {
                    newDir = Direction.West
                }
                break
            case "F":
                if (Direction.West == dir) {
                    newDir = Direction.South
                } else if (Direction.North == dir){
                    newDir = Direction.East
                }
                break
            case "S":
                return
        }

        if (newDir === undefined) {
            console.log("No new direction found")
            this.pipeLength = 1
            this.travelLoc = this.sLoc     
            return
        }
        switch (newDir) {
            case Direction.North:
                this.travelLoc[1] -= 1
                break
            case Direction.South:
                this.travelLoc[1] += 1
                break
            case Direction.East:
                this.travelLoc[0] += 1
                break
            case Direction.West:
                this.travelLoc[0] -= 1
                break
        }

        this.pipeLength++
        this.clearedPipeMap[this.travelLoc[1]][this.travelLoc[0]] = this.pipeMap[this.travelLoc[1]][this.travelLoc[0]]
        dir = newDir
        newDir = undefined
    }
    }

    initMove(dir : Direction){
        switch (dir) {
            case Direction.North:
                this.travelLoc[1] -= 1
                break
            case Direction.South:
                this.travelLoc[1] += 1
                break
            case Direction.East:
                this.travelLoc[0] += 1
                break
            case Direction.West:
                this.travelLoc[0] -= 1
                break
        }
        this.pipeLength = 1
        this.clearedPipeMap = ".".repeat(this.pipeMap[0].length).split("").map(x => x.repeat(this.pipeMap.length).split(""))
        this.clearedPipeMap[this.travelLoc[1]][this.travelLoc[0]] = this.pipeMap[this.travelLoc[1]][this.travelLoc[0]]
        this.move(dir)
    }

    findLoop(){
        for (let dir of enumKeys(Direction)) {
            this.travelLoc = this.sLoc
            this.initMove(Direction[dir])
            if (this.pipeLength != 1) {
                console.log(this.pipeLength/2)
                return
            } else {
                console.log("No loop found",dir)
            }
        }
    }

    print(){

        for (const line of this.clearedPipeMap) {
            console.log(line.join(''))
        }
    }

    mapInternal(dir : Direction) {
        while(true) {
            console.log(this.pipeLength, dir, this.travelLoc)
            let locationChar : string = this.pipeMap[this.travelLoc[1]][this.travelLoc[0]]
            let newDir : Direction | undefined;
            switch (locationChar) {
                case '|':
                    if ([Direction.North, Direction.South].includes(dir)){
                        newDir = dir
                    }
                    break
                case '-':
                    if ([Direction.East, Direction.West].includes(dir)){
                        newDir = dir
                    }
                    break
                case 'L':
                    if (Direction.West == dir) {
                        newDir = Direction.North
                    } else if (Direction.South == dir) {
                        newDir = Direction.East
                    }
                    break
                case "J":
                    if (Direction.South == dir) {
                        newDir = Direction.West
                    } else if (Direction.East == dir) {
                        newDir = Direction.North
                    }
                    break
                case "7":
                    if (Direction.East == dir) {
                        newDir = Direction.South
                    } else if (Direction.North == dir) {
                        newDir = Direction.West
                    }
                    break
                case "F":
                    if (Direction.West == dir) {
                        newDir = Direction.South
                    } else if (Direction.North == dir){
                        newDir = Direction.East
                    }
                    break
                case "S":
                    return
            }
    
            if (newDir === undefined) {
                console.log("No new direction found")
                this.pipeLength = 1
                this.travelLoc = this.sLoc     
                return
            }
            let seekLoc : number[]
            switch (newDir) {
                case Direction.North:
                    this.travelLoc[1] -= 1
                    seekLoc = Object.assign([], this.travelLoc)
                    seekLoc[0] += 1 // Seek East
                    while (seekLoc[0] < this.clearedPipeMap.length && seekLoc[0] >= 0 && seekLoc[1] < this.clearedPipeMap[0].length && seekLoc[1] >= 0 && this.clearedPipeMap[seekLoc[1]][seekLoc[0]] == '.') {
                        this.clearedPipeMap[seekLoc[1]][seekLoc[0]] = "I"
                        seekLoc[0] += 1
                    }
                    break
                case Direction.South:
                    this.travelLoc[1] += 1
                    seekLoc = Object.assign([], this.travelLoc)
                    seekLoc[0] -= 1 // Seek West
                    while (seekLoc[0] < this.clearedPipeMap.length && seekLoc[0] >= 0 && seekLoc[1] < this.clearedPipeMap[0].length && seekLoc[1] >= 0 && this.clearedPipeMap[seekLoc[1]][seekLoc[0]] == '.') {
                        this.clearedPipeMap[seekLoc[1]][seekLoc[0]] = "I"
                        seekLoc[0] -= 1
                    }
                    break
                case Direction.East:
                    this.travelLoc[0] += 1
                    seekLoc = Object.assign([], this.travelLoc)
                    seekLoc[1] += 1 // Seek South
                    while (seekLoc[0] < this.clearedPipeMap.length && seekLoc[0] >= 0 && seekLoc[1] < this.clearedPipeMap[0].length && seekLoc[1] >= 0 && this.clearedPipeMap[seekLoc[1]][seekLoc[0]] == '.') {
                        this.clearedPipeMap[seekLoc[1]][seekLoc[0]] = "I"
                        seekLoc[1] += 1
                    }
                    break
                case Direction.West:
                    this.travelLoc[0] -= 1
                    seekLoc = Object.assign([], this.travelLoc)
                    seekLoc[1] -= 1 // Seek North
                    while (seekLoc[0] < this.clearedPipeMap.length && seekLoc[0] >= 0 && seekLoc[1] < this.clearedPipeMap[0].length && seekLoc[1] >= 0 && this.clearedPipeMap[seekLoc[1]][seekLoc[0]] == '.') {
                        this.clearedPipeMap[seekLoc[1]][seekLoc[0]] = "I"
                        seekLoc[1] -= 1
                    }
                    break
            }
    
            this.pipeLength++
            dir = newDir
            newDir = undefined
    
        }
    }

    findInternal(dir : Direction) {
        switch (dir) {
            case Direction.North:
                this.travelLoc[1] -= 1
                break
            case Direction.South:
                this.travelLoc[1] += 1
                break
            case Direction.East:
                this.travelLoc[0] += 1
                break
            case Direction.West:
                this.travelLoc[0] -= 1
                break
        }
        this.pipeLength = 1
        
        this.mapInternal(dir)

        let sumI : number = 0
        let sumP : number = 0
        for(const line of this.clearedPipeMap) {
            line.forEach(c => {
                if (c == "I") sumI++
                else if (c == ".") sumP++
            })
        }

        if (this.clearedPipeMap[0][0] == "I"){
            console.log(sumP)
        } else {
            console.log(sumI)
        }
    }

    findInternalInit(){
        this.findLoop()
        for (let dir of enumKeys(Direction)) {
            this.travelLoc = this.sLoc
            switch (Direction[dir]) {
                case Direction.North:
                    this.travelLoc[1] -= 1
                    break
                case Direction.South:
                    this.travelLoc[1] += 1
                    break
                case Direction.East:
                    this.travelLoc[0] += 1
                    break
                case Direction.West:
                    this.travelLoc[0] -= 1
                    break
            }
            this.pipeLength = 1
            this.findInternal(Direction[dir])
            if (this.pipeLength != 1) {
                console.log(this.pipeLength/2)
                return
            } else {
                console.log("No loop found",dir)
            }
        }
    }

}

function main() {
    const input : string = fs.readFileSync('./day-10/input', 'utf8')
    const pm = new  PipeMap(input)
    pm.findInternalInit()
    pm.print()
}

main()