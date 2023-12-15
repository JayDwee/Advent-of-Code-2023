// Day 15: Lens Library
import { readFileSync } from 'fs'



function hashString(str: string) : number {
    let total : number = 0 
    for (let i = 0; i < str.length; i++) {
        total = (( total + str.charCodeAt(i) ) * 17 ) % 256
    }
    return total
}


const strArr : Array<string> = readFileSync('./day-15/input', 'utf8').split(",")
let total : number = 0
for (let i = 0; i < strArr.length; i++) {
    total += hashString(strArr[i])
}
console.log(total)