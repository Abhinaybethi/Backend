const express = require("express");

const app = express();

// Needed so req.body works when we start sending JSON from the client (POST/PUT)
app.use(express.json());

//creating multiple products in Array format
const products = [
    { id: 1, name: "Apple TV", brand: "Apple" },
    { id: 2, name: "Realme Narzo 20", brand: "Realme", location: "India" }
];

app.get("/", (req, res) => {
    res.send("Backend is running!");
});

// READ ALL
app.get("/api/products", (req, res) => {
    res.json(products);
});

// READ ONE
app.get("/api/products/:id", (req, res) => {
    const id = Number(req.params.id);
    const product = products.find(p => p.id === id);

    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
});

// CREATE
app.post("/api/products", (req, res) => {
    const newProduct = {
        id: products.length ? products[products.length - 1].id + 1 : 1,
        name: req.body.name,
        brand: req.body.brand
    };

    products.push(newProduct);
    res.status(201).json(newProduct);
});

// UPDATE (full replace)
app.put("/api/products/:id", (req, res) => {
    const id = Number(req.params.id);
    const index = products.findIndex(p => p.id === id);

    if (index === -1) {
        return res.status(404).json({ message: "Product not found" });
    }

    const updatedProduct = {
        id,
        name: req.body.name,
        brand: req.body.brand
    };

    products[index] = updatedProduct;
    res.json(updatedProduct);
});

// UPDATE (partial)
app.patch("/api/products/:id", (req, res) => {
    const id = Number(req.params.id);
    const product = products.find(p => p.id === id);

    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    Object.assign(product, req.body);
    res.json(product);
});

// DELETE
app.delete("/api/products/:id", (req, res) => {
    const id = Number(req.params.id);
    const index = products.findIndex(p => p.id === id);

    if (index === -1) {
        return res.status(404).json({ message: "Product not found" });
    }

    const deleted = products.splice(index, 1);
    res.json({ message: "Product deleted", product: deleted[0] });
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});