let lastMessage;
let currentHeight = 0;
let lastMessages = []
let timeUsed = 0;
let timing = true
let enteringInitials = false


function Phrasify(phrases){
    let out = []
    phrases.forEach((curphrase)=>{
        out.push({isfound: false, phrase: curphrase})
    })
    return out
}

const targetPhrases = Phrasify([
        "hello"
]) //Phrasify(["hello", "i love you", "will you marry me", "murder", "military action", "silly shenanigans"])
const penaltyPhrases = ["language model"]
const penaltyAmnt = 10
const sayingPenalty = 25;

function createPhraseList(){
    targetPhrases.forEach((phrase)=>{
        let phraseElement = document.createElement("div")
        if(phraseElement) phraseElement.classList.add("phrase")
        phraseElement.innerHTML = "- "+phrase.phrase
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
    messageDiv.style = "top: " + height + "px";
    messageContainer.appendChild(messageDiv); 
    lastMessage = messageDiv;
    checkMessage(message, !isAi) 
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

                data.forEach((player) => {
                    let playerElement = document.createElement("div");
                    playerElement.innerHTML = "- "+player.name + ": " + player.score+"s";
                    leaderboard.appendChild(playerElement);
                });
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
    timeUsed++
    if(timing) setTimeout(updateTime, 1000)
}
addEventListener("DOMContentLoaded" , ()=>{
    updateTime()
    createPhraseList()
    updateLeaderboard()
})