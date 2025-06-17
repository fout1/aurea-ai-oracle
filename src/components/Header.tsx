
import { Sparkles, Brain } from "lucide-react";

export const Header = () => {
  return (
    <header className="flex items-center justify-between p-6 backdrop-blur-md bg-white/5 border-b border-white/10">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <div className="w-10 h-10 bg-gradient-to-br from-aurea-400 to-aurea-600 rounded-xl flex items-center justify-center animate-pulse-glow">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <Sparkles className="w-4 h-4 text-aurea-400 absolute -top-1 -right-1 animate-pulse" />
        </div>
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-aurea-400 via-aurea-500 to-aurea-600 bg-clip-text text-transparent">
            Aurea AI
          </h1>
          <p className="text-sm text-gray-400">Your intelligent assistant</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="hidden md:flex items-center space-x-2 px-3 py-1 bg-aurea-500/20 rounded-full border border-aurea-500/30">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm text-aurea-200">Online</span>
        </div>
      </div>
    </header>
  );
};
