$(document).ready(initializeApp);

var cardImages = [
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

cardImages = cardImages.concat(cardImages);

var first_card_clicked = null;//if this is null, it's the first card to be compared later
var second_card_clicked = null;
var total_possible_matches = 9;
var match_counter = 0;//when this reaches 9, the user wins the game
var matches = 0; //increment by 1 every time the application finds a match
var attempts = 0; //increment by 1 every time user clicks the 2nd card
var accuracy = 0; //matches/attempts
var games_played = 0; //increment by 1 when the reset button is clicked

const backgroundMusic = new Audio('./sounds/theme.mp3');
const clickSound = new Audio('./sounds/sound.wav');
const matchedSound = new Audio('./sounds/matched.mp3');
const win = new Audio('win.mp3');
var soundOn = true;

function initializeApp() {
    $('.music_play').click(playBackgroundMusic);
    $('.music_pause').click(pauseBackgroundMusic);
    $('.sound_play').click(enableSoundEffects);
    $('.sound_pause').click(disableSoundEffects);
    displayCards(cardImages);
    $('.card').click(card_clicked);
    $('button.reset').click(reset_game);
    display_stats(); //display stats so that stats boxes do not change size when the user starts playing
}

function shuffleCardsArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var newIndex = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[newIndex];
        array[newIndex] = temp;
    }
}

function displayCards(array) {
    $('#game-area').empty();
    shuffleCardsArray(cardImages);
    var gameArea = $('#game-area');

    for (var i = 0; i < array.length; i++) {
        var cardDiv = $('<div>').addClass('card');
        var frontImage = $('<img>').attr('src', array[i]);
        var frontDiv = $('<div>').addClass('front');
        var backImage = $('<img>').attr('src', "./images/leaf.png")
        var backDiv = $('<div>').addClass('back');
        var cardContainer = $('<div>').addClass('cardContainer');
        frontDiv.append(frontImage);
        cardDiv.append(frontDiv);
        backDiv.append(backImage);
        cardDiv.append(backDiv);
        cardContainer.append(cardDiv);
        gameArea.append(cardContainer);
    }
};

function card_clicked() {
    //if card clicked has class of match, function doesn't run further
    if ($(event.currentTarget).hasClass('match')) {
        return;
    }
    //else, find element with class of back and add class hidden
    $(event.currentTarget).find('.back').addClass('hidden');
    if (first_card_clicked === null) { //first card clicked
        first_card_clicked = $(event.currentTarget);
        debugger;
        soundOn ? clickSound.play() : null;
    } else { //if first_card_clicked is not null, this is a the second card
        attempts += 1;
        if (first_card_clicked[0] === event.currentTarget) {//if user clicks on a front card twice
            return;//disable further card comparison
        }
        second_card_clicked = $(event.currentTarget);
        //If second card's image source is the same as first's card image source
        if (first_card_clicked.find('.front img').attr('src') === second_card_clicked.find('.front img').attr('src')) {
            matchedCards(first_card_clicked,second_card_clicked);
            if (match_counter === total_possible_matches) {
                setTimeout(function () {
                    showWinModal();
                }, 1000);
            }
        } else { //if image sources do not match
            mismatchedCards();
        }
        accuracy = Math.round(accuracy * 100) + "%";
    }
    display_stats();
}

function mismatchedCards(){
    soundOn ? clickSound.play() : null;
    accuracy = matches / attempts;
    $('.card').off('click',card_clicked);
    setTimeout(timeOut, 700);
}

function matchedCards(firstCard, secondCard){
    soundOn ? matchedSound.play() : null;
    firstCard.addClass('match');
    secondCard.addClass('match');
    firstCard.fadeOut(1000);
    secondCard.fadeOut(1000);
    match_counter += 1;
    matches++;
    accuracy = matches / attempts;
    first_card_clicked = null;//reset first_card_clicked for future match comparisoin
    second_card_clicked = null;
}

function timeOut() {
    $(first_card_clicked).find(".back").removeClass('hidden');
    $(second_card_clicked).find(".back").removeClass('hidden');
    first_card_clicked = null;
    second_card_clicked = null;
    $('.card').click(card_clicked); //re-attaches clickhandler to cards
}

function display_stats() {
    $('.games-played > .value').text(games_played);
    $('.attempts > .value').text(attempts);
    $('.accuracy > .value').text(accuracy);
    $('.matches > .value').text(matches);
}

function reset_game() {
    accuracy = 0;
    matches = 0;
    attempts = 0;
    match_counter = 0;
    games_played += 1;
    display_stats();
    displayCards(cardImages);
    $('.card').click(card_clicked);
}

function showWinModal(){
    var modal = document.getElementById('winModal')
    var span = document.getElementsByClassName("close")[0];
    modal.style.display = "block";//display modal
    span.onclick = function() {//exit modal when click on x
          modal.style.display = "none";
          reset_game();
    }
    window.onclick = function(event) {//exit modal when click anywhere outside of modal
          if (event.target == modal) {
              modal.style.display = "none";
              reset_game();
          }
    }  
}

function playBackgroundMusic() {
    backgroundMusic.play();
    $('.music_play').addClass('hidden');
    $('.music_pause').removeClass('hidden');
};

function pauseBackgroundMusic() {
    backgroundMusic.pause();
    $('.music_play').removeClass('hidden');
    $('.music_pause').addClass('hidden');
};

function disableSoundEffects(){
    soundOn = false;
    $('.sound_play').removeClass('hidden');
    $('.sound_pause').addClass('hidden');
};

function enableSoundEffects(){
    soundOn = true;
    $('.sound_play').addClass('hidden');
    $('.sound_pause').removeClass('hidden');
};

