import express from "express";

import db from "../db/connection.js";

import bcrypt from "bcrypt";

const router = express.Router();
const saltRounds = 10;

// sign up a new user
router.post("/", async (req, res) => {
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


export default router;