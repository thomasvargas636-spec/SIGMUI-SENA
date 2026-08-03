// Reservation cancellation page
// Controls the reservation cancellation workflow

const reservations = [
    {
        id: "PRK-001",
        status: "confirmada",
        zone: "Zona Norte A",
        date: "18 Mar 2026 - 2:00 AM",
        duration: "2 horas",
        price: "$2000"
    },
    {
        id: "PRK-002",
        status: "pendiente",
        zone: "Zona Sur B",
        date: "19 Mar 2026 - 4:00 PM",
        duration: "3 horas",
        price: "$3000"
    },
    {
        id: "PRK-003",
        status: "usada",
        zone: "Zona Central",
        date: "10 Mar 2025 - 2:00 AM",
        duration: "1 hora",
        price: "$1500"
    }
];

let selectedReservation = null;

export function initializeCancelReservationView() {

    showStep("list");

    registerEvents();

}

function renderReservations() {

    console.log("Rendering reservations...");

    reservations.forEach((reservation) => {
        console.log(reservation);
    });

}

function showStep(step) {

    const listStep = document.querySelector(".cancelReservation__step--list");
    const confirmationStep = document.querySelector(".cancelReservation__step--confirmation");
    const successStep = document.querySelector(".cancelReservation__step--success");

    listStep.style.display = "none";
    confirmationStep.style.display = "none";
    successStep.style.display = "none";

    switch (step) {

        case "list":
            listStep.style.display = "block";
            break;

        case "confirmation":
            confirmationStep.style.display = "block";
            break;

        case "success":
            successStep.style.display = "block";
            break;

    }

}

function registerEvents() {

    document.addEventListener("click", (event) => {

        if (event.target.closest(".reservationCard__button")) {
            showStep("confirmation");
        }

        if (event.target.closest(".cancelConfirmationCard__backButton")) {
            showStep("list");
        }

        if (event.target.closest(".cancelConfirmationCard__confirmButton")) {
            showStep("success");
        }

        if (event.target.closest(".cancelSuccessCard__reservationsButton")) {
            showStep("list");
        }

        if (event.target.closest(".cancelSuccessCard__homeButton")) {
            window.location.reload();
        }

    });

}

function cancelReservation() {

}

function showAlert(message) {

    console.log(message);

}