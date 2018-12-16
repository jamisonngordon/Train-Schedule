var trainName;
var destination;
var firstTime;
var frequency;
var nextArrival = 0;
var minutesAway;
var database;

$(document).ready(function () {

    var config = {
        apiKey: "AIzaSyBGUbJBJdtOnjpTE-w9UgAuqehntrLbt7s",
        authDomain: "rps-multiplayer-387e3.firebaseapp.com",
        databaseURL: "https://rps-multiplayer-387e3.firebaseio.com",
        projectId: "rps-multiplayer-387e3",
        storageBucket: "rps-multiplayer-387e3.appspot.com",
        messagingSenderId: "839258280438"
    };
    firebase.initializeApp(config);

    database = firebase.database();

    $("#addButton").click(addTrain);

    database.ref().on('child_added',function (snapshot) {

        var nextArrival = calcNextArrival(snapshot.val().firstTime, snapshot.val().frequency);
        var minutesAway = calcMinutesAway(nextArrival, snapshot.val().frequency);

        var row =
        $('<tr>' +
            '<th scope="row" class="text-white">' + snapshot.val().trainName + '</th>' +
            '<td class="text-white">' + snapshot.val().destination + '</td>' +
            '<td class="text-white">' + snapshot.val().firstTime + '</td>' +
            '<td class="text-white">' + nextArrival + '</td>' +
            '<td class="text-white">' + minutesAway + '</td>' +
            '</tr>');

        $("#table").append(row);
        
    });

});

function addTrain() {

    trainName = $("#trainName").val();
    destination = $("#destination").val();
    firstTime = $("#firstTime").val();
    frequency = $("#frequency").val();

    nextArrival = calcNextArrival(firstTime, frequency);

    minutesAway = calcMinutesAway(nextArrival, frequency);

    database.ref().push({
        'trainName': trainName,
        'destination': destination,
        'firstTime': firstTime,
        'frequency': frequency
    });
}

function calcNextArrival (firstTime, frequency) {

    if (moment(firstTime, 'HH:mm') < moment()) {

        var nextArrival = moment(firstTime, 'HH:mm').format('HH:mm');

        while (moment(nextArrival, 'HH:mm') < moment()) {
            nextArrival = moment(nextArrival, 'HH:mm').add(frequency, 'm');
        }

    }
    else {
        nextArrival = moment(firstTime, 'HH:mm').add(frequency, 'm');
    }

    return moment(nextArrival).format('HH:mm');
}

function calcMinutesAway (nextArrival, frequency) {
    return frequency - (Math.abs((moment(nextArrival, 'HH:mm').diff(moment(), 'minutes') % frequency)));
}
