import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    try{
        // Get the tokens from cookies.
        const token = req.cookies.token;

        if(!token){
            return res.status(400).json({message:"Not Authorized"});
        }

        //Verifing token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        //Attaching the user info
        req.user = decoded;

        next();
    } catch(error){
        res.status(400).json({message: "Invalid Token"});
    }
};

export default authMiddleware;