// Day 4: Scratchcards
const fs = require('fs');


var total = 0;
const inputFile = fs.readFileSync('day-4/input', 'utf-8');

for(const card of inputFile.split(/\r?\n/)) {
    var cardTotal = 0;
    const winningNumbers = {};
    const splitCard = card.replace(/Card\ *[0-9]+\: */, '').split(' | ');
    console.log(`splitCard:`, splitCard);
    splitCard[0].split(/ +/).forEach(n => {winningNumbers[n] = 0});
    console.log(`winningNumbers:`, winningNumbers);
    for (const cardNumber of splitCard[1].split(/ +/)) {
        if (winningNumbers[cardNumber] !== undefined) {
            console.log('New Winner! ',cardNumber);
            cardTotal++;
        }
    }
    if (cardTotal != 0) total+=2**(cardTotal-1);
}

console.log(total);