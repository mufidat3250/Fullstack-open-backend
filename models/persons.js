const logger = require('../utils/logger') 
require("dotenv").config()
const mongoose = require("mongoose")


const url = process.env.MONGODB_URI
mongoose.connect(url).then(()=> {
    logger.info('Connected to mongo DB')
}).catch((error)=> {
    logger.error('Error connecting to mongo dB', error.message)
})

mongoose.set("strictQuery", false)
const personSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true,
        minLength: 3
    },
    number:{
        type:String,
        minLength:8,
        required:true,
        validate: {
            validator: function(v) {
                return /^\d{2,3}-\d{4,10}$/.test(v)
            },
        }
    }
})

personSchema.set("toJSON", {
    transform: (document, returedObject) => {
        returedObject.id = returedObject._id.toString()
        delete returedObject._id
        delete returedObject.__v
    }
})

const Persons = mongoose.model("Person", personSchema)

module.exports = Persons

