$(document).ready(initializeGame);

let card_game;

function initializeGame() {
    card_game = new Game();
    card_game.initialize();
}

class Game{
    constructor(){
        this.cardImages = [
            "./images/mano.png",
            "./images/dragon.png",
            "./images/pig.png",
            "./images/snail.png",
            "./images/slime.png",
            "./images/whale.png",
            "./images/mushroom.png",
            "./images/stumpy.png",
            "./images/zombie.png",
        ];
        
        this.cardImages = this.cardImages.concat(this.cardImages);
        this.first_card_clicked = null;/* if this is null, it's the first card to be compared later */
        this.second_card_clicked = null;
        this.clickable = true;
        this.total_possible_matches = 9;
        this.match_counter = 0;/* when this reaches 9, the user wins the game */
        this.matches = 0; /* increment by 1 every time the application finds a match */
        this.attempts = 0; /* increment by 1 every time user clicks the 2nd card */
        this.accuracy = 0; /* matches/attempts  */
        this.games_played = 0; /* increment by 1 when the reset button is clicked  */
        
        this.backgroundMusic = new Audio('./sounds/theme.mp3');
        this.clickSound = new Audio('./sounds/sound.wav');
        this.matchedSound = new Audio('./sounds/matched.mp3');
        this.soundOn = false;
    }

    initialize(){
        this.displayCards(this.cardImages);
        this.display_stats();
        this.addClickHandlers();
    }

    addClickHandlers(){
        $('.music_play').click(()=>this.playBackgroundMusic());
        $('.music_pause').click(()=>this.pauseBackgroundMusic());
        $('.sound_play').click(()=>this.enableSoundEffects());
        $('.sound_pause').click(()=>this.disableSoundEffects());
        $('.card').click(()=>this.card_clicked());
        $('button.reset').click(()=>this.reset_game());
    }

    shuffleCardsArray(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var newIndex = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[newIndex];
            array[newIndex] = temp;
        }
    }
    
    displayCards(array) {
        $('#game-area').empty();
        this.shuffleCardsArray(this.cardImages);
        this.gameArea = $('#game-area');
    
        for (var i = 0; i < array.length; i++) {
            this.cardDiv = $('<div>').addClass('card');
            this.frontImage = $('<img>').attr('src', array[i]);
            this.frontDiv = $('<div>').addClass('front');
            this.backImage = $('<img>').attr('src', "./images/leaf.png")
            this.backDiv = $('<div>').addClass('back');
            this.cardContainer = $('<div>').addClass('cardContainer');
            this.frontDiv.append(this.frontImage);
            this.cardDiv.append(this.frontDiv);
            this.backDiv.append(this.backImage);
            this.cardDiv.append(this.backDiv);
            this.cardContainer.append(this.cardDiv);
            this.gameArea.append(this.cardContainer);
        }
    };

    card_clicked() {
        if(this.clickable===false){
            return;
        }
        /* if card clicked has class of match, function doesn't run further */
        if ($(event.currentTarget).hasClass('match')) {
            return;
        }
        /* else, find element with class of back and add class hidden */
        $(event.currentTarget).find('.back').addClass('hidden');
        if (this.first_card_clicked === null) { //first card clicked
            this.first_card_clicked = event.currentTarget;
            this.soundOn ? this.clickSound.play() : null;
        /* if first_card_clicked is not null, this is a the second card */
        } else {
            this.attempts++;
            /* if user clicks on a front card twice */
            if (this.first_card_clicked === event.currentTarget) {
                return;
            }
            this.second_card_clicked = event.currentTarget;
            /* If second card's image source is the same as first's card image source */
            if ($(this.first_card_clicked).find('.front img').attr('src') === $(this.second_card_clicked).find('.front img').attr('src')) {
                this.matchedCards($(this.first_card_clicked),$(this.second_card_clicked));
                if (this.match_counter === this.total_possible_matches) {
                    setTimeout(() => {
                        this.showWinModal();
                    }, 1000);
                }
            /* if image sources do not match  */
            } else { 
                this.mismatchedCards();
            }
            this.accuracy = Math.round(this.accuracy * 100) + "%";
        }
       this.display_stats();
    }

    mismatchedCards(){
        this.soundOn ? this.clickSound.play() : null;
        this.accuracy = this.matches / this.attempts;
        this.clickable = false;
        setTimeout(() => this.timeOut(), 700);
    }
    
    matchedCards(firstCard, secondCard){
        firstCard.addClass('match');
        secondCard.addClass('match');
        firstCard.fadeOut(1000);
        secondCard.fadeOut(1000);
        this.match_counter++;
        this.matches++;
        this.accuracy = this.matches / this.attempts;
        this.first_card_clicked = null;
        this.second_card_clicked = null;
        this.soundOn ? this.matchedSound.play() : null;
    }
    
    timeOut() {
        $(this.first_card_clicked).find(".back").removeClass('hidden');
        $(this.second_card_clicked).find(".back").removeClass('hidden');
        this.first_card_clicked = null;
        this.second_card_clicked = null;
        this.clickable = true;
    }

    display_stats() {
        $('.games-played > .value').text(this.games_played);
        $('.attempts > .value').text(this.attempts);
        $('.accuracy > .value').text(this.accuracy);
        $('.matches > .value').text(this.matches);
    }

    reset_game() {
        this.first_card_clicked = null;
        this.second_card_clicked = null;
        this.accuracy = 0;
        this.matches = 0;
        this.attempts = 0;
        this.match_counter = 0;
        this.games_played++;
        this.display_stats();
        this.displayCards(this.cardImages);
        $('.card').click(() => this.card_clicked());
    }

    showWinModal(){
        this.modal = document.getElementById('winModal')
        this.span = document.getElementsByClassName("close")[0];
        /*display modal*/
        this.modal.style.display = "block";
        /* exit modal when click on x */
        this.span.onclick = () => {
            this.modal.style.display = "none";
            this.reset_game();
        }
        /* exit modal when click anywhere outside of modal  */
        window.onclick = (event) => {
              if (event.target == this.modal) {
                  this.modal.style.display = "none";
                  this.reset_game();
              }
        }  
    }

    playBackgroundMusic(){
        this.backgroundMusic.play();
        $('.music_play').addClass('hidden');
        $('.music_pause').removeClass('hidden');
    };
    
    pauseBackgroundMusic(){
        this.backgroundMusic.pause();
        $('.music_play').removeClass('hidden');
        $('.music_pause').addClass('hidden');
    };
    
    disableSoundEffects(){
        this.soundOn = false;
        $('.sound_play').removeClass('hidden');
        $('.sound_pause').addClass('hidden');
    };
    
    enableSoundEffects(){
        this.soundOn = true;
        $('.sound_play').addClass('hidden');
        $('.sound_pause').removeClass('hidden');
    };
}

