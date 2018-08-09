$(document).ready(initializeApp);
var firstCardClicked = null;
var secondCardClicked = null;

function initializeApp(){
    attachEventListener();
}

function attachEventListener(){
    $(".card").click(handleCardClickEvent);
}

function handleCardClickEvent(){
    firstCardClicked = event.currentTarget;
    if(firstCardClicked===null){
        $(event.currentTarget).addClass('hidden');
    } else {
        secondCardClicked = event.currentTarget;
    }
    if('compare first with second using the image source of the front image if first clicked === second clicked'){
        console.log('they match or they don\'t match');
    }
}



