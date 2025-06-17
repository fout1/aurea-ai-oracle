
import { Sparkles, Brain } from "lucide-react";
import { ApiKeyDialog } from "./ApiKeyDialog";
import { WalletConnectButton } from "./WalletConnectButton";
import { useAureaAPI } from "@/hooks/useAureaAPI";

export const Header = () => {
  const { apiKey, handleApiKey } = useAureaAPI();

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
          <p className="text-sm text-gray-400">Your intelligent blockchain assistant</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <WalletConnectButton />
        <ApiKeyDialog onApiKeySet={handleApiKey} hasApiKey={!!apiKey} />
        <div className="hidden md:flex items-center space-x-2 px-3 py-1 bg-aurea-500/20 rounded-full border border-aurea-500/30">
          <div className={`w-2 h-2 rounded-full animate-pulse ${apiKey ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
          <span className="text-sm text-aurea-200">{apiKey ? 'API Connected' : 'API Key Needed'}</span>
        </div>
      </div>
    </header>
  );
};
