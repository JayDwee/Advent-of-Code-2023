// Day 4: Scratchcards
const fs = require('fs');


var total = 0;
var cards = {};
const inputFile = fs.readFileSync('day-4/input', 'utf-8');
const splitFile = inputFile.split(/\r?\n/);
const maxCard = splitFile.length;
console.log(`maxCard:`, maxCard);

function addToCards(cardNumber, amount) {
    if (cardNumber > maxCard) {
        return;
    }
    if (cards[cardNumber]) {
        cards[cardNumber] += amount;
    } else {
        cards[cardNumber] = amount;
    }
}

for(const cardNumber of Array(maxCard).keys()) {
    const card = splitFile[cardNumber];

    if (cards[cardNumber] === undefined) cards[cardNumber] = 0; 

    var cardTotal = 0;
    const winningNumbers = {};
    const splitCard = card.replace(/Card\ *[0-9]+\: */, '').split(' | ');
    console.log(`splitCard:`, splitCard);
    splitCard[0].split(/ +/).forEach(n => {winningNumbers[n] = 0});
    console.log(`winningNumbers:`, winningNumbers);
    for (const numberOnCard of splitCard[1].split(/ +/).map(n => Number(n))) {
        if (winningNumbers[numberOnCard] !== undefined) {
            cardTotal++;
            console.log('New Winner! ',numberOnCard, 'adding',cards[cardNumber]+1,'to',cardNumber+cardTotal);
            addToCards(cardNumber+cardTotal, cards[cardNumber]+1);
        }
    }
}

total = Object.values(cards).reduce((a, b) => a + b, 0)+maxCard;

console.log(total);