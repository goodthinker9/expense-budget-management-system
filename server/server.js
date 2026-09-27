import db from "./config/db.js"
import app from "./app.js"
import dotenv from "dotenv"
dotenv.config()
const PORT =process.env.PORT
async function startServer(){
    try {
        const connection =await db.getConnection()
        console.log("the db connected sucessfully")

        app.listen(PORT,()=>{
        console.log(`Server running on http://localhost:${PORT}`);
        })   
        connection.release()
    } catch (error) {
        console.log("failed to connect to db",error.message)
    }
}
startServer()