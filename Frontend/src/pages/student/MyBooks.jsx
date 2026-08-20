import React, { useContext } from "react";
import toast from "react-hot-toast";
import { AppContext } from "../../context/AppContext";
import { axiosInstance } from "../../utils/axiosInstance";

const MyBooks = () => {

    const {
        studentBooks,
        fetchStudentBooks,
        fetchBooks,
        fetchStudentDashboardStats
    } = useContext(AppContext);


    const handleReturn = async (borrowId) => {

        try {

            const { data } = await axiosInstance.post(
                "/borrow/return",
                {
                    borrowId
                }
            );


            if (data.success) {

                toast.success(
                    data.message ||
                    "Book returned successfully."
                );


                await fetchStudentBooks();
                await fetchBooks();
                await fetchStudentDashboardStats();

            }

        } catch (error) {

            console.log(
                "Error returning book:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to return book."
            );
        }
    };


    return (

        <div className="w-full">

            {/* Header */}

            <div className="mb-8">

                <h2 className="text-2xl font-bold text-gray-800">
                    My Books
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                    View your borrowed books and return them when you are done.
                </p>

            </div>


            {/* Books */}

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

                {studentBooks.length === 0 ? (

                    <div className="rounded-xl bg-gray-50 py-10 text-center">

                        <p className="text-sm text-gray-500">
                            You have not borrowed any books yet.
                        </p>

                    </div>

                ) : (

                    <div className="overflow-x-auto">

                        <table className="min-w-full border-separate border-spacing-y-3">

                            <thead>

                                <tr className="text-left text-sm text-gray-500">

                                    <th className="px-4">
                                        Book
                                    </th>

                                    <th className="px-4">
                                        Category
                                    </th>

                                    <th className="px-4">
                                        Borrowed At
                                    </th>

                                    <th className="px-4">
                                        Due Date
                                    </th>

                                    <th className="px-4">
                                        Returned At
                                    </th>

                                    <th className="px-4">
                                        Status
                                    </th>

                                    <th className="px-4">
                                        Overdue
                                    </th>

                                    <th className="px-4">
                                        Action
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {studentBooks.map((item) => (

                                    <tr
                                        key={item._id}
                                        className="rounded-xl bg-gray-50 text-sm text-gray-700"
                                    >

                                        {/* Book */}

                                        <td className="rounded-l-xl px-4 py-4">

                                            <div className="flex items-center gap-3">

                                                {item.book?.coverImage?.url ? (

                                                    <img
                                                        src={item.book.coverImage.url}
                                                        alt={item.book.title}
                                                        className="h-14 w-11 rounded-md object-cover"
                                                    />

                                                ) : (

                                                    <div className="flex h-14 w-11 items-center justify-center rounded-md bg-gray-200 text-xs text-gray-500">
                                                        No Image
                                                    </div>

                                                )}


                                                <div>

                                                    <p className="font-medium text-gray-800">
                                                        {item.book?.title || "Book deleted"}
                                                    </p>

                                                </div>

                                            </div>

                                        </td>


                                        {/* Category */}

                                        <td className="px-4 py-4">
                                            {item.book?.category || "N/A"}
                                        </td>


                                        {/* Borrowed At */}

                                        <td className="px-4 py-4">

                                            {item.borrowedAt
                                                ? new Date(
                                                    item.borrowedAt
                                                ).toLocaleDateString(
                                                    "en-US",
                                                    {
                                                        year: "numeric",
                                                        month: "short",
                                                        day: "numeric"
                                                    }
                                                )
                                                : "N/A"
                                            }

                                        </td>


                                        {/* Due Date */}

                                        <td className="px-4 py-4">

                                            {item.dueDate
                                                ? new Date(
                                                    item.dueDate
                                                ).toLocaleDateString(
                                                    "en-US",
                                                    {
                                                        year: "numeric",
                                                        month: "short",
                                                        day: "numeric"
                                                    }
                                                )
                                                : "N/A"
                                            }

                                        </td>


                                        {/* Returned At */}

                                        <td className="px-4 py-4">

                                            {item.returnedAt
                                                ? new Date(
                                                    item.returnedAt
                                                ).toLocaleDateString(
                                                    "en-US",
                                                    {
                                                        year: "numeric",
                                                        month: "short",
                                                        day: "numeric"
                                                    }
                                                )
                                                : "Not Returned"
                                            }

                                        </td>


                                        {/* Status */}

                                        <td className="px-4 py-4">

                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                    item.status === "returned"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-yellow-100 text-yellow-700"
                                                }`}
                                            >

                                                {item.status}

                                            </span>

                                        </td>


                                        {/* Overdue */}

                                        <td className="px-4 py-4">

                                            {item.status === "returned" ? (

                                                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                                                    No
                                                </span>

                                            ) : item.isOverdue ? (

                                                <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                                                    Overdue
                                                </span>

                                            ) : (

                                                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                                                    No
                                                </span>

                                            )}

                                        </td>


                                        {/* Action */}

                                        <td className="rounded-r-xl px-4 py-4">

                                            {item.status === "returned" ? (

                                                <span className="text-xs font-medium text-gray-400">
                                                    Returned
                                                </span>

                                            ) : (

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleReturn(item._id)
                                                    }
                                                    className="rounded-lg bg-black px-4 py-2 text-xs font-semibold text-white hover:opacity-90"
                                                >
                                                    Return Book
                                                </button>

                                            )}

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>
    );
};

export default MyBooks;