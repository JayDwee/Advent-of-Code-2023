// Day 5: If You Give A Seed A Fertilizer
import * as fs from 'fs';

class ConvertRecord {
    lowerBoundary : number
    upperBoundary : number
    output : number

    constructor(
        lowerBoundary : number, 
        upperBoundary : number, 
        output : number) {
            this.lowerBoundary = lowerBoundary
            this.upperBoundary = upperBoundary
            this.output = output
        }

    convert(input : number) : number | undefined {
        if (this.lowerBoundary <= input 
            && input <= this.upperBoundary){
            return this.output + input - this.lowerBoundary 
        } else {
            return undefined
        }
    }
}

class ConvertMap {
    records : ConvertRecord[] = []

    convert(input : number){
        // Can be improved by using binary search
        let output : number | undefined
        
        for (const record of this.records) {
            if (output = record.convert(input)){
                return output
            }
        }
        return input
    }
}


function main () {
    const inputFile : string = fs.readFileSync('day-5/input', 'utf-8')
    const splitFile : string[] = inputFile.split(/\r?\n/)
    
    const seeds : number[][] = splitFile[0].replace("seeds: ", "").split(" ").map(s => [Number(s)])
    
    let mapBlockFile : string[] = splitFile.splice(3).join('\n').split(/[a-z]+-to-[a-z]+ map:\n/)

    for (const mapNumber of mapBlockFile.keys()) {
        let convertMap : ConvertMap = new ConvertMap() // todo: init configmap

        for (const line of mapBlockFile[mapNumber].split('\n')) {
            let [outputStart, inputStart, range] = line.split(" ").map(s => Number(s))
            convertMap.records.push(new ConvertRecord(inputStart, inputStart + range-1, outputStart))
        }

        seeds.map(seed => {
            seed[mapNumber+1] = convertMap.convert(seed[mapNumber])
            return seed
        } )
    }

    let newSeeds = seeds.reduce((acc, seed) => acc[acc.length-1] > seed[seed.length-1] ? seed : acc)
    console.log(newSeeds)
    // console.log(seeds)
    
}

main()