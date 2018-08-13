$(document).ready(initializeApp);

var cardImages = [
    "./images/mano.png",
    "./images/dragon.png",
    "./images/pig.png",
    "./images/snail.png",
    "./images/slime.jpg",
    "./images/whale.png",
    "./images/mushroom.png",
    "./images/stumpy.png",
    "./images/zombie.png",
    "./images/mano.png",
    "./images/dragon.png",
    "./images/pig.png",
    "./images/snail.png",
    "./images/slime.jpg",
    "./images/whale.png",
    "./images/mushroom.png",
    "./images/stumpy.png",
    "./images/zombie.png",
];

function initializeApp() {
    displayCards(cardImages);
    $('.card').click(card_clicked);
    var reset = $('button.reset');
    reset.click(reset_stats);
    $('.win').fadeOut(0);//fades out the YOU WON message
    display_stats();//display stats so that stats boxes do not change size when the user starts playing
    $('.logo').click(function() {//reloads the page when a user clicks on the MapleStory logo
        location.reload(true);
    });
}

var first_card_clicked = null;
var second_card_clicked = null;
var total_possible_matches = 9;
var match_counter = 0;
var matches = 0; //increment by 1 every time the application finds a match
var attempts = 0; //incremebt by 1 every time user clicks the 2nd card
var accuracy = 0; //matches/attempts
var games_played = 0; //increment by 1 when the reset button is clicked

function shuffleCardsArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var newIndex = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[newIndex];
        array[newIndex] = temp;
    }
}

function displayCards(array) {
    shuffleCardsArray(cardImages);
    var gameArea = $('#game-area');

    for (var i = 0; i < array.length; i++) {
        var cardDiv = $('<div>', {
            class: 'card'
        });

        var frontImage = $('<img>', {
            src: array[i]
        });
        var frontDiv = $('<div>', {
            class: 'front'
        });
        (frontDiv).append(frontImage);
        (cardDiv).append(frontDiv);

        var backImage = $('<img>', {
            src: "./images/leaf.png"
        });
        var backDiv = $('<div>', {
            class: 'back'
        });
        (backDiv).append(backImage);
        (cardDiv).append(backDiv);

        var cardContainer = $('<div>', {
            class: 'cardContainer'
        });

        (cardContainer).append(cardDiv);
        (gameArea).append(cardContainer);
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
    } else { //2nd card clicked
        attempts += 1;
        if (first_card_clicked[0] === event.currentTarget) { //what does this line mean exactly?
            return;
        }
        second_card_clicked = $(event.currentTarget);
        //If second card's image source is the same as first's card image source
        if (first_card_clicked.find('.front img').attr('src') === second_card_clicked.find('.front img').attr('src')) {
            console.log('it\'s a match!');
            var audio = new Audio('sound.flac');
            audio.play();
            first_card_clicked.addClass('match');
            second_card_clicked.addClass('match');
            first_card_clicked.fadeOut(1000);
            second_card_clicked.fadeOut(1000);
            match_counter += 1;
            matches++;
            accuracy = matches / attempts;
            first_card_clicked = null;
            second_card_clicked = null;
            if (match_counter === total_possible_matches) {
                console.log('YOU WON!!!');
                setTimeout(function () {
                    $('.win').fadeIn(1000);
                }, 1000);
            }

        } else { //if image sources do not match
            console.log('2nd click. Cards DO NOT match!');
            accuracy = matches / attempts;

            $('.card').off();
            setTimeout(function () {
                $(first_card_clicked).find(".back").removeClass('hidden');
                $(second_card_clicked).find(".back").removeClass('hidden');
                first_card_clicked = null;
                second_card_clicked = null;
                $('.card').click(card_clicked); //What does this line do?
                $('.card').on();
            }, 400);
        }
        accuracy = Math.round(accuracy * 100) + "%";
    }
    display_stats();
}

function display_stats() {
    $('.games-played > .value').text(games_played);
    $('.attempts > .value').text(attempts);
    $('.accuracy > .value').text(accuracy);
    $('.matches > .value').text(matches);
}

function reset_stats() {
    console.log('Reset button clicked');
    $('.win').fadeOut(0); //make the YOU WON texts go away
    accuracy = 0; //good
    matches = 0; //good
    attempts = 0; //good
    games_played += 1; //good
    display_stats();
    // $('.back').removeClass('hidden'); //show the back cards again
    // $('.card').fadeIn(100); //makes the faded cards reappear
    // $('.card').removeClass('match'); //so that when you reset, you can flip cards that were matched from previous game
    $('#game-area').empty();
    displayCards(cardImages);
    $('.card').click(card_clicked);
}