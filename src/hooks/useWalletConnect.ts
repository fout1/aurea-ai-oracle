
import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

// WalletConnect types
interface WalletConnection {
  address: string;
  chainId: number;
  isConnected: boolean;
  connector: string;
}

interface WalletConnectError {
  message: string;
  code?: number;
}

// Mock WalletConnect implementation for demo
class MockWalletConnect {
  private listeners: Map<string, Function[]> = new Map();
  private isConnected = false;
  private account = '';
  private chainId = 1;

  async connect(): Promise<{ accounts: string[], chainId: number }> {
    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock successful connection
    this.isConnected = true;
    this.account = '0x742d35Cc6634C0532925a3b8D6C' + Math.random().toString(16).slice(2, 10);
    this.chainId = 1;
    
    this.emit('connect', { accounts: [this.account], chainId: this.chainId });
    return { accounts: [this.account], chainId: this.chainId };
  }

  async disconnect(): Promise<void> {
    this.isConnected = false;
    this.account = '';
    this.emit('disconnect');
  }

  async switchChain(chainId: number): Promise<void> {
    this.chainId = chainId;
    this.emit('chainChanged', chainId);
  }

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  off(event: string, callback: Function) {
    const listeners = this.listeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, data?: any) {
    const listeners = this.listeners.get(event);
    if (listeners) {
      listeners.forEach(listener => listener(data));
    }
  }

  getAccount(): string {
    return this.account;
  }

  getChainId(): number {
    return this.chainId;
  }

  isConnectedWallet(): boolean {
    return this.isConnected;
  }
}

export const useWalletConnect = () => {
  const [wallet, setWallet] = useState<WalletConnection | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletConnector] = useState(() => new MockWalletConnect());
  const { toast } = useToast();

  const connect = useCallback(async () => {
    if (isConnecting) return;
    
    setIsConnecting(true);
    try {
      const result = await walletConnector.connect();
      
      const walletConnection: WalletConnection = {
        address: result.accounts[0],
        chainId: result.chainId,
        isConnected: true,
        connector: 'WalletConnect'
      };
      
      setWallet(walletConnection);
      
      toast({
        title: "Wallet Connected",
        description: `Connected to ${walletConnection.address.slice(0, 6)}...${walletConnection.address.slice(-4)}`,
      });
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect to wallet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  }, [isConnecting, walletConnector, toast]);

  const disconnect = useCallback(async () => {
    try {
      await walletConnector.disconnect();
      setWallet(null);
      
      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been disconnected.",
      });
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  }, [walletConnector, toast]);

  const switchChain = useCallback(async (chainId: number) => {
    try {
      await walletConnector.switchChain(chainId);
      if (wallet) {
        setWallet({ ...wallet, chainId });
      }
      
      toast({
        title: "Network Switched",
        description: `Switched to chain ID ${chainId}`,
      });
    } catch (error) {
      console.error('Failed to switch chain:', error);
      toast({
        title: "Network Switch Failed",
        description: "Failed to switch network. Please try again.",
        variant: "destructive",
      });
    }
  }, [wallet, walletConnector, toast]);

  // Set up event listeners
  useEffect(() => {
    const handleConnect = (data: { accounts: string[], chainId: number }) => {
      const walletConnection: WalletConnection = {
        address: data.accounts[0],
        chainId: data.chainId,
        isConnected: true,
        connector: 'WalletConnect'
      };
      setWallet(walletConnection);
    };

    const handleDisconnect = () => {
      setWallet(null);
    };

    const handleChainChanged = (chainId: number) => {
      if (wallet) {
        setWallet({ ...wallet, chainId });
      }
    };

    walletConnector.on('connect', handleConnect);
    walletConnector.on('disconnect', handleDisconnect);
    walletConnector.on('chainChanged', handleChainChanged);

    return () => {
      walletConnector.off('connect', handleConnect);
      walletConnector.off('disconnect', handleDisconnect);
      walletConnector.off('chainChanged', handleChainChanged);
    };
  }, [walletConnector, wallet]);

  return {
    wallet,
    isConnecting,
    connect,
    disconnect,
    switchChain,
    isConnected: !!wallet?.isConnected,
  };
};
