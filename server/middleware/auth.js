import  jwt from "jsonwebtoken"
const auth=async(req,res,next)=>{
    const authHeader=req.headers.authorization
    // console.log(authHeader)
    if(!authHeader){
        return res.status(401).json({message:"Access denied. No token provided."})
    }
    try {
        const token=authHeader.split(" ")[1]
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        // console.log(decoded)
        req.user=decoded
        next()
    } catch (error) {
        res.status(400).json({message:"Invalid token."})
    }
}
export default auth;