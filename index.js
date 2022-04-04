const express = require('express')
const mongoose  = require('mongoose')
const authRouter = require('./authRouter')
const PORT = process.env.PORT || 6000

const app = express()

app.use(express.json())
app.use("/auth", authRouter)


const start = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/autorisation')
        app.listen(PORT, () => console.log(`server started on port ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}

start()