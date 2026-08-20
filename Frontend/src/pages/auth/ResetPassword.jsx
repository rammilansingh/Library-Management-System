import React, { useContext, useState } from 'react'
import {Link, resolvePath, useParams} from "react-router-dom"
import {axiosInstance} from "../../utils/axiosInstance.js"
import toast from "react-hot-toast"
import { AppContext } from '../../context/AppContext.jsx'


const ResetPassword = () => {

  const{loading,setLoading,navigate} = useContext(AppContext)

  const {token} = useParams();

  const [formData,setFormData] = useState({
    password:"",
    confirmPassword:""
  })

  const handleChange =(e)=>{
    setFormData({...formData,[e.target.name]:e.target.value})
  }

  const hanleSubmit = async (e)=>{
    e.preventDefault();

    if(!formData.password || !formData.confirmPassword){
      return toast.error("please fill all fields");
    }

    if(formData.password !== formData.confirmPassword){
      return toast.error("Password mismatch");
    }

    try {
      setLoading(true);
      const {data} = await axiosInstance.put(`/auth/reset-password/${token}`,formData);
      if (data.success) {
                toast.success(data.message)
                navigate("/login")
            }

    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
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
          <p className='text-sm text-gray-500 mt-1'>Create new password</p>
        </div>

        <form onSubmit={hanleSubmit} className='flex flex-col gap-4'>

           <input type="password" value={formData.password} onChange={handleChange} name='password' 
          placeholder='Password' className='h-12 rounded-lg border border-gray-300 px-4
           text-sm outline-none focus:border-black' />

           <input type="password" value={formData.confirmPassword} onChange={handleChange} name='confirmPassword' 
          placeholder='confirmPassword' className='h-12 rounded-lg border border-gray-300 px-4
           text-sm outline-none focus:border-black' />

           <div className='flex justify-between items-center text-sm'>
              <Link to="/login" className='text-gray-600 hover:text-black hover:underline'>Back to login page
              </Link>
           </div>

           <button type='submit' disabled={loading} className='mt-2 h-12 rounded-lg bg-black text-white
           font-semibold  hover:opacity-90 transition'>{loading? "please wait....":"Reset Password"}</button>
        </form>

      </div>

    </div>
  )
}

export default ResetPassword;