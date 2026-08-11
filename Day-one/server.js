const express = require("express");
const app = express();

app.use(express.json());

let products = [
    { id: 1, name: "Apple TV", brand: "Apple" },
    { id: 2, name: "Realme Narzo 20", brand: "Realme" }
];

// GET all
app.get("/api/products", (req, res) => {
    res.json(products);
});

// GET one
app.get("/api/products/:id", (req, res) => {
    const id = Number(req.params.id);
    const product = products.find(p => p.id === id);

    if (!product) return res.status(404).json({ message: "Not found" });
    res.json(product);
});

// POST (create)
app.post("/api/products", (req, res) => {
    const newProduct = {
        id: products.length + 1,
        name: req.body.name,
        brand: req.body.brand
    };
    products.push(newProduct);
    res.status(201).json(newProduct);
});

// PUT (update)
app.put("/api/products/:id", (req, res) => {
    const id = Number(req.params.id);
    const product = products.find(p => p.id === id);

    if (!product) return res.status(404).json({ message: "Not found" });

    product.name = req.body.name;
    product.brand = req.body.brand;
    res.json(product);
});

// DELETE
app.delete("/api/products/:id", (req, res) => {
    const id = Number(req.params.id);
    const index = products.findIndex(p => p.id === id);

    if (index === -1) return res.status(404).json({ message: "Not found" });

    const deleted = products.splice(index, 1);
    res.json({ message: "Deleted", product: deleted[0] });
});

app.listen(5000, () => console.log("Server running on port 5000"));