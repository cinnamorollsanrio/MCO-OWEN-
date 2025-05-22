// Sample user accounts
const accounts = [
    { user: "user1", pass: "pass1" },
    { user: "user2", pass: "pass2" }
];

// Bus fleet
const busFleet = {
    luxury: [
        { name: "Luxury-21", cost: 300, seats: 30 },
        { name: "Luxury-22", cost: 300, seats: 30 },
        { name: "Luxury-23", cost: 300, seats: 30 },
        { name: "Luxury-24", cost: 300, seats: 30 }
    ],
    aircon: [
        { name: "Aircon-31", cost: 400, seats: 30 },
        { name: "Aircon-32", cost: 400, seats: 30 },
        { name: "Aircon-33", cost: 400, seats: 30 },
        { name: "Aircon-34", cost: 400, seats: 30 }
    ],
    minibus: [
        { name: "Mini-41", cost: 300, seats: 25 },
        { name: "Mini-42", cost: 300, seats: 25 },
        { name: "Mini-43", cost: 300, seats: 25 },
        { name: "Mini-44", cost: 300, seats: 25 }
    ],
    uvx: [
        { name: "UVX-51", cost: 400, seats: 25 },
        { name: "UVX-52", cost: 400, seats: 25 },
        { name: "UVX-53", cost: 400, seats: 25 },
        { name: "UVX-54", cost: 400, seats: 25 }
    ]
};

// Reservation history
const bookings = [];

function userLogin() {
    const u = prompt("Username:");
    const p = prompt("Password:");
    const found = accounts.find(acc => acc.user === u && acc.pass === p);
    if (found) {
        alert("Welcome, " + u);
        return u;
    } else {
        alert("Login failed.");
        return null;
    }
}

function showBusOptions(type) {
    const list = busFleet[type];
    let msg = `Available ${type} buses:\n`;
    list.forEach((bus, idx) => {
        msg += `${idx + 1}. ${bus.name} | ₱${bus.cost} | Seats left: ${bus.seats}\n`;
    });
    alert(msg);
    const index = parseInt(prompt("Select a bus number:")) - 1;
    return index >= 0 && index < list.length ? index : -1;
}

function handleReservation(userName) {
    const type = prompt("Bus type? (luxury, aircon, minibus, uvx)").toLowerCase();
    if (!busFleet[type]) {
        alert("Type not found.");
        return;
    }

    const busIdx = showBusOptions(type);
    if (busIdx === -1) {
        alert("Invalid selection.");
        return;
    }

    const seat = prompt("Seat number:");
    const chosenBus = busFleet[type][busIdx];

    const duplicate = bookings.find(b => b.user === userName && b.bus === chosenBus.name && b.seat === seat);
    if (duplicate) {
        alert("You already reserved this seat.");
        return;
    }

    if (chosenBus.seats <= 0) {
        alert("No more seats.");
        return;
    }

    bookings.push({
        user: userName,
        bus: chosenBus.name,
        type,
        seat,
        paid: false,
        proof: null,
        price: chosenBus.cost
    });

    chosenBus.seats--;
    alert("Reservation confirmed!");
}

function cancelBooking(userName) {
    const busName = prompt("Enter bus name to cancel:");
    const seatNum = prompt("Enter seat number:");

    const index = bookings.findIndex(b => b.user === userName && b.bus === busName && b.seat === seatNum);
    if (index === -1) {
        alert("Booking not found.");
        return;
    }

    const category = bookings[index].type;
    const bus = busFleet[category].find(b => b.name === busName);
    if (bus) bus.seats++;

    bookings.splice(index, 1);
    alert("Reservation cancelled.");
}

function makePayment(userName) {
    const bus = prompt("Bus name:");
    const seat = prompt("Seat number:");
    const image = prompt("Upload proof (filename or URL):");

    const booking = bookings.find(b => b.user === userName && b.bus === bus && b.seat === seat);
    if (!booking) {
        alert("No reservation found.");
        return;
    }

    booking.paid = true;
    booking.proof = image;
    alert("Payment successful.");
}

function displayBookings() {
    if (bookings.length === 0) {
        alert("No bookings.");
        return;
    }

    let output = "";
    bookings.forEach(b => {
        output += `Passenger: ${b.user}\nBus: ${b.bus} (${b.type})\nSeat: ${b.seat}\nPrice: ₱${b.price}\nPaid: ${b.paid ? "Yes" : "No"}\nProof: ${b.proof || "None"}\n---\n`;
    });
    alert(output);
}

function showMenu() {
    const currentUser = userLogin();
    if (!currentUser) return;

    while (true) {
        const option = prompt(
            "Menu:\n1. Reserve\n2. Cancel\n3. Pay\n4. View\n5. Exit"
        );

        switch (option) {
            case "1":
                handleReservation(currentUser);
                break;
            case "2":
                cancelBooking(currentUser);
                break;
            case "3":
                makePayment(currentUser);
                break;
            case "4":
                displayBookings();
                break;
            case "5":
                alert("Thanks for using the system.");
                return;
            default:
                alert("Invalid option.");
        }
    }
}

showMenu();
