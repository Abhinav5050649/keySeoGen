const express = require("express");
const User = require("../models/user");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require('dotenv').config()
const fetchUser = require("../middleware/fetchuser");
const { body, validationResult } = require('express-validator')

//Signup --> works
router.post(`/signup`, 
    body('email').isEmail(),
    body('password').isLength({min: 5}),
    async(req, res) => {
        try{
            let user = await User.findOne({email: req.body.email})

            if (user)
            {
                return res.status(400).json({"success": false, "errors": "Account exists!"})
            }

            const salt = await bcrypt.genSalt(10);
            const secPass = await bcrypt.hash(req.body.password, salt);

            user = await User.create({
                email: req.body.email,
                password: secPass
            })

            const data = {
                user: {
                    id: user.id,
                }
            };

            const authToken = jwt.sign(data, process.env.JWT_SECRET);
            //change secure to true in prod, keep to false in dev/test
            res.cookie('token', authToken, { httpOnly: true, secure: true })

            return res.status(200).json({message: "Successful signup!"})
            //return res.status(200).cookie('token', authToken, { httpOnly: true, secure: false }).json({message: "Successful signup!"})
        }   catch (error) {
            console.error(error);
            return res.status(500).send(`Internal Server Error!!!`);
        }
    }
);

//for login --> works
router.post(`/login`, 
    body('email').isEmail(),
    body('password').isLength({min: 5}),
    async(req, res) => {
        try{
            const user = await User.findOne({"email": req.body.email})

            if (!user)
            {
                return res.status(400).json({"success": false})
            }

            const passwordComparison = await bcrypt.compare(req.body.password, user.password);

            if (!passwordComparison){
                return res.status(400).json({"success": false})
            }

            const data = {
                user: {
                    id: user.id,
                },
            }

            const authToken = jwt.sign(data, process.env.JWT_SECRET);
            //console.log(authToken)
            //return res.status(200).cookie('token', authToken, { httpOnly: true, secure: false }).json({message: "Successful login!"})
            //change secure to true in prod, keep to false in dev/test
            res.cookie('token', authToken, { httpOnly: true, secure: true })
            return res.status(200).json({message: "Successful login!"})

        }   catch (error)   {
            console.error(error);
            res.status(500).send(`Internal Server Error!!!`);
        }
    }
)

router.get("/logout", async(req, res) => {
    try{
        return res.clearCookie('token').send('Log Out!');redirect("/")
    }catch(error){
        console.error(error)
        return res.status(500).json({message: "Log out error!"})
    }
})

module.exports = router;