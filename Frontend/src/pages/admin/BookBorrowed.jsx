import React, { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import {
  Eye,
  EyeIcon,
  RotateCcw,
  Trash2Icon,
} from "lucide-react";
import toast from "react-hot-toast";
import { axiosInstance } from "../../utils/axiosInstance";

const BookBorrowed = () => {
  const {
    borrows,
    loading,
    fetchBorrowed,
    navigate,
  } = useContext(AppContext);

  // =========================
  // RETURN BOOK
  // =========================

  const returnBook = async (id) => {
    try {
      const { data } = await axiosInstance.put(
        `/borrows/return/${id}`
      );

      if (data.success) {
        toast.success(
          data.message || "Book returned successfully"
        );

        await fetchBorrowed();
      }
    } catch (error) {
      console.log("Error returning book:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to return book"
      );
    }
  };

  // =========================
  // FORMAT DATE
  // =========================

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =========================
  // STATUS
  // =========================

  const getStatus = (borrow) => {
    if (borrow.status) {
      return borrow.status;
    }

    if (borrow.returnedAt) {
      return "Returned";
    }

    if (
      borrow.dueDate &&
      new Date(borrow.dueDate) < new Date()
    ) {
      return "Overdue";
    }

    return "Borrowed";
  };

  // =========================
  // STATUS STYLE
  // =========================

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case "returned":
        return "bg-green-100 text-green-700";

      case "overdue":
        return "bg-red-100 text-red-700";

      case "borrowed":
        return "bg-blue-100 text-blue-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="w-full">

      {/*HEADER*/}

      <div className="mb-8 flex flex-col gap-4 sm:flex-row
        sm:items-center sm:justify-between">

        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Borrowed Books
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Monitor all books currently borrowed by students.
          </p>
        </div>

        <div className="rounded-lg bg-black px-4 py-2.5
          text-sm font-medium text-white">
          Total: {borrows?.length || 0}
        </div>
      </div>

      {/* STATS */}

      <div className="mb-6 grid grid-cols-1 gap-4
        sm:grid-cols-2 lg:grid-cols-4">

        {/* Total */}

        <div className="rounded-xl border border-gray-200
          bg-white p-5 shadow-sm">

          <p className="text-sm text-gray-500">
            Total Borrowed Books
          </p>

          <h3 className="mt-2 text-2xl font-bold text-gray-800">
            {borrows?.length || 0}
          </h3>
        </div>

        {/* Borrowed */}

        <div className="rounded-xl border border-gray-200
          bg-white p-5 shadow-sm">

          <p className="text-sm text-gray-500">
            Currently Borrowed Books
          </p>

          <h3 className="mt-2 text-2xl font-bold text-blue-600">
            {
              borrows?.filter(
                (item) =>
                  getStatus(item).toLowerCase() ===
                  "borrowed"
              ).length || 0
            }
          </h3>
        </div>



        
      </div>

      {/* TABLE*/}

      <div className="rounded-2xl border border-gray-200
        bg-white p-5 shadow-sm">

        {loading ? (

          /* Loading */

          <div className="py-16 text-center">
            <div className="mx-auto h-8 w-8 animate-spin
              rounded-full border-4 border-gray-300
              border-t-black">
            </div>

            <p className="mt-3 text-sm text-gray-500">
              Loading borrowed books...
            </p>
          </div>

        ) : !borrows || borrows.length === 0 ? (

          /* Empty */

          <div className="rounded-xl bg-gray-50 py-16
            text-center">

            <p className="text-sm font-medium text-gray-600">
              No borrowed books found.
            </p>

            <p className="mt-1 text-xs text-gray-400">
              Books borrowed by students will appear here.
            </p>
          </div>

        ) : (

          /* Table */

          <div className="overflow-x-auto">

            <table className="min-w-full
              border-separate border-spacing-y-3">

              <thead>
                <tr className="text-left text-sm
                  text-gray-500">

                  <th className="px-4 py-2">
                    Student
                  </th>

                  <th className="px-4 py-2">
                    Book
                  </th>

                  <th className="px-4 py-2">
                    Borrow Date
                  </th>

                  <th className="px-4 py-2">
                    Due Date
                  </th>

                  <th className="px-4 py-2">
                    Status
                  </th>

                  <th className="px-4 py-2">
                    Actions
                  </th>

                </tr>
              </thead>

              <tbody>

                {borrows.map((item) => {

                  const status = getStatus(item);

                  return (
                    <tr
                      key={item._id}
                      className="rounded-xl bg-gray-100
                      text-sm"
                    >

                      {/* STUDENT */}

                      <td className="rounded-l-xl px-4 py-4">

                        <div className="font-medium
                          text-gray-800">
                          {item.student?.name ||
                            item.user?.name ||
                            "Unknown Student"}
                        </div>

                        <div className="mt-1 text-xs
                          text-gray-500">
                          {item.student?.email ||
                            item.user?.email ||
                            ""}
                        </div>

                      </td>

                      {/* BOOK */}

                      <td className="px-4 py-4">

                        <div className="flex items-center
                          gap-3">

                          {item.book?.coverImage?.url && (
                            <img
                              src={
                                item.book.coverImage.url
                              }
                              alt={
                                item.book.title ||
                                "Book"
                              }
                              className="h-12 w-9 rounded
                              object-cover"
                            />
                          )}

                          <div>
                            <p className="font-medium
                              text-gray-800">
                              {item.book?.title ||
                                "Unknown Book"}
                            </p>

                            <p className="mt-1 text-xs
                              text-gray-500">
                              {item.book?.category ||
                                ""}
                            </p>
                          </div>

                        </div>

                      </td>

                      {/* BORROW DATE */}

                      <td className="px-4 py-4 text-gray-600">
                        {formatDate(
                          item.borrowDate ||
                          item.createdAt
                        )}
                      </td>

                      {/* DUE DATE */}

                      <td className="px-4 py-4 text-gray-600">
                        {formatDate(item.dueDate)}
                      </td>

                      {/* STATUS */}

                      <td className="px-4 py-4">

                        <span
                          className={`inline-flex rounded-full
                          px-3 py-1 text-xs font-medium
                          ${getStatusClass(status)}`}
                        >
                          {status}
                        </span>

                      </td>

                      {/* ACTIONS */}

                      <td className="rounded-r-xl px-4 py-4">

                        <div className="flex items-center
                          gap-3">

                          {/* VIEW */}

                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/admin/books/borrowed/${item._id}`
                              )
                            }
                            title="View"
                            className="text-gray-600
                            hover:text-black"
                          >
                            <EyeIcon className="h-5 w-5" />
                          </button>

                          {/* RETURN */}

                          {status.toLowerCase() ===
                            "borrowed" && (
                            <button
                              type="button"
                              onClick={() =>
                                returnBook(item._id)
                              }
                              title="Return Book"
                              className="text-green-600
                              hover:text-green-700"
                            >
                              <RotateCcw
                                className="h-5 w-5"
                              />
                            </button>
                          )}

                        </div>

                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookBorrowed;