// Day 8: Haunted Wasteland
import * as fs from 'fs'

let nodeMap : { [key: string]: Node }  = {}

class Node{
    constructor(
    public name : string,
    public leftNode? : Node,
    public rightNode? : Node) {}

    move(direction: string) : Node {
        if (direction == 'L') {
            return this.leftNode ? this.leftNode : new Node("A")
        } else {
            return this.rightNode ? this.rightNode : new Node("A")
        }
    }
}

function greatestCommonDivisor(a: number, b: number) {
    if (b == 0) {
        return a
    }
    return greatestCommonDivisor(b, a % b)
}

function lowestCommonMutiple(amounts: number[]) {
    let lowestCommonMutiple : number = 1
    for (const amount of amounts) {
        lowestCommonMutiple = (lowestCommonMutiple * amount) / greatestCommonDivisor(lowestCommonMutiple, amount)
    }
    return lowestCommonMutiple
}

function main() {
    const input = fs.readFileSync('./day-8/input', 'utf8')
    const lines = input.split(/\r?\n/)
    let route : string = lines[0]
    let starters : string[] = []
    let totals : number[] = []
    
    for (const line of lines.slice(2)) {   
        nodeMap[line.split(" =")[0]] = new Node(line.split(" =")[0])
        if (line[2] == 'A') {
            starters.push(line.split(" =")[0])
        }
    }

    for (const starter of starters) {
        let total : number = 0
        let currentNode : Node = nodeMap[starter]
        
        for (const line of lines.slice(2)) {
            let splitLine = line.split(' = ')
            let directionNode = splitLine[1].replace(/\(?\)?/g, '').split(', ')
            nodeMap[splitLine[0]].leftNode = nodeMap[directionNode[0]]
            nodeMap[splitLine[0]].rightNode = nodeMap[directionNode[1]]
            
        }
        
        console.log(nodeMap)
        do {
            currentNode = currentNode.move(route[total % route.length])
            console.log(currentNode.name)
            total++
        } while (currentNode.name[2] != 'Z')
        totals.push(total)
    }
    let total = lowestCommonMutiple(totals)
    console.log(total)
}

main()