import React, { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { EyeIcon } from "lucide-react";

const OverdueBooks = () => {

  const {
    borroweBooks,
    loading,
    navigate,
  } = useContext(AppContext);


  // Safe array
  const books = borroweBooks || [];


  // =========================
  // FILTER OVERDUE BOOKS
  // =========================

  const overdueBooks = books.filter((item) => {

    return (
      item.status === "borrowed" &&
      new Date(item.dueDate) < new Date()
    );

  });


  // =========================
  // FORMAT DATE
  // =========================

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


  // =========================
  // CALCULATE DAYS LATE
  // =========================

  const getDaysLate = (dueDate) => {

    if (!dueDate) {
      return 0;
    }

    const today = new Date();
    const due = new Date(dueDate);

    const difference =
      today.getTime() - due.getTime();

    return Math.ceil(
      difference / (1000 * 60 * 60 * 24)
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
            Overdue Books
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Monitor books that have passed their due date.
          </p>

        </div>


        <div
          className="rounded-lg bg-red-500
          px-4 py-2.5 text-sm font-medium
          text-white"
        >
          Overdue: {overdueBooks.length}
        </div>

      </div>


      {/* =========================
          STATS
      ========================= */}

      <div className="mb-6">

        <div
          className="rounded-xl border border-red-100
          bg-white p-5 shadow-sm"
        >

          <p className="text-sm text-gray-500">
            Total Overdue Books
          </p>

          <h3
            className="mt-2 text-2xl font-bold
            text-red-600"
          >
            {overdueBooks.length}
          </h3>

          <p className="mt-1 text-xs text-gray-400">
            Books not returned before the due date
          </p>

        </div>

      </div>


      {/* =========================
          TABLE
      ========================= */}

      <div
        className="rounded-2xl border border-gray-200
        bg-white p-5 shadow-sm"
      >

        {/* LOADING */}

        {loading ? (

          <div className="py-16 text-center">

            <div
              className="mx-auto h-8 w-8 animate-spin
              rounded-full border-4 border-gray-300
              border-t-red-500"
            />

            <p className="mt-3 text-sm text-gray-500">
              Loading overdue books...
            </p>

          </div>

        ) : overdueBooks.length === 0 ? (

          /* =========================
             EMPTY STATE
          ========================= */

          <div
            className="rounded-xl bg-gray-50
            py-16 text-center"
          >

            <p
              className="text-sm font-medium
              text-gray-600"
            >
              No overdue books found.
            </p>

            <p
              className="mt-1 text-xs
              text-gray-400"
            >
              Great! All borrowed books are within their due dates.
            </p>

          </div>

        ) : (

          /* =========================
             TABLE
          ========================= */

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
                    Days Late
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

                {overdueBooks.map((item) => (

                  <tr
                    key={item._id}
                    className="rounded-xl bg-gray-100
                    text-sm"
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
                      font-medium text-red-600"
                    >
                      {formatDate(item.dueDate)}
                    </td>


                    {/* DAYS LATE */}

                    <td className="px-4 py-4">

                      <span
                        className="rounded-full
                        bg-red-100 px-3 py-1
                        text-xs font-medium
                        text-red-700"
                      >
                        {getDaysLate(item.dueDate)}{" "}
                        {getDaysLate(item.dueDate) === 1
                          ? "Day"
                          : "Days"}
                      </span>

                    </td>


                    {/* STATUS */}

                    <td className="px-4 py-4">

                      <span
                        className="inline-flex
                        rounded-full bg-red-100
                        px-3 py-1 text-xs
                        font-medium text-red-700"
                      >
                        Overdue
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

export default OverdueBooks;