$(document).ready(initializeApp);

function initializeApp() {
    $('.card').click(card_clicked);
    var reset = $('button.reset');
    reset.click(reset_stats);
}

var first_card_clicked = null;
var second_card_clicked = null;
var total_possible_matches = 9;
var match_counter = 0;
var matches = 0; //increment by 1 every time the application finds a match
var attempts = 0; //incremebt by 1 every time user clicks the 2nd card
var accuracy = ""; //matches/attempts
var games_played = 0; //increment by 1 when the reset button is clicked


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
            }

        } else {//if image sources do not match
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
    accuracy = 0; //good
    matches = 0; //good
    attempts = 0; //good
    games_played += 1; //good
    display_stats();

    $('.back').removeClass('hidden'); //show the back cards again
    $('.card').fadeIn(100);
    $('.card').removeClass('match'); //so that when you reset, you can flip cards that were matched from previous game
}