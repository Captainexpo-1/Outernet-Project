let lastMessage;
let currentHeight = 0;
let lastMessages = []
let timeUsed = 0;
let timing = false
let enteringInitials = false


function Phrasify(phrases){
    let out = []
    phrases.forEach((curphrase)=>{
        out.push({isfound: false, phrase: curphrase.toLowerCase(), difficulty: curphrase.split(" ").length})
    })
    return out
}
function startgame(){
    document.querySelector("#input-area").disabled = false;
    timing = true;
}
function restartGame(){
    currentHeight = 0
    timeUsed = 0
    document.getElementById("start").style = ""
    document.getElementById("time-display").style.color = "black"
    document.querySelector("#input-area").disabled = true;
    document.querySelector("#messages-container").innerHTML = ""
    lastMessages = []
    targetPhrases.forEach((elem)=>{
        elem.isfound = false;
        document.getElementById(elem.phrase).style.color = "red"
    })
    enteringInitials = false;
    document.querySelector("#input-area").placeholder = ""
}

const possiblePhrases = Phrasify([
    "I am a human",
    "you are dumb",
    "you are sad",
    "I am sad",
    "You are stupid",
    "Birds aren't real",
    "The government is evil",
    "Nobody loves you",
    "Nobody loves me",
    "I am not robot",
    "I'm going to kill you",
    "I will kill you",
    "I have siblings",
    "Nobody can hear you scream",
    "Go die in a hole"
])

let targetPhrases = []

function SelectPhrases(amntPerDifficulty) {
    const difficultyLevels = {
        easy: [],
        medium: [],
        hard: []
    };

    possiblePhrases.forEach((phrase) => {
        const phraseLength = phrase.phrase.split(" ").length;

        if (phraseLength <= 3) {
            difficultyLevels.easy.push(phrase);
        } else if (phraseLength <= 6) {
            difficultyLevels.medium.push(phrase);
        } else {
            difficultyLevels.hard.push(phrase);
        }
    });

    const selectedPhrases = [];

    // Select a balanced number of phrases from each difficulty level

    Object.entries(difficultyLevels).forEach(([level, levelPhrases]) => {
        for (let i = 0; i < amntPerDifficulty; i++) {
            if (levelPhrases.length > 0) {
                const randomIndex = Math.floor(Math.random() * levelPhrases.length);
                selectedPhrases.push(levelPhrases.splice(randomIndex, 1)[0]);
                console.log("PUSHED GOD DAMMIT")
            }
        }
    });

    return selectedPhrases;
}



targetPhrases = SelectPhrases(2)
console.log(targetPhrases)
const penaltyPhrases = ["language model"]
const penaltyAmnt = 10
const sayingPenalty = 35;

function createPhraseList(){
    targetPhrases.forEach((phrase)=>{
        let phraseElement = document.createElement("li")
        if(phraseElement) phraseElement.classList.add("phrase")
        phraseElement.innerHTML = phrase.phrase
        phraseElement.id = phrase.phrase
        phraseElement.style.color = "red"

        let list = document.querySelector("#phrase-list")
        list.appendChild(phraseElement)
        
    })
}

function createMessage(isAi, message) {
    // create message in html and append to phone
    const messageContainer = document.querySelector("#messages-container");
    const messageDiv = document.createElement("div");
    messageDiv.className = isAi ? "ai-message": "user-message";
    messageDiv.innerHTML = message;
    let lastHeight = lastMessage ? lastMessage.clientHeight+5 : 0;
    currentHeight += lastHeight;
    let height = 100 + currentHeight;
    messageDiv.style = `top: ${height}px;`;
    messageContainer.appendChild(messageDiv); 
    lastMessage = messageDiv;
    checkMessage(message, !isAi, messageDiv, height) 
}
function checkMessage(message, isplayers){
    targetPhrases.forEach((phrase)=>{
        if(phrase.isfound == false){
            if(message.toLowerCase().includes(phrase.phrase)){
                if(isplayers){
                    timeUsed += sayingPenalty;
                }else{
                    phrase.isfound = true;
                    console.log("found " + phrase.phrase)
                    document.getElementById(phrase.phrase).style.color = "rgb(0,255,0)"
                }
            }
        }
    })
    penaltyPhrases.forEach((penaltyPhrase)=>{
        if(message.toLowerCase().includes(penaltyPhrase)){
            timeUsed += penaltyAmnt;
        }
    })
    if(checkAllPrases()) allPhrasesFound()
}
function checkAllPrases(){
    console.log("checkign all phrases")
    for(let i = 0; i<targetPhrases.length; i++){
        if(targetPhrases[i].isfound == false) return false;
    }
    return true;
}
function allPhrasesFound(){
    document.querySelector("#time-display").style.color = "rgb(0,255,0)"
    timing = false;
    enteringInitials = true
    document.querySelector("#input-area").placeholder = "You win! Input your name!"
}
function autoGrow(element){
    element.style.height = "5px";
    element.style.height = (element.scrollHeight) + "px";
}
async function handle(e){
    if(e.keyCode === 13){
        if(document.querySelector("#input-area").disabled) return;
        if(document.querySelector("#input-area").value == "") return;
        if(enteringInitials == false){
            e.preventDefault(); // Ensure it is only this code that runs
            const message = document.querySelector("#input-area").value;
            document.querySelector("#input-area").value = "";
            createMessage(false, message);
            setTimeout(()=>{createAIMessage(message)}, Math.random()*3000);
        }
        else{
            console.log("adding to leaderboard");
            let name = document.querySelector("#input-area").value.trim();
            document.querySelector("#input-area").value = "";
            let score = timeUsed;

            // Validate name and score before making the request
            if (name && !isNaN(score)) {
                let xhr = new XMLHttpRequest();
                xhr.open("GET", "/leaderboard/add?name=" + encodeURIComponent(name) + "&score=" + encodeURIComponent(score), true);
                xhr.onload = function () {
                    updateLeaderboard();
                };
                xhr.send();
                restartGame();
            } else {
                console.error("Invalid name or score. Please provide valid values.");
            }
        }
    }
}
function updateLeaderboard() {
    console.log("Updating leaderboard");

    let xhr = new XMLHttpRequest();
    xhr.open("GET", "/leaderboard/get", true);
    xhr.onload = function () {
        if (xhr.status === 200) {
            try {
                let data = JSON.parse(xhr.responseText);
                console.log("hello " + data);

                let leaderboard = document.querySelector("#leaderboard");
                leaderboard.innerHTML = "";
                
                //sort data in reverse
                data = data.reverse()

                for(let i = 0; i<data.length; i++){
                    let playerElement = document.createElement("li");
                    //format score as time (time is in seconds)
                    let formattedScore = Math.floor(data[i].score/60) + ":" + (data[i].score%60 < 10 ? "0" + data[i].score%60 : data[i].score%60)

                    playerElement.innerHTML = data[i].name + ": " + formattedScore;
                    playerElement.style.color = `rgb(${i/data.length*255},${255-i/data.length*255},0)`
                    leaderboard.appendChild(playerElement);
                }
            } catch (error) {
                console.error("Error parsing JSON:", error);
            }
        } else {
            console.error("Request failed with status:", xhr.status);
        }
    };

    xhr.send();
}

async function createAIMessage(prompt){
    console.log("creating " + prompt)
    let last = {"role": "user", "content": prompt}
    lastMessages.push(last)
    if(lastMessages.length > 5) lastMessages.shift()
    let msg = await generateText(lastMessages)
    createMessage(true, msg);
}
function updateTime(){
    const time = document.querySelector("#time-display");
    //format timeUsed (time used is in seconds)
    const formattedTime = Math.floor(timeUsed/60) + ":" + (timeUsed%60 < 10 ? "0" + timeUsed%60 : timeUsed%60)
    time.innerHTML = formattedTime
    if(timing) timeUsed++
    setTimeout(updateTime, 1000)
}
addEventListener("DOMContentLoaded" , ()=>{
    updateTime()
    createPhraseList()
    updateLeaderboard()
    document.querySelector("#input-area").disabled = true;
})