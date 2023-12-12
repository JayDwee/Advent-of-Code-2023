// Day 12: Hot Springs

import { readFileSync } from 'fs';

let cache = new Map<string, number>()
function findMatches(fields: string, ns: number[]) : number {
    if (ns.length == 0) {
        return /#/.exec(fields) ? 0 : 1
    }
    if (!/[#?]/.exec(fields)){
        return 0
    }

    let cacheKey : string = fields + " " +ns.join(",")
    if (cache.has(cacheKey)) {
        return cache.get(cacheKey)!
    }
    
    let result = 0
    if (fields.startsWith(".")) {
        result = findMatches(fields.slice(1), ns)
    }
    if (fields.startsWith("#")) {
        if (RegExp("^[\\?#]{"+ns[0]+"}([\\?.]|$)").exec(fields)){
            result = findMatches(fields.slice(ns[0]+1), ns.slice(1))
        } 
    }
    if (fields.startsWith("?")){
        result = findMatches(fields.replace("?", "#"), ns)+findMatches(fields.slice(1), ns)
    }
    
    cache.set(cacheKey, result)
    return result
}

function findRegExp(input: string) : RegExp {
    let regexpArray : string[] = input.split(",").map(num => "[#\\?]{"+num+"}")
    return new RegExp("^[\\.\\?]*"+regexpArray.join("[\\.\\?]+")+"[\\.\\?]*$")
}

function recurseFindOptionsAndCompare(input: string, regexp: RegExp) : number{
    if (!input.includes('?')) {
        return regexp.test(input) ? 1 : 0
    } 
    if (!regexp.test(input)) {
        return 0
    }

    return recurseFindOptionsAndCompare(input.replace('?', '#'), regexp) + recurseFindOptionsAndCompare(input.replace('?', '.'), regexp)
}

function expandNumbers(input : string) : string {
    return input+(","+input).repeat(4)
}

function expandField(input : string) : string {
    return input+("?"+input).repeat(4)
}

function main() {
    const splitFile : string[] = readFileSync('./day-12/input', 'utf-8').split(/\r?\n/)
    let total = 0
    for (const lineNumber of splitFile.keys()) {
        let splitLine : string[] = splitFile[lineNumber].split(" ")
        // total += recurseFindOptionsAndCompare(expandField(splitLine[0]), findRegExp(expandNumbers(splitLine[1])))
        total += findMatches(expandField(splitLine[0]), expandNumbers(splitLine[1]).split(",").map(Number))
        console.log("completed line", lineNumber, findMatches(expandField(splitLine[0]), expandNumbers(splitLine[1]).split(",").map(Number)))
    }
    console.log(total)
}

main()
