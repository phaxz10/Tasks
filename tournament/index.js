
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
const roundColumns = Array.from({ length: numOfRounds }, (_, round) => {
    const roundColumn = document.createElement("section");
    roundColumn.classList.add("round-column");

    const roundTitle = document.createElement("h2");
    roundTitle.classList.add("round-title");
    roundTitle.textContent = `Round ${round + 1}`;

    const matchesGroup = document.createElement("div");
    matchesGroup.classList.add("round-matches", `round-${round + 1}`);

    const roundMatches = matches.filter((match) => match.round === round);

    const matchElements = roundMatches.map((match) => {
        const matchContainer = document.createElement("div");
        matchContainer.id = match.id;
        matchContainer.classList.add("match-container");
        matchContainer.innerHTML = `
            <div class="player-container" id="${match.id}-${match.slotNumbers[0]}">
                <p class="slot-number">${match.slotNumbers[0]}</p>
                <p class="player-name">${match.players?.[0] || "TBD"}</p>
            </div>
            <hr>
            <div class="player-container" id="${match.id}-${match.slotNumbers[1]}">
                <p class="slot-number">${match.slotNumbers[1]}</p>
                <p class="player-name">${match.players?.[1] || "TBD"}</p>
            </div>
        `;

        return matchContainer;
    });

    matchesGroup.append(...matchElements);
    roundColumn.append(roundTitle, matchesGroup);
    return roundColumn;
});

bracketContainer.append(...roundColumns);


const assignButton = document.getElementById("assign");
const errorDisplay = document.getElementById("error")
const playerNamesInput = document.getElementById("player-names");

playerNamesInput.addEventListener("change", () => {
    errorDisplay.textContent = "";
})

const handleAssign = () => {
    const inputNames = playerNamesInput.value.split(",").map((name) => name.trim()).filter(Boolean);

    if (inputNames.length !== requiredPlayersCount) {
        errorDisplay.textContent = `Please enter exactly ${requiredPlayersCount} player names.`;
        return;
    }

    const players = new Set(inputNames);

    if (players.size !== requiredPlayersCount) {
        errorDisplay.textContent = "Player names must be unique.";
        return;
    }

    // get only the first round matches
    const firstRoundMatches = matches.filter((match) => match.round === 0);

    firstRoundMatches.forEach((match) => {
        match.slotNumbers.forEach((slotNumber) => {

            const playerName = inputNames[slotNumber - 1];

            match.players.push(playerName);

            const playerContainer = document.getElementById(`${match.id}-${slotNumber}`);
            if (!playerContainer) return;

            const playerNameElement = playerContainer.querySelector(".player-name");
            if (!playerNameElement) return;

            playerNameElement.textContent = playerName;
        });
    });
}

assignButton.addEventListener("click", handleAssign)