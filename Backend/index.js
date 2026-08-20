import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import authroutes from "./routes/auth.routes.js"
import bookroutes from "./routes/book.routes.js"
import borrowroutes from "./routes/borrow.route.js"
import adminroutes from "./routes/admin.routes.js"
// import connectCloudinary from "./config/cloudinary.js";

dotenv.config();



const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.use(cookieParser())
app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true
}))

app.get("/",(req,res)=>{
    res.json({message:"Hello From Server."})
})

//DataBase Connection
connectDB()

//Cloudinary Connection
// connectCloudinary()


// Routes

app.use("/api/auth",authroutes);
app.use("/api/bookS",bookroutes);
app.use("/api/borrow",borrowroutes);
app.use("/api/admin",adminroutes);

const PORT = process.env.PORT || 5000

app.listen(PORT,()=>{
    console.log(`server is running on PORT ${PORT}`);   
})