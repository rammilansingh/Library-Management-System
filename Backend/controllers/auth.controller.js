import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import { json } from "express";
import crypto from "crypto";
import sendEmail from "../utils/sendEmails.js";

// cookie options  
const cookieOPtions = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000
};

// Student Register

export const registerStudent = async(req,res)=>{
    try {
        const {name,email,password} = req.body;
        if (!name || !email || !password) {
           return res.json({success:false,message:"All fields are required."})
        }

        const existingUser = await User.findOne({email});

        if (existingUser) {
            return res.json({
                success:false,
                message:"Student already exists with this email."
            })
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const user = await User.create({
            name,
            email,
            password:hashedPassword,
            role:"student"
        })

        const token = generateToken({
            id:user._id,
            role:user.role
        })

        res.cookie("token",token,cookieOPtions)

        return res.json({
            success:true,
            message:"Student Registered.",
            user:{
                id:user._id,
                name:user.name,
                email:user.email,
                role:user.role
            }
        })
        
    } catch (error) {
        console.log("error",error);
        return res.json({message:"Internal Server Error",error})
    }
}

// LOGIN {STUDENT  +  ADMIN}

export const loginUser = async(req,res)=>{
    try {
        const {email,password} = req.body;
        if (!email || !password) {
            return res.json({success:false,message:"All fields are required."})
        }

        // Admin login from .env
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
           const token = generateToken({
            email:process.env.ADMIN_EMAIL,
            role:"admin"
        }) 

         res.cookie("token",token,cookieOPtions)

         return res.json({
            success:true,
            message:"Admin login Successful.",
            user:{
                email:process.env.ADMIN_EMAIL,
                role:"admin"
            }
        })
        }

        // Student login From DataBase
        const user = await User.findOne({email});
        if (!user) {
            return res.status(404).json({
                success:false,
                message:"User Not Found."
            })
        }

        const isPasswordValid = await bcrypt.compare(password,user.password)

        if (!isPasswordValid) {
             return res.status(401).json({
                success:false,
                message:"Invalid email or password."
            })
        }
        const token = generateToken({
            id:user._id,
            role:user.role
        }) 

         res.cookie("token",token,cookieOPtions)

         return res.status(200).json({
            success:true,
            message:"Student login Successful.",
            user:{
                id:user._id,
                name:user.name,
                email:user.email,
                role:user.role
            }
        })

    } catch (error) {
        console.log("error",error);
        return res.json({message:"Internal Server Error",error})
    }
}

// LOGOUT

export const logoutUser = async(req,res)=>{
    try {
        res.cookie("token","",{
            httpOnly:true,
            expires:new Date(0)
        })

        return res.status(200).json({
            success:true,
            message:"Logged Out Successfully",
        })
    } catch (error) {
        console.log("error",error);
        return res.json({message:"Internal server Error",error})
        
    }
}

// function to get My Profile
export const getMyProfile = async(req,res)=>{
    try {
if (req.user.role === "admin") {
    return res.status(200).json({
        success:true,
        user:{
            email:process.env.ADMIN_EMAIL,
            role:"admin"
        }
    })
}

        const {id} = req.user;
        const user = await User.findById(id).select("-password")
         return res.status(200).json({
            success:true,
            user,
        })
    } catch (error) {
         return res.status(500).json({
            success:false,
            message:"Failed to fetch profile.",
            error: error.message
        })
    }
}


// function for Forget password

export const forgetPassword = async(req,res)=>{
    try {

        const {email} = req.body;
        if (!email) {
            return res.status(400).json({
                success:false,
                message:"Email is Required."
            })
        }

        const user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({
                success:false,
                message:"No user found with this email."
            })
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
// Hash Token And Save In DB
        const hashToken = crypto.createHash("sha256").update(resetToken).digest("hex");
        user.resetPasswordToken = hashToken;
        user.resetPasswordExpire = Date.now() + 15 * 60 * 1000  // 15 minutes

        await user.save({validateBeforeSave:false});
 //create reset URL


 const resetUrl =`${process.env.FRONTEND_URL}/reset-password/${resetToken}`
 
 // Email message
const message = `
Hello,

You requested to reset your password.

Please click the link below to reset your password:

${resetUrl}

This link will expire in 15 minutes.

If you did not request a password reset, please ignore this email.

Regards,
Library Management System Team
`;

const html = `<div style="font-family: arial, sans-serif; line-height: 1.6;">
<h2>Password Reset Request</h2>
<p> Click the button below to reset password</p>
<a
        href="${resetUrl}"
        style="
            display: inline-block;
            padding: 12px 20px;
            background: black;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
        "
    >
        Reset Password
    </a>

    <p style="margin-top: 20px;">
        This link will expire in 15 minutes.
    </p>

    <p>
        If you did not request this, please ignore this email.
    </p>
</div>`

try {
    
    await sendEmail({
        email:user.email,
        subject:"Password Reset",
        message,
        html
    })
    return res.status(200).json({
        success:true,
        message:"Reset Password email sent."
    })
} catch (error) {
    return res.status(500).json({
            success:false,
            message:"Could not send email."
        })
}

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Internal Server Error.",
            error: error.message
        })
    }
}

// function to reset password

export const resetPassword = async(req,res)=>{
    try {
        const {token} = req.params;
        const {password,confirmPassword} = req.body;
        if (!password || !confirmPassword) {
            return res.status(400).json({
                success:false,
                message:"All fields are required."
            })
        }

         if (password !== confirmPassword) {
            return res.status(400).json({
                success:false,
                message:"Password do not match."
            })
        }

        //Hash Incoming token
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire:{$gt: Date.now()}
        })

        if (!user) {
           return res.status(400).json({
                success:false,
                message:"Invalid or Expired Token."
            }) 
        }

        // Hash New Password
        const hashedPassword = await bcrypt.hash(password,10)

            user.password = hashedPassword;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;

            await user.save();

            return res.status(200).json({
        success:true,
        message:"Reset Password Successful."
    })

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Internal Server Error.",
            error: error.message
        })
    }
}