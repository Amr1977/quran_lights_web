//total score of all suras
var fullKhatmaCharCount = 322604;

// Initialize Firebase
var config = {
    apiKey: "AIzaSyAn1GqNGEI3cB8pa5jBgaKxVdnf7xckw2c",
    authDomain: "quran-lights.firebaseapp.com",
    databaseURL: "https://quran-lights.firebaseio.com",
    projectId: "quran-lights",
    storageBucket: "quran-lights.appspot.com",
    messagingSenderId: "35819574492"
};
var surasHistory = {};
var SuraNamesAr = [];
var sortedTimestampSuraArray = [];
var update_stamp = 0;
var serverOffset = 0;
var lightRatio = 0;
var autoRefreshPeriod = 10 * 60 * 1000;

var colorHash = {};

//Settings
var refreshPeriodDays = 10;

/**
 * Used to record the most recent transaction timestamp so in the next fetch we get more recent transactions only.
 */
var lastTransactionTimeStamp = "0";

var SuraNamesEn = [
    "Al-Fatiha",
    "Al-Baqara",
    "Al Imran",
    "An-Nisa",
    "Al-Ma'ida",
    "Al-An'am",
    "Al-A'raf",
    "Al-Anfal",
    "At-Tawba",
    "Yunus",
    "Hud",
    "Yusuf",
    "Ar-Ra'd",
    "Ibrahim",
    "Al-Hijr",
    "An-Nahl",
    "Al-Isra",
    "Al-Kahf",
    "Maryam",
    "Ta-Ha",
    "Al-Anbiya",
    "Al-Hajj",
    "Al-Mu'minoon",
    "An-Nur",
    "Al-Furqan",
    "Ash-Shu'ara",
    "An-Naml",
    "Al-Qasas",
    "Al-Ankabut",
    "Ar-Rum",
    "Luqman",
    "As-Sajda",
    "Al-Ahzab",
    "Saba",
    "Fatir",
    "Ya Sin",
    "As-Saaffat",
    "Sad",
    "Az-Zumar",
    "Ghafir",
    "Fussilat",
    "Ash-Shura",
    "Az-Zukhruf",
    "Ad-Dukhan",
    "Al-Jathiya",
    "Al-Ahqaf",
    "Muhammad",
    "Al-Fath",
    "Al-Hujurat",
    "Qaf",
    "Adh-Dhariyat",
    "At-Tur",
    "An-Najm",
    "Al-Qamar",
    "Ar-Rahman",
    "Al-Waqi'a",
    "Al-Hadid",
    "Al-Mujadila",
    "Al-Hashr",
    "Al-Mumtahina",
    "As-Saff",
    "Al-Jumua",
    "Al-Munafiqun",
    "At-Taghabun",
    "At-Talaq",
    "At-Tahrim",
    "Al-Mulk",
    "Al-Qalam",
    "Al-Haaqqa",
    "Al-Maarij",
    "Nuh",
    "Al-Jinn",
    "Al-Muzzammil",
    "Al-Muddathir",
    "Al-Qiyama",
    "Al-Insan",
    "Al-Mursalat",
    "An-Naba",
    "An-Naziat",
    "Abasa",
    "At-Takwir",
    "Al-Infitar",
    "Al-Mutaffifin",
    "Al-Inshiqaq",
    "Al-Burooj",
    "At-Tariq",
    "Al-Ala",
    "Al-Ghashiya",
    "Al-Fajr",
    "Al-Balad",
    "Ash-Shams",
    "Al-Lail",
    "Ad-Dhuha",
    "Al-Inshirah",
    "At-Tin",
    "Al-Alaq",
    "Al-Qadr",
    "Al-Bayyina",
    "Az-Zalzala",
    "Al-Adiyat",
    "Al-Qaria",
    "At-Takathur",
    "Al-Asr",
    "Al-Humaza",
    "Al-Fil",
    "Quraysh",
    "Al-Ma'un",
    "Al-Kawthar",
    "Al-Kafirun",
    "An-Nasr",
    "Al-Masadd",
    "Al-Ikhlas",
    "Al-Falaq",
    "Al-Nas"];


    var suraVerseCount = [
    7,
    286,
    200,
    176,
    120,
    165,
    206,
    75,
    129,
    109,
    123,
    111,
    43,
    52,
    99,
    128,
    111,
    110,
    98,
    135,
    112,
    78,
    118,
    64,
    77,
    227,
    93,
    88,
    69,
    60,
    34,
    30,
    73,
    54,
    45,
    83,
    182,
    88,
    75,
    85,
    54,
    53,
    89,
    59,
    37,
    35,
    38,
    29,
    18,
    45,
    60,
    49,
    62,
    55,
    78,
    96,
    29,
    22,
    24,
    13,
    14,
    11,
    11,
    18,
    12,
    12,
    30,
    52,
    52,
    44,
    28,
    28,
    20,
    56,
    40,
    31,
    50,
    40,
    46,
    42,
    29,
    19,
    36,
    25,
    22,
    17,
    19,
    26,
    30,
    20,
    15,
    21,
    11,
    8,
    8,
    19,
    5,
    8,
    8,
    11,
    11,
    8,
    3,
    9,
    5,
    4,
    7,
    3,
    6,
    3,
    5,
    4,
    5,
    6
];

var suraRevalationOrder = [
    5,
    87,
    89,
    92,
    112,
    55,
    39,
    88,
    113,
    51,
    52,
    53,
    96,
    72,
    54,
    70,
    50,
    69,
    44,
    45,
    73,
    103,
    74,
    102,
    42,
    47,
    48,
    49,
    85,
    84,
    57,
    75,
    90,
    58,
    43,
    41,
    56,
    38,
    59,
    60,
    61,
    62,
    63,
    64,
    65,
    66,
    95,
    111,
    106,
    34,
    67,
    76,
    23,
    37,
    97,
    46,
    94,
    105,
    101,
    91,
    109,
    110,
    104,
    108,
    99,
    107,
    77,
    2,
    78,
    79,
    71,
    40,
    3,
    4,
    31,
    98,
    33,
    80,
    81,
    24,
    7,
    82,
    86,
    83,
    27,
    36,
    8,
    68,
    10,
    35,
    26,
    9,
    11,
    12,
    28,
    1,
    25,
    100,
    93,
    14,
    30,
    16,
    13,
    32,
    19,
    29,
    17,
    15,
    18,
    114,
    6,
    22,
    20,
    21
];

var suraWordCountOrder = [
    29,
    6144,
    3503,
    3712,
    2837,
    3055,
    3344,
    1243,
    2506,
    1841,
    1947,
    1795,
    854,
    831,
    658,
    1845,
    1559,
    1583,
    972,
    1354,
    1174,
    1279,
    1051,
    1317,
    896,
    1322,
    1165,
    1441,
    982,
    818,
    550,
    374,
    1303,
    884,
    780,
    733,
    865,
    735,
    1177,
    1228,
    796,
    860,
    837,
    346,
    488,
    646,
    542,
    560,
    353,
    373,
    360,
    312,
    359,
    342,
    352,
    379,
    575,
    475,
    447,
    352,
    226,
    177,
    180,
    242,
    279,
    254,
    337,
    301,
    261,
    217,
    227,
    286,
    200,
    256,
    164,
    243,
    181,
    174,
    179,
    133,
    104,
    81,
    169,
    108,
    109,
    61,
    72,
    92,
    139,
    82,
    54,
    71,
    40,
    27,
    34,
    72,
    30,
    94,
    36,
    40,
    36,
    28,
    14,
    33,
    23,
    17,
    25,
    10,
    27,
    19,
    29,
    15,
    23,
    20
];

/**
 * Normal Quran Order: 0
 * Light Order: 1
 * Char count 2
 * verse count 3
 * word count 4
 * revalation order 5
 * refresh count 6
 */
var currentSortType = 0;

/**
 * Used to avoid reacting to update_stamp triggers caused by self
 */
var ownTimeStamps = [];

function sortNumber(a, b) {
    return a - b;
}

//TODO fix for new FDB structure
function refreshSura(suraIndex, refreshTimeStamp) {
    //TODO update model
    //TODO check for empty history array
    //console.log("history before refresh: ", surasHistory[suraIndex]);
    

    //update FDB
    var refreshRecord = {op: "refresh", sura: suraIndex, time: refreshTimeStamp};
    var transactionTimeStamp = (Date.now() + serverOffset)* 1000;
    var newEntry = firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/Master/reviews/' + transactionTimeStamp);
    newEntry.set(refreshRecord, function(error) {
        if (error) {
         alert("Data could not be saved, check your connection. " + error);
        } else {
          console.log("Data saved successfully. @", transactionTimeStamp, refreshRecord);
          lastTransactionTimeStamp = transactionTimeStamp.toString();
          console.log("surasHistory[suraIndex].history before refresh: ", surasHistory[suraIndex].history);
          surasHistory[suraIndex].history.push(refreshTimeStamp);
          console.log("surasHistory[suraIndex].history after refresh: ", surasHistory[suraIndex].history);
          //console.log("Refreshing sura: [", suraIndex, "] with time stamp: ", timeStamp);
          //console.log("history after refresh: ", surasHistory[suraIndex]);
          sortedTimestampSuraArray = [];
          refreshCountSortedSuraArray = [];
          addSuraCells();
          //to avoid pulling history again
          ownTimeStamps.push(transactionTimeStamp);
          //console.log("added transactionTimeStamp: ", transactionTimeStamp, " record: ", refreshRecord);
          //trigger update on other devices
          firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/Master/update_stamp').set(transactionTimeStamp);
        }
      });
      
}

function sortByKey(array, key) {
    return array.sort(function (a, b) {
        var x = a[key];
        var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}


var revalationSortedSuraArray = [];

function createRevalationSuraOrderArray() {
    if (revalationSortedSuraArray.length != 0) {
        return;
    }
    for (suraIndex = 1; suraIndex <= 114; suraIndex++) {
        var suraWithCharCountRecord = { suraID: suraIndex, revalOrder: suraRevalationOrder[suraIndex - 1] };
        revalationSortedSuraArray.push(suraWithCharCountRecord);
    }

    revalationSortedSuraArray = sortByKey(revalationSortedSuraArray, "revalOrder");
}


var verseCountSortedSuraArray = [];

function createVerseCountSuraOrderArray() {
    if (verseCountSortedSuraArray.length != 0) {
        return;
    }
    for (suraIndex = 1; suraIndex <= 114; suraIndex++) {
        var suraWithCharCountRecord = { suraID: suraIndex, verseCount: suraCharCount[suraIndex - 1] };
        verseCountSortedSuraArray.push(suraWithCharCountRecord);
    }

    verseCountSortedSuraArray = sortByKey(verseCountSortedSuraArray, "verseCount");
}

var characterCountSortedSuraArray = [];

function createCharCountSuraOrderArray() {
    if (characterCountSortedSuraArray.length != 0) {
        return;
    }
    for (suraIndex = 1; suraIndex <= 114; suraIndex++) {
        var suraWithCharCountRecord = { suraID: suraIndex, charCount: suraCharCount[suraIndex - 1] };
        characterCountSortedSuraArray.push(suraWithCharCountRecord);
    }

    characterCountSortedSuraArray = sortByKey(characterCountSortedSuraArray, "charCount");
}

var wordCountSortedSuraArray = [];

function createWordCountSuraOrderArray() {
    if (wordCountSortedSuraArray.length != 0) {
        return;
    }
    for (suraIndex = 1; suraIndex <= 114; suraIndex++) {
        var suraWithWordCountRecord = { suraID: suraIndex, wordCount: suraCharCount[suraIndex - 1] };
        wordCountSortedSuraArray.push(suraWithWordCountRecord);
    }

    wordCountSortedSuraArray = sortByKey(wordCountSortedSuraArray, "wordCount");
}

function createSortedTimeStampSuraArray() {
    if (sortedTimestampSuraArray.length != 0) {
        return;
    }

    for (suraIndex = 1; suraIndex <= 114; suraIndex++) {
        var timeStampsArray = surasHistory[suraIndex].history != null ? surasHistory[suraIndex].history : [];
        var mostRecentTimestamp = timeStampsArray.length > 0 ? timeStampsArray[timeStampsArray.length - 1] : 0;
        var suraWithLastTimeStampRecord = { suraID: suraIndex, timeStamp: mostRecentTimestamp };
        sortedTimestampSuraArray.push(suraWithLastTimeStampRecord);
    }

    sortedTimestampSuraArray = sortByKey(sortedTimestampSuraArray, "timeStamp");
}

var refreshCountSortedSuraArray = [];

function createSortedRefreshCountSuraArray() {
    if (refreshCountSortedSuraArray.length != 0) {
        return;
    }
    for (suraIndex = 1; suraIndex <= 114; suraIndex++) {
        var timeStampsArray = surasHistory[suraIndex].history != null ? surasHistory[suraIndex].history : [];
        var mostRecentTimestamp = timeStampsArray.length;
        var suraWithRefreshCountRecord = { suraID: suraIndex, refreshCount: mostRecentTimestamp };
        refreshCountSortedSuraArray.push(suraWithRefreshCountRecord);
    }

    refreshCountSortedSuraArray = sortByKey(refreshCountSortedSuraArray, "refreshCount");
}

function sortedSuraIndexConverter(index) {
    switch (currentSortType) {
        //Normal sura order        
        case 0:
            return index;

        //light order
        case 1: 
            createSortedTimeStampSuraArray();
            return (sortedTimestampSuraArray[index - 1]).suraID;

        //character count order
        case 2:
            createCharCountSuraOrderArray();
            return characterCountSortedSuraArray[index - 1].suraID;

        //verse count order
        case 3:
            createVerseCountSuraOrderArray();
            return verseCountSortedSuraArray[index - 1].suraID;

        //word count sort
        case 4:
        createWordCountSuraOrderArray();
        return wordCountSortedSuraArray[index - 1].suraID;


        //revalation order
        case 5:
            createRevalationSuraOrderArray();
            return revalationSortedSuraArray[index - 1].suraID;

        //refresh count
        case 6:
            createSortedRefreshCountSuraArray();
            return refreshCountSortedSuraArray[index - 1].suraID;

        default: return index;
    }

}

var buildingSurasFlag = false;

function addSuraCells() {
    //TODO reuse cells
if (buildingSurasFlag) {
    return;
}
buildingSurasFlag = true;
    var reviewsNode = document.getElementById('reviews');
    while (reviewsNode.firstChild) {
        reviewsNode.removeChild(reviewsNode.firstChild);
    }

    var currentTimeStamp = Math.floor(Date.now() / 1000);
    var refreshPeriod = refreshPeriodDays * 24 * 60 * 60;
    lightRatio = 0;
    for (var cellIndex = 1; cellIndex <= 114; cellIndex++) {
        var suraIndex = sortedSuraIndexConverter(cellIndex);
        var element = document.createElement("button");

        element.index = suraIndex;
        element.className = "sura-cell" + " sura-"+suraIndex;
        if ( surasHistory[suraIndex] == null) {
            surasHistory[suraIndex] = {};
            surasHistory[suraIndex].history = [];
            surasHistory[suraIndex].suraIndex = suraIndex;
            surasHistory[suraIndex].memorization = 0;
        }
        var timeStampsArray = surasHistory[suraIndex].history;
        //TODO if not refreshed before make it zero instead of (currentTimeStamp - refreshPeriod) and condition timeDifferenceRatio value to be zero too
        var maxStamp = timeStampsArray.length > 0 ? timeStampsArray[timeStampsArray.length - 1] : 0;
        var timeDifferenceRatio = 1 - (currentTimeStamp - (maxStamp == 0 ? (currentTimeStamp - refreshPeriod): maxStamp) ) * 1.0 / refreshPeriod;
        timeDifferenceRatio = timeDifferenceRatio < 0 ? 0 : timeDifferenceRatio;
        lightRatio += (((timeDifferenceRatio * suraCharCount[suraIndex - 1])/fullKhatmaCharCount) * 100.0);
        var greenComponent = (255.0 * timeDifferenceRatio).toFixed(0);
        if (timeStampsArray.length > 0) {
            element.style.backgroundColor = "rgb(0," + greenComponent + ",0)";
        } else {
            element.style.backgroundImage = "url('images/desert.jpg')";
        }
        
        colorHash[cellIndex] = rgbToHex(0, greenComponent, 0);
        var daysElapsed = ((currentTimeStamp - maxStamp) / (60 * 60 * 24.0)).toFixed(0);

        if (daysElapsed >= 30 && timeStampsArray.length > 0) {
            element.style.border = "thick solid rgb(255,0,0)";
        }

        var suraName = element.index + " " + SuraNamesEn[suraIndex - 1];
        var daysElapsedText = (daysElapsed == 0 || daysElapsed > 1000 ? "" : (daysElapsed + " Days"));
        if (timeDifferenceRatio >= 0.3) {
            element.style.color = "black";
        } else {
            element.style.color = "white";
        }

        var suraNameElement = document.createElement("p");
        suraNameElement.className = "sura_name_label";

        switch (surasHistory[suraIndex].memorization) {
            case "2": suraNameElement.className = "memorized sura_name_label";
                break;
            default:
                suraNameElement.className = "not_memorized sura_name_label";
        }

        suraNameElement.textContent = suraName;

        element.appendChild(suraNameElement);
        
        var charCountText = readableFormat(suraCharCount[suraIndex - 1]);

        //Char count
        var charCountElement = document.createElement("span");
        charCountElement.id = "char-count";
        charCountElement.style.float = "left";
        charCountElement.textContent = charCountText;
        element.appendChild(charCountElement);

        //Days elapsed
        if (daysElapsed != 0) {
            var daysElapsedElement = document.createElement("span");//document.createTextNode(daysElapsedText);
            daysElapsedElement.style.float = "right";
            daysElapsedElement.textContent = daysElapsedText;
            daysElapsedElement.id = "days";
            element.appendChild(daysElapsedElement);
        }        
        //element.appendChild(memoDiv);


        element.onclick = function () {
            var timeStamp = Math.floor(Date.now() / 1000);
            var index = this.index;
            $(".sura-"+index).addClass("animated bounceIn");
            refreshSura(index, timeStamp);
            
        };

        document.getElementById('reviews').appendChild(element);
    }

    updateLightRatioChart();
    document.getElementById("score").textContent = getScore() + " Light Ratio: " + lightRatio.toFixed(2);
    drawTimeSeriesChart("daily-score-chart", 0);
    drawTimeSeriesChart("monthly-score-chart", 1);
    drawKhatmaPieChart();
    $("#reviews").addClass("animated bounce");
    buildingSurasFlag = false;
    //periodically refresh
    if (periodicRefreshTimerRef != null) {
        clearInterval(periodicRefreshTimerRef);
    }
    
    periodicRefreshTimerRef = setInterval(addSuraCells, autoRefreshPeriod);
}

firebase.initializeApp(config);

function bounce(suraIndex){
    $(".sura-"+suraIndex).addClass("animated bounceIn");
}

/**
                             * Handles the sign in button press.
                             */
function toggleSignIn() {
    
    if (firebase.auth().currentUser) {
        showToast("Signing out...");
        // [START signout]
        firebase.auth().signOut();
        document.getElementById('quickstart-sign-in').textContent = 'Sign in';
        //empty score
        document.getElementById('score').textContent = '--';
        currentSortType = 0;
        //"sort_type"
        var allRadios = document.getElementsByName('sort_type');
        allRadios.forEach(function(element) {
            element.checked = false;
        }, this);
        document.getElementById('email').value='';
        document.getElementById('password').value='';
        document.getElementById('daily-score-chart').innerHTML='';
        document.getElementById('monthly-score-chart').innerHTML='';
        document.getElementById('khatma-progress-chart').innerHTML='';
        document.getElementById('light-ratio-chart-container').innerHTML='';
        document.getElementById('sort_div').innerHTML='';
        surasHistory = {};
        hideToast();
        // [END signout]
    } else {
        showToast("Signing in...");
        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;
        if (email.length < 4) {
            alert('Please enter an email address.');
            return;
        }
        if (password.length < 4) {
            alert('Please enter a password.');
            return;
        }
        // Sign in with email and pass.
        // [START authwithemail]
        firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // [START_EXCLUDE]
            if (errorCode === 'auth/wrong-password') {
                alert('Wrong password.');
            } else {
                alert(errorMessage);
            }
            console.log(error);
            document.getElementById('quickstart-sign-in').disabled = false;
            document.getElementById('quickstart-sign-in').textContent = 'Sign in';
            // [END_EXCLUDE]
        });
        hideToast();
        // [END authwithemail]
    }
    document.getElementById('quickstart-sign-in').disabled = false;
}
/**
 * Handles the sign up button press.
 */
function handleSignUp() {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    if (email.length < 4) {
        alert('Please enter an email address.');
        return;
    }
    if (password.length < 4) {
        alert('Please enter a password.');
        return;
    }
    // Sign in with email and pass.
    // [START createwithemail]
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode == 'auth/weak-password') {
            alert('The password is too weak.');
        } else {
            alert(errorMessage);
        }
        console.log(error);
        // [END_EXCLUDE]
    });
    // [END createwithemail]
}
/**
 * Sends an email verification to the user.
 */
function sendEmailVerification() {
    // [START sendemailverification]
    firebase.auth().currentUser.sendEmailVerification().then(function () {
        // Email Verification sent!
        // [START_EXCLUDE]
        alert('Email Verification Sent!');
        // [END_EXCLUDE]
    });
    // [END sendemailverification]
}
function sendPasswordReset() {
    var email = document.getElementById('email').value;
    // [START sendpasswordemail]
    firebase.auth().sendPasswordResetEmail(email).then(function () {
        // Password Reset Email Sent!
        // [START_EXCLUDE]
        alert('Password Reset Email Sent!');
        // [END_EXCLUDE]
    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode == 'auth/invalid-email') {
            alert(errorMessage);
        } else if (errorCode == 'auth/user-not-found') {
            alert(errorMessage);
        }
        console.log(error);
        // [END_EXCLUDE]
    });
    // [END sendpasswordemail];
}

function initCells() {
    var user = firebase.auth().currentUser;
    if (user) {
        document.getElementById('quickstart-sign-in').textContent = 'Sign out';
        // User is signed in.
        var displayName = user.displayName;
        var email = user.email;
        var emailVerified = user.emailVerified;
        var photoURL = user.photoURL;
        var isAnonymous = user.isAnonymous;
        var uid = user.uid;
        var providerData = user.providerData;
        var myUserId = firebase.auth().currentUser.uid;

        var database = firebase.database();
        //TODO add query to fetch new records only
        //console.log("grapping transactions after ", lastTransactionTimeStamp);
        var reviewsRef = firebase.database().ref('users/' + myUserId + '/Master/reviews').orderByKey().startAt(lastTransactionTimeStamp.toString());
        
        showToast("Fetching history...");
        reviewsRef.once('value', function (snapshot) {
            hideToast();
            //surasHistory = {};
            var bounceList = [];
            if (snapshot != null) {
                
                snapshot.forEach(function (childSnapshot) {
                    var transactionTimeStamp = childSnapshot.key;
                    if (lastTransactionTimeStamp == transactionTimeStamp) {
                        return;
                    }

                    //console.log("transactionTimeStamp ", transactionTimeStamp);
                    if (Number(transactionTimeStamp) > Number(lastTransactionTimeStamp)) {
                        lastTransactionTimeStamp = transactionTimeStamp;
                    }
                    var transactionRecord = childSnapshot.val(); 

                    var suraIndex = transactionRecord.sura;
                    bounceList.push(suraIndex);

                    if(surasHistory[suraIndex] == null) {
                        surasHistory[suraIndex] = {};
                        surasHistory[suraIndex].suraIndex = suraIndex;
                        surasHistory[suraIndex].history = [];
                    }

                    switch (transactionRecord.op) {
                        case "memorize":
                        surasHistory[suraIndex].memorization = transactionRecord.state;
                        break;
    
                        case "refresh":
                        if(surasHistory[suraIndex].history.indexOf(transactionRecord.time) == -1){
                            surasHistory[suraIndex].history.push(transactionRecord.time);
                        } else {
                            console.log("duplicate refresh eliminated ", transactionRecord);
                        }
                        
                    }
                });
    
                for (var suraIndex in surasHistory.keys) {
                    surasHistory[suraIndex].history.sort(sortNumber);
                }

                //console.log("last transactions timestamp: ", lastTransactionTimeStamp);
            }
            document.getElementById('reviews').textContent = '';
            sortedTimestampSuraArray = [];
            refreshCountSortedSuraArray = [];
            //console.log("surasHistory:" + surasHistory);
            addSuraCells();
            bounceList.forEach(function(suraIndex){
                bounce(suraIndex);
            });
        });

        // [START_EXCLUDE]
        
        // [END_EXCLUDE]
    }
}

var timeStampTriggerTimerRef = null;
var periodicRefreshTimerRef = null;
var isFirstLoad = 1;

function onTimeStampUpdated(){
    timeStampTriggerTimerRef = null;
    console.log("Fetching history...");
    initCells();
}

function skew() {
    var offsetRef = firebase.database().ref(".info/serverTimeOffset");
    offsetRef.on("value", function(snap) {
      serverOffset = snap.val();
      //console.log("server offset: ", serverOffset);
    });
}

/**
 * initApp handles setting up UI event listeners and registering Firebase auth listeners:
 *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
 *    out, and that is where we update the UI.
 */
function initApp() {
    // Listening for auth state changes.
    // [START authstatelistener]
    document.getElementById("password")
        .addEventListener("keyup", function (event) {
            event.preventDefault();
            if (event.keyCode == 13) {
                document.getElementById("quickstart-sign-in").click();
            }
        });
    firebase.auth().onAuthStateChanged(function (user) {
        // [START_EXCLUDE silent]
        document.getElementById('quickstart-sign-in').disabled = false;

        // [END_EXCLUDE]
        if (user) {
            skew();
            document.getElementById("email").style.display = "none";
            document.getElementById("password").style.display = "none";
            document.getElementById("quickstart-sign-up").style.display = "none";
            //document.getElementById("sort_div").style.display = "block";
            var update_timestamp_ref = firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/Master/update_stamp');
            update_timestamp_ref.on('value', function (snapshot) {
                //console.log("timestamp trigger");
                var updatedValue = snapshot.val();
                var indexOfTimeStamp = ownTimeStamps.indexOf(updatedValue);
                if ( indexOfTimeStamp != -1) {
                    //delete matching own timestamp
                    ownTimeStamps.splice(indexOfTimeStamp,1);
                    console.log("dropping own update.");
                    return;
                }

                //stabilize successive triggers
                if (timeStampTriggerTimerRef != null) {
                    clearTimeout(timeStampTriggerTimerRef);
                    console.log("Dropped repeated timestamp trigger.. ");
                }
                timeStampTriggerTimerRef = setTimeout(onTimeStampUpdated, isFirstLoad == 1 ? 0 : 5000);
                isFirstLoad = 0;
            });
        } else {
            clearInterval(periodicRefreshTimerRef);
            document.getElementById("email").style.display = "block";
            document.getElementById("password").style.display = "block";
            document.getElementById("quickstart-sign-up").style.display = "block";
            document.getElementById("reviews").innerHTML = "Sign in to fetch your history.";
            // User is signed out.
            // [START_EXCLUDE]
            document.getElementById('quickstart-sign-in').textContent = 'Sign in';

            //empty score
            document.getElementById("score").textContent = '--';
            //document.getElementById('quickstart-account-details').textContent = 'null';
            // [END_EXCLUDE]
        }
        // [START_EXCLUDE silent]

        // [END_EXCLUDE]
    });
    // [END authstatelistener]


    document.getElementById('quickstart-sign-in').addEventListener('click', toggleSignIn, false);
    document.getElementById('quickstart-sign-up').addEventListener('click', handleSignUp, false);
}
window.onload = function () {
    initApp();
};

var suraCharCount = [
    139,
    25613,
    14605,
    15937,
    11892,
    12418,
    14071,
    5299,
    10873,
    7425,
    7633,
    7125,
    3450,
    3461,
    2797,
    7642,
    6480,
    6425,
    3835,
    5288,
    4925,
    5196,
    4354,
    5596,
    3786,
    5517,
    4679,
    5791,
    4200,
    3388,
    2121,
    1523,
    5618,
    3510,
    3159,
    2988,
    3790,
    2991,
    4741,
    4984,
    3282,
    3431,
    3508,
    1439,
    2014,
    2602,
    2360,
    2456,
    1493,
    1473,
    1510,
    1293,
    1405,
    1438,
    1585,
    1692,
    2475,
    1991,
    1913,
    1519,
    936,
    749,
    780,
    1066,
    1170,
    1067,
    1316,
    1258,
    1107,
    947,
    947,
    1089,
    840,
    1015,
    664,
    1065,
    815,
    766,
    762,
    538,
    425,
    326,
    740,
    436,
    459,
    249,
    293,
    378,
    573,
    335,
    249,
    312,
    164,
    102,
    156,
    281,
    112,
    394,
    156,
    164,
    158,
    122,
    70,
    133,
    96,
    73,
    112,
    42,
    95,
    79,
    81,
    47,
    71,
    80
];

function readableFormat(number) {
    if (number >= 1000000000) {
        return (number / 1000000000).toFixed(2) + "G";
    } else if (number >= 1000000) {
        return (number / 1000000).toFixed(2) + "M";
    } else if (number >= 1000) {
        return (number / 1000).toFixed(2) + "K";
    } else {
        return number;
    }
}

function todayStartTimeStamp() {
    var now = new Date();
    var startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var timestamp = startOfDay / 1000;
    console.log("todayStartTimeStamp", timestamp);
    return timestamp;
}

function getScore() {
    var total = 0;
    var today = 0;
    var todayStart = todayStartTimeStamp();
    for (i = 1; i <= 114; i++) {
        var suraScore = suraCharCount[i - 1];
        var history = surasHistory[i].history;
        if (history==null) {
            history = [];
        }
        total = total + (Number(history.length) * Number(suraScore));
        var lastEntryIndex = history.length - 1;
        //timestamps are sorted so we will start from their top going backward until we exceed today's start
        while (lastEntryIndex >= 0 && history[lastEntryIndex] >= todayStart) {
            today += suraScore;
            console.log("Today added sura: ", SuraNamesEn[i - 1], history[lastEntryIndex]);
            lastEntryIndex--;
        }
    }

    return readableFormat(total) + (today > 0 ? "(+" + readableFormat(today) + " today)" : "");
}

function sortLight() {
    currentSortType = 1;
    addSuraCells();
}

function sortNormal() {
    currentSortType = 0;
    addSuraCells();
}

function sortChars() {
    currentSortType = 2;
    addSuraCells();
}

function sortVerse() {
    currentSortType = 3;
    addSuraCells();
}

function sortWord(){
    currentSortType = 4;
    addSuraCells();
}

function sortReval() {
    currentSortType = 5;
    addSuraCells();
}

function sortRefresh() {
    currentSortType = 6;
    addSuraCells();
}

function showToast(message) {
    var x = document.getElementById("snackbar")
    x.textContent = message;
    x.className = "show";
}

function hideToast(){
    var x = document.getElementById("snackbar");
    x.className = x.className.replace("show", "");
}

/**
 * 
 * @param {*} mode 0 daily, 1 monthly
 */
function scoreData(mode) {
    //TODO add zeros for missing days
    var allEntries = [];

    for (cellIndex = 1; cellIndex <= 114; cellIndex++) {
        var history = surasHistory[cellIndex].history;
        for (entry = 0; entry < history.length; entry++) {
            allEntries.push([ history[entry] * 1000, suraCharCount[cellIndex - 1] ]);
        }
    }

    if (allEntries.length == 0) {
        return [];
    }
   // console.log("All entries: ", allEntries);

    var sortedEntries = sortByX(allEntries);

    var scoreArray = [];
    var periodScore = 0;
    var dayIndex = 0;
    var prevDate = (new Date(sortedEntries[0][0])).getDate();
    var prevMonth= (new Date(sortedEntries[0][0])).getMonth();

    for(var index = 0; index < sortedEntries.length; index++){
        var date = new Date(sortedEntries[index][0]);
        var currentDate = date.getDate();
        var currentMonth = date.getMonth();

        if((mode == 0 && Number(prevDate) != Number(currentDate)) || Number(prevMonth) != Number(currentMonth)){
            scoreArray.push([ sortedEntries[index - 1][0] , periodScore ]);
            //console.log("score: ", sortedEntries[index][1]);
            periodScore = sortedEntries[index][1];
            //console.log("dayScore: ",dayScore);
            //console.log("new date ", date, "current date/month", currentDate,"-", currentMonth, "prev date-month", prevDate, "-", prevMonth);
        } else {
            //console.log("score: ", sortedEntries[index][1]);
            periodScore += sortedEntries[index][1];
            //console.log("continue date ", date);
            //console.log("dayScore: ",dayScore);
        }
        if(index == (sortedEntries.length - 1)) {
            scoreArray.push([ sortedEntries[index][0] , periodScore ]);
        }
        prevDate = currentDate;
        prevMonth = currentMonth;
    }

    //console.log("dailyScoreArray: ", dailyScoreArray);

    return scoreArray;

}

function sortByX(array){
    return array.sort(function (a, b) {
        var x = a[0];
        var y = b[0];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

function drawTimeSeriesChart(divID, mode){
    var data = scoreData(mode);
    console.log("drawTimeSeriesChart", divID, mode, data);
    Highcharts.chart(divID, {
        chart: {
            zoomType: 'x'
        },
        title: {
            text: mode == 0 ? 'Daily Score Chart' : 'Monthly Score Chart'
        },
        subtitle: {
            text: document.ontouchstart === undefined ?
                    'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
        },
        xAxis: {
            type: 'datetime'
        },
        yAxis: {
            title: {
                text: mode == 0 ? 'Daily Score' : "Monthly Score"
            }
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            area: {
                fillColor: {
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1
                    },
                    stops: [
                        [0, Highcharts.getOptions().colors[0]],
                        [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                    ]
                },
                marker: {
                    radius: 2
                },
                lineWidth: 1,
                states: {
                    hover: {
                        lineWidth: 1
                    }
                },
                threshold: null
            }
        },

        series: [{
            type: 'area',
            name: 'Date score',
            data: data
        }]
    });
}

function drawKhatmaPieChart(){
    var khatmaProgress = getKhatmaProgressData();
    var data = khatmaProgress.data;

    console.log("khatmaProgress", khatmaProgress);
    
    // Build the chart
    Highcharts.chart('khatma-progress-chart', {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: "Khatma #" + khatmaProgress.currentKhatma + ' Progress'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'green'
                    },
                    connectorColor: 'silver'
                }
            }
        },
        series: [{
            name: "Khatma Progress",
            data: data
        }],

        drilldown: {
            series: khatmaProgress.drilldown
        }

    });
}

/**
 * The minimum history length is current khatma number - 1, suras with that mimimum history length are in the completed set, other suras are not completed yet.
 */
function getKhatmaProgressData(){
    var indexesOfSurasWithMinimumHistoryLength = [];
    
    //current minimum history length reached
    var minimumHistoryLength = surasHistory[1].history.length;

    //comulated char count of minimum history length suras
    var comulatedScoreOfCurrentMinimumHistoryLengthSuras = 0;

    var khatmaProgress = {};

    for(var suraIndex = 1; suraIndex <= 114; suraIndex++){
        //check if current sura history length is less than current reached minimum
        if (surasHistory[suraIndex].history.length < minimumHistoryLength) {
            //reset mimimum
            //console.log("reseting minimum");
            minimumHistoryLength = surasHistory[suraIndex].history.length; 
            indexesOfSurasWithMinimumHistoryLength = [ suraIndex ];
            comulatedScoreOfCurrentMinimumHistoryLengthSuras = suraCharCount[suraIndex - 1];
            //console.log("indexesOfSurasWithMinimumHistoryLength: ", indexesOfSurasWithMinimumHistoryLength, "comulatedScoreOfCurrentMinimumHistoryLengthSuras", comulatedScoreOfCurrentMinimumHistoryLengthSuras);
        } 
        //check if current sura history equals current reached mimimum
        else if (surasHistory[suraIndex].history.length == minimumHistoryLength) {
            indexesOfSurasWithMinimumHistoryLength.push(suraIndex);
            comulatedScoreOfCurrentMinimumHistoryLengthSuras += suraCharCount[suraIndex - 1];
            //console.log("indexesOfSurasWithMinimumHistoryLength: ", indexesOfSurasWithMinimumHistoryLength, "comulatedScoreOfCurrentMinimumHistoryLengthSuras", comulatedScoreOfCurrentMinimumHistoryLengthSuras);
        } else {
            //console.log("sura[",suraIndex, "] with history length [",surasHistory[suraIndex].history.length, "] not belonging to mimimums, current history minimum: ", minimumHistoryLength, " indexesOfSurasWithMinimumHistoryLength: ", indexesOfSurasWithMinimumHistoryLength);
        }

    }

    console.log("completed: ", indexesOfSurasWithMinimumHistoryLength, comulatedScoreOfCurrentMinimumHistoryLengthSuras);

    khatmaProgress.data = [ 
        {name: "Remaining", y: comulatedScoreOfCurrentMinimumHistoryLengthSuras, sliced: true, selected: true, drilldown: "Remaining"} , 
        {name: "Completed", y: (fullKhatmaCharCount - comulatedScoreOfCurrentMinimumHistoryLengthSuras), drilldown: "Completed" }
    ];

    //extract current khatma number
    khatmaProgress.currentKhatma = minimumHistoryLength + 1;

    var remainingDrillDownArray = [];
    var completedDrilldownArray = [];
    for(var index = 1; index <= 114; index++){
        var entry = {
            name: SuraNamesEn[index - 1], 
            y: suraCharCount[index - 1]//,
            //color: colorHash[index]
        };
        if (indexesOfSurasWithMinimumHistoryLength.indexOf(index) != -1) {
            remainingDrillDownArray.push(entry);
        } else {
            completedDrilldownArray.push(entry);
        }
    }

    remainingDrillDownArray = sortByKey(remainingDrillDownArray, "y");
    completedDrilldownArray = sortByKey(completedDrilldownArray, "y");


    console.log("remainingDrillDownArray",remainingDrillDownArray);
    console.log("completedDrilldownArray",completedDrilldownArray);

    khatmaProgress.drilldown = [{
            name: "Remaining",
            id: "Remaining",
            data: remainingDrillDownArray
        },
        {
            name: "Completed",
            id: "Completed",
            data: completedDrilldownArray
        }
    ];
    
    return khatmaProgress;
} 

function componentToHex(c) {
    var hex = parseInt(c).toString(16);
    var hexStr = hex.length == 1 ? "0" + hex : hex;

    return hexStr;
}

function rgbToHex(r, g, b) {
    return "#" + "00" + componentToHex(g) + "00";
}

var gaugeOptions = {
    
        chart: {
            type: 'solidgauge'
        },
    
        title: null,
    
        pane: {
            center: ['50%', '85%'],
            size: '140%',
            startAngle: -90,
            endAngle: 90,
            background: {
                backgroundColor: '#EEE',
                innerRadius: '60%',
                outerRadius: '100%',
                shape: 'arc'
            }
        },
    
        tooltip: {
            enabled: false
        },
    
        // the value axis
        yAxis: {
            stops: [
                [0.1, '#DF5353'], // red
                [0.5, '#DDDF0D'], // yellow
                [0.9, '#55BF3B'] // green
            ],
            lineWidth: 0,
            minorTickInterval: null,
            tickAmount: 2,
            title: {
                y: -70
            },
            labels: {
                y: 16
            }
        },
    
        plotOptions: {
            solidgauge: {
                dataLabels: {
                    y: 5,
                    borderWidth: 0,
                    useHTML: true
                }
            }
        }
    };

    // The Light Ratio gauge
var chartLightRatio;

function updateLightRatioChart(){
    chartLightRatio = null;
    chartLightRatio = new Highcharts.chart('light-ratio-chart-container', Highcharts.merge(gaugeOptions, {
        yAxis: {
            min: 0,
            max: 100,
            title: {
                text: 'Light Ratio'
            }
        },
    
        credits: {
            enabled: false
        },
    
        series: [{
            name: 'Light Ratio',
            data: [(lightRatio)],
            dataLabels: {
                format: '<div style="text-align:center"><span style="font-size:25px;color:' +
                    ( 'black') + '">{y:.2f}</span><br/>' +
                       '<span style="font-size:12px;color:silver">percent</span></div>'
            },
            tooltip: {
                valueSuffix: ' percent'
            }
        }]
    
    }));
}