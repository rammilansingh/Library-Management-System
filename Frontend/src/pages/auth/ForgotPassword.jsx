import React, { useContext, useState } from 'react'
import {Link, resolvePath} from "react-router-dom"
import {axiosInstance} from "../../utils/axiosInstance.js"
import toast from "react-hot-toast"
import { AppContext } from '../../context/AppContext.jsx'


const ForgotPassword = () => {

  const{loading,setLoading,navigate} = useContext(AppContext)
  const [formData,setFormData] = useState({
    email:"",
  })

  const handleChange =(e)=>{
    setFormData({...formData,[e.target.name]:e.target.value})
  }

  const hanleSubmit = async (e)=>{
    e.preventDefault();
    try {
      setLoading(true);
      const {data} = await axiosInstance.post("/auth/forget-password",formData);
      if (data.success) {
                toast.success(data.message)
            }

    } catch (error) {
      toast.error(Response.error.data.message)
    }

    finally{
      setLoading(false)
    }

  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-100 to-gray-300
     flex items-center justify-center px-4'>

      <div className='w-full max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-8'>
        <div className='text-center mb-6'>
          <h2 className='text-2xl sm:text-3xl font-semibold text-gray-800'>Reset Password</h2>
          <p className='text-sm text-gray-500 mt-1'>Enter your email to reset your password</p>
        </div>

        <form onSubmit={hanleSubmit} className='flex flex-col gap-4'>
          <input type="email" value={formData.email} onChange={handleChange} name='email' 
          placeholder='Email' className='h-12 rounded-lg border border-gray-300 px-4
           text-sm outline-none focus:border-black' />

           <div className='flex justify-between items-center text-sm'>
              <Link to="/login" className='text-gray-600 hover:text-black hover:underline'> Login
              </Link>
           </div>

           <button type='submit' disabled={loading} className='mt-2 h-12 rounded-lg bg-black text-white
           font-semibold  hover:opacity-90 transition'>{loading? "please wait....":"Reset password"}</button>
        </form>

        <p className='text-center text-sm text-gray-600 mt-6'>
          Don't have an account?
          <Link to="/register" className='font-semibold text-black hover:underline'>Sign Up</Link>
        </p>

      </div>

    </div>
  )
}

export default ForgotPassword;