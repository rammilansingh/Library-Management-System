import React, { useContext, useState } from 'react'
import {Link, resolvePath} from "react-router-dom"
import {axiosInstance} from "../../utils/axiosInstance.js"
import toast from "react-hot-toast"
import { AppContext } from '../../context/AppContext.jsx'


const Register = () => {

  const{loading,setLoading,setUser,navigate} = useContext(AppContext)
  const [formData,setFormData] = useState({
    name:"",
    email:"",
    password:""
  })

  const handleChange =(e)=>{
    setFormData({...formData,[e.target.name]:e.target.value})
  }

  const hanleSubmit = async (e)=>{
    e.preventDefault();
    try {
      setLoading(true);
      const {data} = await axiosInstance.post("/auth/register",formData);
      if (data.success) {
                toast.success(data.message)
                setUser(data.user)
                navigate("/student") 
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
          <h2 className='text-2xl sm:text-3xl font-semibold text-gray-800'> Sign Up </h2>
          <p className='text-sm text-gray-500 mt-1'>Register new user</p>
        </div>

        <form onSubmit={hanleSubmit} className='flex flex-col gap-4'>
          <input type="text" value={formData.name} onChange={handleChange} name='name' 
          placeholder='Name' className='h-12 rounded-lg border border-gray-300 px-4
           text-sm outline-none focus:border-black' />

          <input type="email" value={formData.email} onChange={handleChange} name='email' 
          placeholder='Email' className='h-12 rounded-lg border border-gray-300 px-4
           text-sm outline-none focus:border-black' />

           <input type="password" value={formData.password} onChange={handleChange} name='password' 
          placeholder='Password' className='h-12 rounded-lg border border-gray-300 px-4
           text-sm outline-none focus:border-black' />


           <button type='submit' disabled={loading} className='mt-2 h-12 rounded-lg bg-black text-white
           font-semibold  hover:opacity-90 transition'>{loading? "please wait....":"Register"}</button>
        </form>

        <p className='text-center text-sm text-gray-600 mt-6'>
          Aready have an account?
          <Link to="/login" className='font-semibold text-black hover:underline'>Sign In</Link>
        </p>

      </div>

    </div>
  )
}

export default Register