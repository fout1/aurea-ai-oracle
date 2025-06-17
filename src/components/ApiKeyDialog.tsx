
import React, { useState } from 'react';
import { Key, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ApiKeyDialogProps {
  onApiKeySet: (key: string) => void;
  hasApiKey: boolean;
}

export const ApiKeyDialog: React.FC<ApiKeyDialogProps> = ({ onApiKeySet, hasApiKey }) => {
  const [apiKey, setApiKey] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onApiKeySet(apiKey.trim());
      setApiKey('');
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant={hasApiKey ? "outline" : "default"}
          size="sm"
          className={hasApiKey ? "text-green-400 border-green-400/50" : "bg-aurea-500 hover:bg-aurea-600"}
        >
          <Key className="w-4 h-4 mr-2" />
          {hasApiKey ? "Update API Key" : "Set API Key"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-gray-900/95 backdrop-blur-sm border border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white">Configure Aurea API Key</DialogTitle>
          <DialogDescription className="text-gray-300">
            Enter your Brian API key to enable Aurea AI functionality.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey" className="text-white">API Key</Label>
            <Input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Brian API key..."
              className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
            />
          </div>
          <div className="flex items-center justify-between">
            <a
              href="https://docs.brianknows.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-aurea-400 hover:text-aurea-300 text-sm flex items-center"
            >
              Get API Key <ExternalLink className="w-3 h-3 ml-1" />
            </a>
            <Button 
              type="submit" 
              disabled={!apiKey.trim()}
              className="bg-aurea-500 hover:bg-aurea-600"
            >
              Save Key
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
