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

function main() {
    const input = fs.readFileSync('./day-8/input', 'utf8')
    const lines = input.split(/\r?\n/)
    let route : string = lines[0]
    let total : number = 0
    
    for (const line of lines.slice(2)) {   
        nodeMap[line.split(" =")[0]] = new Node(line.split(" =")[0])
    }
    let currentNode : Node = nodeMap["AAA"]

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
    } while (currentNode.name != 'ZZZ')

    console.log(total)
}

main()