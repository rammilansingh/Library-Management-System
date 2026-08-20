import React, { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { EyeIcon } from "lucide-react";

const BookReturned = () => {

  const {
    borroweBooks,
    loading,
    navigate,
  } = useContext(AppContext);


  // Safe array
  const books = borroweBooks || [];


  // Only returned books
  const returnedBooks = books.filter(
    (item) => item.status === "returned"
  );


  // Format date
  const formatDate = (date) => {

    if (!date) {
      return "N/A";
    }

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };


  return (
    <div className="w-full">

      {/* =========================
          HEADER
      ========================= */}

      <div
        className="mb-8 flex flex-col gap-4
        sm:flex-row sm:items-center
        sm:justify-between"
      >

        <div>

          <h2 className="text-2xl font-bold text-gray-800">
            Returned Books
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            View all books returned by students.
          </p>

        </div>


        <div
          className="rounded-lg bg-black px-4 py-2.5
          text-sm font-medium text-white"
        >
          Total Returned: {returnedBooks.length}
        </div>

      </div>


      {/* =========================
          STATS
      ========================= */}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">

        <div
          className="rounded-xl border border-gray-200
          bg-white p-5 shadow-sm"
        >

          <p className="text-sm text-gray-500">
            Total Returned Books
          </p>

          <h3
            className="mt-2 text-2xl font-bold
            text-green-600"
          >
            {returnedBooks.length}
          </h3>

        </div>


        <div
          className="rounded-xl border border-gray-200
          bg-white p-5 shadow-sm"
        >

          <p className="text-sm text-gray-500">
            Return Records
          </p>

          <h3
            className="mt-2 text-2xl font-bold
            text-gray-800"
          >
            {returnedBooks.length}
          </h3>

        </div>

      </div>


      {/* =========================
          TABLE
      ========================= */}

      <div
        className="rounded-2xl border border-gray-200
        bg-white p-5 shadow-sm"
      >

        {loading ? (

          <div className="py-16 text-center">

            <div
              className="mx-auto h-8 w-8 animate-spin
              rounded-full border-4 border-gray-300
              border-t-black"
            />

            <p className="mt-3 text-sm text-gray-500">
              Loading returned books...
            </p>

          </div>

        ) : returnedBooks.length === 0 ? (

          <div
            className="rounded-xl bg-gray-50
            py-16 text-center"
          >

            <p
              className="text-sm font-medium
              text-gray-600"
            >
              No returned books found.
            </p>

            <p
              className="mt-1 text-xs
              text-gray-400"
            >
              Returned books will appear here.
            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table
              className="min-w-full
              border-separate border-spacing-y-3"
            >

              <thead>

                <tr
                  className="text-left text-sm
                  text-gray-500"
                >

                  <th className="px-4 py-2">
                    Student
                  </th>

                  <th className="px-4 py-2">
                    Book
                  </th>

                  <th className="px-4 py-2">
                    Category
                  </th>

                  <th className="px-4 py-2">
                    Borrowed Date
                  </th>

                  <th className="px-4 py-2">
                    Due Date
                  </th>

                  <th className="px-4 py-2">
                    Returned Date
                  </th>

                  <th className="px-4 py-2">
                    Status
                  </th>

                  <th className="px-4 py-2">
                    Action
                  </th>

                </tr>

              </thead>


              <tbody>

                {returnedBooks.map((item) => (

                  <tr
                    key={item._id}
                    className="rounded-xl
                    bg-gray-100 text-sm"
                  >

                    {/* STUDENT */}

                    <td
                      className="rounded-l-xl
                      px-4 py-4"
                    >

                      <p
                        className="font-medium
                        text-gray-800"
                      >
                        {item.student?.name ||
                          "Unknown Student"}
                      </p>

                      <p
                        className="mt-1 text-xs
                        text-gray-500"
                      >
                        {item.student?.email || ""}
                      </p>

                    </td>


                    {/* BOOK */}

                    <td className="px-4 py-4">

                      <p
                        className="font-medium
                        text-gray-800"
                      >
                        {item.book?.title ||
                          "Unknown Book"}
                      </p>

                    </td>


                    {/* CATEGORY */}

                    <td
                      className="px-4 py-4
                      text-gray-600"
                    >
                      {item.book?.category ||
                        "N/A"}
                    </td>


                    {/* BORROWED DATE */}

                    <td
                      className="px-4 py-4
                      text-gray-600"
                    >
                      {formatDate(item.createdAt)}
                    </td>


                    {/* DUE DATE */}

                    <td
                      className="px-4 py-4
                      text-gray-600"
                    >
                      {formatDate(item.dueDate)}
                    </td>


                    {/* RETURNED DATE */}

                    <td
                      className="px-4 py-4
                      font-medium text-gray-700"
                    >
                      {formatDate(item.returnedAt)}
                    </td>


                    {/* STATUS */}

                    <td className="px-4 py-4">

                      <span
                        className="inline-flex
                        rounded-full bg-green-100
                        px-3 py-1 text-xs
                        font-medium text-green-700"
                      >
                        Returned
                      </span>

                    </td>


                    {/* ACTION */}

                    <td
                      className="rounded-r-xl
                      px-4 py-4"
                    >

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

export default BookReturned;