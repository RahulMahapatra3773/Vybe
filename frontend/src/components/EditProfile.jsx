import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import axios from 'axios';
import { Loader2, Camera, User, ArrowLeft, Save, Edit3 } from 'lucide-react';
import { toast } from 'sonner';
import { setAuthUser } from '@/redux/authSlice';
import { motion } from 'framer-motion';

const EditProfile = () => {
  const { user } = useSelector((store) => store.auth);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    profilePhoto: user?.profilePicture,
    bio: user?.bio || '',
    gender: user?.gender || '',
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const imageRef = useRef();

  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setInput({ ...input, profilePhoto: file, previewUrl });
    }
  };

  const selectChangeHandler = (value) => {
    setInput({ ...input, gender: value });
  };

  const editProfileHandler = async () => {
    const formData = new FormData();
    formData.append('bio', input.bio);
    formData.append('gender', input.gender);
    if (input.profilePhoto && typeof input.profilePhoto !== 'string') {
      formData.append('profilePhoto', input.profilePhoto);
    }

    try {
      setLoading(true);
      const res = await axios.post(
        'https://vybe-1.onrender.com/api/v1/user/profile/edit',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(
          setAuthUser({
            ...user,
            bio: res.data.user?.bio,
            profilePicture: res.data.user?.profilePicture,
            gender: res.data.user?.gender,
          })
        );
        toast.success(res.data.message);
        navigate(`/profile/${user?._id}`);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-white">
      <div className="sticky top-0 z-10 bg-gradient-to-r from-black/80 to-gray-900/80 backdrop-blur-xl border-b border-blue-500/20">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            onClick={() => navigate(-1)}
            className="p-2 bg-gradient-to-r from-gray-800/80 to-gray-900/80 hover:from-gray-700/80 hover:to-gray-800/80 border border-blue-500/20 rounded-xl backdrop-blur-sm transition-all duration-200 hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-2">
            <Edit3 className="w-6 h-6 text-blue-400" />
            Edit Profile
          </h1>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="max-w-2xl mx-auto px-4 py-8"
      >
        <div className="bg-gradient-to-br from-black/80 via-gray-900/80 to-blue-900/20 border border-blue-500/30 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden">
          <div className="relative p-8 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-b border-blue-500/20">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative group">
                <div className="relative">
                  <Avatar className="w-24 h-24 ring-4 ring-blue-500/30 group-hover:ring-blue-500/50 transition-all duration-300">
                    <AvatarImage
                      src={input.previewUrl || user?.profilePicture}
                      alt="Avatar"
                      className="object-cover w-full h-full"
                    />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-2xl">
                      {user?.username?.[0]?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer"
                    onClick={() => imageRef.current?.click()}>
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl" />
              </div>

              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {user?.username}
                </h2>
                <p className="text-gray-400 mt-1 mb-4">
                  {user?.bio || 'Add a bio to tell people more about yourself...'}
                </p>

                <input
                  ref={imageRef}
                  onChange={fileChangeHandler}
                  type="file"
                  accept="image/*"
                  className="hidden"
                />

                <Button
                  onClick={() => imageRef.current?.click()}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl px-6 py-2 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-blue-500/25"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Change Photo
                </Button>
              </div>
            </div>
          </div>
          <div className="p-8 space-y-6">
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-300">
                <User className="w-4 h-4" />
                Bio
              </label>
              <Textarea
                value={input.bio}
                onChange={(e) => setInput({ ...input, bio: e.target.value })}
                placeholder="Tell people a little about yourself..."
                className="min-h-[120px] bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-blue-500/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 resize-none"
                maxLength={150}
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Share your story, interests, or what makes you unique</span>
                <span className={input.bio.length > 130 ? 'text-yellow-400' : 'text-gray-500'}>
                  {input.bio.length}/150
                </span>
              </div>
            </div>
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-300">
                Gender
              </label>
              <Select defaultValue={input.gender} onValueChange={selectChangeHandler}>
                <SelectTrigger className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-blue-500/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200">
                  <SelectValue placeholder="Select your gender" />
                </SelectTrigger>
                <SelectContent className="bg-gradient-to-br from-black/90 to-gray-900/90 backdrop-blur-xl border border-blue-500/30 rounded-xl">
                  <SelectGroup>
                    <SelectItem
                      value="male"
                      className="text-white hover:bg-blue-500/20 focus:bg-blue-500/20 rounded-lg"
                    >
                      Male
                    </SelectItem>
                    <SelectItem
                      value="female"
                      className="text-white hover:bg-blue-500/20 focus:bg-blue-500/20 rounded-lg"
                    >
                      Female
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="p-8 pt-0 flex gap-4">
            <Button
              onClick={() => navigate(-1)}
              disabled={loading}
              className="flex-1 h-12 bg-gradient-to-r from-gray-600/80 to-gray-700/80 hover:from-gray-500/80 hover:to-gray-600/80 text-white rounded-xl backdrop-blur-sm transition-all duration-200 hover:scale-[1.02]"
            >
              Cancel
            </Button>

            <Button
              onClick={editProfileHandler}
              disabled={loading}
              className="flex-1 h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-xl transition-all duration-200 hover:scale-[1.02] shadow-lg hover:shadow-blue-500/25"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </div>
              )}
            </Button>
          </div>
        </div>
      </motion.div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default EditProfile;