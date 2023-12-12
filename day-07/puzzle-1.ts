// Day 7: Camel Cards
import * as fs from 'fs';

class Hand {
    constructor(
        public cards : string, 
        public bid : number,
        public power : number = 0
        ) {
            this.setPower()
    }

    setPower() : void {
        let cardGroupObj : {[index: string]: number} = [...this.cards].reduce((acc, curr) => {
            acc[curr] ? acc[curr]++ : acc[curr] = 1 
            return acc
        }, {} as {[index: string]: number})
        let cardGroup : number[] = Object.values(cardGroupObj)
        let cardGroupMax : number = Math.max(...cardGroup)

        if (cardGroup.includes(2) && cardGroup.includes(3)) {
            this.power = 5
        }
        else if (cardGroup.includes(2) && Object.values(cardGroupObj).length == 3) {
            this.power = 3
        }
        else if (cardGroupMax > 3) {
            this.power = cardGroupMax+2
        }
        else if (cardGroupMax == 3) {
            this.power = cardGroupMax+1
        } else {
            this.power = cardGroupMax
        }
    }
}

function cardValue(card : string){
    switch(card) {
        case 'A':
            return 14
        case 'K':
            return 13
        case 'Q':
            return 12
        case 'J':
            return 11
        case 'T':
            return 10
        default:
            return Number(card)
    }
}

function compareCards(a : Hand, b : Hand) : number {
    let result : number = 0
    let i : number = 0
    do {
        result = cardValue(a.cards[i]) - cardValue(b.cards[i])
        i++
    } while (result == 0 && i < 5 )
    return result
}


function main() {
    const input : string = fs.readFileSync('day-7/input', 'utf-8')
    const lines  : string[] = input.split(/\r?\n/)
    let hands : Hand[] = []

    for (const line of lines) {
        const [card, bid] = line.split(' ')
        const hand = new Hand(card, Number(bid))
        hands.push(hand)
    }

    let total = 0
    let cardsArray = hands.sort((a,b) => {
        if (a.power == b.power) {
            return compareCards(a,b)
        } else {
            return a.power - b.power
        }
    })
    for (let i : number = 0; i < cardsArray.length; i++) {
        console.log(i, cardsArray[i])
        total += cardsArray[i].bid * (i+1)
    }
    console.log(total)
}

main()

// let hand : Hand = new Hand('TT221', 1)
// console.log(hand.power)
