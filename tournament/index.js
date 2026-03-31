let players = new Set();
const playersPerMatch = 2
let numOfRounds = 3

const bracketContainer = document.getElementById("bracket");

const requiredPlayersCount = playersPerMatch ** numOfRounds; // to be able to have 3 rounds

const matches = [];

let matchesInRound = requiredPlayersCount / playersPerMatch;

// create blank matches
for (let round = 0; round < numOfRounds; round++) {
    for (let match = 0; match < matchesInRound; match++) {
        matches.push({
            id: `R${round + 1}M${match + 1}`,
            round,
            slotNumbers: [match * playersPerMatch + 1, match * playersPerMatch + 2],
            players: [],
            winner: null,
            nextMatch: round + 2 <= numOfRounds ? `R${round + 2}M${Math.floor(match / playersPerMatch) + 1}` : null
        })
    }

    matchesInRound /= playersPerMatch;
}


// create DOM elements for matches
const matchesElements = matches.map(match => {
    const matchContainer = document.createElement("div")
    matchContainer.id = match.id;
    matchContainer.classList.add("match-container")
    matchContainer.innerHTML = `
    <div class="player-container" id="${match.id}-${match.slotNumbers[0]}">
    <p>${match.slotNumbers[0]}</p>
    <p>${match.players?.[0] || ''}</p></div>
    <hr></hr>
    <div class="player-container" id="${match.id}-${match.slotNumbers[1]}">
    <p>${match.slotNumbers[1]}</p>
    <p>${match.players?.[1] || ''}</p></div>
    `

    return matchContainer
})

bracketContainer.append(...matchesElements);