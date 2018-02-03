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

var roundActive;

var playerName;
var playerNum;
var pHasChosen = false;

var joined = false;

var chatCache = [];

// ========== Database Updates ===========

//called on page load and whenever a value in the DB changes,
//the main function that keeps the page up to date
database.ref().on('value', function(snapshot) {
    var state = snapshot.val();

    //Update Game Info
    roundActive = state.roundData.roundActive;
    var currentWinner = state.roundData.currentWinner;
    if(!roundActive) { showEndRoundMessage(currentWinner); }

    //Update Info Message


    //Update Player Info
    updatePlayerInfo(state, 1);
    updatePlayerInfo(state, 2);

    //Update Chat Log
    updateChatLog(state.chatLog);
});

// ========== On-Click Functions ===========

$('#name-btn').on('click', function(event) {
    event.preventDefault();

    playerName = $('#name-input').val().trim();
    if(playerName != '') {
       tryJoinGame();
    }
});

$('.p-choice').on('click', function() {
    if(! pHasChosen) {
        setPlayerChoice($(this).attr('alt'), playerNum);
        tryProcessGame();
    }
});

$('#restart-btn').on('click', function(event) {
    pHasChosen = false;
    $('#restart-btn').hide();
    $('#result-banner').hide();

    database.ref('/roundData/roundActive').set(true);
    database.ref('/roundData/currentWinner').set(0);
});

$('#chat-btn').on('click', function(event) {
    event.preventDefault();

    if(playerName != undefined) {
        var message = $('#chat-input').val().trim();
        if(message != ('')) {
            database.ref('/chatLog').push(playerName + ': ' + message);
        }
    }
});

// ========== Game Logic ===========

function tryProcessGame() {
    if(!roundActive) {return;}

    //A hacky way (due to time constraint) to get all the necessary data from the
    //database in a format that can be used to set wins/losses in the DB easily
    var p1Choice;
    var p1Stats = [];
    
    var p2Choice;
    var p2Stats = [];

    var fullStats = [null, p1Stats, p2Stats];

    database.ref().once('value', function(snapshot) {
        p1Choice = snapshot.val().p1Data.choice;
        p1Stats[0] = snapshot.val().p1Data.wins;
        p1Stats[1] = snapshot.val().p1Data.losses;
        
        p2Choice = snapshot.val().p2Data.choice;
        p2Stats[0] = snapshot.val().p2Data.wins;
        p2Stats[1] = snapshot.val().p2Data.losses;
    });
    

    //if both players have moved
    if(p1Choice != '' && p2Choice != '') {
        var winner = getWinner(p1Choice, p2Choice);
        
        if(winner != 0) { //not a tie
            var loser;
            if(winner === 1) { loser = 2; } 
            else { loser = 1; }
            //update database with scores
            var updatedWins = ++(fullStats[winner][0]);
            var updatedLosses = ++(fullStats[loser][1]);

            database.ref('/p' + winner + 'Data/wins').set(updatedWins);
            database.ref('/p' + loser + 'Data/losses').set(updatedLosses);
        }
        finishRound(winner);
    }
    //otherwise still waiting, do nothing
}

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
            //player's number must be set locally
            //before the DB's values are set because
            //that updates the UI, which the local number is needed for.
            playerNum = slotNumber;

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
        }
    });
}

function setPlayerChoice(choice, slotNumber) {
    //update DB
    database.ref('/p' + slotNumber + 'Data/choice').set(choice);
    pHasChosen = true;
}

//returns 0 for tie, 1 for p1, 2 for p2
function getWinner(p1Choice, p2Choice) {
    if(p1Choice === p2Choice) {
        return 0;
    
    } else if(p1Choice === 'Batman') {
        if(p2Choice === 'Superman') { return 1; }
        else if(p2Choice === 'Velociraptors') { return 2; }
    
    } else if(p1Choice === 'Superman') {
        if(p2Choice === 'Batman') { return 2; }
        else if(p2Choice === 'Velociraptors') { return 1; }
    
    } else if(p1Choice === 'Velociraptors') {
        if(p2Choice === 'Superman') { return 2; }
        else if(p2Choice === 'Batman') { return 1; }
    
    } else {
        //throw error
    }
}

function finishRound(winner) {
    database.ref('/roundData/currentWinner').set(winner);
    database.ref('/roundData/roundActive').set(false);
    database.ref('/p1Data/choice').set('');
    database.ref('/p2Data/choice').set('');
}

// ========== UI Update Functions ===========

function updatePlayerInfo(state, num) {
    var playerState;
    if(num === 1) { playerState = state.p1Data; }
    else { playerState = state.p2Data; }

    // $('#p1-visible-message').hide();
    // $('#p2-visible-message').hide();

    if(playerState.occupied) {
        //show name
        $('#player' + num + '-name').text(playerState.name);
        
        //show choices if player has not yet made a decision
        if(playerState.choice === '' && state.roundData.roundActive) {
            $('#player' + num + '-choice').hide();
            //if the client is in this player slot, show their choices
            if(playerNum === num) {
                $('#player' + num + '-options').show();
            }

        //show the appropriate thing when this player's decision has been made
        } else {

            var imgPath = './assets/images/';
            
            //show the choice if playerNum === num
            //or show choice for either player if the round is over
            if(playerNum === num || (state.p1Data.choice != '' && state.p2Data.choice != '')){
                $('#player' + num + '-choice').attr('src', (imgPath + playerState.choice.toLowerCase() + '.jpg'));
                $('#player' + num + '-choice').attr('alt', playerState.choice);
                $('#player' + num + '-options').hide();
                $('#player' + num + '-choice').show();
            } 

            //show the notification that the opposite player has made a decision
            // else {
            //     if(playerNum === 1) { $('#p2-visible-message').show(); }
            //     else { $('#p1-visible-message').show(); }
            // }        
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
}

function updateChatLog(chatLog) {
    for(var message in chatLog) {
        if(chatLog.hasOwnProperty(message)) {
            if(message != 'dummy' && !chatCache.includes(chatLog[message])) {
                var messageDisplay = $('<p>');
                messageDisplay.text(chatLog[message]);
                $('#chat-log').append(messageDisplay);

                //stop the same message from appearing more than once...
                //not a good solution, but better than nothing
                chatCache.push(chatLog[message]);
            }
        }
    }
}

function showEndRoundMessage(winner) {
    var endRoundMessage;
    if(winner === 0) { endRoundMessage = "It's a tie!"; }
    else { endRoundMessage = 'Winner is Player ' + winner + '!'; }
    $('#result-banner').text(endRoundMessage);
    $('#result-banner').show();
    if(joined) {
        $('#restart-btn').show();
    }
}