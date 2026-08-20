import React, { useContext } from 'react'
import { AppContext } from '../../context/AppContext'
import { Trash2Icon } from 'lucide-react'
import toast from 'react-hot-toast'
import { axiosInstance } from '../../utils/axiosInstance'

const StudentList = () => {

  const { students, fetchStudents } = useContext(AppContext)

  const deleteStudent = async (id) => {
    try {
      const { data } = await axiosInstance.delete(
        `/admin/students/${id}`
      )

      if (data.success) {
        toast.success(data.message)
        await fetchStudents()
      }

    } catch (error) {
      console.log("Error deleting student:", error)

      toast.error(
        error.response?.data?.message ||
        "Failed to delete student"
      )
    }
  }

  return (
    <div className='w-full'>

      <div className='mb-8 flex flex-row items-center justify-between'>

        <div>
          <h2 className='text-2xl font-bold text-gray-800'>
            Students Overview
          </h2>

          <p className='mt-1 text-sm text-gray-600'>
            Monitor Students
          </p>
        </div>

      </div>

      {/* Students Table */}

      <div className='mt-10 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm'>

        {
          students.length === 0 ? (

            <div className='rounded-xl bg-gray-50 py-10 text-center text-sm text-gray-500'>
              No students found.
            </div>

          ) : (

            <div className='overflow-x-auto'>

              <table className='min-w-full border-separate border-spacing-y-3'>

                <thead>

                  <tr className='text-left text-sm text-gray-500'>

                    <th className='px-4'>
                      Name
                    </th>

                    <th className='px-4'>
                      Email
                    </th>

                    <th className='px-4'>
                      Role
                    </th>

                    <th className='px-4'>
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {
                    students.map((item) => (

                      <tr
                        key={item._id}
                        className='rounded-xl bg-gray-100 text-sm'
                      >

                        <td className='rounded-l-xl px-4 py-4 font-medium'>
                          <div>
                            {item.name}
                          </div>
                        </td>

                        <td className='px-4 py-4'>
                          {item.email}
                        </td>

                        <td className='px-4 py-4'>
                          {item.role}
                        </td>

                        <td className='rounded-r-xl px-4 py-4'>

                          <div className='flex gap-2'>

                            <Trash2Icon
                              onClick={() =>
                                deleteStudent(item._id)
                              }
                              className='h-5 w-5 cursor-pointer text-red-500'
                            />

                          </div>

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

export default StudentList