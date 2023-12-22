// Day 22: Sand Slabs
import { readFileSync } from 'fs'

class Block{
    xStart: number
    yStart: number
    zStart: number
    xEnd: number
    yEnd: number
    zEnd: number

    constructor(inputStr : string) {
        let splitInput : number[] = inputStr.replace('~',',').split(',').map(Number)
        this.xStart = splitInput[0]
        this.yStart = splitInput[1]
        this.zStart = splitInput[2]
        this.xEnd = splitInput[3]
        this.yEnd = splitInput[4]
        this.zEnd = splitInput[5]
    }

    toString() : string {
        return this.xStart + ',' + this.yStart + ','+ (this.zStart+1)+ '~' + this.xEnd + ',' + this.yEnd + ',' + (this.zEnd+1)
    }
}

function isCoordinateOverlap (start1 : number, end1 : number, start2 : number, end2 : number) : boolean {
    return (start1 <= start2 && end1 >= start2) || (start1 <= end2 && end1 >= end2) || (start2 <= start1 && end2 >= start1) || (start2 <= end1 && end2 >= end1)
}

function isBlockOverlap(block1 : Block, block2 : Block) : boolean {
    let result = isCoordinateOverlap(block1.xStart, block1.xEnd, block2.xStart, block2.xEnd) && isCoordinateOverlap(block1.yStart, block1.yEnd, block2.yStart, block2.yEnd)
    return result
    // return isCoordinateOverlap(block1.x_start, block1.x_end, block2.x_start, block2.x_end) && isCoordinateOverlap(block1.y_start, block1.y_end, block2.y_start, block2.y_end) && isCoordinateOverlap(block1.z_start, block1.z_end, block2.z_start, block2.z_end)
}

    
let blocks : Block[] = readFileSync('./day-22/input', 'utf-8').split(/\r?\n/).map(x => new Block(x)).sort((a,b) => a.zStart - b.zStart)

for (const blockNumber of blocks.keys()){
    let searchOffset : number = 1
    let zDiff : number = 0
    while (blockNumber-searchOffset >= 0 && 
        !(blocks[blockNumber-searchOffset].zEnd + 1 <= blocks[blockNumber].zStart 
            && isBlockOverlap(blocks[blockNumber - searchOffset], blocks[blockNumber]))){
                searchOffset++
            }
    if (blockNumber-searchOffset >= 0){
        zDiff = blocks[blockNumber].zStart - blocks[blockNumber-searchOffset].zEnd - 1
    } else {
        zDiff = blocks[blockNumber].zStart
    }
    blocks[blockNumber].zStart = blocks[blockNumber].zStart-zDiff
    blocks[blockNumber].zEnd = blocks[blockNumber].zEnd-zDiff
}

blocks = blocks.sort((a,b) => a.zEnd - b.zEnd != 0 ? a.zEnd - b.zEnd : a.xEnd - b.xEnd != 0 ? a.xEnd - b.xEnd : a.yEnd - b.yEnd )
console.log(blocks.map(x => x.toString()).join('\n'))

const allowedDestroy = new Set(blocks.keys())

for (let i = blocks.length-1; i >= 0; i--) {
    let searchOffset : number = 1
    let supporting : Set<number> = new Set()
    while (i-searchOffset >= 0 ) {
        if (blocks[i-searchOffset].zEnd == blocks[i].zStart - 1 && isBlockOverlap(blocks[i-searchOffset], blocks[i])) {
            supporting.add(i-searchOffset)
        }
        searchOffset++
    }
    if (supporting.size == 1) {
        console.log(blocks[i].toString(), "supported by:",blocks[supporting.values().next().value].toString())
        allowedDestroy.delete(supporting.values().next().value)
    }

}
// console.log(allowedDestroy)
console.log(allowedDestroy.size)