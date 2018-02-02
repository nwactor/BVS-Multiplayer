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
var playerNum;

var joined = false;

//have to set occupied = false when someone leaves
//push the value to of the person to p1Data, which gets deleted when they leave?

// ========== Stuff ===========

//tryJoinGame();

// ========== Database Updates ===========

//called on page load and whenever a value in the DB changes,
//the main function that keeps the page up to date
database.ref().on('value', function(snapshot) {
    console.log(snapshot.val());
    var state = snapshot.val();

    //Update Info Message


    //Update Player Info
    updatePlayerInfo(state.p1Data, 1);
    updatePlayerInfo(state.p2Data, 2);

    //Update Chat Log

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
    if(joined) {
        $('#name-display').text('Welcome ' + playerName + '. You are Player ' + playerNum + '.');
        $('#join-display').hide();
    }
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

function updatePlayerInfo(playerState, num) {
    if(playerState.occupied) {
        //show name
        $('#player' + num + '-name').text(playerState.name);
        //show choice
        if(playerState.choice === '') {
            $('#player' + num + '-choice').hide();
            //if the client is in this player slot, show their choices
            if(playerNum === num) {
                $('#player' + num + '-options').show();
            }
        } else {
            //if the round has gone:
                //show choice
            //else
                //show choice if playerNum === num
        }
    
    } else {
        //reset name to default
        $('#player' + num + '-name').text('Waiting for Player ' + num);
        //hide player choice
        $('#player' + num + '-choice').hide();
        $('#player' + num + '-options').hide();
    }
    
    //show stats (will be 0 if slot is unoccupied)
    updateStats(num, playerState.wins, playerState.losses);
}

//update each player's stats after every round
function updateStats(player, wins, losses) {
    $('#player' + player + '-stats').text('Wins: ' + wins + ' Losses: ' + losses);
    // $('#player2-stats').text('Wins: ' + p2Stats[0] + ' Losses: ' + p2Stats[1]);
}

function showChatMessage() {

}