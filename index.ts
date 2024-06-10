import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectToMongoDB from './db/connectDb.ts'

const app = express()
dotenv.config()

const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.listen(PORT, () => {
    connectToMongoDB();
    console.log(`server is listening on ${PORT}`)
  })