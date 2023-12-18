// Day 17: Clumsy Crucible
import { readFileSync } from 'fs'
import {
    PriorityQueue,
    MinPriorityQueue,
    MaxPriorityQueue,
    ICompare,
    IGetCompareValue,
  } from '@datastructures-js/priority-queue';

enum Direction {North, East, South, West}

function enumKeys<O extends object, K extends keyof O = keyof O>(obj: O): K[] {
    return Object.keys(obj).filter(k => Number.isNaN(+k)) as K[];
}

class CrucibleMap {
    private map: number[][] = []
    min_dist : number = 4
    max_dist : number = 10
    private average: number = 0
    private pQueue: PriorityQueue<CruciblePosition> = new MinPriorityQueue(p => p.g)
    private paths: Map<number, Array<CruciblePath>> = new Map()
    private seen: number[][] = []
    private completedPath? : CruciblePath = undefined

    private seenCache : Map<string, boolean> = new Map()

    constructor(input: string) {
        this.map = input.split(/\r?\n/).map(line => line.split('').map(Number))
        this.average = this.map.reduce((acc, line) => acc + line.reduce((acc, val) => acc + val, 0), 0) / (this.map.length * this.map[0].length)
        this.seen = this.map.map(line => line.map(val => 0))
    }

    addPos(prev : CruciblePosition, direction : Direction){
        let x : number
        let y : number
        switch (direction) {
            case Direction.North:
                if (prev.y == 0) return
                if (prev.direction == Direction.South) return
                x = prev.x
                y = prev.y - 1
                break
            case Direction.East:
                if (prev.x == this.map[0].length - 1) return
                if (prev.direction == Direction.West) return
                x = prev.x + 1
                y = prev.y
                break
            case Direction.South:
                if (prev.y == this.map.length - 1) return
                if (prev.direction == Direction.North) return
                x = prev.x
                y = prev.y + 1
                break
            case Direction.West:
                if (prev.x == 0) return
                if (prev.direction == Direction.East) return
                x = prev.x - 1
                y = prev.y
                break
        }

        let val = this.map[y][x]
        let h = this.calculateH(x,y)
        let direction_distance : number = 1
        if (direction == prev.direction) {
            direction_distance = prev.direction_distance + 1
        }

        let newCruciblePos : CruciblePosition = new CruciblePosition(x, y, prev, prev.g + val + h, prev.g + val, h, direction, direction_distance)
        if (this.seenCache.has(newCruciblePos.cacheKey)) return
        if (newCruciblePos.direction_distance == 1 && prev.direction_distance < this.min_dist) return
        if (newCruciblePos.direction_distance > this.max_dist) return
        this.pQueue.enqueue(newCruciblePos)

        // console.log(this.searchedMap[y][x])
    }

    run(start_x : number, start_y : number) : number {
        this.pQueue.enqueue(new CruciblePosition(1, 0, undefined, this.calculateH(1,0), 0, this.calculateH(1,0), Direction.East, 1))
        this.pQueue.enqueue(new CruciblePosition(0, 1, undefined, this.calculateH(0,1), 0, this.calculateH(0,1), Direction.South, 1))
        while (!this.pQueue.isEmpty()){
            let minF = this.pQueue.pop()
            if (this.seenCache.has(minF.cacheKey)) continue
            if (minF === undefined) break
            if (minF.x == this.map[0].length - 1 && minF.y == this.map.length - 1 ) {
                let path : CruciblePath = this.tracebackRoute(minF)
                // console.log(path)
                this.printPath(path)
                // this.printSearchedMap()
                return minF.f + this.map[0][0]
            }
            this.seenCache.set(minF.cacheKey, true)
            this.seen[minF.y][minF.x]++
            // if (minF.x == 0 && minF.y == 0) console.log(minF.cacheKey)
            // console.log(this.seen.map(l => l.map( s => s.toString().padEnd(3,' ')).join(',')).join('\n')+'\n')
            for (const direction of enumKeys(Direction)){
                this.addPos(minF, Direction[direction])
            }
        }
        // this.printSearchedMap()
        // let path : CruciblePath = this.tracebackRoute(this.searchedMap[this.searchedMap.length-1][this.searchedMap[0].length-1])
        // console.log(path)
        // this.printPath(path)
        return 0
    }

    tracebackRoute(trace: CruciblePosition | undefined) : Array<CruciblePosition>{
        let path : Array<CruciblePosition> = []
        // console.log(trace)
        while (trace !== undefined){
            path.push(trace)
            trace = trace.from
        }
        return path.reverse()
    }
    
    printPath(path : CruciblePath) {
        let outMap = this.map.map(l => l.slice(0).map(s => '.'))
        for (let pNum of path.keys()) {
            const p = path[pNum]
            // outMap[p.y][p.x] = (pNum < 10 ? ' ' : '') + pNum.toString()
            outMap[p.y][p.x] = '#'
        }
        console.log(outMap.map(l => l.join("")).join("\n")+"\n")
        console.log(path.map(p => this.map[p.y][p.x]).reduce((a,b) => a+b))
    }

    calculateH(x: number, y: number) {
        return ((this.map.length-1 - y) + (this.map[0].length-1 - x)) * 4
    }
}


class CruciblePosition {
    constructor(
        public x: number,
        public y: number,
        public from: CruciblePosition | undefined,
        public f : number,
        public g: number,
        public h: number,
        public direction: Direction,
        public direction_distance: number
    ) {}

    get cacheKey() {
        return `(${this.x}, ${this.y}) ${this.direction} ${this.direction_distance}`
    }
}

type CruciblePath = Array<CruciblePosition>

let crucibleMap : CrucibleMap = new CrucibleMap(readFileSync('./day-17/input', 'utf8'));
crucibleMap.run(0,0)

// console.log('413432313545753646373353'.split('').map(Number).reduce((acc, a) => acc + a, 0))