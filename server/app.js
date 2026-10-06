import express from "express";
import dotenv from "dotenv"
import cors from "cors"
import router from "./routes/authRoute.js"
import categoryRouter from "./routes/categoryRoute.js"
import transactionRouter from "./routes/transactionRoute.js"
import reportRouter from "./routes/reportRoute.js"
dotenv.config()
const app =express()
app.use(express.json())
app.use(cors())
app.get("/",(req,res)=>{
    res.status(200).json({
        message:"the server is start accepting requests"
    })
})
app.use("/api/auth",router)
app.use("/api/category",categoryRouter)
app.use("/api/transaction",transactionRouter)
app.use("/api/reports",reportRouter)
export default app
