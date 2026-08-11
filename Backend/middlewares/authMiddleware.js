import jwt from "jsonwebtoken";

export const isAuthenticated = async(req,res,next)=>{
    try {
        const token = req.cookies.token;
        if(!token){
            return res.json({
                success:false,
                message:"Please Login First."
            })
        }

        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success:false,
            message:"Invalid or Expired Token.",
            error: error.message
        })
    }
}

// to check wheather user is admin or student
export const isAdmin = async(req,res,next)=>{
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({
                success:false,
                message:"Acess denied. Admin only."
            })
        }

        next();

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Invalid or Expired Token.",
            error: error.message
        })
    }
}