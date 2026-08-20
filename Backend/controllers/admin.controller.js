import User from "../models/user.model.js";
import Borrow from "../models/borrow.model.js";


// GET ALL STUDENTS

export const getAllStudents = async (req, res) => {
    try {

        const students = await User.find({ role: "student" })
            .select("-password")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: students.length,
            students,
        });

    } catch (error) {

        console.log("Error fetching students:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch students.",
            error: error.message,
        });
    }
};


// GET SINGLE STUDENT

export const getSingleStudent = async(req,res)=>{
    try {

        const student = await User.findById(req.params.id).select("-password");

        if(!student){
            return res.status(200).json({
                success: false,
                message: "student not found."
            })
        }

        return res.status(200).json({
            success: true,
            student
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: " Failed to fetch student.",
            error: error.message,
        })
    }
}

//  DELETE STUDENTS

export const deleteStudent = async(req,res)=>{
    try {
        const student = await User.findById(req.params.id);

        if(!student){
            return res.status(200).json({
                success: false,
                message: "student not found."
            })
        }

        const activeBorrows = await Borrow.findOne({
                    student: student._id,
                    "Status" : "borrowed"
                })
        
                if(activeBorrows > 0){
                    return res.status(400).json({
                        success: false,
                        message: "Can't delete student because he still have borrowed books."
                    })
                }

                await student.deleteOne();

                return res.status(200).json({
                    success: true,
                    message: "Student deleted successfully."
                })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: " Failed to delete student.",
            error: error.message,
        })
    }
}