import Book from "../models/book.model.js";
import  cloudinary from "../config/cloudinary.js";

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
            message: "Book added Sucessfully.",
            book,
        })
    } catch (error) {
        return res.status(501).json({
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
            sucess: true,
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
            sucess: true,
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

export const updateBook = async(req,res)=>{
    try {
        const{
            title,
            description,
            category,
            language,
            totalCopies,
            availableCopies
        } = req.body;

        let book = await Book.findById(req.params.id);
        if(!book){
            return res.status(404).json({
                success: false,
                message: "Book not found."
            })
        }

        let updatedData = {};
        if(title !== undefined) updatedData.title = title
        if(description !== undefined) updatedData.description = description
        if(category !== undefined) updatedData.category = category
        if(language !== undefined) updatedData.language = language
        if(totalCopies !== undefined) updatedData.totalCopies = totalCopies
        if(availableCopies !== undefined) updatedData.availableCopies = availableCopies

        // IF NEW IMAGE UPLOADED
        if(req.file){
            if(book.coverImage?.public_id){
                await cloudinary.uploader.upload(book.coverImage.public_id)
            }
            const result = await cloudinary.uploader.upload(req.file.path,{
            folder:"library_collection"
        })
        updatedData.coverImage = {
            public_id: result.public_id,
            url: result.secure_url
        }
        }
        book = await Book.findByIdAndUpdate(req.params.id,updatedData,{
            new: true,
            runValidators: true
        });


            return res.status(200).json({
                success : true,
                message : "Book updated successfully.",
                book,
            })

    } catch (error) {
       return res.status(501).json({
            success: false,
            message: " Failed to update Books.",
            error: error.message,
        })    
    }
}


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