let leaderboard = []

async function GetLeaderboard(){
    //get the leaderboard
    let response = await fetch("/leaderboard/get")
    leaderboard = await response.json()
}

function DisplayLeaderboard(){
    //display the leaderboard
    console.log("Displaying leaderboard")
    console.log(leaderboard.length)
    leaderboard = leaderboard.reverse()
    for(let i = 0; i<leaderboard.length; i++){
        let playerElement = document.createElement("li");
        //format score as time (time is in seconds)
        let formattedScore = Math.floor(leaderboard[i].score/60) + ":" + (leaderboard[i].score%60 < 10 ? "0" + leaderboard[i].score%60 : leaderboard[i].score%60)
        playerElement.innerHTML = leaderboard[i].name + ": " + formattedScore;
        playerElement.style.color = `rgb(${i/leaderboard.length*255},${255-i/leaderboard.length*255},0)`
        document.querySelector("#leaderboard-display").appendChild(playerElement);
    }
}
async function load(){
    await GetLeaderboard()
    DisplayLeaderboard()
}
addEventListener("DOMContentLoaded", () => {
    load()
})