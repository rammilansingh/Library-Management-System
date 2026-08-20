import React from "react";
import { Toaster } from "react-hot-toast";
import { Routes, Route, useLocation } from "react-router-dom";

import Register from "./pages/auth/Register.jsx";
import Login from "./pages/auth/Login.jsx";
import ForgotPassword from "./pages/auth/ForgotPassword.jsx";
import ResetPassword from "./pages/auth/ResetPassword.jsx";
import AdminLayout from "./pages/admin/AdminLayout.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import BookList from "./pages/admin/BookList.jsx";
import AddBook from "./pages/admin/AddBook.jsx";
import StudentList from "./pages/admin/StudentList.jsx";
import AddStudent from "./pages/admin/AddStudent.jsx";
import UpdateBooks from "./pages/admin/UpdateBooks.jsx";
import UpdateStudent from "./pages/admin/UpdateStudent.jsx";
import BookBorrowed from "./pages/admin/BookBorrowed.jsx";
import BookReturned from "./pages/admin/BookReturned.jsx";
import OverdueBooks from "./pages/admin/OverdueBooks.jsx";
import Layout from "./pages/student/Layout.jsx";
import StudentDashboard from "./pages/student/StudentDashboard.jsx";
import Books from "./pages/student/Books.jsx";
import MyBooks from "./pages/student/MyBooks.jsx";

const App = () => {
  const location = useLocation();
  const adminPath = location.pathname.includes("/admin")
  return (
    <div>
      <Toaster />

      <Routes>
        {/* Auth Routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />}/>
        <Route path="/reset-password/:token" element={<ResetPassword />}/>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="books" element={<BookList />} />
        <Route path="add-book" element={<AddBook />} />
        <Route path="book/update/:id" element={<UpdateBooks />} />
        <Route path="borrowed-books" element={<BookBorrowed />} />
        <Route path="returned-books" element={<BookReturned />} />
        <Route path="overdue-books" element={<OverdueBooks />} />
        <Route path="students" element={<StudentList />} />
        <Route path="add-student" element={<AddStudent />} />
        <Route path="student/update/:id" element={<UpdateStudent />} />

        </Route>

         {/* Admin Routes */}
        <Route path="/student" element={<Layout />}>
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="books" element={<Books />} />
        <Route path="my-books" element={<MyBooks />} />

        </Route>
      </Routes>
    </div>
  );
};

export default App;