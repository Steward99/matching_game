class AudioMusic{
    constructor(){
        this.bgMusic = new Audio('source/sound/creepy.mp3');
        this.bgMusic.volume = 0.5;
        this.bgMusic.loop = true;
        this.flipSound = new Audio('source/sound/flip.wav');
        this.matchedSound = new Audio('source/sound/matched.wav');
        this.gameOverSound = new Audio('source/sound/gameover.wav');
        this.victorySound = new Audio('source/sound/victory.wav');
    }
    startMusic(){
        this.bgMusic.play();
    }
    stopMusic(){
        this.bgMusic.pause();
        this.bgMusic.currentTime = 0;
    }
    flippingCard(){
        this.flipSound.play();
    }
    matchedCard(){
        this.matchedSound.play();
    }
    gameOver(){
        this.stopMusic();
        this.gameOverSound.play();
    }
    victory(){
        this.stopMusic();
        this.victorySound.play();
    }
}


class MatchOrLose{
    constructor(totalTime,cards){
        this.cardsArray = cards;
        this.totalTime = totalTime;
        this.timeRemaining = totalTime;
        this.timer = document.getElementById('game-time');
        this.flicker = document.getElementById('game-flips');
        this.playAudio = new AudioMusic();
    }
    startGame(){
        this.cardToCheck = null;
        this.timeRemaining = this.totalTime;
        this.matchedCards = [];
        this.totalFlicks = 0;
        this.busy = true;

        setTimeout(()=>{
            this.playAudio.startMusic();
            this.countDown = this.startcoundDown();
            this.shuffleCard();
            this.busy = false;
        },500);
            this.hideCard(); 
            this.timer.innerText = this.timeRemaining;
            this.flicker.innerText = this.totalFlicks;
        
    }

    canFlipCard(card){
            return !this.busy && !this.matchedCards.includes(card) && card !== this.cardToCheck;
    }

    shuffleCard(){
        for(let i = this.cardsArray.length -1; i > 0 ; i--){
            let randomIndex = Math.floor(Math.random()*(i+1));
            this.cardsArray[randomIndex].style.order = i;
            this.cardsArray[i].style.order = randomIndex;
        }
    }

    startcoundDown(){
        return setInterval(()=>{
            this.timeRemaining--;
            this.timer.innerText = this.timeRemaining;
            if(this.timeRemaining === 0){
                this.gameOver();
            }
        },1000);
    }

    flipCard(card){
        if(this.canFlipCard(card)){
            this.playAudio.flippingCard();
            this.totalFlicks++;
            this.flicker.innerText = this.totalFlicks;
            card.classList.add('visible');

            if(this.cardToCheck)
                this.cardToMatched(card);
            else
                this.cardToCheck = card;
            
        }
    }

    cardToMatched(card){
        if(this.getCardType(card) === this.getCardType(this.cardToCheck))
            this.cardMatches(card, this.cardToCheck);
        else 
            this.cardMiss(card, this.cardToCheck);

        this.cardToCheck = null;
    }

    cardMatches(card1, card2){
        this.matchedCards.push(card1);
        this.matchedCards.push(card2);
        card1.classList.add('matched');
        card2.classList.add('matched');
        this.playAudio.matchedCard();
        if(this.matchedCards.length === this.cardsArray.length)
            this.victory();
    }

    cardMiss(card1, card2){
        this.busy = true;
        setTimeout(()=>{
            card1.classList.remove('visible');
            card2.classList.remove('visible');
            this.busy = false;
        },1000);
    }

    getCardType(card){
        return card.getElementsByClassName('card-img')[0].src;
    }

    hideCard(){
        this.cardsArray.forEach(card=>{
            card.classList.remove('visible');
            card.classList.remove('matched');
        });
    }

    gameOver(){
        clearInterval(this.countDown);
        this.playAudio.gameOver();
        document.getElementById('game-over-page').classList.add('visible');
    }

    victory(){
        clearInterval(this.countDown);
        this.playAudio.victory();
        document.getElementById('victory-page').classList.add('visible');
    }
    
}

function ready(){
    let overlays = Array.from(document.getElementsByClassName('overlay-page'));
    let cards = Array.from(document.getElementsByClassName('card'));
    let game = new MatchOrLose(60, cards);

    overlays.forEach(overlay => {
        overlay.addEventListener('click',()=>{
            overlay.classList.remove('visible');
            game.startGame();
            });
        });

    cards.forEach(card => {
        card.addEventListener('click', () => {
            game.flipCard(card);
        });
    });
}


if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', ready());
} else {
    ready();
}

