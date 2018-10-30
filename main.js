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

var first_card_clicked = null;//if this is null, it's the first card to be compared later
var second_card_clicked = null;
var total_possible_matches = 9;
var match_counter = 0;//when this reaches 9, the user wins the game
var matches = 0; //increment by 1 every time the application finds a match
var attempts = 0; //incremebt by 1 every time user clicks the 2nd card
var accuracy = 0; //matches/attempts
var games_played = 0; //increment by 1 when the reset button is clicked

const backgroundMusic = new Audio('theme.mp3');
const clickSound = new Audio('sound.wav');
const audio = new Audio('sound.flac');
const win = new Audio('win.mp3');

function initializeApp() {
    $('.play').click(playBackgroundMusic);
    $('.pause').click(pauseBackgroundMusic);
    displayCards(cardImages);
    $('.card').click(card_clicked);
    var reset = $('button.reset');
    reset.click(reset_stats);
    $('.win').fadeOut(0); //fades out the YOU WON message
    display_stats(); //display stats so that stats boxes do not change size when the user starts playing
    // $('.logo').click(function () { //reloads the page when a user clicks on the MapleStory logo
    //     location.reload(true);
    // });
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

        var frontImage = $('<img>', {
            src: array[i]
        });
        var frontDiv = $('<div>').addClass('front');
        frontDiv.append(frontImage);
        cardDiv.append(frontDiv);

        var backImage = $('<img>', {
            src: "./images/leaf.png"
        });
        var backDiv = $('<div>').addClass('back');
        backDiv.append(backImage);
        cardDiv.append(backDiv);

        var cardContainer = $('<div>').addClass('cardContainer');
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
        clickSound.play();
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
                showWinModal();
                setTimeout(function () {
                    win.play();
                    $('.win').fadeIn(1000);
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
    clickSound.play();
    accuracy = matches / attempts;
    $('.card').off('click',card_clicked);
    setTimeout(timeOut, 700);
}

function matchedCards(firstCard, secondCard){
    audio.play();
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
    $('.card').click(card_clicked); //re-attaches clickhandler to .card
}

function display_stats() {
    $('.games-played > .value').text(games_played);
    $('.attempts > .value').text(attempts);
    $('.accuracy > .value').text(accuracy);
    $('.matches > .value').text(matches);
}

function reset_stats() {
    $('.win').fadeOut(0); //make the YOU WON texts go away
    accuracy = 0;
    matches = 0;
    attempts = 0;
    games_played += 1;
    display_stats();
    displayCards(cardImages);
    $('.card').click(card_clicked);
}

function showWinModal(){
    console.log('Win Modal');
    var modal = document.getElementById('winModal')
    var span = document.getElementsByClassName("close")[0];
    modal.style.display = "block";//display modal
    span.onclick = function() {//exit modal when click on x
          modal.style.display = "none";
    }
    window.onclick = function(event) {//exit modal when click anywhere outside of modal
          if (event.target == modal) {
              modal.style.display = "none";
          }
    }  
}

function playBackgroundMusic() {
    backgroundMusic.play();
};

function pauseBackgroundMusic() {
    backgroundMusic.pause();
};