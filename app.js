require("dotenv").config()
const logger = require('./utils/logger')
const express = require("express")
const personRouter = require('./routes/persons')
const middleWare = require('./utils/middleware')
const cors = require("cors")
const app = express()

app.use(express.static("dist"))
app.use(express.json())
app.use(cors())
app.use(middleWare.requestLogger)


app.use('/api/persons', personRouter)

app.use(middleWare.errorHandler)



module.exports = app