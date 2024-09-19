import express from "express";

import db from "../db/connection.js";

import { ObjectId } from "mongodb";

const router = express.Router();

// get all tags
router.get("/", async (req, res) => {
    let collection = db.collection("tags");

    let results = await collection.find({}).toArray();

    res.send(results).status(200);
})

// get Tag by id
router.get("/:id", async (req, res) => {
    let collection = db.collection("tags");

    let query = { _id: new ObjectId(req.params.id) };

    let result = await collection.findOne(query);

    if(!result) res.send("Not Found").status(404);
    else res.send(result).status(200);
})

// create new Tag
router.post("/", async (req, res) => {
    try {
        console.log(req);
        let newTag = {
            label: req.body.label,
        };

        let collection = db.collection("tags");

        let result = await collection.insertOne(newTag);

        res.send(result).status(204);
    } catch(err) {
        console.log(err);
        res.status(500).send("Error creating record");
    }
})

// update a Tag
router.patch("/:id", async (req, res) => {
    try {
        const query = { _id: new ObjectId(req.params.id) };
        const updates = {
            $set: {
                label: req.body.label,
            }
        };

        let collection = db.collection("tags");

        let result = await collection.updateOne(query, updates);

        res.send(result).status(200);
    } catch(err) {
        console.log(err);
        res.status(500).send("Error updating record");
    }
})

// delete a Tag
router.delete("/:id", async (req, res) => {
    try {
        const query = { _id: new ObjectId(req.params.id) };
        
        let collection = db.collection("tags");

        let result = await collection.deleteOne(query);

        res.send(result).status(200);
    } catch(err) {
        console.log(err);
        res.status(500).send("Error deleting record");
    }
})

export default router;