import { Link } from "react-router-dom";
import {
  Camera,
  Heart,
  Users,
  MessageCircle,
  Compass,
  Palette,
  Sparkles,
  ArrowRight,
} from "lucide-react";



export default function LandingPage() {
  const features = [
    { icon: Camera, text: "Post Photos & Videos", color: "from-blue-500 to-cyan-500" },
    { icon: Heart, text: "Like & Comment", color: "from-red-500 to-pink-500" },
    { icon: Users, text: "Follow Friends", color: "from-green-500 to-emerald-500" },
    { icon: MessageCircle, text: "Direct Messaging", color: "from-purple-500 to-violet-500" },
    { icon: Compass, text: "Explore Feed", color: "from-orange-500 to-yellow-500" },
    { icon: Palette, text: "Custom Profiles", color: "from-indigo-500 to-blue-500" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-900 flex flex-col items-center justify-center px-2 sm:px-4 py-4 sm:py-6 text-white relative overflow-hidden">
      <div className="absolute w-60 h-60 sm:w-80 sm:h-80 bg-gradient-to-r from-purple-600/8 to-pink-500/8 rounded-full blur-3xl top-10 left-10 pointer-events-none animate-float hidden sm:block" />
      <div className="absolute w-60 h-60 sm:w-80 sm:h-80 bg-gradient-to-r from-blue-500/8 to-cyan-500/8 rounded-full blur-3xl bottom-10 right-10 pointer-events-none animate-float-delayed hidden sm:block" />
      <div className="text-center z-10 max-w-4xl mx-auto animate-fade-in">
        <div className="mb-4 sm:mb-6 inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-black/60 to-gray-900/60 backdrop-blur-xl rounded-xl border border-blue-500/30 shadow-2xl">
          <img src="/vybe-icon.svg" alt="Vybe" className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="text-base sm:text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Vybe
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold mb-3 sm:mb-4 leading-tight px-2">
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Welcome to
          </span>
          <br />
          <span className="text-white drop-shadow-2xl">Vybe</span>
        </h1>

        <p className="text-sm sm:text-base md:text-lg text-gray-300 mb-6 sm:mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed px-2">
          Feel the vibe, share your moments, and connect with your community through our modern social platform.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3 mb-8 sm:mb-10 md:mb-12 px-2">
          <Link to="/signup">
            <button className="group w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl text-sm sm:text-base font-medium shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 border border-blue-500/20 min-w-[140px] sm:min-w-[160px]">
              <span className="flex items-center justify-center gap-1.5">
                Get Started
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </Link>

          <Link to="/login">
            <button className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-gray-800/80 to-gray-900/80 hover:from-gray-700/80 hover:to-gray-800/80 text-white rounded-xl text-sm sm:text-base font-medium border border-blue-500/30 hover:border-blue-500/50 shadow-xl transition-all duration-300 min-w-[140px] sm:min-w-[160px]">
              Sign In
            </button>
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 z-10 max-w-6xl w-full px-2 sm:px-4 animate-slide-up">
        {features.map((feature, i) => {
          const Icon = feature.icon;
          return (
            <div
              key={i}
              className="relative bg-gradient-to-br from-black/60 via-gray-900/60 to-blue-900/30 backdrop-blur-xl border border-blue-500/20 hover:border-blue-500/40 rounded-xl p-3 sm:p-4 shadow-xl hover:shadow-2xl transition-all duration-300 animate-feature-fade"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className={`inline-flex p-2 sm:p-2.5 rounded-lg bg-gradient-to-r ${feature.color} mb-2 sm:mb-3`}>
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <h3 className="text-xs sm:text-sm font-semibold text-white mb-1">{feature.text}</h3>
            </div>
          );
        })}
      </div>
      <div className="absolute bottom-4 sm:bottom-6 flex items-center gap-1.5 text-gray-400 text-xs px-2 text-center">
        <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        <span>Join the vibe with creators worldwide</span>
        <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes feature-fade {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-15px) translateX(8px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(12px) translateX(-6px); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.8s ease-out 0.3s both;
        }
        .animate-feature-fade {
          animation: feature-fade 0.5s ease-out both;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
        
        /* Reduce motion for users who prefer it */
        @media (prefers-reduced-motion: reduce) {
          .animate-fade-in,
          .animate-slide-up,
          .animate-feature-fade,
          .animate-float,
          .animate-float-delayed {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}