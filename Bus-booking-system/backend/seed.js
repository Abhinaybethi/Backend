require("dotenv").config();

const sequelize = require("./config/sequelize");
const User = require("./models/User");
const Bus = require("./models/Bus");

async function seedDatabase() {
    try {
        await sequelize.authenticate();

        console.log("Connected to MySQL successfully!");

        await User.sync();
        await Bus.sync();

        // 3 Users
        await User.create({
            name: "Rahul",
            email: "rahul@example.com"
        });

        await User.create({
            name: "Priya",
            email: "priya@example.com"
        });

        await User.create({
            name: "Arjun",
            email: "arjun@example.com"
        });

        // 2 Buses
        await Bus.create({
            busNumber: "TS01AB1234",
            totalSeats: 40,
            availableSeats: 25
        });

        await Bus.create({
            busNumber: "TS02CD5678",
            totalSeats: 50,
            availableSeats: 8
        });

        console.log("3 users and 2 buses inserted successfully!");

    } catch (error) {
        console.error("Seeding error:", error);
    } finally {
        await sequelize.close();
    }
}

seedDatabase();