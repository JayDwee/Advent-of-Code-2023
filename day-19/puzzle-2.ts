// Day 19: Aplenty
import { readFileSync } from 'fs'

class PartRating {
    constructor(    
        public x : CategoryRange = new CategoryRange(1,4000), 
        public m : CategoryRange = new CategoryRange(1,4000),
        public a : CategoryRange = new CategoryRange(1,4000),
        public s : CategoryRange = new CategoryRange(1,4000)
        ){}

    fromStr(str : string) : CategoryRange {
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
        return new CategoryRange(0, 0)
    }

    setStr(str : string, range : CategoryRange) {
        switch (str) {
            case 'x':
                this.x = range 
                break
            case 'm':
                this.m = range
                break
            case 'a':
                this.a = range
                break
            case 's':
                this.s = range
                break
        }
    }

    clone() : PartRating {
        return new PartRating(this.x.clone(), this.m.clone(), this.a.clone(), this.s.clone())
    }
}

class CategoryRange {
    constructor(public min : number, public max : number){}

    clone() : CategoryRange {
        return new CategoryRange(this.min, this.max)
    }
}
class RuleDecision {
    constructor(
        public rating : PartRating,
        public decision : string | null){}
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
            return rating.fromStr(this.category).min > this.conditionValue! ? this.destination : null
        }

        if (this.condition == '<') {
            return rating.fromStr(this.category).min < this.conditionValue! ? this.destination : null
        }

        return null
    }

    splitRatingRanges(rating: PartRating) : RuleDecision[] {
        if (this.category == undefined) {
            return [new RuleDecision(rating.clone(), this.destination)]
        }

        let lowerBound = new RuleDecision(rating.clone(), null)
        let upperBound = new RuleDecision(rating.clone(), null)

        if (this.condition == '>') {
            lowerBound.rating.setStr(this.category, new CategoryRange(rating.fromStr(this.category).min, this.conditionValue!))
            upperBound.rating.setStr(this.category, new CategoryRange(this.conditionValue! + 1, rating.fromStr(this.category).max))
            upperBound.decision = this.destination
        }

        if (this.condition == '<') {
            lowerBound.rating.setStr(this.category, new CategoryRange(rating.fromStr(this.category).min, this.conditionValue!-1))
            upperBound.rating.setStr(this.category, new CategoryRange(this.conditionValue!, rating.fromStr(this.category).max))
            lowerBound.decision = this.destination
        }
        return [lowerBound, upperBound]
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
    
    splitRatingRanges(rating : PartRating) : RuleDecision[] {
        let waitingRatingQueue : Array<PartRating> = new Array(rating)
        let completedRatingQueue : Array<RuleDecision> = new Array()

        for (let rule of this.rules) {
            let resultQueue : Array<PartRating> = new Array()
            for (let rating of waitingRatingQueue) {
                let result : RuleDecision[] = rule.splitRatingRanges(rating)
                for (let ruleDecision of result) {
                    if (ruleDecision.decision != null) {
                        completedRatingQueue.push(ruleDecision)
                    } else {
                        resultQueue.push(ruleDecision.rating)
                    }
                }
            }
            waitingRatingQueue = resultQueue
        }
        // console.log(this.name) 
        // completedRatingQueue.forEach(rating => console.log(rating.rating.x.min, rating.rating.x.max, rating.rating.m.min, rating.rating.m.max, rating.rating.a.min, rating.rating.a.max, rating.rating.s.min, rating.rating.s.max, rating))
        return completedRatingQueue
    }
}

let workflows : Map<string, Workflow> = new Map()
let ratings : Map<string, Array<PartRating>> = new Map()
let total : number = 0

let inputSplit : string[] = readFileSync('./day-19/input', 'utf8').split(/\r?\n\r?\n/)
inputSplit[0].split(/\r?\n/).forEach(workflow => {
                                                    let wf = new Workflow(workflow)
                                                    workflows.set(wf.name, wf)
                                                })
ratings.set('in', [new PartRating()])

let acceptedRatings : Array<PartRating> = new Array()
let rejectedRatings : Array<PartRating> = new Array()

while (ratings.size != 0) {
    let workflowName : string = ratings.keys().next().value
    let ratingArr : Array<PartRating> = ratings.get(workflowName)!
    ratings.delete(workflowName)

    for (let rating of ratingArr) {
        let workflow : Workflow = workflows.get(workflowName)!
        let ratingResults : Array<RuleDecision> = workflow.splitRatingRanges(rating)

        for (let ratingResult of ratingResults) {
            if (ratingResult.decision == 'A') {
                acceptedRatings.push(ratingResult.rating)
            } else if (ratingResult.decision == 'R') {
                rejectedRatings.push(ratingResult.rating)
            } else if (ratings.has(ratingResult.decision!)) {
                ratings.get(ratingResult.decision!)!.push(ratingResult.rating)
            } else {
                ratings.set(ratingResult.decision!, [ratingResult.rating])
            }
        }
    }
}
// console.log(acceptedRatings)
for (let acceptedRating of acceptedRatings ){
    total += (acceptedRating.x.max-acceptedRating.x.min+1)
                *(acceptedRating.m.max-acceptedRating.m.min+1)
                *(acceptedRating.a.max-acceptedRating.a.min+1)
                *(acceptedRating.s.max-acceptedRating.s.min+1)
}

console.log(total)