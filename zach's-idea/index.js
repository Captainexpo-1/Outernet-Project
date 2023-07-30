
let lastMessage;
let currentHeight = 0;
let lastMessages = []
let timeUsed = 0;

function Phrasify(phrases){
    let out = []
    phrases.forEach((curphrase)=>{
        out.push({isfound: false, phrase: curphrase})
    })
    return out
}

const targetPhrases = Phrasify(["hello", "i love you", "will you marry me", "murder", "military action", "silly shenanigans"])
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
}
function autoGrow(element){
    element.style.height = "5px";
    element.style.height = (element.scrollHeight) + "px";
    document.querySelector("#input-area-surroundings").style.height = element
}
function handle(e){
    if(e.keyCode === 13){
        e.preventDefault(); // Ensure it is only this code that runs
        const message = document.querySelector("#input-area").value;
        document.querySelector("#input-area").value = "";
        createMessage(false, message);
        setTimeout(()=>{createAIMessage(message)}, Math.random()*3000);
    }
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
    setTimeout(updateTime, 1000)
}
addEventListener("DOMContentLoaded" , ()=>{
    updateTime()
    createPhraseList()
})