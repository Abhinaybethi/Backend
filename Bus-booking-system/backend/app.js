require("dotenv").config();

const express = require("express");
const { Op } = require("sequelize");

const sequelize = require("./config/sequelize");

const User = require("./models/User");
const Bus = require("./models/Bus");
const Booking = require("./models/Booking");
const Payment = require("./models/Payment");

const app = express();

const PORT = 3000;

app.use(express.json());


// --------------------------------------------------
// GET /
// --------------------------------------------------

app.get("/", (req, res) => {
    res.send("Bus Booking API is running!");
});


// --------------------------------------------------
// POST /users
// Create a user using Sequelize
// --------------------------------------------------

app.post("/users", async (req, res) => {
    try {
        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({
                message: "Name and email are required"
            });
        }

        const user = await User.create({
            name,
            email
        });

        console.log(
            `INSERT: User created with ID ${user.id}`
        );

        res.status(201).json({
            message: "User created successfully",
            user
        });

    } catch (error) {
        console.error("CREATE USER ERROR:", error);

        if (error.name === "SequelizeUniqueConstraintError") {
            return res.status(409).json({
                message: "Email already exists"
            });
        }

        res.status(500).json({
            message: "Failed to create user"
        });
    }
});


// --------------------------------------------------
// GET /users
// Retrieve all users using Sequelize
// --------------------------------------------------

app.get("/users", async (req, res) => {
    try {
        const users = await User.findAll();

        res.status(200).json(users);

    } catch (error) {
        console.error("GET USERS ERROR:", error);

        res.status(500).json({
            message: "Failed to retrieve users"
        });
    }
});


// --------------------------------------------------
// POST /buses
// Create a bus using Sequelize
// --------------------------------------------------

app.post("/buses", async (req, res) => {
    try {
        const {
            busNumber,
            totalSeats,
            availableSeats
        } = req.body;

        if (
            !busNumber ||
            totalSeats === undefined ||
            availableSeats === undefined
        ) {
            return res.status(400).json({
                message: "Bus number, total seats and available seats are required"
            });
        }

        const bus = await Bus.create({
            busNumber,
            totalSeats,
            availableSeats
        });

        console.log(
            `INSERT: Bus created with ID ${bus.id}`
        );

        res.status(201).json({
            message: "Bus created successfully",
            bus
        });

    } catch (error) {
        console.error("CREATE BUS ERROR:", error);

        if (error.name === "SequelizeUniqueConstraintError") {
            return res.status(409).json({
                message: "Bus number already exists"
            });
        }

        res.status(500).json({
            message: "Failed to create bus"
        });
    }
});


// --------------------------------------------------
// GET /buses/available/:seats
// Retrieve buses where availableSeats > seats
// --------------------------------------------------

app.get("/buses/available/:seats", async (req, res) => {
    try {
        const seats = Number(req.params.seats);

        if (Number.isNaN(seats)) {
            return res.status(400).json({
                message: "Seats must be a valid number"
            });
        }

        const buses = await Bus.findAll({
            where: {
                availableSeats: {
                    [Op.gt]: seats
                }
            }
        });

        res.status(200).json(buses);

    } catch (error) {
        console.error("GET AVAILABLE BUSES ERROR:", error);

        res.status(500).json({
            message: "Failed to retrieve available buses"
        });
    }
});


// --------------------------------------------------
// Start server
// --------------------------------------------------

async function startServer() {
    try {

        // Connect to MySQL
        await sequelize.authenticate();

        console.log(
            "Sequelize connected to MySQL successfully!"
        );

        // Synchronize all required models
        await User.sync();
        await Bus.sync();
        await Booking.sync();
        await Payment.sync();

        console.log(
            "All Sequelize models synchronized successfully!"
        );

        // Start Express server
        app.listen(PORT, () => {
            console.log(
                `Server is up and running on port ${PORT}! Ready to handle requests.`
            );
        });

    } catch (error) {
        console.error(
            "Database startup error:",
            error
        );
    }
}

startServer();