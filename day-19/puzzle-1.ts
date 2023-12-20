// Day 19: Aplenty
import { readFileSync } from 'fs'

class PartRating {
    public x : number
    public m : number
    public a : number
    public s : number

    constructor(partRatingStr : string){
        let splitRating : string[] = partRatingStr.replace(/[{}]/g,'').split(',')
        this.x = parseInt(splitRating[0].substring(2))
        this.m = parseInt(splitRating[1].substring(2))
        this.a = parseInt(splitRating[2].substring(2))
        this.s = parseInt(splitRating[3].substring(2))
    }

    fromStr(str : string) : number {
        switch (str) {
            case 'x':
                return this.x
            case 'm':
                return this.m
            case 'a':
                return this.a
            case 's':
                return this.s
        }
        return Infinity
    }
}

class Rule {
    public category? : string
    public condition? : string
    public conditionValue? : number
    public destination : string
    
    constructor(ruleStr : string){
        let splitRule : string[] = ruleStr.split(':')
        if (splitRule.length == 1) {
            this.destination = splitRule[0]
        } else {
            this.category = splitRule[0][0]
            this.condition = splitRule[0][1]
            this.conditionValue = parseInt(splitRule[0].substring(2))
            this.destination = splitRule[1]
        }
    }

    run(rating : PartRating) : string | null {
        if (this.category == undefined) {
            return this.destination
        }

        if (this.condition == '>') {
            return rating.fromStr(this.category) > this.conditionValue! ? this.destination : null
        }

        if (this.condition == '<') {
            return rating.fromStr(this.category) < this.conditionValue! ? this.destination : null
        }

        return null
    }
}

class Workflow {
    name : string
    rules : Rule[] = []

    constructor(workflowStr : string) {
        let splitStr : string[] = workflowStr.replace('}','').split('{')
        this.name = splitStr[0]
        for (let ruleStr of splitStr[1].split(',')) {
            this.rules.push(new Rule(ruleStr))
        }
    }

    run(rating : PartRating) : string {
        let result : string | null = null
        let r : number = 0
        while (result === null) {
            result = this.rules[r].run(rating)
            r++
        }
        return result
    }
}

let workflows : Map<string, Workflow> = new Map()
let ratings : PartRating[] = []
let total : number = 0

let inputSplit : string[] = readFileSync('./day-19/input', 'utf8').split(/\r?\n\r?\n/)
inputSplit[0].split(/\r?\n/).forEach(workflow => {
                                                    let wf = new Workflow(workflow)
                                                    workflows.set(wf.name, wf)
                                                })
inputSplit[1].split(/\r?\n/).forEach(rating => {ratings.push(new PartRating(rating))})

ratings.forEach(rating => {
    let workflowStr : string = 'in'
    while (workflowStr != 'A' && workflowStr != 'R') {
        let workflow : Workflow = workflows.get(workflowStr)!
        workflowStr = workflow.run(rating)
    }
    if (workflowStr == 'A') {
        total += rating.x + rating.m + rating.a + rating.s
    }
})

console.log(total)