import express from "express";

import db from "../db/connection.js";

import { ObjectId } from "mongodb";

const router = express.Router();

// get all Tags
router.get("/", async (req, res) => {
    let collection = db.collection("tags");

    let results = await collection.find({}).toArray();

    res.status(200).send(results);
})

// get Tags by userId
router.get("/:id", async (req, res) => {
    let collection = db.collection("tags");

    let query = { userId: req.params.id };

    let result = await collection.find(query).toArray();

    if(!result) res.status(404).send("Not Found");
    else res.status(200).send(result);
})

// create new Tag
router.post("/", async (req, res) => {
    try {
        let newTag = {
            label: req.body.label,
            userId: req.body.userId,
        };

        let collection = db.collection("tags");

        let result = await collection.insertOne(newTag);
        console.log(result);

        res.status(200).send(result);
    } catch(err) {
        console.log(err);
        res.status(500).send("Error creating record");
    }
})

// create new Tags
router.post("/many", async (req, res) => {
    try {
        let collection = db.collection("tags");

        const newTags = req.body.labels.map((label) => { return { label: label, userId: userId }})

        let result = await collection.insertMany(newTags);

        res.status(200).send(result);
    } catch(err) {
        console.log(err);
        res.status(500).send("Error creating record");
    }
})

// updates a group of Tags
router.patch("/many", async (req, res) => {
    try {
        console.log(req.body);
        const bulkOperation = req.body.tags.map((tag) => {
            return {
                updateMany: {
                    filter: { _id: new ObjectId(String(tag._id)) },
                    update: { $set: { label: tag.label } }
                }
            }
        });

        let collection = db.collection("tags");

        let result = await collection.bulkWrite(bulkOperation);

        res.status(200).send(result);
    } catch(err) {
        console.log(err);
        res.status(500).send("Error updating record");
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

        res.status(200).send(result);
    } catch(err) {
        console.log(err);
        res.status(500).send("Error updating record");
    }
})

// delete a group of Tags
router.delete("/many", async (req, res) => {
    try {
        const idsToDelete = req.body.ids.map((id) => {
            return new ObjectId((String(id)));
        })

        const query = { _id: { $in: idsToDelete } };
        
        let collection = db.collection("tags");

        let result = await collection.deleteMany(query);

        res.status(200).send(result);
    } catch(err) {
        console.log(err);
        res.status(500).send("Error deleting record");
    }
})

// delete a Tag
router.delete("/:id", async (req, res) => {
    try {
        const query = { _id: new ObjectId(req.params.id) };
        
        let collection = db.collection("tags");

        let result = await collection.deleteOne(query);

        res.status(200).send(result);
    } catch(err) {
        console.log(err);
        res.status(500).send("Error deleting record");
    }
})

export default router;