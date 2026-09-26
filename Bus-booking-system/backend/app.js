require("dotenv").config();

const express = require("express");
const db = require("./config/db");

const app = express();

const PORT = 3000;

app.use(express.json());


// --------------------------------------------------
// GET /
// --------------------------------------------------

app.get("/", (req, res) => {
    res.send("Student Management API is running!");
});


// --------------------------------------------------
// POST /students
// Create a student
// --------------------------------------------------

app.post("/students", async (req, res) => {
    try {
        const { name, email, age } = req.body;

        if (!name || !email || age === undefined) {
            return res.status(400).json({
                message: "Name, email and age are required"
            });
        }

        const [result] = await db.execute(
            `INSERT INTO students (name, email, age)
             VALUES (?, ?, ?)`,
            [name, email, age]
        );

        console.log(
            `INSERT: Student created with ID ${result.insertId}`
        );

        res.status(201).json({
            message: "Student created successfully",
            studentId: result.insertId
        });

    } catch (error) {

        console.error("INSERT ERROR:", error);

        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                message: "Email already exists"
            });
        }

        res.status(500).json({
            message: "Failed to create student"
        });
    }
});


// --------------------------------------------------
// GET /students
// Retrieve all students
// --------------------------------------------------

app.get("/students", async (req, res) => {
    try {

        const [students] = await db.execute(
            "SELECT * FROM students"
        );

        res.status(200).json(students);

    } catch (error) {

        console.error("GET STUDENTS ERROR:", error);

        res.status(500).json({
            message: "Failed to retrieve students"
        });
    }
});


// --------------------------------------------------
// GET /students/:id
// Retrieve one student
// --------------------------------------------------

app.get("/students/:id", async (req, res) => {
    try {

        const { id } = req.params;

        const [students] = await db.execute(
            "SELECT * FROM students WHERE id = ?",
            [id]
        );

        if (students.length === 0) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.status(200).json(students[0]);

    } catch (error) {

        console.error("GET STUDENT ERROR:", error);

        res.status(500).json({
            message: "Failed to retrieve student"
        });
    }
});


// --------------------------------------------------
// PUT /students/:id
// Update student
// --------------------------------------------------

app.put("/students/:id", async (req, res) => {
    try {

        const { id } = req.params;
        const { name, email, age } = req.body;

        if (!name || !email || age === undefined) {
            return res.status(400).json({
                message: "Name, email and age are required"
            });
        }

        const [result] = await db.execute(
            `UPDATE students
             SET name = ?, email = ?, age = ?
             WHERE id = ?`,
            [name, email, age, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        console.log(
            `UPDATE: Student ${id} updated successfully`
        );

        res.status(200).json({
            message: "Student updated successfully"
        });

    } catch (error) {

        console.error("UPDATE ERROR:", error);

        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                message: "Email already exists"
            });
        }

        res.status(500).json({
            message: "Failed to update student"
        });
    }
});


// --------------------------------------------------
// DELETE /students/:id
// Delete student
// --------------------------------------------------

app.delete("/students/:id", async (req, res) => {
    try {

        const { id } = req.params;

        const [result] = await db.execute(
            "DELETE FROM students WHERE id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        console.log(
            `DELETE: Student ${id} deleted successfully`
        );

        res.status(200).json({
            message: "Student deleted successfully"
        });

    } catch (error) {

        console.error("DELETE ERROR:", error);

        res.status(500).json({
            message: "Failed to delete student"
        });
    }
});


// --------------------------------------------------
// Start server
// --------------------------------------------------
const sequelize = require("./config/sequelize");
const Student = require("./models/Student");

async function startServer() {
    try {
        await sequelize.authenticate();

        console.log("Sequelize connected to MySQL successfully!");

        await Student.sync();

        console.log("Students table synchronized successfully!");

        app.listen(PORT, () => {
            console.log(
                `Server is up and running on port ${PORT}! Ready to handle requests.`
            );
        });

    } catch (error) {
        console.error("Database startup error:", error);
    }
}

startServer();