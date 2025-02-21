import express from "express";

import db from "../db/connection.js";

import bcrypt from "bcryptjs";

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
            firstName: req.body.firstName,
            lastName: req.body.lastName,
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

// update user style
router.patch("/updateStyle", async (req, res) => {
    try {
        const query = { _id: new ObjectId(String(req.body._id)) };

        console.log(req.body.stylePreferences);
        const updates = {
            $set: {
                stylePreferences: req.body.stylePreferences,
            }
        };

        let collection = db.collection("users");

        let result = await collection.updateOne(query, updates);
            
        console.log(result);
        res.status(200).send(result);
    } catch(err) {
        console.log(err);
        res.status(500).send(null);
    }
})

// update user style
router.patch("/updateLayout", async (req, res) => {
    try {
        const query = { _id: new ObjectId(String(req.body._id)) };

        console.log(req.body.layout);
        const updates = {
            $set: {
                layout: req.body.layout,
            }
        };

        let collection = db.collection("users");

        let result = await collection.updateOne(query, updates);
            
        console.log(result);
        res.status(200).send(result);
    } catch(err) {
        console.log(err);
        res.status(500).send(null);
    }
})

router.patch("/updateProfileWithPassword", async (req, res) => {
    try {
        const query = { _id: new ObjectId(String(req.body._id)) };

        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

        const updates = {
            $set: {
                username: req.body.username,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                password: hashedPassword
            }
        };

        let collection = db.collection("users");

        let result = await collection.updateOne(query, updates);
            
        res.status(200).send(result);
    } catch(err) {
        console.log(err);
        res.status(500).send(null);
    }
})

router.patch("/updateProfileWithoutPassword", async (req, res) => {
    try {
        const query = { _id: new ObjectId(String(req.body._id)) };

        const updates = {
            $set: {
                username: req.body.username,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
            }
        };

        let collection = db.collection("users");

        let result = await collection.updateOne(query, updates);
            
        res.status(200).send(result);
    } catch(err) {
        console.log(err);
        res.status(500).send(null);
    }
})


export default router;