import { initializeCancelReservationView } from "./pages/cancelReservationView.js";

document.addEventListener("DOMContentLoaded", () => {

    if (document.querySelector(".cancelReservation")) {
        initializeCancelReservationView();
    }

});