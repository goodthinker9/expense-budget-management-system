export const authorize=(...role)=>{
    // console.log("role")
    return(req,res,next)=>{
        // console.log("role",role)
        // console.log(req.user.role)
        // console.log(!role.includes(req.user.role))
        if(!role.includes(req.user.role)){
            return res.status(403).json({message:"Access denied. You do not have permission to perform this action."})
        }
        next()
    }
}