const express = require("express");
const User = require("../models/user");
const router = express.Router();
const jwt = require("jsonwebtoken");
require('dotenv').config()
var axios = require("axios");
const fetchUser = require("../middleware/fetchuser");

router.post(`/keywords`, fetchUser, async(req, res) => {
    try{
        //console.log("testing1")
        let search_obj = req.sanitize(req.body.search_obj)
        // const response = await fetch(`http://localhost:8000/scrape-google/?search_param=${search_obj}`);
        // const data = await response.json();
        // return res.status(200).send(data)
        axios({
            url: `http://localhost:8000/scrape-google/?search_param=${search_obj}`,
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
        })
        .then(function(response) {
            console.log(response.data)
            return res.status(200).send(response.data)
        })
        .catch(function(error) {
            console.log(error)
        })

    }
    catch(error){
        //console.log("hello")
        console.error(error)
        return res.status(500).json({message: "Internal Server Error!"})
    }
})

router.get(`/seo/:obj`, fetchUser, async(req, res)=> {
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
        text: `Generate seo keywords related to ${req.params.obj}`
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