
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
        { id: 56, name: "BNB Chain", nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 } },
        { id: 42161, name: "Arbitrum", nativeCurrency: { name: "Arbitrum ETH", symbol: "ETH", decimals: 18 } }
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
        },
        {
          name: "bridge",
          description: "Bridge tokens across chains",
          parameters: [
            { name: "fromChain", type: "string", description: "Source chain", required: true },
            { name: "toChain", type: "string", description: "Destination chain", required: true },
            { name: "token", type: "address", description: "Token to bridge", required: true },
            { name: "amount", type: "string", description: "Amount to bridge", required: true }
          ]
        }
      ]
    };
  }

  async chat(request: AgentRequest): Promise<ApiResponse<TransactionResult | KnowledgeResult> | ApiError> {
    await this.delay(1500);
    
    // Simulate different responses based on prompt content
    if (request.prompt.toLowerCase().includes('swap') || 
        request.prompt.toLowerCase().includes('transfer') ||
        request.prompt.toLowerCase().includes('bridge') ||
        request.prompt.toLowerCase().includes('send')) {
      return {
        result: {
          solver: "Aurea",
          action: "DeFi Transaction",
          type: "write",
          data: {
            description: `Aurea AI has prepared a transaction based on: "${request.prompt}"`,
            steps: [{
              chainId: parseInt(request.chainId || '1'),
              blockNumber: 18500000,
              from: request.address,
              to: "0x1234567890123456789012345678901234567890",
              gasLimit: "21000",
              data: "0xa9059cbb",
              value: "0"
            }],
            gasCostUSD: "5.50",
            fromChainId: parseInt(request.chainId || '1'),
            fromAmountUSD: 100,
            fromAmount: "100",
            fromToken: {
              address: "0xA0b86a33E6441c84fE0bF0FBAb66c5c7B53c4e6d",
              chainId: parseInt(request.chainId || '1'),
              symbol: "USDC",
              decimals: 6,
              name: "USD Coin",
              coinKey: "USDC",
              logoURI: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
              priceUSD: "1.00"
            },
            fromAddress: request.address,
            toChainId: parseInt(request.chainId || '1'),
            toAmountUSD: 95,
            toAmount: "95",
            toAmountMin: "94",
            toToken: {
              address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
              chainId: parseInt(request.chainId || '1'),
              symbol: "ETH",
              decimals: 18,
              name: "Ethereum",
              coinKey: "ETH",
              logoURI: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
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
          answer: `Aurea AI: ${request.prompt}

I'm your intelligent blockchain assistant, powered by advanced AI and comprehensive DeFi knowledge. I can help you with:

🔄 **DeFi Operations**: Swaps, bridges, lending, staking across 50+ protocols
📊 **Portfolio Management**: Track assets, analyze performance, optimize yields  
⛓️ **Multi-Chain Support**: Ethereum, Polygon, Arbitrum, Optimism, BSC, and more
💡 **Smart Insights**: Market analysis, gas optimization, risk assessment
🛡️ **Security**: Transaction simulation, contract verification, scam detection

Key capabilities:
- Execute complex DeFi strategies with natural language
- Real-time market data and price analysis
- Cross-chain transaction routing with best rates
- Smart contract interaction and deployment
- Yield farming and liquidity provision guidance

How can I assist you with your blockchain journey today?`,
          context: [
            {
              pageContent: "Aurea AI is a comprehensive blockchain assistant with deep DeFi knowledge",
              metadata: {
                description: "Aurea AI Knowledge Base - DeFi Protocols and Blockchain Technology",
                language: "en",
                source: "https://docs.aurea.ai",
                title: "Complete Guide to DeFi and Blockchain Operations"
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
        answer: `Aurea AI Knowledge: ${request.prompt}

Based on my comprehensive blockchain knowledge base, here's what you need to know:

**DeFi Protocols & Concepts:**
- Automated Market Makers (AMMs): Uniswap, SushiSwap, Curve
- Lending/Borrowing: Aave, Compound, MakerDAO
- Yield Farming: Optimized strategies across protocols
- Cross-chain bridges: Hop, Stargate, Synapse

**Technical Implementation:**
- Smart contract security best practices
- Gas optimization techniques  
- MEV protection strategies
- Transaction batching and automation

**Market Insights:**
- Real-time price feeds and analytics
- Liquidity analysis and impermanent loss calculations
- Risk assessment and portfolio optimization
- Emerging trends and opportunities

This information is sourced from verified protocols, official documentation, and real-time blockchain data to ensure accuracy and reliability.`,
        context: [
          {
            pageContent: "Comprehensive DeFi protocol documentation and implementation guides",
            metadata: {
              description: "Aurea AI DeFi Knowledge Base",
              language: "en",
              source: "https://knowledge.aurea.ai/defi",
              title: "DeFi Protocols and Implementation Guide"
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
        solver: "Aurea",
        action: "Optimized DeFi Transaction",
        type: "write",
        data: {
          description: `Aurea-optimized transaction: ${request.prompt}`,
          steps: [{
            chainId: parseInt(request.chainId || '1'),
            blockNumber: 18500000,
            from: request.address,
            to: "0x1234567890123456789012345678901234567890",
            gasLimit: "50000",
            data: "0xa9059cbb",
            value: "0"
          }],
          gasCostUSD: "8.75",
          fromChainId: parseInt(request.chainId || '1'),
          fromAmountUSD: 500,
          fromAmount: "500",
          fromToken: {
            address: "0xA0b86a33E6441c84fE0bF0FBAb66c5c7B53c4e6d",
            chainId: parseInt(request.chainId || '1'),
            symbol: "USDC",
            decimals: 6,
            name: "USD Coin",
            coinKey: "USDC",
            logoURI: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
            priceUSD: "1.00"
          },
          fromAddress: request.address,
          toChainId: parseInt(request.chainId || '1'),
          toAmountUSD: 485,
          toAmount: "485",
          toAmountMin: "480",
          toToken: {
            address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
            chainId: parseInt(request.chainId || '1'),
            symbol: "ETH",
            decimals: 18,
            name: "Ethereum",
            coinKey: "ETH",
            logoURI: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
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

/**
 * @title Aurea Generated Smart Contract
 * @dev Generated by Aurea AI based on: ${request.prompt}
 */
contract AureaGeneratedContract {
    string public name = "Aurea Smart Contract";
    address public owner;
    mapping(address => uint256) public balances;
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    
    constructor() {
        owner = msg.sender;
        balances[msg.sender] = 1000000 * 10**18; // 1M tokens
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }
    
    function transfer(address to, uint256 amount) public returns (bool) {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        require(to != address(0), "Invalid address");
        
        balances[msg.sender] -= amount;
        balances[to] += amount;
        
        emit Transfer(msg.sender, to, amount);
        return true;
    }
    
    function updateName(string memory _name) public onlyOwner {
        name = _name;
    }
    
    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "Invalid address");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }
}
\`\`\``,
      abi: [
        {"type": "constructor", "inputs": []},
        {"type": "function", "name": "name", "inputs": [], "outputs": [{"type": "string"}]},
        {"type": "function", "name": "owner", "inputs": [], "outputs": [{"type": "address"}]},
        {"type": "function", "name": "transfer", "inputs": [{"name": "to", "type": "address"}, {"name": "amount", "type": "uint256"}], "outputs": [{"type": "bool"}]}
      ],
      bytecode: "0x608060405234801561001057600080fd5b50336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff..."
    };
  }

  async speechToAction(request: SpeechRequest): Promise<ApiResponse<TransactionResult> | ApiError> {
    await this.delay(1800);
    return {
      result: {
        solver: "Aurea",
        action: "Voice-Activated Transaction",
        type: "write",
        data: {
          description: "Action generated from voice command using Aurea AI speech recognition",
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
            logoURI: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
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
            logoURI: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
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
    return { result: "aurea_jwt_token_" + Math.random().toString(36).substring(2, 15) };
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
