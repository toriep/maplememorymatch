$(document).ready(initializeApp);

function initializeApp(){
    $('.card').click(card_clicked);
}

var first_card_clicked = null;
var second_card_clicked=null;
var total_possible_matches = 2;
var match_counter= 0;


function card_clicked(){
    $(event.currentTarget).find('.back').addClass('hidden');
    if(first_card_clicked===null){
        first_card_clicked=$(event.currentTarget);
        // return first_card_clicked??
    } else {
        if(first_card_clicked[0] === event.currentTarget){
            return;
        }
        second_card_clicked=$(event.currentTarget);

        if(first_card_clicked.find('.front img').attr('src')===second_card_clicked.find('.front img').attr('src')){
            match_counter += 1;
            first_card_clicked = null;
            second_card_clicked = null;

            if(match_counter===total_possible_matches){
                console.log('YOU WON!!!');
            }

        } else if(first_card_clicked.find('.front img').attr('src')!==second_card_clicked.find('.front img').attr('src')){
            $('.card').off();
            setTimeout(function(){
                $(first_card_clicked).find(".back").removeClass('hidden');
                $(second_card_clicked).find(".back").removeClass('hidden');
                first_card_clicked=null;
                second_card_clicked=null;
                initializeApp();
            }, 800);
        }
    }
}




// $(document).ready(initializeApp);
// var firstCardClicked = null;
// var secondCardClicked = null;
//
// function initializeApp(){
//     attachEventListener();
// }
//
// function attachEventListener(){
//     $(".card").click(handleCardClickEvent);
// }
//
// function handleCardClickEvent(){
//     firstCardClicked = event.currentTarget;
//     if(firstCardClicked===null){
//         $(event.currentTarget).addClass('hidden');
//     } else {
//         secondCardClicked = event.currentTarget;
//     }
//     if('compare first with second using the image source of the front image if first clicked === second clicked'){
//         console.log('they match or they don\'t match');
//     }
// }



