import express from "express";
import {
    borrowBook,
    returnBook,
    getMyBorrowedBook,
    getAllBorrowRecords,
    getOverdueBooks,
    getStudentDashboard
} from "../controllers/borrow.controller.js"

import { isAuthenticated, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Student
router.post("/borrow",isAuthenticated,borrowBook);
router.post("/return", isAuthenticated, returnBook);
router.get("/my-books",isAuthenticated,getMyBorrowedBook);
router.get("/student/dashboard",isAuthenticated,getStudentDashboard);

// Admin
router.get("/admin/all",isAuthenticated,isAdmin,getAllBorrowRecords);
router.get("/admin/overdue",isAuthenticated,isAdmin,getOverdueBooks);


export default router;