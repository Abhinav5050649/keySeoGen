const connectToMongo = require(`./db`)
const express = require(`express`)
const cors = require(`cors`)
const port = 5002
const app = express()
const bodyparser = require('body-parser')
const expressSanitizer = require('express-sanitizer');
var cookies = require("cookie-parser");
require('dotenv').config()

connectToMongo()

app.use(express.json())
app.use(cors())
// Mount express-sanitizer middleware here
app.use(expressSanitizer())
app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json())
app.use(cookies());

app.use(`/api/auth`, require(`./routes/auth`))
app.use(`/api/search`, require(`./routes/search`))

app.get(`/`, (req, res) => {
    res.send(`Testing!`)
})

app.listen(port, () => {
    console.log(`App listening on PORT: ${port}`)
})