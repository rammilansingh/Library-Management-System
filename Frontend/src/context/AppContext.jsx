import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../utils/axiosInstance";

export const AppContext = createContext();

const AppContextProvider = ({children}) => {


    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [adminStats,setAdminStats] = useState();
    const [books,setBooks] = useState([]);
    const [students,setStudents] = useState([]);
    const [borrowedBooks,setBorrowedBooks] = useState([]);

    const isAdmin = user && user.role === "admin"
    const navigate = useNavigate();

    const fetchUser = async()=>{
        try {
            const {data} = await axiosInstance.get("/auth/me");
            if (data.success) {
                setUser(data.user)
            }
        } catch (error) {
            setUser(null)
        }
    }


    

    //Fetch Admin Dasboard Stats

const fetchAdminDashboardStats = async()=>{
    try {
        const {data} = await axiosInstance.get("/books/admin/dashboard");
        
        if (data.success) {
                setAdminStats(data)
            }
    } catch (error) {
        console.log("error to fetch admin stats",error);
    }
}

    //Fetch Books

const fetchBooks = async()=>{
    try {
        const {data} = await axiosInstance.get("/books/all");
        
        if (data.success) {
                setBooks(data.books)
            }
    } catch (error) {
        console.log("error to fetch books",error);
    }
}

// fetch students

const fetchStudents = async()=>{
    try {
        const {data} = await axiosInstance.get("/admin/students");
        
        if (data.success) {
                setStudents(data.students)
            }
    } catch (error) {
        console.log("error to fetch students",error);
    }
}

// fetch all borrowed books

const fetchBorrowedBooks = async()=>{
    try {
        const {data} = await axiosInstance.get("/borrow/admin/all");
        
        if (data.success) {
                setBorrowedBooks(data.records)
            }
    } catch (error) {
        console.log("error to fetch borrowed books",error);
    }
}

    useEffect(()=>{
        fetchUser()
        fetchBooks()
       
    },[])

    useEffect(()=>{
        if (isAdmin) {
            fetchAdminDashboardStats();
             fetchStudents()
             fetchBorrowedBooks()
        }
    },[isAdmin])

    const value = {loading,setLoading,user,setUser,navigate,adminStats,fetchAdminDashboardStats,
        books,fetchBooks,students,fetchStudents,borrowedBooks,fetchBorrowedBooks}

    return(
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export default AppContextProvider;