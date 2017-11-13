/*
* @Description a stopwatch class.
* Credits: https://codepen.io/_Billy_Brown/pen/dbJeh
*/
const Stopwatch = function(display) {
    this.running = false;
    this.display = display;
    this.reset();
    this.print(this.times);
};

Stopwatch.prototype.reset = function() {
    this.times = [0, 0, 0];
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
        if(this.cards.length > 0) {
            this.cards = [];
        }
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
    * @description reference to the stars ul list in the dom.
    */
    starContainer: document.getElementsByClassName('stars')[0],

    /*
    * @description reference to the stars inside  the ul list.
    */
    stars: 3,

    /*
    * @description number of moves the user has made.
    */
    moves: 0,

    /*
    * @description the currently open card to compare the next.
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
        if(! this.stopwatch) {
            this.stopwatch = new Stopwatch(document.querySelector('.stopwatch'));
        } else {
            this.stopwatch.stop();
            this.stopwatch.reset();
        }
        this.resetMoves();
        this.resetStars();
        this.finishedCards = [];
        let shuffeledCards = this.shuffle(model.createCardObjets());
        let memoryCards = this.getCardsFragment(shuffeledCards);
        //display the cards on the page
        gameView.init(memoryCards);

    },

    /*
    * @description create a star rating string with <i> elements
    * and a font-awesome star.
    * @return {string} starString - a star rating string to add to a dom element.
    */
    getStars: function() {
        let starString = '';
        for(let i = 0; i < this.stars; i++) {
            starString += ' <i class="fa fa-star yellow"></i> ';
        }
        return starString;
    },

    /*
    * @description increment the move counter by 1.
    */
    incrementMoves() {
        this.moves++;
        document.getElementsByClassName('moves')[0].innerHTML = this.moves;
        this.drawStars();
    },

    /*
    * @description Update the stars in the dom based on the number of moves.
    */
    drawStars() {
        if (this.moves > 12 && this.stars === 3 ) {
            --this.stars;
            this.starContainer.innerHTML = this.getStars();
        }
        if (this.moves > 17 && this.stars === 2 ) {
            --this.stars;
            this.starContainer.innerHTML = this.getStars();
        }
    },

    /*
    * @description reset the move counter to 0 and update the dom.
    */
    resetMoves() {
        this.moves = 0;
        document.getElementsByClassName('moves')[0].innerHTML = this.moves;
    },

    /*
    * @description reset the number of stars to the initial value of 3.
    */
    resetStars() {
        if (this.stars !== 3) {
            this.starContainer.innerHTML = '';
            for(let i = 0; i < 3; i++) {
                let star = document.createElement('li');
                star.classList.add('fa', 'fa-star', 'yellow');
                this.starContainer.appendChild(star);
            }
            this.stars = 3;
        }
    },

    /*
    * @description if it's a new record, add the current moves and time to localStorage.
    */
    addResultToLocaStorage() {
        let moveRecord = window.localStorage.getItem('moveRecord');
        if (! moveRecord) {
            localStorage.setItem('moveRecord', this.moves);
            localStorage.setItem('timeRecord', this.stopwatch.times);
        } else {
            if (moveRecord > this.moves) {
                // last game was a new PB
                localStorage.setItem('moveRecord', this.moves);
                localStorage.setItem('timeRecord', this.stopwatch.times);
            }
        }
    },
    /*
    * @description getter for the 16 card objects in the model.
    */
    getCards() {
        return model.cards;
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
                controller.startTime();
            });
            //add the card to the DocumentFragment
            memoryCards.appendChild(li);
        });
        return memoryCards;
    },

    /*
    * @description start the watch if it is running.
    */
    startTime: function() {
        if (!this.stopwatch.running) {
            this.stopwatch.start();
        }
    },

    /*
    * @description open a card an show it's image.
    * then compare the image to the last opened card
    * @param {domElement} card - a html li (card) element
    */
    showCard: function(card) {
        if (card.classList.contains('show')){
            return;
        }
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
        this.incrementMoves();
        if (card.dataset.symbol === this.currentCard.dataset.symbol) {
            //match case
            this.finishedCards.push(card, this.currentCard);
            this.currentCard = null;
            if (this.finishedCards.length === 16) {
                window.requestAnimationFrame(function(){
                    controller.stopwatch.stop();
                    controller.addResultToLocaStorage();
                    gameView.updateMoveRecord();
                    gameView.showModalDialog();
                });

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
    /*
    * @description reference to the deck element in the dom.
    */
    deck: document.getElementsByClassName('deck')[0],

    dialog: new window.mdc.dialog.MDCDialog(document.querySelector('#finish-game-dialog')),

    finishGameDialogPb: document.getElementsByClassName('finish-game-dialog--pb')[0],

    finishGameDialogMoves:  document.getElementsByClassName('finish-game-dialog--moves')[0],

    finishGameDialogTime: document.getElementsByClassName('finish-game-dialog--time')[0],

    finishGameDialogStars: document.getElementsByClassName('finish-game-dialog--starrating')[0],

    /*
    * @description initialize evereything on the page like adding the cards
    * and register the necessary event listener for the restart button.
    * @param {DocumentFragment} memoryCards - a DocumentFragment, containig all the cards as html li elements
    */
    init: function(memoryCards) {
        this.displayCards(memoryCards);
        this.resetModalDialogText();
        let restartButton = document.getElementsByClassName('restart')[0];

        restartButton.addEventListener('click', function(){
            controller.init();
        });

        this.dialog.listen('MDCDialog:accept', function() {
            controller.init();
        });

        this.updateMoveRecord();

    },

    /*
    * @description reset the modal dialog pb section, because it's not sure
    * the next round is a PB.
    */
    resetModalDialogText: function() {
        this.finishGameDialogPb.innerHTML = '';
    },

    /*
    * @description displays the cards on the page.
    * @param {DocumentFragment} memoryCards - a DocumentFragment, containig all the cards as html li elements
    */
    displayCards: function(memoryCards) {
        if (this.deck.children.length > 0) {
            //remove the 'old' cards
            this.deck.innerHTML = '';
        }
        this.deck.appendChild(memoryCards);
    },

    /*
    * @description displays modal dialog when the user finished the game.
    */
    showModalDialog: function() {
        let moveRecord = window.localStorage.getItem('moveRecord');
        if (moveRecord >= controller.moves) {
            this.finishGameDialogPb.innerHTML = '<h3>👏 YOU MADE A NEW RECORD, AWESOME! 🥇</h3>';
        }
        this.finishGameDialogMoves.innerHTML = controller.moves;
        this.finishGameDialogTime.innerHTML = controller.stopwatch.format(controller.stopwatch.times);
        this.finishGameDialogStars.innerHTML = 'Star Rating: ' + controller.stars + ' Stars' + controller.getStars();
        this.dialog.show();
    },

    /*
    * @description updates the PB section in the dom with the new record.
    */
    updateMoveRecord: function() {
        let moveRecord = window.localStorage.getItem('moveRecord');
        let timeRecord = window.localStorage.getItem('timeRecord');
        let personalRecord = document.getElementsByClassName('personal-record')[0];
        if (!moveRecord) {
            personalRecord.innerHTML = 'PB: -';
        } else {
            timeRecord = timeRecord.split(',');
            let recordText = 'PB: <span class="red">' + moveRecord + ' Moves</span> in <span class="red">' + timeRecord[0] + ':' + timeRecord[1] + ':' + timeRecord[2].substring(0,4) + '</span>';
            personalRecord.innerHTML = recordText;
        }
    },
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