
import { 
  AgentRequest, 
  KnowledgeRequest, 
  TransactionRequest, 
  ParametersExtractionRequest,
  SmartContractRequest,
  SpeechRequest,
  CompileRequest,
  ExplainRequest,
  SignInRequest,
  ApiResponse,
  ApiError,
  TransactionResult,
  KnowledgeResult,
  ParametersExtractionResult,
  SmartContractResult,
  Network,
  Action
} from '@/types/aurea-api';

// Mock Aurea AI API responses for development/demo
class MockAureaAPIService {
  private apiKey: string | null = null;
  private delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  constructor() {
    this.apiKey = localStorage.getItem('aurea-api-key');
  }

  setApiKey(key: string) {
    this.apiKey = key;
    localStorage.setItem('aurea-api-key', key);
  }

  getApiKey(): string | null {
    return this.apiKey;
  }

  // Mock responses
  async ping(): Promise<ApiResponse<string> | ApiError> {
    await this.delay(500);
    return { result: "PONG! Aurea AI is alive!" };
  }

  async compile(request: CompileRequest): Promise<ApiResponse<any> | ApiError> {
    await this.delay(1000);
    return { 
      result: { 
        abi: [{"type": "function", "name": "example"}], 
        bytecode: "0x608060405234801561001057600080fd5b50..." 
      } 
    };
  }

  async explain(request: ExplainRequest): Promise<ApiResponse<string> | ApiError> {
    await this.delay(800);
    return { result: "This smart contract implements a basic token functionality with standard ERC-20 features including transfer, approval, and balance tracking mechanisms." };
  }

  async getNetworks(): Promise<ApiResponse<Network[]> | ApiError> {
    await this.delay(300);
    return {
      result: [
        { id: 1, name: "Ethereum", nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 } },
        { id: 137, name: "Polygon", nativeCurrency: { name: "Matic", symbol: "MATIC", decimals: 18 } },
        { id: 56, name: "BNB Chain", nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 } }
      ]
    };
  }

  async getActions(): Promise<ApiResponse<Action[]> | ApiError> {
    await this.delay(400);
    return {
      result: [
        {
          name: "transfer",
          description: "Transfer tokens to another address",
          parameters: [
            { name: "to", type: "address", description: "Recipient address", required: true },
            { name: "amount", type: "string", description: "Amount to transfer", required: true }
          ]
        },
        {
          name: "swap",
          description: "Swap tokens on a DEX",
          parameters: [
            { name: "fromToken", type: "address", description: "Token to swap from", required: true },
            { name: "toToken", type: "address", description: "Token to swap to", required: true },
            { name: "amount", type: "string", description: "Amount to swap", required: true }
          ]
        }
      ]
    };
  }

  async chat(request: AgentRequest): Promise<ApiResponse<TransactionResult | KnowledgeResult> | ApiError> {
    await this.delay(1500);
    
    // Simulate different responses based on prompt content
    if (request.prompt.toLowerCase().includes('swap') || request.prompt.toLowerCase().includes('transfer')) {
      return {
        result: {
          solver: "Aurea" as const,
          action: "Token Transfer",
          type: "write" as const,
          data: {
            description: `Transfer simulation based on: "${request.prompt}"`,
            steps: [{
              chainId: 1,
              blockNumber: 18500000,
              from: request.address,
              to: "0x1234567890123456789012345678901234567890",
              gasLimit: "21000",
              data: "0x",
              value: "0"
            }],
            gasCostUSD: "5.50",
            fromChainId: 1,
            fromAmountUSD: 100,
            fromAmount: "100",
            fromToken: {
              address: "0xA0b86a33E6441c84fE0bF0FBAb66c5c7B53c4e6d",
              chainId: 1,
              symbol: "USDC",
              decimals: 6,
              name: "USD Coin",
              coinKey: "USDC",
              logoURI: "https://example.com/usdc.png",
              priceUSD: "1.00"
            },
            fromAddress: request.address,
            toChainId: 1,
            toAmountUSD: 95,
            toAmount: "95",
            toAmountMin: "94",
            toToken: {
              address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
              chainId: 1,
              symbol: "ETH",
              decimals: 18,
              name: "Ethereum",
              coinKey: "ETH",
              logoURI: "https://example.com/eth.png",
              priceUSD: "2000.00"
            },
            toAddress: request.address
          }
        } as TransactionResult
      };
    } else {
      return {
        result: {
          input: request.prompt,
          answer: `Aurea AI response to: "${request.prompt}". This is a comprehensive answer about blockchain technology, DeFi protocols, and smart contract development. Aurea AI provides intelligent insights and transaction capabilities for the decentralized ecosystem.`,
          context: [
            {
              pageContent: "Relevant blockchain documentation context",
              metadata: {
                description: "Aurea AI Knowledge Base",
                language: "en",
                source: "https://docs.aurea.ai",
                title: "Blockchain Technology Guide"
              }
            }
          ]
        } as KnowledgeResult
      };
    }
  }

  async knowledge(request: KnowledgeRequest): Promise<ApiResponse<KnowledgeResult> | ApiError> {
    await this.delay(1200);
    return {
      result: {
        input: request.prompt,
        answer: `Knowledge response from Aurea AI: "${request.prompt}". This provides detailed information about blockchain concepts, DeFi protocols, smart contracts, and Web3 development best practices.`,
        context: [
          {
            pageContent: "Comprehensive blockchain knowledge base content",
            metadata: {
              description: "Aurea AI Documentation",
              language: "en",
              source: "https://knowledge.aurea.ai",
              title: "Blockchain Development Guide"
            }
          }
        ]
      }
    };
  }

  async transaction(request: TransactionRequest): Promise<ApiResponse<TransactionResult> | ApiError> {
    await this.delay(1000);
    return {
      result: {
        solver: "Aurea" as const,
        action: "Mock Transaction",
        type: "write" as const,
        data: {
          description: `Transaction for: ${request.prompt}`,
          steps: [{
            chainId: 1,
            blockNumber: 18500000,
            from: request.address,
            to: "0x1234567890123456789012345678901234567890",
            gasLimit: "50000",
            data: "0xa9059cbb",
            value: "0"
          }],
          gasCostUSD: "8.75",
          fromChainId: 1,
          fromAmountUSD: 500,
          fromAmount: "500",
          fromToken: {
            address: "0xA0b86a33E6441c84fE0bF0FBAb66c5c7B53c4e6d",
            chainId: 1,
            symbol: "USDC",
            decimals: 6,
            name: "USD Coin",
            coinKey: "USDC",
            logoURI: "https://example.com/usdc.png",
            priceUSD: "1.00"
          },
          fromAddress: request.address,
          toChainId: 1,
          toAmountUSD: 485,
          toAmount: "485",
          toAmountMin: "480",
          toToken: {
            address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
            chainId: 1,
            symbol: "ETH",
            decimals: 18,
            name: "Ethereum",
            coinKey: "ETH",
            logoURI: "https://example.com/eth.png",
            priceUSD: "2000.00"
          },
          toAddress: request.address
        }
      }
    };
  }

  async extractParameters(request: ParametersExtractionRequest): Promise<ApiResponse<ParametersExtractionResult> | ApiError> {
    await this.delay(600);
    return {
      result: {
        prompt: request.prompt,
        completion: {
          action: "transfer"
        }
      }
    };
  }

  async generateSmartContract(request: SmartContractRequest): Promise<SmartContractResult | ApiError> {
    await this.delay(2000);
    return {
      result: `\`\`\`solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AureaGeneratedContract {
    // Generated based on: ${request.prompt}
    
    string public name = "Aurea Smart Contract";
    address public owner;
    
    constructor() {
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }
    
    function updateName(string memory _name) public onlyOwner {
        name = _name;
    }
}
\`\`\``,
      abi: [
        {"type": "constructor", "inputs": []},
        {"type": "function", "name": "name", "inputs": [], "outputs": [{"type": "string"}]},
        {"type": "function", "name": "owner", "inputs": [], "outputs": [{"type": "address"}]}
      ],
      bytecode: "0x608060405234801561001057600080fd5b50336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff..."
    };
  }

  async speechToAction(request: SpeechRequest): Promise<ApiResponse<TransactionResult> | ApiError> {
    await this.delay(1800);
    return {
      result: {
        solver: "Aurea" as const,
        action: "Speech to Action",
        type: "write" as const,
        data: {
          description: "Action generated from speech input",
          steps: [{
            chainId: 1,
            blockNumber: 18500000,
            from: request.address,
            to: "0x1234567890123456789012345678901234567890",
            gasLimit: "30000",
            data: "0x",
            value: "0"
          }],
          gasCostUSD: "3.25",
          fromChainId: 1,
          fromAmountUSD: 50,
          fromAmount: "50",
          fromToken: {
            address: "0xA0b86a33E6441c84fE0bF0FBAb66c5c7B53c4e6d",
            chainId: 1,
            symbol: "USDC",
            decimals: 6,
            name: "USD Coin",
            coinKey: "USDC",
            logoURI: "https://example.com/usdc.png",
            priceUSD: "1.00"
          },
          fromAddress: request.address,
          toChainId: 1,
          toAmountUSD: 48,
          toAmount: "48",
          toAmountMin: "47",
          toToken: {
            address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
            chainId: 1,
            symbol: "ETH",
            decimals: 18,
            name: "Ethereum",
            coinKey: "ETH",
            logoURI: "https://example.com/eth.png",
            priceUSD: "2000.00"
          },
          toAddress: request.address
        }
      }
    };
  }

  async getNonce(): Promise<ApiResponse<string> | ApiError> {
    await this.delay(200);
    return { result: Math.random().toString(36).substring(2, 15) };
  }

  async signIn(request: SignInRequest): Promise<ApiResponse<string> | ApiError> {
    await this.delay(500);
    return { result: "mock-jwt-token-for-aurea-ai" };
  }

  async generateApiKey(): Promise<ApiResponse<string> | ApiError> {
    await this.delay(300);
    return { result: "aurea_api_" + Math.random().toString(36).substring(2, 15) };
  }

  async getUsage(apiKey: string): Promise<ApiResponse<number> | ApiError> {
    await this.delay(200);
    return { result: Math.floor(Math.random() * 1000) };
  }
}

export const mockAureaAPI = new MockAureaAPIService();
