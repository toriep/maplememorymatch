$(document).ready(initializeApp);

let game1;

function initializeApp() {
    game1 = new Game();
    game1.initialize();
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
        this.first_card_clicked = null;//if this is null, it's the first card to be compared later
        this.second_card_clicked = null;
        this.total_possible_matches = 9;
        this.match_counter = 0;//when this reaches 9, the user wins the game
        this.matches = 0; //increment by 1 every time the application finds a match
        this.attempts = 0; //increment by 1 every time user clicks the 2nd card
        this.accuracy = 0; //matches/attempts
        this.games_played = 0; //increment by 1 when the reset button is clicked
        
        this.backgroundMusic = new Audio('./sounds/theme.mp3');
        this.clickSound = new Audio('./sounds/sound.wav');
        this.clickSound.volume = 0.55;
        this.matchedSound = new Audio('./sounds/matched.mp3');
        this.matchedSound.playbackRate = 1.5;
        this.win = new Audio('./sounds/win.mp3');
        this.soundOn = true;
    }
    initialize(){
        $('.music_play').click(()=>this.playBackgroundMusic());
        $('.music_pause').click(()=>this.pauseBackgroundMusic());
        $('.sound_play').click(()=>this.enableSoundEffects());
        $('.sound_pause').click(()=>this.disableSoundEffects());
        this.displayCards(this.cardImages);
        $('.card').click(()=>this.card_clicked());
        $('button.reset').click(()=>this.reset_game());
        this.display_stats(); //display stats so that stats boxes do not change size when the user starts playing
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
        //if card clicked has class of match, function doesn't run further
        if ($(event.currentTarget).hasClass('match')) {
            return;
        }
        //else, find element with class of back and add class hidden
        $(event.currentTarget).find('.back').addClass('hidden');
        if (this.first_card_clicked === null) { //first card clicked
            this.first_card_clicked = event.currentTarget;
            this.soundOn ? this.clickSound.play() : null;
        } else { //if first_card_clicked is not null, this is a the second card
            this.attempts += 1;
            if (this.first_card_clicked === event.currentTarget) {//if user clicks on a front card twice
                return;//disable further card comparison
            }
            this.second_card_clicked = event.currentTarget;
            //If second card's image source is the same as first's card image source
            if ($(this.first_card_clicked).find('.front img').attr('src') === $(this.second_card_clicked).find('.front img').attr('src')) {
                this.matchedCards($(this.first_card_clicked),$(this.second_card_clicked));
                if (this.match_counter === this.total_possible_matches) {
                    setTimeout(()=> {
                        this.showWinModal();
                    }, 1800);
                }
            } else { //if image sources do not match
                this.mismatchedCards();
            }
            this.accuracy = Math.round(this.accuracy * 100) + "%";
        }
       this.display_stats();
    }

    mismatchedCards(){
        this.soundOn ? this.clickSound.play() : null;
        this.accuracy = this.matches / this.attempts;
        $('.card').off('click');
        setTimeout(()=>this.timeOut(), 700);
    }
    
    matchedCards(firstCard, secondCard){
        this.soundOn ? this.matchedSound.play() : null;
        $('.card').off('click');
        setTimeout(()=>this.timeOut(), 1800);
        firstCard.addClass('match');
        secondCard.addClass('match');
        firstCard.fadeOut(1000);
        secondCard.fadeOut(1000);
        this.match_counter += 1;
        this.matches++;
        this.accuracy = this.matches / this.attempts;
        this.first_card_clicked = null;//reset first_card_clicked for future match comparisoin
        this.second_card_clicked = null;
    }
    
    timeOut() {
        $(this.first_card_clicked).find(".back").removeClass('hidden');
        $(this.second_card_clicked).find(".back").removeClass('hidden');
        this.first_card_clicked = null;
        this.second_card_clicked = null;
        $('.card').click(()=>this.card_clicked()); //re-attaches clickhandler to cards
    }
    display_stats() {
        $('.games-played > .value').text(this.games_played);
        $('.attempts > .value').text(this.attempts);
        $('.accuracy > .value').text(this.accuracy);
        $('.matches > .value').text(this.matches);
    }
    reset_game() {
        this.accuracy = 0;
        this.matches = 0;
        this.attempts = 0;
        this.match_counter = 0;
        this.games_played += 1;
        this.display_stats();
        this.displayCards(this.cardImages);
        $('.card').click(()=>this.card_clicked());
        this.win.pause();
        this.win.currentTime = 0;
    }
    showWinModal(){
        this.soundOn ? this.win.play() : null;
        this.modal = document.getElementById('winModal')
        this.span = document.getElementsByClassName("close")[0];
        this.modal.style.display = "block";//display modal
        this.span.onclick = ()=> {//exit modal when click on x
            this.modal.style.display = "none";
            this.reset_game();
        }
        window.onclick = (event)=> {//exit modal when click anywhere outside of modal
              if (event.target == this.modal) {
                  this.modal.style.display = "none";
                  this.reset_game();
              }
        }  
    }
    playBackgroundMusic() {
        this.backgroundMusic.play();
        $('.music_play').addClass('hidden');
        $('.music_pause').removeClass('hidden');
    };
    
    pauseBackgroundMusic() {
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

