require("dotenv").config();

const express = require("express");
const db = require("./config/db");

const app = express();

app.use(express.json());

const PORT = 3000;

app.get("/", (req, res) => {
    res.send("Server is up and running on port 3000! Ready to handle requests.");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.post("/users", async (req, res) => {
    try {
        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({
                message: "Name and email are required"
            });
        }

        const [result] = await db.execute(
            "INSERT INTO Users (name, email) VALUES (?, ?)",
            [name, email]
        );

        console.log(`User inserted successfully. ID: ${result.insertId}`);

        res.status(201).json({
            message: "User created successfully",
            userId: result.insertId
        });

    } catch (error) {
        console.error("Insert error:", error);

        res.status(500).json({
            message: "Failed to create user"
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