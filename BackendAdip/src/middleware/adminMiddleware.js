const jwt = require("jsonwebtoken");
const User = require("../models/user");
const redisClient = require("../config/redis")

const adminMiddleware = async (req,res,next)=>{
    try{
       
        const {token} = req.cookies;
        if(!token)
            throw new Error("Token is not present");

        const payload = jwt.verify(token,process.env.JWT_KEY);

        const {_id} = payload;

        if(!_id){
            throw new Error("Invalid token");
        }

        const user = await User.findById(_id);

        if(!user){
            throw new Error("User Doesn't Exist");
        }

        if(user.role !== 'admin')
            throw new Error("Admin access required");

        // Redis check
        const IsBlocked = await redisClient.exists(`token:${token}`);

        if(IsBlocked)
            throw new Error("Invalid Token");

        req.user = user;  

        next();
    }
    catch(err){
        res.status(401).send("Error: "+ err.message)
    }
}

module.exports = adminMiddleware;