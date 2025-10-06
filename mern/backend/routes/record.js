import express from "express";
import db from "../db/connection.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// Get all records
router.get("/", async (req, res) => {
  try {
    const collection = db.collection("records");
    const results = await collection.find({}).toArray();
    res.status(200).json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch records" });
  }
});

// Get single record by ID
router.get("/:id", async (req, res) => {
  try {
    const collection = db.collection("records");
    const query = { _id: new ObjectId(req.params.id) };
    const result = await collection.findOne(query);

    if (!result) {
      res.status(404).json({ error: "Record not found" });
    } else {
      res.status(200).json(result);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch record" });
  }
});

// Create new record
router.post("/", async (req, res) => {
  try {
    const newDocument = {
      name: req.body.name,
      position: req.body.position,
      level: req.body.level,
    };
    const collection = db.collection("records");
    const result = await collection.insertOne(newDocument);

    res.status(201).json({
      message: "Record added successfully",
      id: result.insertedId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add record" });
  }
});

// Update record by ID
router.patch("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const updates = {
      $set: {
        name: req.body.name,
        position: req.body.position,
        level: req.body.level,
      },
    };
    const collection = db.collection("records");
    const result = await collection.updateOne(query, updates);

    if (result.matchedCount === 0) {
      res.status(404).json({ error: "Record not found" });
    } else {
      res.status(200).json({ message: "Record updated", result });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update record" });
  }
});

// Delete record by ID
router.delete("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const collection = db.collection("records");
    const result = await collection.deleteOne(query);

    if (result.deletedCount === 0) {
      res.status(404).json({ error: "Record not found" });
    } else {
      res.status(200).json({ message: "Record deleted", result });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete record" });
  }
});

export default router;
