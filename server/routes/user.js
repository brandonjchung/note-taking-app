import express from "express";

import db from "../db/connection.js";

import bcrypt from "bcrypt";

import { ObjectId } from "mongodb";

const router = express.Router();
const saltRounds = 10;

// get User
router.post("/login", async (req, res) => {
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

// sign up a new user
router.post("/signup", async (req, res) => {
    try {
        let collection = db.collection("users");

        let doesUsernameExist = await collection.findOne({ username: req.body.username });

        if(doesUsernameExist != null){
            res.status(401).send(null);
            return;
        }
        
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    
        let newUser = {
            username: req.body.username,
            password: hashedPassword
        };

        let result = await collection.insertOne(newUser);    

        if(result){
            res.status(201).send(JSON.stringify(newUser));
        }
    } catch(err) {
        console.log(err);
        res.status(500).send(null);
    }
})

// update user
router.patch("/update", async (req, res) => {
    try {
        console.log('req.body._id');
        console.log(req.body._id);
        const query = { _id: new ObjectId(req.body._id) };

        const updates = {
            $set: {
                stylePreferences: req.body.stylePreferences,
            }
        };

        let collection = db.collection("users");

        let result = await collection.updateOne(query, updates);
            
        let test = { _id: req.body._id };

        let resulttest = await collection.findOne(test);

        console.log('resulttest');
        console.log(resulttest);

        console.log('result');
        console.log(result);
        res.status(200).send(result);
    } catch(err) {
        console.log(err);
        res.status(500).send(null);
    }
})


export default router;