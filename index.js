require("dotenv").config()
const express = require("express")
const sequelize = require("./database")
const rotes = require('./rotes/index')
const errorHandler = require('./middleware/errorHandlingMiddleware')
const fileUpload = require('express-fileupload')
const path = require('path')


const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json())
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(fileUpload({}))
app.use('/api', rotes)

app.use(errorHandler)

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT, () => console.log(`Server started, port = ${PORT}`))
    } catch (e) {
        console.log("Error: ", e.message)
    }
}

start()
