// Day 16: The Floor Will Be Lava
import { readFileSync } from 'fs'

enum Direction {North, South, East, West}


class MirrorMap {
    private _map: string[][] = [];
    private _coverage_map: string[][] = [];
    private _beams: Beam[] = [];
    private _beamCache : Map<string, boolean> = new Map()


    constructor(input: string) {
        let lines = input.split(/\r?\n/);
        for (let line of lines) {
            this._map.push(line.split(''));
        }
        this._coverage_map = this._map.map(x => x.slice(0))
    }

    get map(): string[][] {
        return this._map;
    }

    run_all() : number {
        let max_number : number = 0
        for (let y = 0; y < this._map.length; y++) {
            max_number = Math.max(this.run(0, y, Direction.East), max_number)
            max_number = Math.max(this.run(this._map[0].length-1, y, Direction.West), max_number)
        }
        for (let x = 0; x < this._map[0].length; x++) {
            max_number = Math.max(this.run(x, 0, Direction.South), max_number)
            max_number = Math.max(this.run(x, this._map.length-1, Direction.North), max_number)
        }
        return max_number
    }

    run(start_x: number, start_y: number, start_direction: Direction) : number {
        this._coverage_map = this._map.map(x => x.slice(0))
        this._beams.push(new Beam(start_x, start_y, start_direction));
        this._beamCache = new Map()
        this._beamCache.set(this._beams[0].str_format(), true)
        while (this._beams.length != 0){
            let beam : Beam = this._beams.pop()!
            this._coverage_map[beam.y_pos][beam.x_pos] = '#'
            let new_beams : Beam[] = beam.move(this)
            .filter(b => b.x_pos >= 0 && b.x_pos < this._map[0].length && b.y_pos >= 0 && b.y_pos < this._map.length)
            .filter(b => !this._beamCache.has(b.str_format()))
            new_beams.forEach(b => this._beamCache.set(b.str_format(), true))
            this._beams.push(...new_beams)
        }
        this.print_coverage()
        return this.count_coverage()
    }

    count_coverage() : number {
        return this._coverage_map.reduce((acc, x) => acc + x.reduce((acc, x) => acc + (x == '#' ? 1 : 0), 0), 0 )
    }

    print_coverage() {
        console.log(this._coverage_map.map(x => x.join('')).join('\n')+'\n')
    
    }

}

class Beam{
    constructor(
        public x_pos: number,
        public y_pos: number,
        public direction: Direction){}

    move(mirrorMap: MirrorMap) : Beam[] {
        switch(mirrorMap.map[this.y_pos][this.x_pos]) {
            case '/':
                if (this.direction == Direction.South) {
                    this.direction = Direction.West;
                    this.x_pos--;
                } else if (this.direction == Direction.North) {
                    this.direction = Direction.East;
                    this.x_pos++;
                } else if (this.direction == Direction.West) {
                    this.direction = Direction.South;
                    this.y_pos++;
                } else if (this.direction == Direction.East) {
                    this.direction = Direction.North;
                    this.y_pos--;
                }
                return [this]
            case '\\':
                if (this.direction == Direction.South) {
                    this.direction = Direction.East;
                    this.x_pos++;
                } else if (this.direction == Direction.North) {
                    this.direction = Direction.West;
                    this.x_pos--;
                } else if (this.direction == Direction.West) {
                    this.direction = Direction.North;
                    this.y_pos--;
                } else if (this.direction == Direction.East) {
                    this.direction = Direction.South;
                    this.y_pos++;
                }
                return [this]
            case '-':
                if (this.direction == Direction.North || this.direction == Direction.South) {
                    this.direction = Direction.West
                    this.x_pos--
                    return [this, new Beam(this.x_pos+2, this.y_pos, Direction.East)]
                } 
                break
            case '|':
                if (this.direction == Direction.West || this.direction == Direction.East) {
                    this.direction = Direction.North
                    this.y_pos--
                    return [this, new Beam(this.x_pos, this.y_pos+2, Direction.South)]
                } 
                break
            case '.':
                break
        }
        switch(this.direction) {
            case Direction.North:
                this.y_pos--;
                break
            case Direction.South:
                this.y_pos++;
                break
            case Direction.East:
                this.x_pos++;
                break
            case Direction.West:
                this.x_pos--;
                break
        }

        return [this]
    
    }

    str_format(){
        return `${this.x_pos}_${this.y_pos}_${this.direction}`
    }
}

console.log(new MirrorMap(readFileSync('./day-16/input', 'utf8')).run_all())