const express = require('express')
const app = express();
require('dotenv').config();
const main = require('./config/db')
const cookieParser = require('cookie-parser');
const redisClient = require('./config/redis');
const authRouter = require("./routes/userAuth");
const beneficiaryRouter = require("./routes/applyRouter");
const applicationRouter = require('./routes/applicationRouter');
const contactRouter = require("./routes/contactRouter");


const cors = require("cors");
const path = require("path");

app.use(cors({ 
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json());
app.use(cookieParser()); 

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use('/user', authRouter);
app.use('/beneficiary', beneficiaryRouter);
app.use('/application', applicationRouter);
app.use('/api', contactRouter); 



const InitalizeConnection = async ()=>{
    try{

        await Promise.all([main(),redisClient.connect()]);
        console.log("DB Connected");
        
        app.listen(process.env.PORT, ()=>{
            console.log("Server listening at port number: "+ process.env.PORT);
        })

    }
    catch(err){
        console.log("Error: "+err);
    }
}


InitalizeConnection();
