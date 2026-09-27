import app from "./app.js"

async function startServer(){
    try {
        // const connection = await app.listen(process.env.PORT)
        app.listen(process.env.PORT,()=>{
            console.log(`server is running on port ${process.env.PORT}`)
        })
    } catch (error) {
        console.error("Error starting server:", error)
    }
}

startServer()