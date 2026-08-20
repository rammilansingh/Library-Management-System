import Borrow from "../models/borrow.model.js";
import Book from "../models/book.model.js";

// BORROW BOOK

export const borrowBook = async (req,res)=>{
    try {
        if(req.user.role !== "student"){
            return res.status(403).json({
                success:false,
                message: "Only students can borrow books."
            })
        }

        const {bookId,dueDate} = req.body;

        if (!bookId || !dueDate) {
            return res.status(400).json({
                success: false,
                message: "Book id and due date are required."
            })
        }

        const due = new Date(dueDate);

        if(isNaN(due.getTime())){
            return res.status(400).json({
                success: false,
                message: "Invalid due Date."
            })
        }

        if(due <= new Date()){
            return res.status(400).json({
                success: false,
                message: "due date must be in future."
            })
        }

        const book = await Book.findById(bookId);

        if(!book){
            return res.status(404).json({
                success: false,
                message: "Book not found."
            })
        } 

        if(book.availableCopies < 1){
            return res.status(404).json({
                success: false,
                message: "Book is out of stock."
            })
        }
        
        const alreadyBorrowed = await Borrow.findOne({
            student: req.user.id,
            book: bookId,
            status: "borrowed"
        })

        if(alreadyBorrowed){
             return res.status(404).json({
                success: false,
                message: "You have already borrowed this book and not returned it yet."
            })
        }

        const activeBorrowCount = await Borrow.countDocuments({
            student: req.user.id,
            status: "borrowed"
        })

        if(activeBorrowCount>=3){
             return res.status(404).json({
                success: false,
                message: "Borrow limit has reached. You can borrow upto 3 books at a time."
            })
        }

        const overdueBook = await Borrow.findOne({
            student: req.user.id,
            status: "borrowed",

            dueDate: {$lt: new Date()}
        })

        if (overdueBook) {
           return res.status(404).json({
                success: false,
                message: "You have an overdue book, return it before borrowing new one."
            }) 
        }

        const updatedBook = await Book.findByIdAndUpdate(
            {_id:bookId, availableCopies: {$gte: 1}},
            {$inc: {availableCopies: -1}},
            {new : true}
        )

        if(!updatedBook){
            return res.status(404).json({
                success: false,
                message: "Book is out of Stock."
            }) 
        }

        const borrow = await Borrow.create({
            student : req.user.id,
            book : bookId,
            dueDate,
        })

        return res.status(201).json({
                success: true,
                message: "Book borrowed Successfully.",
                borrow,
            }) 

    } catch (error) {
         return res.status(500).json({
            success: false,
            message: " Failed to borrow Book.",
            error: error.message,
        })
    }
}


// RETURN BOOK

export const returnBook = async (req,res)=>{
    try {
        
        const { borrowId } = req.body;

        if (!borrowId) {
             return res.status(404).json({
                success: false,
                message: "Borrow id is required."
            }) 
        }

        const borrowRecord = await Borrow.findById(borrowId);
        if(!borrowRecord){
            return res.status(404).json({
                success: false,
                message: "Borrow record not found."
            }) 
        }

        if(borrowRecord.status === "returned"){
            return res.status(404).json({
                success: false,
                message: "Book already returned."
            }) 
        }

        if(borrowRecord.student.toString()  !== req.user.id){
            return res.status(404).json({
                success: false,
                message: "You can return only the books borrowed by you."
            }) 
        }

        const book = await Book.findById(borrowRecord.book);

        if(!book){
            return res.status(404).json({
                success: false,
                message: "Book not found."
            })
        } 

        borrowRecord.status = "returned";
        borrowRecord.returnedAt = new Date();
        await borrowRecord.save();
        
        book.availableCopies += 1;
        await book.save();

        return res.status(201).json({
                success: true,
                message: "Book return SucessFully.",
                borrowRecord,
            }) 

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: " Failed to return Book.",
            error: error.message,
        })
    }
}


//GET MY BORROWED BOOK (STUDENT)

export const getMyBorrowedBook = async(req,res)=>{
    try {
        const borrowedBooks = await Borrow.find({student: req.user.id})
        .populate("book")
        .sort({createdAt: -1});

        const updatedBorrowedBooks = borrowedBooks.map((item)=>{
            const isOverdue = 
            item.status === "borrowed" && new Date(item.dueDate) < new Date();

            return {
                ...item._doc,
                isOverdue,
            }
        })

        return res.status(200).json({
            success: true,
            count : updatedBorrowedBooks.length,
            borrowedBooks: updatedBorrowedBooks
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: " Failed to know  borrow  record of user.",
            error: error.message,
        })
    }
}


//  GET ALL BORROW RECORDS (ADMIN)

export const getAllBorrowRecords = async (req, res) => {
    try {

        const records = await Borrow.find()
            .populate("student", "name email")
            .populate("book", "title category")
            .sort({ createdAt: -1 });

        const updatedRecords = records.map((item) => {

            const isOverdue =
                item.status === "borrowed" &&
                new Date(item.dueDate) < new Date();

            return {
                ...item._doc,
                isOverdue,
            };
        });

        return res.status(200).json({
            success: true,
            count: updatedRecords.length,
            records: updatedRecords
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Failed to get Book records by admin.",
            error: error.message,
        });
    }
};


export const getOverdueBooks = async(req,res)=>{
    try {
        const overdueBooks = await Borrow.find({
            status: "borrowed",
            dueDate: {$lt: new Date()}
        })
        .populate("student","name email")
        .populate("book","title category")
        .sort({dueDate: 1});

        return res.status(200).json({
            success: true,
            count : overdueBooks.length,
            overdueBooks,
        })
        
    } catch (error) {
         return res.status(500).json({
            success: false,
            message: " Failed to get Book records by admin.",
            error: error.message,
        })
    }
}


// student Dashboard

export const getStudentDashboard = async(req,res)=>{
    try {
        
        if (req.user.role !== "student") {
          return res.status(403).json({
            success: false,
            message: "Only student cann access this dashboard.",
            
        })  
        }

        const studentId = req.user.id;

        const totalBorrowed =  await Borrow.countDocuments({student: studentId});
        const currentlyBorrowed =  await Borrow.countDocuments({
            student: studentId,
            status: "borrowed"
        });

        const returnedBooks =  await Borrow.countDocuments({
            student: studentId,
            status: "returned"
        });

        const overdueBooks = await Borrow.countDocuments({
        student: studentId,
        status: "borrowed",
        dueDate: { $lt: new Date() },
        });

        const recentBorrows = await Borrow.find({
        student: studentId
        })
        .populate("book", "title category coverImage")
        .sort({ createdAt: -1 })
        .limit(5);

        const updatedRecentActivity = recentBorrows.map((item)=>{
            const isOverdue =
            item.status === "borrowed" && new Date(item.dueDate) < new Date();

            const daysLate = isOverdue?Math.ceil(
            (  new Date() - new Date(item.dueDate)) / (24 * 60 * 60 * 1000)
            )
            : 0;

            return {
                ...item._doc,
                isOverdue,
                daysLate
            }
        })

        return res.status(200).json({
            success: true,
            dashboard: {
                totalBorrowed,
                currentlyBorrowed,
                returnedBooks,
                overdueBooks,
                recentActivity: updatedRecentActivity,
            }
        })


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: " Failed to fetch student dashboard data.",
            error: error.message,
        })
    }
}