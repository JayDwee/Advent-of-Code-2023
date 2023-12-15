// Day 15: Lens Library
import { readFileSync } from 'fs'
const METADATA = "METADATA"

type Box = Map<string, any>

function insertToBox(box: Box | undefined, lens: string) : Box {
    if (box === undefined) box = new Map()
    let lensName : string = lens.split("=")[0]
    let lensValue : number = parseInt(lens.split("=")[1])
    box.set(lensName, lensValue)
    if (box.get(METADATA) === undefined) box.set(METADATA, [] as Array<string>)
    if (!(box.get(METADATA).find((val : string) => val==lensName))) box.get(METADATA).push(lensName)
    return box
}

function removeFromBox(box: Box | undefined, lens: string){
    if (box === undefined) return
    lens = lens.replace("-","")
    box.delete(lens)
    box.set(METADATA, box.get(METADATA).filter((m: string) => m !== lens))
}


function hashString(str: string) : number {
    let total : number = 0 
    for (let i = 0; i < str.length; i++) {
        total = (( total + str.charCodeAt(i) ) * 17 ) % 256
    }
    return total
}

function totalBox(boxNumber: number, box: Box) : number {
    let total : number = 0
    const metadata : Array<string> = box.get(METADATA)
    for (let i = 0; i < metadata.length; i++) {
        total += box.get(metadata[i])*(i+1)*(boxNumber+1)
    }
    return total
}

const strArr : Array<string> = readFileSync('./day-15/input', 'utf8').split(",")
let boxes : Map<number, Box> = new Map()
for (let i = 0; i < strArr.length; i++) {
    const str : string = strArr[i]
    const isInsert = str[str.length-1] != "-"
    const boxNumber : number = hashString(str.substring(0,str.length-(isInsert ? 2 : 1)))
    let box : Box | undefined= boxes.get(boxNumber)
    if (isInsert) {
        boxes.set(boxNumber, insertToBox(box, strArr[i]))
    } else {
        removeFromBox(box, str)
    }
}
console.log(boxes)
let total : number = 0
boxes.forEach((box: Box, boxNumber: number) => {total += totalBox(boxNumber, box)})
console.log(total)