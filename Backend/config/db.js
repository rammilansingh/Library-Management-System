import mongoose from "mongoose";

export const connectDB = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DataBase.");
        
    } catch (error) {
       console.log("Error to Connect with DataBase.",error); 
    }
}