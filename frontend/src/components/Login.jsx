import React, { useEffect, useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { toast } from 'sonner';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, Eye, EyeOff, Sparkles, ArrowRight } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser } from '@/redux/authSlice';
import { motion } from 'framer-motion';

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { user } = useSelector(store => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const signupHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(
        'http://localhost:8000/api/v1/user/login',
        input,
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setAuthUser(res.data.user));
        navigate('/');
        toast.success(res.data.message);
        setInput({ email: "", password: "" });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-900 flex items-center justify-center px-4 py-8 text-white">
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
              Welcome Back
            </h1>
            <p className="text-gray-300 leading-relaxed">
              Sign in to continue your journey and connect with friends
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold mb-3 text-gray-200">
              Email Address
            </label>
            <Input
              type="email"
              name="email"
              value={input.email}
              onChange={changeEventHandler}
              placeholder="Enter your email"
              className="bg-gradient-to-r from-gray-800/60 to-gray-900/60 backdrop-blur-sm border border-blue-500/30 hover:border-blue-500/50 focus:border-blue-500 text-white placeholder-gray-400 rounded-xl px-4 py-3 transition-all duration-300 focus:ring-2 focus:ring-blue-500/20"
              required
            />
          </div>

          <div className="mb-8">
            <label className="block text-sm font-semibold mb-3 text-gray-200">
              Password
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                value={input.password}
                onChange={changeEventHandler}
                placeholder="Enter your password"
                className="bg-gradient-to-r from-gray-800/60 to-gray-900/60 backdrop-blur-sm border border-blue-500/30 hover:border-blue-500/50 focus:border-blue-500 text-white placeholder-gray-400 rounded-xl px-4 py-3 pr-12 transition-all duration-300 focus:ring-2 focus:ring-blue-500/20"
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

          <div>
            {loading ? (
              <Button
                disabled
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 rounded-xl shadow-2xl"
              >
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Signing you in...
              </Button>
            ) : (
              <Button
                type="submit"
                className="group w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 rounded-xl shadow-2xl transition-all duration-300"
              >
                <span className="flex items-center justify-center gap-2">
                  Sign In
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            )}
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-400">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-blue-400 hover:text-purple-400 font-semibold transition-colors duration-300 hover:underline"
              >
                Create Account
              </Link>
            </p>
          </div>
        </form>

        <div className="mt-8 flex items-center justify-center gap-2 text-gray-400 text-sm">
          <Sparkles className="w-4 h-4" />
          <span>Secure & encrypted login</span>
          <Sparkles className="w-4 h-4" />
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
