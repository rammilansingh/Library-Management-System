import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../utils/axiosInstance";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {

    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);

    const [adminStats, setAdminStats] = useState();
    const [studentStats, setStudentStats] = useState();

    const [books, setBooks] = useState([]);
    const [studentBooks, setStudentBooks] = useState([]);

    const [students, setStudents] = useState([]);
    const [borrowedBooks, setBorrowedBooks] = useState([]);

    const navigate = useNavigate();

    const isAdmin = user?.role === "admin";


    // Fetch User

    const fetchUser = async () => {
        try {

            const { data } = await axiosInstance.get("/auth/me");

            if (data.success) {
                setUser(data.user);
            }

        } catch (error) {

            console.log("Error fetching user:", error);

            setUser(null);
        }
    };


    // Admin Dashboard

    const fetchAdminDashboardStats = async () => {
        try {

            const { data } = await axiosInstance.get(
                "/books/admin/dashboard"
            );

            if (data.success) {
                setAdminStats(data);
            }

        } catch (error) {

            console.log(
                "Error fetching admin stats:",
                error
            );
        }
    };


    // Student Dashboard

    const fetchStudentDashboardStats = async () => {
        try {

            const { data } = await axiosInstance.get(
                "/borrow/student/dashboard"
            );

            if (data.success) {
                setStudentStats(data);
            }

        } catch (error) {

            console.log(
                "Error fetching student stats:",
                error
            );
        }
    };


    // Fetch All Books

    const fetchBooks = async () => {
        try {

            const { data } = await axiosInstance.get(
                "/books/all"
            );

            if (data.success) {
                setBooks(data.books || []);
            }

        } catch (error) {

            console.log(
                "Error fetching books:",
                error
            );
        }
    };


    // Fetch Student's Books

    const fetchStudentBooks = async () => {
        try {

            const { data } = await axiosInstance.get(
                "/borrow/my-books"
            );

            console.log("MY BOOKS RESPONSE:", data);

            if (data.success) {
                setStudentBooks(data.borrowedBooks || []);
            }

        } catch (error) {

            console.log(
                "Error fetching student books:",
                error.response?.data || error
            );

            setStudentBooks([]);
        }
    };


    // Fetch Students - Admin

    const fetchStudents = async () => {
        try {

            const { data } = await axiosInstance.get(
                "/admin/students"
            );

            if (data.success) {
                setStudents(data.students || []);
            }

        } catch (error) {

            console.log(
                "Error fetching students:",
                error
            );
        }
    };


    // Fetch All Borrow Records - Admin

    const fetchBorrowedBooks = async () => {
        try {

            const { data } = await axiosInstance.get(
                "/borrow/admin/all"
            );

            if (data.success) {
                setBorrowedBooks(data.records || []);
            }

        } catch (error) {

            console.log(
                "Error fetching borrowed books:",
                error
            );
        }
    };


    // First get user and books

    useEffect(() => {

        fetchUser();
        fetchBooks();

    }, []);


    // Fetch data after user is available

    useEffect(() => {

        if (!user) {
            return;
        }


        if (user.role === "student") {

            fetchStudentDashboardStats();
            fetchStudentBooks();

        }


        if (user.role === "admin") {

            fetchAdminDashboardStats();
            fetchStudents();
            fetchBorrowedBooks();

        }

    }, [user]);


    const value = {

        loading,
        setLoading,

        user,
        setUser,

        navigate,

        adminStats,
        fetchAdminDashboardStats,

        studentStats,
        fetchStudentDashboardStats,

        books,
        fetchBooks,

        studentBooks,
        fetchStudentBooks,

        students,
        fetchStudents,

        borrowedBooks,
        fetchBorrowedBooks,

    };


    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;