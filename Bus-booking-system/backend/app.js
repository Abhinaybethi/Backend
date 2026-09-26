require("dotenv").config();

const express = require("express");
const db = require("./config/db");

const app = express();

app.use(express.json());

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
app.get("/buses/available/:seats", async (req, res) => {
    try {
        const { seats } = req.params;

        const [buses] = await db.execute(
            `SELECT * FROM Buses
       WHERE availableSeats > ?`,
            [seats]
        );

        console.log(
            `Retrieved buses with more than ${seats} available seats`
        );

        res.status(200).json(buses);

    } catch (error) {
        console.error("Error retrieving available buses:", error);

        res.status(500).json({
            message: "Failed to retrieve buses"
        });
    }
});
app.post("/buses", async (req, res) => {
    try {
        const {
            busNumber,
            totalSeats,
            availableSeats
        } = req.body;

        if (!busNumber || !totalSeats || availableSeats === undefined) {
            return res.status(400).json({
                message: "busNumber, totalSeats and availableSeats are required"
            });
        }

        const [result] = await db.execute(
            `INSERT INTO Buses
       (busNumber, totalSeats, availableSeats)
       VALUES (?, ?, ?)`,
            [busNumber, totalSeats, availableSeats]
        );

        console.log(`Bus inserted successfully. ID: ${result.insertId}`);

        res.status(201).json({
            message: "Bus created successfully",
            busId: result.insertId
        });

    } catch (error) {
        console.error("Error inserting bus:", error);

        res.status(500).json({
            message: "Failed to create bus"
        });
    }
});

app.put("/users/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({
                message: "Name and email are required"
            });
        }

        const [result] = await db.execute(
            "UPDATE Users SET name = ?, email = ? WHERE id = ?",
            [name, email, id]
        );

        if (result.affectedRows === 0) {
            console.log(`Update failed. User ${id} not found.`);

            return res.status(404).json({
                message: "User not found"
            });
        }

        console.log(`User ${id} updated successfully.`);

        res.json({
            message: "User updated successfully"
        });

    } catch (error) {
        console.error("Update error:", error);

        res.status(500).json({
            message: "Failed to update user"
        });
    }
});

app.delete("/users/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.execute(
            "DELETE FROM Users WHERE id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            console.log(`Delete failed. User ${id} not found.`);

            return res.status(404).json({
                message: "User not found"
            });
        }

        console.log(`User ${id} deleted successfully.`);

        res.json({
            message: "User deleted successfully"
        });

    } catch (error) {
        console.error("Delete error:", error);

        res.status(500).json({
            message: "Failed to delete user"
        });
    }
});
