import express from "express";

import db from "../db/connection.js";

import bcrypt from "bcrypt";

const router = express.Router();
const saltRounds = 10;

// get User
router.post("/", async (req, res) => {
    let collection = db.collection("users");

    let query = { username: req.body.username };

    let result = await collection.findOne(query);

    const correctPassword = await bcrypt.compare(req.body.password, result.password)

    if(result == null || correctPassword == false) {
        res.status(404).send(result);
    }
    else {
        res.status(200).send(JSON.stringify(result));
    }
})

export default router;