import React, { useEffect, useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { toast } from 'sonner'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2, Eye, EyeOff } from 'lucide-react'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'

const Signup = () => {
  const [input, setInput] = useState({ username: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { user } = useSelector(store => store.auth)
  const navigate = useNavigate()

  const changeEventHandler = e => setInput({ ...input, [e.target.name]: e.target.value })

  const signupHandler = async e => {
    e.preventDefault()
    try {
      setLoading(true)
      const res = await axios.post('https://vybe-q98w.onrender.com/api/v1/user/register', input, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      })
      if (res.data.success) {
        toast.success(res.data.message)
        setInput({ username: '', email: '', password: '' })
        navigate('/login')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) navigate('/')
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-900 flex items-center justify-center px-4 py-8 text-white relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        <form
          onSubmit={signupHandler}
          className="bg-gradient-to-br from-black/60 via-gray-900/60 to-blue-900/30 backdrop-blur-xl border border-blue-500/30 rounded-2xl shadow-2xl p-8"
        >
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Create Account
            </h1>
            <p className="text-gray-300 leading-relaxed">
              Sign up to continue your journey and connect with friends
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold mb-3 text-gray-200">Username</label>
            <Input
              type="text"
              name="username"
              value={input.username}
              onChange={changeEventHandler}
              placeholder="Enter username"
              className="bg-gradient-to-r from-gray-800/60 to-gray-900/60 backdrop-blur-sm border border-blue-500/30 text-white placeholder-gray-400 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold mb-3 text-gray-200">Email Address</label>
            <Input
              type="email"
              name="email"
              value={input.email}
              onChange={changeEventHandler}
              placeholder="Enter email"
              className="bg-gradient-to-r from-gray-800/60 to-gray-900/60 backdrop-blur-sm border border-blue-500/30 text-white placeholder-gray-400 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
              required
            />
          </div>

          <div className="mb-8">
            <label className="block text-sm font-semibold mb-3 text-gray-200">Password</label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={input.password}
                onChange={changeEventHandler}
                placeholder="Enter password"
                className="bg-gradient-to-r from-gray-800/60 to-gray-900/60 backdrop-blur-sm border border-blue-500/30 text-white placeholder-gray-400 rounded-xl px-4 py-3 pr-12 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-400 transition-colors"
              >
                {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {loading ? (
            <Button
              disabled
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 rounded-xl shadow-2xl transition-all duration-300"
            >
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Signing up...
            </Button>
          ) : (
            <Button
              type="submit"
              className="group w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 rounded-xl shadow-2xl transition-all duration-300"
            >
              Signup
            </Button>
          )}

          <div className="mt-8 text-center">
            <p className="text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-400 hover:text-purple-400 font-semibold transition-colors duration-300 hover:underline">
                Login
              </Link>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default Signup
