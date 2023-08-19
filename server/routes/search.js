const express = require("express");
const User = require("../models/user");
const router = express.Router();
const jwt = require("jsonwebtoken");
require('dotenv').config()
const fetchUser = require("../middleware/fetchuser");

router.post(`/keywords/:obj`, fetchUser, async(req, res) => {
    try{
        axios.post(`localhost:8000/search_param/:${req.sanitize(req.params.obj)}`)
        .then((response) => {
            return res.status(200).json(response)
        })
        .catch((error) => {
            return res.status(500).json({message: "Error with "})
        })
    }
    catch(error){
        console.error(error)
        return res.status(500).json({message: "Internal Server Error!"})
    }
})

router.post(`/seo/:obj`, fetchUser, async(req, res)=> {
    try{
        const sdk = require('api')('@eden-ai/v2.0#rmckb24zallf965p7');

        sdk.auth('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZjQ3NmRiNGItNTNmNi00MzcyLWFjODMtMDVlYzJlMTAzYzAwIiwidHlwZSI6ImFwaV90b2tlbiJ9.WFSnllRq-K7Dt7kR-pcNUCRwH85Ss2Z7-f_4gP2ENkw');
        sdk.text_generation_create({
        response_as_dict: true,
        attributes_as_list: false,
        show_original_response: false,
        temperature: 0,
        max_tokens: 100,
        providers: 'cohere,openai,anthropic,google,ai21labs',
        text: `Generate seo keywords related to ${obj}`
        })
        .then(({ data }) => console.log(data))
        .catch(err => console.error(err));
    }
    catch(error){
        console.error(error)
        return res.status(500).json({message: "Internal Server Error!"})
    }
})

module.exports = router;