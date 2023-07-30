let lastMessage;
let currentHeight = 0;
let lastMessages = []
let battery = 5


function createMessage(isAi, message) {
    // create message in html and append to phone
    const phone = document.querySelector("#phone-screen");
    const messageDiv = document.createElement("div");
    messageDiv.className = isAi ? "ai-message" : "user-message";
    messageDiv.innerHTML = message;
    let lastHeight = lastMessage ? lastMessage.clientHeight+5 : 0;
    currentHeight += lastHeight;
    let height = 100 + currentHeight;
    messageDiv.style = "top: " + height + "px";
    phone.appendChild(messageDiv); 
    lastMessage = messageDiv;
    
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
        new Audio("audio/send.wav").play()
        battery-=1
        updateBattery()
        setTimeout(()=>{createAIMessage(message)}, Math.random()*3000);
    }
}
async function createAIMessage(prompt){
    console.log("creating " + prompt)
    let last = {"role": "user", "content": prompt}
    lastMessages.push(last)
    let msg = await generateText(lastMessages)
    createMessage(true, msg);
    new Audio("audio/recieve.wav").play()
}
function updateDescription(elem){
    elem.remove()
}
function updateTime(){
    const time = document.querySelector("#time-display");
    const d = new Date()
    let minutes;
    if(d.getMinutes() < 10){
        minutes = "0" + d.getMinutes().toString()
    } else {
        minutes = d.getMinutes().toString()
    }
    let timeText = (d.getHours()==12 || d.getHours()==24 ? 12 : d.getHours()%12) + ":" + minutes
    time.innerHTML = timeText
    setTimeout(updateTime, 1000)
}
setTimeout(updateTime, 10)

function handleGuess(event){
    if(event.keyCode === 13){
        console.log("Guessed")
        if(document.querySelector("#guess-input").value.toLowerCase() == randomEmotion){
            console.log("Correct")
            document.querySelector("#guess-input").value = "";
            document.querySelector("#guess-input").placeholder = "You guessed it!";
            setTimeout(()=>{
                window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            },2000)
        }
    }
}    
function updateBattery(){
    if(battery == -1){
        while(true){
            alert("you failed dingus.")
        }
    }else{
        const percentage = (battery/5)
        console.log(battery/5)
        document.querySelector("#battery-innards").setAttribute("style", `background-color: rgb(0,255,0); width: ${battery/5*100}%; height: 100%;`) //`linear-gradient(to right, rgb(${Math.floor(percentage*255)}, ${Math.floor(255-percentage*255)}, ${0}) ${100*percentage}, #5d454500 ${100*percentage});`
    }
}
addEventListener("DOMContentLoaded", ()=>{
    updateBattery()
})