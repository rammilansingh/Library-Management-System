import React, { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { axiosInstance } from "../../utils/axiosInstance";

const Books = () => {

  const {
    books,
    fetchBooks,
    fetchStudentBooks,
    fetchStudentDashboardStats
  } = useContext(AppContext);

  const [selectedDates, setSelectedDates] = useState({});


  // Handle due date change

  const handleDateChange = (bookId, date) => {

    setSelectedDates((prev) => ({
      ...prev,
      [bookId]: date
    }));

  };


  // Borrow Book

  const handleBorrow = async (bookId) => {

    try {

      const dueDate = selectedDates[bookId];


      // Check due date

      if (!dueDate) {

        return toast.error(
          "Please select due date."
        );

      }


      // API call

      const { data } = await axiosInstance.post(
        "/borrow/borrow",
        {
          bookId,
          dueDate
        }
      );


      if (data.success) {

        toast.success(
          data.message ||
          "Book borrowed successfully."
        );


        // Refresh books

        await fetchBooks();


        // Refresh student's borrowed books

        await fetchStudentBooks();


        // Refresh student dashboard

        await fetchStudentDashboardStats();


        // Clear selected date

        setSelectedDates((prev) => {

          const updated = {
            ...prev
          };

          delete updated[bookId];

          return updated;

        });

      }

    } catch (error) {

      console.log(
        "Error borrowing book:",
        error
      );


      toast.error(
        error?.response?.data?.message ||
        "Failed to borrow book."
      );

    }

  };


  return (

    <div className="w-full">

      {/* Header */}

      <div className="mb-8 flex flex-row items-center justify-between">

        <div>

          <h2 className="text-2xl font-bold text-gray-800">
            Books
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Browse available books and borrow them.
          </p>

        </div>

      </div>


      {/* Books Table */}

      <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

        {books.length === 0 ? (

          <div className="rounded-xl bg-gray-50 py-10 text-center text-sm text-gray-500">

            No books found.

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="min-w-full border-separate border-spacing-y-3">

              <thead>

                <tr className="text-left text-sm text-gray-500">

                  <th className="px-4">
                    Title
                  </th>

                  <th className="px-4">
                    Image
                  </th>

                  <th className="px-4">
                    Category
                  </th>

                  <th className="px-4">
                    Total Copies
                  </th>

                  <th className="px-4">
                    Available Copies
                  </th>

                  <th className="px-4">
                    Language
                  </th>

                  <th className="px-4">
                    Due Date
                  </th>

                  <th className="px-4">
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody>

                {books.map((item) => (

                  <tr
                    key={item._id}
                    className="rounded-xl bg-gray-100 text-sm"
                  >

                    {/* Title */}

                    <td className="rounded-l-xl px-4 py-4 font-medium">

                      {item.title}

                    </td>


                    {/* Image */}

                    <td className="px-4 py-4">

                      {item.coverImage?.url ? (

                        <img
                          src={item.coverImage.url}
                          alt={item.title}
                          className="h-14 w-14 rounded-md object-cover"
                        />

                      ) : (

                        <div className="flex h-14 w-14 items-center justify-center rounded-md bg-gray-200 text-xs text-gray-500">

                          No Image

                        </div>

                      )}

                    </td>


                    {/* Category */}

                    <td className="px-4 py-4">

                      {item.category || "N/A"}

                    </td>


                    {/* Total Copies */}

                    <td className="px-4 py-4">

                      {item.totalCopies}

                    </td>


                    {/* Available Copies */}

                    <td className="px-4 py-4">

                      <span
                        className={
                          item.availableCopies > 0
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >

                        {item.availableCopies}

                      </span>

                    </td>


                    {/* Language */}

                    <td className="px-4 py-4">

                      {item.language || "N/A"}

                    </td>


                    {/* Due Date */}

                    <td className="px-4 py-4">

                      <input
                        type="date"
                        min={
                          new Date()
                            .toISOString()
                            .split("T")[0]
                        }
                        value={
                          selectedDates[item._id] || ""
                        }
                        onChange={(e) =>
                          handleDateChange(
                            item._id,
                            e.target.value
                          )
                        }
                        disabled={
                          item.availableCopies < 1
                        }
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black disabled:bg-gray-100"
                      />

                    </td>


                    {/* Action */}

                    <td className="rounded-r-xl px-4 py-4">

                      <button
                        type="button"
                        onClick={() =>
                          handleBorrow(item._id)
                        }
                        disabled={
                          item.availableCopies < 1
                        }
                        className={`rounded-lg px-4 py-2 text-xs font-medium ${
                          item.availableCopies < 1
                            ? "cursor-not-allowed bg-gray-300 text-gray-500"
                            : "bg-green-600 text-white hover:opacity-90"
                        }`}
                      >

                        {item.availableCopies < 1
                          ? "Out of Stock"
                          : "Borrow"}

                      </button>

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

export default Books;