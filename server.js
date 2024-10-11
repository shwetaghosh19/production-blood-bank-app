const express=require('express');
const app=express();
const dotenv=require('dotenv');
const colors=require('colors');
const morgan=require('morgan');
const cors=require('cors');
const connectDB=require('./config/db');
const path=require('path')
dotenv.config();
//mongoDB connection
connectDB();
//middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
//routes
app.use("/api/v1/test",require("./routes/testRouter"));
app.use("/api/v1/auth",require("./routes/authRoutes"));
app.use("/api/v1/inventory",require("./routes/inventoryRoutes"))
app.use("/api/v1/analytics",require("./routes/analyticsRoutes"))
app.use("/api/v1/admin",require("./routes/adminRoutes"))

//STATIC Folder
app.use(express.static(path.join(__dirname,'./client/build')))
//Static Routes
app.get('*',function(req,res){
    res.sendFile(path.join(__dirname,'./client/build/index.html'))
})

const PORT=process.env.PORT||8080;

app.listen(PORT,()=>{
    console.log(`Node Server Running in ${process.env.DEV_MODE} Modeon Port ${process.env.PORT}`.bgBlue.white);

});