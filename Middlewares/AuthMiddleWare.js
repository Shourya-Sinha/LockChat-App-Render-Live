import jwt from "jsonwebtoken";

export const verifyToken = (req,res,next)=>{
    try {
        const token = req.cookies.jwt;

        if(!token){
            return res.status(401).json({
                message: 'You are not Authenticated!! Please Login Again.'
            });
        }

        jwt.verify(token,process.env.JWT_KEY,async(err,payload)=>{
            if(err){
                return res.status(403).json({
                    message: 'Token is not valid!! Please Login Again.'
                });
            }
            req.userId = payload.userId;

            next();
        })

    } catch (error) {
        return res.status(500).json({
            message: error || 'Server Error!! Please try again.'
        });
    }
}