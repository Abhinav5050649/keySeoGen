const mongoose = require(`mongoose`)
mongoose.set('strictQuery', true);
require('dotenv').config()
const mongooseURL = process.env.mongooseURL

const connectToMongo = () => {
    mongoose.connect(mongooseURL, () => {
        console.log(`Connected to DB`)
    })
}

module.exports = connectToMongo