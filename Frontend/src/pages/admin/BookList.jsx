import React, { useContext } from 'react'
import { AppContext } from '../../context/AppContext'
import { Edit2Icon, Trash2Icon } from 'lucide-react'

const BookList = () => {
  const{books,fetchBooks,navigate} = useContext(AppContext)

  const deleteBook = async (id) => {
    try {
      const { data } = await axiosInstance.delete(
        `/books/delete/${id}`
      )

      if (data.success) {
        toast.success(data.message)
        await fetchBooks()
      }

    } catch (error) {
      console.log("Error deleting student:", error)

      toast.error(
        error.response?.data?.message ||
        "Failed to delete book"
      )
    }
  }

  return (
    <div className='w-full'>
      <div className='mb-8 flex flex-row  items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold text-gray-800'>Book Overview</h2>
          <p className='mt-1 text-sm text-gray-600'>Monitor Books</p>
        </div>
        <button onClick={()=>navigate("/admin/add-book")} className='rounded-lg bg-black px-8 py-2 text-sm font-medium text-white
         hover:opacity-90 cursor-pointer'> 
          Add Book
        </button>
      </div>

      {/* Books Table */}

      <div className='mt-10 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm'>
        {
          books.length === 0 ? (
            <div className='rounded-xl bg-gray-50 py-10 text-center text-sm text-gray-500'>
              No book found.
            </div>
          ):(
            <div className='overflow-x-auto'>
              <table className='min-w-full border-separate border-spacing-y-3'>
                <thead>
                  <tr className='text-left text-sm text-gray-500'>

                    <th className='px-4'>Title</th>
                    <th className='px-4'>Image</th>
                    <th className='px-4'>Category</th>
                    <th className='px-4'>Total Copies</th>
                    <th className='px-4'>Available Copies</th>
                    <th className='px-4'>Language</th>
                    <th className='px-4'>Actions</th>

                  </tr>
                </thead>

                <tbody>
                  {
                    books.map((item)=>(
                      <tr key={item._id} className='rounded-xl bg-gray-100  text-sm 
                       '>

                      <td className='rounded-l-xl px-4 py-4 font-medium'>

                      <div>
                        {item.title}
                      </div>

                      </td>

                      <td className='px-4 py-4'>
                        <img src={item.coverImage.url} alt={item.title} className='h-14 w-14  rounded' />
                      </td>

                       <td className='px-4 py-4'>
                        {item.category}
                      </td>

                       <td className='px-4 py-4'>
                        {item.totalCopies}
                      </td>

                       <td className='px-4 py-4'>
                        {item.availableCopies}
                      </td>

                      <td className='rounded-r-xl px-4 py-4'>
                      {item.language}
                      </td>

                      <td className='rounded-r-xl px-4 py-4 flex gap-2'>
                        <Trash2Icon onClick={()=>deleteBook(item._id)} className='text-red-500 w-5 h-5 cursor-pointer'/>
                        <Edit2Icon onClick={()=>{navigate(`/admin/book/update/${item._id}`)}} className='text-yellow-500 w-5 h-5 cursor-pointer'/>
                      </td>
                      </tr>
                    ))
                  }
                </tbody>

              </table>

            </div>
          )
        }
      </div>

    </div>
  )
}

export default BookList