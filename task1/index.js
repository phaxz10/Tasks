let hideDischarged = false

const patients = [
    { id: "P101", name: "Santos, Maria", status: "Active", balance: 1500.00, ward: "A" },
    { id: "P102", name: "Reyes, Jose", status: "Discharged", balance: 0.00, ward: "B" },
    { id: "P103", name: "Cruz, Ana", status: "Active", balance: 0.00, ward: "A" },
    { id: "P104", name: "Bautista, Luis", status: "Active", balance: 5200.50, ward: "C" },
    { id: "P105", name: "Garcia, Elena", status: "Discharged", balance: 300.00, ward: "B" }
];

const PHPFormatter = new Intl.NumberFormat('en-PH', {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
})

const sortedPatients = patients.toSorted((a, b) => {
    const statusA = a.status;
    const statusB = b.status;

    // show active patients first
    if (statusA !== statusB) {
        return statusA === "Active" ? -1 : 1;
    }

    // then sort by ward
    return a.ward.localeCompare(b.ward);
});

// since we sorted patients with active first, we can slice out the discharged patients
let firstDischargedIndex = -1

for (let i = 0; i < sortedPatients.length; i++) {
    if (sortedPatients[i].status === "Discharged") {
        firstDischargedIndex = i;
        break;
    }
}

const noDischargedPatients = firstDischargedIndex !== -1 ? sortedPatients.slice(0, firstDischargedIndex) : sortedPatients;

const app = document.getElementById("app");

if (!app) {
    throw new Error("App container not found");
}

const button = document.createElement("button");
const listContainer = document.createElement("div");
listContainer.classList.add("container")

app.append(button, listContainer);


const renderPatients = (patientList) => {
    button.textContent = hideDischarged ? "Show All" : "Hide Discharged";
    const fragment = document.createDocumentFragment();

    patientList.forEach((patient) => {

        const card = document.createElement("div");
        card.classList.add("patient-card");

        // apply style for discharged status
        if (patient.status.toUpperCase() === "DISCHARGED") {
            card.classList.add("discharged");
        }

        // apply style for active patients with balance
        if (patient.status.toUpperCase() === "ACTIVE" && patient.balance > 0) {
            card.classList.add("active-with-balance");
        }

        // other patient info
        card.innerHTML = `
          <p>${patient.name}</p>
          <p>Status: ${patient.status}</p>
          <p>Ward: ${patient.ward}</p>
          <p>Balance: ${PHPFormatter.format(patient.balance)}</p>
        `;


        fragment.appendChild(card);
    });

    listContainer.replaceChildren(fragment);
}


renderPatients(sortedPatients);

button.addEventListener("click", () => {
    if (hideDischarged) {
        hideDischarged = false;
        renderPatients(sortedPatients);
    } else {
        hideDischarged = true;
        renderPatients(noDischargedPatients)
    }
})
