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
var memorization = {};
var SuraNamesAr = [];
var sortedTimestampSuraArray = [];
var update_stamp = 0;

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
 * 
 * Light Order: 1
 * 
 */
var currentSortType = 0;

function sortNumber(a, b) {
    return a - b;
}

function readFileLines(fileName) {
    var fs = require("fs");
    var text = fs.readFile(fileName);
    var textByLine = text.split("\n");
    return textByLine;
}

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
//console.log(SuraNamesEn);

function refreshSura(suraIndex, timeStamp) {
    var newEntry = firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/Master/reviews/' + timeStamp);
    newEntry.set(suraIndex);
    firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/Master/update_stamp').set(timeStamp);
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

    for (suraIndex = 1; suraIndex <= 114; suraIndex++) {
        var timeStampsArray = surasHistory[suraIndex] != null ? surasHistory[suraIndex] : [];
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
        var timeStampsArray = surasHistory[suraIndex] != null ? surasHistory[suraIndex] : [];
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
        case 1: if (sortedTimestampSuraArray.length != 0) {
            return sortedTimestampSuraArray[index - 1].suraID;
        }
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

function addSuraCells() {
    //TODO reuse cells

    var reviewsNode = document.getElementById('reviews');
    while (reviewsNode.firstChild) {
        reviewsNode.removeChild(reviewsNode.firstChild);
    }

    var currentTimeStamp = Math.floor(Date.now() / 1000);
    var refreshPeriod = 10 * 24 * 60 * 60;

    for (cellIndex = 1; cellIndex <= 114; cellIndex++) {
        var suraIndex = sortedSuraIndexConverter(cellIndex);
        var element = document.createElement("button");

        element.index = suraIndex;
        element.className = "sura-cell";
        var timeStampsArray = surasHistory[suraIndex] != null ? surasHistory[suraIndex] : [];
        //TODO if not refreshed before make it zero instead of (currentTimeStamp - refreshPeriod) and condition timeDifferenceRatio value to be zero too
        var maxStamp = timeStampsArray.length > 0 ? timeStampsArray[timeStampsArray.length - 1] : (currentTimeStamp - refreshPeriod);
        var timeDifferenceRatio = 1 - (currentTimeStamp - maxStamp) * 1.0 / refreshPeriod;
        element.style.backgroundColor = "rgb(0," + (255.0 * timeDifferenceRatio).toFixed(0) + ",0)";
        var daysElapsed = ((currentTimeStamp - maxStamp) / (60 * 60 * 24.0)).toFixed(0);
        if (daysElapsed >= 30) {
            element.style.border = "thick solid rgb(255,0,0)";
        }

        var suraName = element.index + " " + SuraNamesEn[suraIndex - 1];
        var daysElapsedText = (daysElapsed == 0 ? "" : (daysElapsed + " Days"));
        if (timeDifferenceRatio >= 0.3) {
            element.style.color = "black";
        } else {
            element.style.color = "white";
        }

        var suraNameElement = document.createElement("p");
        suraNameElement.className = "sura_name_label";

        switch (memorization[suraIndex] != null ? memorization[suraIndex] : 0) {
            case 2: suraNameElement.className = "memorized sura_name_label";
                break;
            default:
                suraNameElement.className = "not_memorized sura_name_label";
        }

        suraNameElement.textContent = suraName;

        element.appendChild(suraNameElement);
        //element.appendChild(document.createElement("br"));
        if (daysElapsed != 0) {
            var daysElapsedElement = document.createTextNode(daysElapsedText);
            daysElapsedElement.id = "days";
            element.appendChild(daysElapsedElement);
        }
        //element.appendChild(memoDiv);


        element.onclick = function () {
            refreshSura(this.index, currentTimeStamp);
            this.style.backgroundColor = "rgb(0,255,0)";
            if (this.childNodes.item(1) != null) {
                this.removeChild(this.childNodes.item(1));
            }
            this.childNodes.item(0).style.color = "rgb(0,0,0)";
        };

        document.getElementById('reviews').appendChild(element);
    }
}

firebase.initializeApp(config);

/**
                             * Handles the sign in button press.
                             */
function toggleSignIn() {
    if (firebase.auth().currentUser) {
        // [START signout]
        firebase.auth().signOut();
        document.getElementById('quickstart-sign-in').textContent = 'Sign in';
        //empty score
        document.getElementById('score').textContent = '--';
        // [END signout]
    } else {

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
        // User is signed in.
        // document.getElementById("auth-div").style.display = "none";
        var displayName = user.displayName;
        var email = user.email;
        var emailVerified = user.emailVerified;
        var photoURL = user.photoURL;
        var isAnonymous = user.isAnonymous;
        var uid = user.uid;
        var providerData = user.providerData;
        var myUserId = firebase.auth().currentUser.uid;

        var database = firebase.database();
        var reviewsRef = firebase.database().ref('users/' + myUserId + '/Master/reviews');
        var memRef = firebase.database().ref('users/' + myUserId + '/Master/memorization');
        memRef.once('value', function (snapshot) {
            memorization = snapshot.val();
            if (memorization == null) {
                memorization = {};
            }
            console.log("memorization:" + memorization);
            reviewsRef.once('value', function (snapshot) {
                surasHistory = {};
                snapshot.forEach(function (childSnapshot) {
                    var childKey = Number(childSnapshot.key);
                    var childData = Number(childSnapshot.val());

                    if (surasHistory[childData] != null) {
                        surasHistory[childData].push(childKey);
                    } else {
                        surasHistory[childData] = [childKey];
                    }

                });

                for (var suraIndex in surasHistory.keys) {
                    surasHistory[suraIndex].sort(sortNumber);
                }
                document.getElementById('reviews').textContent = '';
                sortedTimestampSuraArray = [];
                refreshCountSortedSuraArray = [];
                console.log("surasHistory:" + surasHistory);
                addSuraCells();
                document.getElementById("score").textContent = getScore();
            });
        });

        // [START_EXCLUDE]
        document.getElementById('quickstart-sign-in').textContent = 'Sign out';
        // [END_EXCLUDE]
    }
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
            document.getElementById("email").style.display = "none";
            document.getElementById("password").style.display = "none";
            document.getElementById("quickstart-sign-up").style.display = "none";
            //document.getElementById("sort_div").style.display = "block";
            var update_timestamp_ref = firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/Master/update_stamp');
            update_timestamp_ref.on('value', function (snapshot) {
                console.log("time stamp updated: " + snapshot.val());
                initCells();
            });
        } else {
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

    return timestamp;
}

function getScore() {
    var total = 0;
    var today = 0;
    var todayStart = todayStartTimeStamp();
    for (i = 1; i <= 114; i++) {
        var suraScore = suraCharCount[i - 1];
        var history = surasHistory[i];
        if (history==null) {
            history = [];
        }
        total = total + (Number(history.length) * Number(suraScore));
        var lastEntryIndex = history.length - 1;
        //timestamps are sorted so we will start from their top going backward until we exceed today's start
        while (lastEntryIndex >= 0 && history[lastEntryIndex] >= todayStart) {
            today += suraScore;
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

