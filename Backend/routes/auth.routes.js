import express from "express";
import { forgetPassword, getMyProfile, loginUser, logoutUser, registerStudent, resetPassword } from "../controllers/auth.controller.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.post("/register",registerStudent)
router.post("/login",loginUser)
router.get("/logout",logoutUser)
router.get("/me",isAuthenticated,getMyProfile)
router.post("/forget-password",forgetPassword)
router.put("/reset-password/:token",resetPassword)

export default router;