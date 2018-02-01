// Initialize Firebase
var config = {
    apiKey: "AIzaSyCslpdmM8wX_Dao5Ed4DaOHUp6oXLKEISQ",
    authDomain: "batman-superman-velociraptors.firebaseapp.com",
    databaseURL: "https://batman-superman-velociraptors.firebaseio.com",
    projectId: "batman-superman-velociraptors",
    storageBucket: "batman-superman-velociraptors.appspot.com",
    messagingSenderId: "1040495803238"
};
firebase.initializeApp(config);

var database = firebase.database();

// ========== Variable Declaration ===========

var p1Choice;
var p2Choice;
//wins, losses
var p1Stats = [0, 0];
var p2Stats = [0, 0];

var p1HasChosen = false;
var p2HasChosen = false;

var playerName;


var thisPlayer;
var joined = false;

//have to set occupied = false when someone leaves
//push the value to of the person to p1Data, which gets deleted when they leave?

// ========== Stuff ===========

tryJoinGame();

// ========== Database Updates ===========

//called on page load and whenever a value in the DB changes
database.ref().on('value', function(snapshot) {
    //set local variables and visuals from the database 
    
    //if someone is connected to p1, show their data
    if(snapshot.child('/p1Data/connection').exists()) {

    }

});

// ========== On-Click Functions ===========

$('#name-btn').on('click', function(event) {
    event.preventDefault();


});

$('.p1-choice').on('click', function() {
    p1Choice = $(this).attr('alt');
    p1HasChosen = true;

    tryProcessGame();
});

$()

$('#chat-btn').on('click', function(event) {
    event.preventDefault();

  
});

// ========== Game Logic ===========

function tryJoinGame() {
    //check if p1 is occupied
    if(!database.ref('/p1Data').child('occupied')) {

    }
    //if not, p1 = occupied
    //this player = p1, locally
    //else try same thing for p2
}

function tryProcessGame() {
    if (p1HasChosen && p2HasChosen) {
        var winner = getWinner();
    }
}

//returns 0 for tie, 1 for p1, 2 for p2
function getWinner() {
    if(p1Choice === p2Choice) {
        return 0;
    
    } else if(p1Choice === 'Batman') {
        if(p2Choice === 'Superman') { return 1; }
        else if(p2Choice === 'Velociraptors') { return 2; }
    
    } else if(p1Choice === 'Superman') {
        if(p2Choice === 'Superman') { return 1; }
        else if(p2Choice === 'Velociraptors') { return 2; }
    
    } else if(p1Choice === 'Velociraptors') {
        if(p2Choice === 'Superman') { return 1; }
        else if(p2Choice === 'Velociraptors') { return 2; }
    
    } else {
        //throw error
    }
}


// ========== UI Update Functions ===========

//update each player's stats after every round
function updateStats() {
  $('#player1-stats').text('Wins: ' + p1Stats[0] + ' Losses: ' + p1Stats[1]);
  $('#player2-stats').text('Wins: ' + p2Stats[0] + ' Losses: ' + p2Stats[1]);
}

function showPlayerName() {

}