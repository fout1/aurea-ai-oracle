
import React from 'react';
import { Wallet, LogOut, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useWalletConnect } from '@/hooks/useWalletConnect';

export const WalletConnectButton = () => {
  const { wallet, isConnecting, connect, disconnect, switchChain, isConnected } = useWalletConnect();

  const supportedChains = [
    { id: 1, name: 'Ethereum' },
    { id: 137, name: 'Polygon' },
    { id: 56, name: 'BNB Chain' },
    { id: 42161, name: 'Arbitrum' },
  ];

  const handleConnect = async () => {
    await connect();
  };

  const handleDisconnect = async () => {
    await disconnect();
  };

  const handleSwitchChain = async (chainId: number) => {
    await switchChain(chainId);
  };

  if (!isConnected) {
    return (
      <Button
        onClick={handleConnect}
        disabled={isConnecting}
        className="bg-aurea-500 hover:bg-aurea-600"
      >
        <Wallet className="w-4 h-4 mr-2" />
        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="border-aurea-500/50 text-aurea-200">
          <Wallet className="w-4 h-4 mr-2" />
          {wallet?.address.slice(0, 6)}...{wallet?.address.slice(-4)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-gray-900/95 backdrop-blur-sm border border-gray-700">
        <DropdownMenuLabel className="text-white">
          <div className="flex flex-col space-y-1">
            <span>Wallet Connected</span>
            <span className="text-xs text-gray-400 font-normal">
              Chain ID: {wallet?.chainId}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-700" />
        
        <DropdownMenuLabel className="text-aurea-200 text-xs">Switch Network</DropdownMenuLabel>
        {supportedChains.map((chain) => (
          <DropdownMenuItem
            key={chain.id}
            onClick={() => handleSwitchChain(chain.id)}
            className="text-gray-300 hover:text-white hover:bg-gray-800"
          >
            <Zap className="w-4 h-4 mr-2" />
            {chain.name}
            {wallet?.chainId === chain.id && (
              <span className="ml-auto text-aurea-400">✓</span>
            )}
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator className="bg-gray-700" />
        <DropdownMenuItem
          onClick={handleDisconnect}
          className="text-red-400 hover:text-red-300 hover:bg-gray-800"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
