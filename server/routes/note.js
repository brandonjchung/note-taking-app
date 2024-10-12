import express from "express";

import db from "../db/connection.js";

import { ObjectId } from "mongodb";

const router = express.Router();

// get all notes
router.get("/", async (req, res) => {
    let collection = db.collection("notes");

    let results = await collection.find({}).toArray();

    res.send(results).status(200);
})

// get notes by userId
router.get("/:id", async (req, res) => {
    let collection = db.collection("notes");

    let query = { userId: req.params.id };

    let result = await collection.find(query).toArray();

    if(!result) res.send("Not Found").status(404);
    else res.send(result).status(200);
})

// create new note
router.post("/", async (req, res) => {
    try {
        let newNote = {
            title: req.body.title,
            markdown: req.body.markdown,
            tagIds: req.body.tagIds,
        };

        let collection = db.collection("notes");

        let result = await collection.insertOne(newNote);

        res.status(204).send(result);
    } catch(err) {
        console.log(err);
        res.status(500).send("Error creating record");
    }
})

// update a note
router.patch("/:id", async (req, res) => {
    try {
        const query = { _id: new ObjectId(req.params.id) };
        const updates = {
            $set: {
                title: req.body.title,
                markdown: req.body.markdown,
                tagIds: req.body.tagIds,
            }
        };

        let collection = db.collection("notes");

        let result = await collection.updateOne(query, updates);
        console.log(result);

        res.status(200).send(result);
    } catch(err) {
        console.log(err);
        res.status(500).send("Error updating record");
    }
})

// delete a note
router.delete("/:id", async (req, res) => {
    try {
        const query = { _id: new ObjectId(req.params.id) };
        
        let collection = db.collection("notes");

        let result = await collection.deleteOne(query);

        res.status(200).send(result);
    } catch(err) {
        console.log(err);
        res.status(500).send("Error deleting record");
    }
})

export default router;