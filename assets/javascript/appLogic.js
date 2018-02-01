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

var pChoice;

var pHasChosen = false;

var playerName;


var thisPlayer;
var joined = false;

//have to set occupied = false when someone leaves
//push the value to of the person to p1Data, which gets deleted when they leave?

// ========== Stuff ===========

//tryJoinGame();

// ========== Database Updates ===========

//called on page load and whenever a value in the DB changes
database.ref().on('value', function(snapshot) {
    console.log(snapshot.val());
    //set local variables and visuals from the database 
    
    //if someone is connected to p1, show their data
    if(snapshot.val().p1Data.occupied) {

    }

});

// database.ref('p1Data/wins').on('value', function(snapshot) {

// });

// ========== On-Click Functions ===========

$('#name-btn').on('click', function(event) {
    event.preventDefault();

    playerName = $('#name-input').val().trim();
    if(playerName != '') {
       tryJoinGame();
    }
});

$('.p1-choice').on('click', function() {
    setPlayerChoice($(this).attr('alt'));
    tryProcessGame();
});

$()

$('#chat-btn').on('click', function(event) {
    event.preventDefault();

  
});

// ========== Game Logic ===========

//try to join as p1. If that fails, try to join as p2.
function tryJoinGame() {
    tryJoinAsPlayer(1);
    if(!joined) { tryJoinAsPlayer(2); }
}

//tries to enter the given player slot. If it's already occupied, fails.
function tryJoinAsPlayer(slotNumber) {   
    database.ref('/p' + slotNumber + 'Data').once('value', function(snapshot) {
        //check if the slot is occupied
        if(!snapshot.val().occupied) {
            
            joined = true;

            //add the player's data to the DB
            database.ref('/p' + slotNumber + 'Data').set({
                name: playerName,
                occupied: true,
                wins: 0,
                losses: 0,
                choice: ''
            });
            
            //reset player slot when the player disconnects
            database.ref('/p' + slotNumber + 'Data').onDisconnect().set({
                name: "",
                occupied: false,
                wins: 0,
                losses: 0,
                choice: ''
            });

            //set the player's number locally
            playerNum = slotNumber;
        }
    });
}

function setPlayerChoice(choice) {
    pChoice = choice;
    pHasChosen = true;
}

function tryProcessGame() {
    if (p1HasChosen && p2HasChosen) {
        var winner = getWinner();
    }
}

//returns 0 for tie, 1 for p1, 2 for p2
function getWinner() {
    var p1Choice = '';
    var p2Choice = '';

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
    var p1Stats;
    var p2Stats;
    $('#player1-stats').text('Wins: ' + p1Stats[0] + ' Losses: ' + p1Stats[1]);
    $('#player2-stats').text('Wins: ' + p2Stats[0] + ' Losses: ' + p2Stats[1]);
}

function showPlayerName() {

}