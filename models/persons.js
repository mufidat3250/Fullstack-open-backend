require('dotenv').config()
const mongoose = require('mongoose')

const url = process.env.MONGODB_URI
mongoose.connect(url)
mongoose.set('strictQuery', false)
const personSchema = new mongoose.Schema({
    name:String,
    number:String
})

personSchema.set('toJSON', {
    transform: (document, returedObject) => {
        returedObject.id = returedObject._id.toString()
        delete returedObject._id
        delete returedObject.__v
    }
})

const Persons = mongoose.model('Person', personSchema)

module.exports = Persons

