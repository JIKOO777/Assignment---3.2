const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// GET all (with optional query search/sort)
router.get("/", async (req, res) => {
  try {
    const { q, sort } = req.query;
    const filter = q
      ? {
          $or: [
            { title: { $regex: q, $options: "i" } },
            { category: { $regex: q, $options: "i" } }
          ]
        }
      : {};

    let query = Product.find(filter);

    // sort: newest | price_asc | price_desc | title_asc
    if (sort === "price_asc") query = query.sort({ price: 1 });
    else if (sort === "price_desc") query = query.sort({ price: -1 });
    else if (sort === "title_asc") query = query.sort({ title: 1 });
    else query = query.sort({ createdAt: -1 });

    const items = await query.exec();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: String(err) });
  }
});

// GET one by id
router.get("/:id", async (req, res) => {
  try {
    const item = await Product.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: "Invalid id", error: String(err) });
  }
});

// CREATE
router.post("/", async (req, res) => {
  try {
    const created = await Product.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ message: "Validation error", error: String(err) });
  }
});

// UPDATE
router.put("/:id", async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: "Update failed", error: String(err) });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted", id: req.params.id });
  } catch (err) {
    res.status(400).json({ message: "Delete failed", error: String(err) });
  }
});

module.exports = router;
