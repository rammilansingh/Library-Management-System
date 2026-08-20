import Book from "../models/book.model.js";
import  cloudinary from "../config/cloudinary.js";
import Borrow from "../models/borrow.model.js";
// function to create book

export const createBook = async(req,res)=>{
    try {
        const{
            title,
            description,
            category,
            language,
            totalCopies,
            availableCopies
        } = req.body;

        if( !title ||
            !description ||
            !category ||
            !language ||
            !totalCopies ||
            !availableCopies){
            return res.status(404).json({
                success: false,
                message:"Please provide all the required fields."
            })
            }
        if(!req.file){
            return res.status(404).json({
                success: false,
                message:"Book cover image is required."
            })
        }

    //     console.log({
    // cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    // api_key: process.env.CLOUDINARY_API_KEY ? "Loaded" : "Missing",
    // api_secret: process.env.CLOUDINARY_API_SECRET ? "Loaded" : "Missing",
    // file: req.file?.path
// });

        const result = await cloudinary.uploader.upload(req.file.path,{
            folder:"library_collection"
        })

        const book = await Book.create({
            title,
            description,
            category,
            language,
            totalCopies,
            availableCopies,
            coverImage:{
                public_id: result.public_id,
                url: result.secure_url
            },
            added_by: "admin"
        })

        return res.status(201).json({
            success: true,
            message: "Book added Successfully.",
            book,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: " Failed to create Book.",
            error: error.message,
        })

//  console.log("========== CLOUDINARY ERROR ==========");
//     console.log("message:", error.message);
//     console.log("http_code:", error.http_code);
//     console.log("error:", error.error);
//     console.log("response:", error.response);

//     return res.status(500).json({
//         success: false,
//         message: "Failed to create Book.",
//         error: error.message,
//         http_code: error.http_code,
//         details: error.error
//     });
    }
}


// GET ALL BOOKS + SEARCH + FILTER

export const getAllBooks = async(req,res)=>{
    try {
        const{title,keyword,category,language,available}=req.query; 

        let query = {};
        if(title){
            query.title ={$regex: keyword, $options: "i"}
        }
        
        if(category){
            query.category = category
        }
        
        if(language){
           query.language ={$regex: `^${language}$`, $options: "i"} 
        }

        if(available === "true"){
            query.availableCopies ={$gt: 0}
        }

        if(available === "false"){
            query.availableCopies = 0;
        }
        
        const books = await Book.find(query).sort({createdAt:-1})

        return res.status(200).json({
            success: true,
            count: books.length,
            books,
        })

    } catch (error) {
       return res.status(501).json({
            success: false,
            message: " Failed to fetch Books.",
            error: error.message,
        }) 
    }
}

// GET SINGLE BOOK

export const getSingleBook = async(req,res)=>{
    try {
        const book = await Book.findById(req.params.id);

        if(!book){
            return res.status(404).json({
                success: false,
                message: "Book not found."
            })
        }

        return res.status(200).json({
            success: true,
            book,
        })

    } catch (error) {
      return res.status(501).json({
            success: false,
            message: " Failed to fetch Books.",
            error: error.message,
        })   
    }
}

// UPDATE BOOK

export const updateBook = async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            language,
            totalCopies,
            availableCopies
        } = req.body;

        let book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Book not found."
            });
        }

        let updatedData = {};

        if (title !== undefined)
            updatedData.title = title;

        if (description !== undefined)
            updatedData.description = description;

        if (category !== undefined)
            updatedData.category = category;

        if (language !== undefined)
            updatedData.language = language;

        if (totalCopies !== undefined)
            updatedData.totalCopies = totalCopies;

        if (availableCopies !== undefined)
            updatedData.availableCopies = availableCopies;

        // IF NEW IMAGE IS UPLOADED
        if (req.file) {

            // Delete old image from Cloudinary
            if (book.coverImage?.public_id) {
                await cloudinary.uploader.destroy(
                    book.coverImage.public_id
                );
            }

            // Upload new image
            const result = await cloudinary.uploader.upload(
                req.file.path,
                {
                    folder: "library_collection"
                }
            );

            updatedData.coverImage = {
                public_id: result.public_id,
                url: result.secure_url
            };
        }

        book = await Book.findByIdAndUpdate(
            req.params.id,
            updatedData,
            {
                new: true,
                runValidators: true
            }
        );

        return res.status(200).json({
            success: true,
            message: "Book updated successfully.",
            book
        });

    } catch (error) {

        console.log("Update book error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update book.",
            error: error.message
        });
    }
};


// DELETE BOOK


export const deleteBook = async(req,res)=>{
    try {

        const book = await Book.findById(req.params.id);

        if(!book){
            return res.status(404).json({
                success: false,
                message: "Book not found."
            })
        }

        const activeBorrow = await Borrow.findOne({
            book: book._id,
            "status" : "borrowed"
        })

        if(activeBorrow){
            return res.status(400).json({
                success: false,
                message: "Can't delete book because it is currently borrowed by a student."
            })
        }

        if (book.coverImage?.public_id) {
            await cloudinary.uploader.destroy(book.coverImage.public_id);
        }

        await book.deleteOne();

        return res.status(200).json({
            success : true,
            message : "Book deleted successfully."
        })

    } catch (error) {
      return res.status(501).json({
            success: false,
            message: " Failed to delete Books.",
            error: error.message,
        })    
    }
}


// ADMIN DASHBOARD STATS

export const getAdminDashboardStats = async(req,res)=>{
    try {
        
        const totalBooks = await Book.countDocuments();
        const totalBorrowedRecords = await Borrow.countDocuments();
        const borrowedBooksCount = await Borrow.countDocuments({
            status: "borrowed"
        });

        const returnedBooksCount = await Borrow.countDocuments({
            status: "retuned"
        });

        const overdueBooksCount = await Borrow.countDocuments({
            status: "borrowed",
            dueDate: {$lt: new Date()}
        });

        const books = await Book.find();

        const totalCopies = books.reduce((sum, book)=> sum + book.totalCopies,0);
        const availableCopies = books.reduce((sum, book)=> sum + book.availableCopies,0);

        const recentBorrows = await Borrow.find()
        .populate("student" , "name email")
        .populate("book", "title category")
        .sort({createdAt: -1})
        .limit(5);

        return res.status(200).json({
            success: true,
            stats: {
                totalBooks,
                totalCopies,
                availableCopies,
                borrowedBooksCount,
                overdueBooksCount,
                returnedBooksCount,
                totalBorrowedRecords
            },
            recentBorrows
        })

    } catch (error) {
        return res.status(501).json({
            success: false,
            message: " Failed to fetch Admin dashboard stats.",
            error: error.message,
        }) 
    }
}