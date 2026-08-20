import React from 'react'
import StudentSidebar from '../../components/student/StudentSidebar'
import StudentTopbar from '../../components/student/StudentTopbar'
import {Outlet} from "react-router-dom"

const Layout = () => {
  return (
    <div className='min-h-screen bg-gray-100 '>
        <div className='flex min-h-screen'>
        <StudentSidebar/>

        {/* Right Content */}
         <div className='flex-1 flex flex-col'>
          {/* Topbar */}
          <StudentTopbar/>
          {/* Outlet content */}

          <main className='flex-1'>
            <div className='rounded-2xl bg-white p-4 sm:p-6 shadow-sm min-h-[calc(100vh-120px)]'>
              <Outlet/>
            </div>
          </main>

         </div>
        </div>

    </div>
  )
}

export default Layout