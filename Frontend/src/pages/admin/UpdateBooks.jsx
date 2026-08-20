import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { AppContext } from "../../context/AppContext";
import { axiosInstance } from "../../utils/axiosInstance";

const UpdateBooks = () => {
  const { id } = useParams();

  const {
    books,
    loading,
    setLoading,
    navigate,
    fetchBooks,
  } = useContext(AppContext);

  const [preview, setPreview] = useState(null);
  const [newImage, setNewImage] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    language: "English",
    totalCopies: "",
    availableCopies: "",
  });

  const categories = [
    "Fiction",
    "Non Fiction",
    "Science",
    "History",
    "Technology",
    "Education",
    "Other",
  ];

  
  // LOAD EXISTING BOOK
  

  useEffect(() => {
    const book = books.find((book) => book._id === id);

    if (book) {
      setFormData({
        title: book.title || "",
        description: book.description || "",
        category: book.category || "",
        language: book.language || "English",
        totalCopies: book.totalCopies || "",
        availableCopies: book.availableCopies || "",
      });

      setPreview(book.coverImage || null);
    }
  }, [id, books]);


  // HANDLE INPUT CHANGE
 

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  
  // HANDLE IMAGE CHANGE
 

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setNewImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // =========================
  // HANDLE UPDATE
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      Number(formData.availableCopies) >
      Number(formData.totalCopies)
    ) {
      toast.error(
        "Available copies cannot be greater than total copies"
      );
      return;
    }

    try {
      setLoading(true);

      const dataToSend = new FormData();

      dataToSend.append("title", formData.title);
      dataToSend.append(
        "description",
        formData.description
      );
      dataToSend.append("category", formData.category);
      dataToSend.append("language", formData.language);
      dataToSend.append(
        "totalCopies",
        formData.totalCopies
      );
      dataToSend.append(
        "availableCopies",
        formData.availableCopies
      );

      // Only send image if user selected a new one
      if (newImage) {
        dataToSend.append("coverImage", newImage);
      }

      const { data } = await axiosInstance.put(
        `/books/update/${id}`,
        dataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.success) {
        toast.success(
          data.message || "Book updated successfully"
        );

        await fetchBooks();

        navigate("/admin/books");
      }
    } catch (error) {
      console.log("Error updating book:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to update book"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // IF BOOK NOT FOUND
  // =========================

  const bookExists = books.some(
    (book) => book._id === id
  );

  if (!bookExists && books.length > 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800">
            Book not found
          </h2>

          <button
            type="button"
            onClick={() => navigate("/admin/books")}
            className="mt-4 rounded-lg bg-black px-5 py-2.5
            text-sm font-medium text-white hover:opacity-90"
          >
            Back to Books
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">

      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Update Book
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Update the details of the book below.
        </p>
      </div>

      {/* =========================
          FORM
      ========================= */}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-6 lg:grid-cols-3"
      >

        {/* =========================
            BOOK COVER
        ========================= */}

        <div className="lg:col-span-1">
          <div
            className="rounded-2xl border border-gray-200
            bg-white p-5 shadow-sm"
          >
            <h3
              className="mb-4 text-lg font-semibold
              text-gray-800"
            >
              Book Cover
            </h3>

            <div
              className="flex h-72 items-center justify-center
              overflow-hidden rounded-xl border-2 border-dashed
              border-gray-300 bg-gray-50"
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Book Cover Preview"
                  className="h-full w-full object-contain"
                />
              ) : (
                <div className="text-center">
                  <p
                    className="text-sm font-medium
                    text-gray-600"
                  >
                    No cover image
                  </p>

                  <p
                    className="mt-1 text-xs
                    text-gray-400"
                  >
                    Upload a new cover image
                  </p>
                </div>
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-4 block w-full cursor-pointer
              rounded-lg border border-gray-300 text-sm
              text-gray-600 file:mr-4 file:border-0
              file:bg-black file:px-4 file:py-3
              file:text-sm file:font-medium
              file:text-white hover:file:opacity-90"
            />

            <p className="mt-2 text-xs text-gray-400">
              Select a new image only if you want to
              change the existing cover.
            </p>
          </div>
        </div>

        {/* =========================
            BOOK INFORMATION
        ========================= */}

        <div className="lg:col-span-2">
          <div
            className="rounded-2xl border border-gray-200
            bg-white p-5 shadow-sm"
          >
            <h3
              className="mb-5 text-lg font-semibold
              text-gray-800"
            >
              Book Information
            </h3>

            <div
              className="grid grid-cols-1 gap-4
              md:grid-cols-2"
            >

              {/* TITLE */}

              <div className="md:col-span-2">
                <label
                  className="mb-1 block text-sm
                  font-medium text-gray-700"
                >
                  Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="Enter book title"
                  className="h-12 w-full rounded-lg
                  border border-gray-300 px-4 text-sm
                  outline-none focus:border-black"
                />
              </div>

              {/* DESCRIPTION */}

              <div className="md:col-span-2">
                <label
                  className="mb-1 block text-sm
                  font-medium text-gray-700"
                >
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="5"
                  placeholder="Enter book description"
                  className="w-full rounded-lg
                  border border-gray-300 px-4 py-3
                  text-sm outline-none
                  focus:border-black"
                />
              </div>

              {/* CATEGORY */}

              <div>
                <label
                  className="mb-1 block text-sm
                  font-medium text-gray-700"
                >
                  Category
                </label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="h-12 w-full rounded-lg
                  border border-gray-300 px-4 text-sm
                  outline-none focus:border-black"
                >
                  <option value="">
                    Select Category
                  </option>

                  {categories.map((category) => (
                    <option
                      key={category}
                      value={category}
                    >
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* LANGUAGE */}

              <div>
                <label
                  className="mb-1 block text-sm
                  font-medium text-gray-700"
                >
                  Language
                </label>

                <input
                  type="text"
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  required
                  placeholder="English"
                  className="h-12 w-full rounded-lg
                  border border-gray-300 px-4 text-sm
                  outline-none focus:border-black"
                />
              </div>

              {/* TOTAL COPIES */}

              <div>
                <label
                  className="mb-1 block text-sm
                  font-medium text-gray-700"
                >
                  Total Copies
                </label>

                <input
                  type="number"
                  name="totalCopies"
                  value={formData.totalCopies}
                  onChange={handleChange}
                  required
                  min="1"
                  placeholder="Enter total copies"
                  className="h-12 w-full rounded-lg
                  border border-gray-300 px-4 text-sm
                  outline-none focus:border-black"
                />
              </div>

              {/* AVAILABLE COPIES */}

              <div>
                <label
                  className="mb-1 block text-sm
                  font-medium text-gray-700"
                >
                  Available Copies
                </label>

                <input
                  type="number"
                  name="availableCopies"
                  value={formData.availableCopies}
                  onChange={handleChange}
                  required
                  min="0"
                  placeholder="Enter available copies"
                  className="h-12 w-full rounded-lg
                  border border-gray-300 px-4 text-sm
                  outline-none focus:border-black"
                />
              </div>
            </div>

            {/* =========================
                BUTTONS
            ========================= */}

            <div
              className="mt-6 flex flex-col gap-3
              sm:flex-row sm:justify-end"
            >
              <button
                type="button"
                onClick={() =>
                  navigate("/admin/books")
                }
                className="h-11 rounded-lg border
                border-gray-300 px-6 text-sm
                font-medium text-gray-700
                hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="h-11 rounded-lg bg-black
                px-6 text-sm font-semibold text-white
                hover:opacity-90 disabled:opacity-70"
              >
                {loading
                  ? "Updating..."
                  : "Update Book"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UpdateBooks;