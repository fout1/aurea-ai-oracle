
import { useState, useCallback } from 'react';
import { aureaAPI } from '@/services/aurea-api';
import { 
  ConversationMessage, 
  TransactionResult, 
  KnowledgeResult, 
  ApiError 
} from '@/types/aurea-api';
import { useToast } from '@/hooks/use-toast';
import { useWalletConnect } from '@/hooks/useWalletConnect';

export const useAureaAPI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState(aureaAPI.getApiKey());
  const { toast } = useToast();
  const { wallet } = useWalletConnect();

  const handleApiKey = useCallback((key: string) => {
    aureaAPI.setApiKey(key);
    setApiKey(key);
    toast({
      title: "API Key Set",
      description: "Aurea API key has been configured successfully.",
    });
  }, [toast]);

  const sendMessage = useCallback(async (
    prompt: string, 
    address?: string, 
    chainId?: string,
    conversationHistory?: ConversationMessage[]
  ): Promise<{ response: string; isTransaction: boolean } | null> => {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please set your API key to use Aurea AI.",
        variant: "destructive",
      });
      return null;
    }

    setIsLoading(true);
    
    // Use wallet address if available, otherwise use provided address
    const userAddress = wallet?.address || address || "0x0000000000000000000000000000000000000000";
    const userChainId = chainId || wallet?.chainId?.toString();
    
    console.log('Sending message to Aurea API:', { 
      prompt, 
      address: userAddress, 
      chainId: userChainId,
      walletConnected: !!wallet 
    });

    try {
      const result = await aureaAPI.chat({
        prompt,
        address: userAddress,
        chainId: userChainId,
        messages: conversationHistory,
      });

      if ('error' in result) {
        throw new Error(result.error);
      }

      // Check if it's a transaction result or knowledge result
      if ('solver' in result.result) {
        // Transaction result
        const txResult = result.result as TransactionResult;
        return {
          response: `🔄 **Transaction Prepared by Aurea AI**

**Description:** ${txResult.data.description}

**Details:**
• Solver: ${txResult.solver}
• Action: ${txResult.action}
• Gas Cost: $${txResult.data.gasCostUSD}
• From: ${txResult.data.fromAmount} ${txResult.data.fromToken.symbol} (~$${txResult.data.fromAmountUSD})
• To: ${txResult.data.toAmount} ${txResult.data.toToken.symbol} (~$${txResult.data.toAmountUSD})

${wallet ? `✅ Wallet connected: ${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}` : '⚠️ Connect wallet to execute transaction'}`,
          isTransaction: true,
        };
      } else {
        // Knowledge result
        const knowledgeResult = result.result as KnowledgeResult;
        return {
          response: knowledgeResult.answer,
          isTransaction: false,
        };
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "API Error",
        description: error instanceof Error ? error.message : "Failed to send message",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [apiKey, wallet, toast]);

  const getKnowledge = useCallback(async (prompt: string): Promise<string | null> => {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please set your API key to use Aurea AI.",
        variant: "destructive",
      });
      return null;
    }

    setIsLoading(true);
    console.log('Getting knowledge from Aurea API:', prompt);

    try {
      const result = await aureaAPI.knowledge({ prompt });

      if ('error' in result) {
        throw new Error(result.error);
      }

      return result.result.answer;
    } catch (error) {
      console.error('Error getting knowledge:', error);
      toast({
        title: "API Error",
        description: error instanceof Error ? error.message : "Failed to get knowledge",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [apiKey, toast]);

  const checkConnection = useCallback(async (): Promise<boolean> => {
    try {
      const result = await aureaAPI.ping();
      return !('error' in result);
    } catch {
      return false;
    }
  }, []);

  return {
    isLoading,
    apiKey,
    handleApiKey,
    sendMessage,
    getKnowledge,
    checkConnection,
    wallet,
  };
};
