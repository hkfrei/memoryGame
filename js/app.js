/*
* @Description a stopwatch class.
* Credits: https://codepen.io/_Billy_Brown/pen/dbJeh
*/
const Stopwatch = function(display) {
    this.running = false;
    this.display = display;
    this.laps = [];
    this.reset();
    this.print(this.times);
};

Stopwatch.prototype.reset = function() {
    this.times = [ 0, 0, 0 ];
    this.print();
};

Stopwatch.prototype.start = function() {
    if (!this.time) this.time = performance.now();
    if (!this.running) {
        this.running = true;
        requestAnimationFrame(this.step.bind(this));
    }
};

Stopwatch.prototype.stop = function() {
    this.running = false;
    this.time = null;
};

Stopwatch.prototype.step = function(timestamp) {
    if (!this.running) return;
    this.calculate(timestamp);
    this.time = timestamp;
    this.print();
    requestAnimationFrame(this.step.bind(this));
};

Stopwatch.prototype.calculate = function(timestamp) {
    var diff = timestamp - this.time;
    // Hundredths of a second are 100 ms
    this.times[2] += diff / 10;
    // Seconds are 100 hundredths of a second
    if (this.times[2] >= 100) {
        this.times[1] += 1;
        this.times[2] -= 100;
    }
    // Minutes are 60 seconds
    if (this.times[1] >= 60) {
        this.times[0] += 1;
        this.times[1] -= 60;
    }
};

Stopwatch.prototype.print = function() {
    this.display.innerText = this.format(this.times);
};

Stopwatch.prototype.format = function(times) {
    return `\
${pad0(times[0], 2)}:\
${pad0(times[1], 2)}:\
${pad0(Math.floor(times[2]), 2)}`;
};


function pad0(value, count) {
    var result = value.toString();
    for (; result.length < count; --count)
        result = '0' + result;
    return result;
}

const model = {
    /*
    * @description array with all the 16 card objects.
    */
    cards: [],

    /*
    * @description array with the different symbol classes.
    */
    symbols: [
        'fa-diamond',
        'fa-paper-plane-o',
        'fa-anchor',
        'fa-bolt',
        'fa-cube',
        'fa-leaf',
        'fa-bicycle',
        'fa-bomb'
    ],

    /*
    * @description constructor function for creating card objects.
    * @param {string} symbol - the name of the symbol (see symbols array).
    * @return {object} - a card object.
    */
    Card: function(symbol){
        this.symbol = symbol;
        return this;
    },

    /*
    * @description creates two card objects for every symbol in the symbols array and
      pushes them all tho the model.cards array.
    * @return {array} cards - Array with all the 16 card objects.
    */
    createCardObjets: function() {
        this.symbols.forEach((symbol) => {
            let card = new this.Card(symbol);
            //add 2 cards per symbol
            this.cards.push(card,card);
        });
        return this.cards;
    }
};


const controller = {

    /*
    * @description the currently open card to compare the next
    * opened card with.
    */
    currentCard: null,

    /*
    * @description array to store all the cards that matched.
    */
    finishedCards: [],

    /*
    * @description shuffles and displays the cards on the page and
    * make everything ready to start playing.
    */
    init: function() {
        this.stopwatch = new Stopwatch(document.querySelector('.stopwatch'));
        let shuffeledCards = this.shuffle(model.createCardObjets());
        let memoryCards = this.getCardsFragment(shuffeledCards);
        //display the cards on the page
        gameView.init(memoryCards);

    },

    /*
    * @description Shuffle function from http://stackoverflow.com/a/2450976
    * @param {array} cardObjects - array of objects to shuffle
    * @return {array} cardObjects - the shuffeled array
    */
    shuffle: function(cardObjects) {
        var currentIndex = cardObjects.length, temporaryValue, randomIndex;

        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = cardObjects[currentIndex];
            cardObjects[currentIndex] = cardObjects[randomIndex];
            cardObjects[randomIndex] = temporaryValue;
        }

        return cardObjects;
    },

    /*
    * @description Create a DocumentFragment containing cards.
    * @param {array} cards - array with (shuffeled) card objects.
    * @return {DocumentFragmen} memoryCards - a DocumentFragment with all the Cards as <li>Elements</li>.
    */
    getCardsFragment: function(shuffeledCards) {
        const memoryCards = new DocumentFragment();
        shuffeledCards.forEach(function(card) {
            let li = document.createElement('li');
            li.classList.add('card');
            // set the symbol as a data attribute to the card for later use.
            li.dataset.symbol = card.symbol;

            let icon = document.createElement('i');
            icon.classList.add('fa', card.symbol);
            li.appendChild(icon);

            //add the click event listener to the card
            li.addEventListener('click', function(e) {
                controller.showCard(e.target);
            });
            //add the card to the DocumentFragment
            memoryCards.appendChild(li);
        });
        return memoryCards;
    },

    /*
    * @description open a card an show it's image.
    * then compare the image to the last opened card
    * @param {domElement} card - a html li (card) element
    */
    showCard: function(card) {
        card.classList.add('open', 'show');
        if (!this.currentCard) {
            this.currentCard = card;
        } else {
            this.compareCards(card);
        }

    },

    /*
    * @description all the open cards that do not match
    * @param {domElement} card - the last opened card
    */
    closeCards: function(card) {
        card.classList.remove('open', 'show');
        this.currentCard.classList.remove('open', 'show');
        this.currentCard = null;
    },

    /*
    * @description compares the two opened card symbols for equality
    * @param {domElement} card - the card that was last opened
    */
    compareCards: function(card) {
        if (card.dataset.symbol === this.currentCard.dataset.symbol) {
            //match case
            this.finishedCards.push(card, this.currentCard);
            this.currentCard = null;
            if (this.finishedCards.length === 16) {
                alert('yeeeeh you won!');
            }
        } else {
            //no match case
            window.requestAnimationFrame(function() {
                controller.closeCards(card);
            });
        }
    }
};

const gameView = {

    deck: document.getElementsByClassName('deck')[0],

    init: function(memoryCards) {
        this.displayCards(memoryCards);
        let startButton = document.getElementsByClassName('start')[0];
        let stopButton = document.getElementsByClassName('stop')[0];
        let resetButton = document.getElementsByClassName('reset')[0];
        startButton.addEventListener('click', function(){
            controller.stopwatch.start();
        });
        stopButton.addEventListener('click', function(){
            controller.stopwatch.stop();
        });
        resetButton.addEventListener('click', function(){
            controller.stopwatch.reset();
        });
    },

    /*
    * @description displays the cards on the page.
    * @param {DocumentFragment} memoryCards - a DocumentFragment, containig all the cards as html li elements
    */
    displayCards: function(memoryCards) {
        this.deck.appendChild(memoryCards);
    }
};



/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
controller.init();