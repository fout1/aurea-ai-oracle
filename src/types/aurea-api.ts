
// Token type definition
export interface Token {
  address: string;
  chainId: number;
  symbol: string;
  decimals: number;
  name: string;
  coinKey: string;
  logoURI: string;
  priceUSD: string;
}

// Protocol type definition
export interface Protocol {
  key: string;
  name: string;
  logoURI: string;
}

// Transaction step definition
export interface TransactionStep {
  chainId: number;
  blockNumber: number;
  from: string;
  to: string;
  gasLimit: string;
  data: string;
  value: string;
  protocol?: Protocol;
}

// Transaction data definition
export interface TransactionData {
  description: string;
  steps: TransactionStep[];
  gasCostUSD: string;
  fromChainId: number;
  fromAmountUSD: number;
  fromAmount: string;
  fromToken: Token;
  fromAddress: string;
  toChainId: number;
  toAmountUSD: number;
  toAmount: string;
  toAmountMin: string;
  toToken: Token;
  toAddress: string;
}

// Updated solver type to include Aurea
export type SolverType = "LI.FI" | "Enso" | "Brian" | "Lido" | "Bungee" | "Symbiosis" | "Avnu.fi" | "Aurea";

// Transaction result definition
export interface TransactionResult {
  solver: SolverType;
  action: string;
  type: "write" | "read";
  data: TransactionData;
}

// Knowledge context definition
export interface KnowledgeContext {
  pageContent: string;
  metadata: {
    description: string;
    language: string;
    source: string;
    title: string;
  };
}

// Knowledge result definition
export interface KnowledgeResult {
  input: string;
  answer: string;
  context: KnowledgeContext[];
}

// Message type for conversation history
export interface ConversationMessage {
  sender: "user" | "aurea";
  content: string;
}

// Network definition
export interface Network {
  id: number;
  name: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

// Action parameter definition
export interface ActionParameter {
  name: string;
  type: string;
  description: string;
  required: boolean;
}

// Action definition
export interface Action {
  name: string;
  description: string;
  parameters: ActionParameter[];
}

// Wallet connection types
export interface WalletInfo {
  address: string;
  chainId: number;
  connector: string;
  isConnected: boolean;
}

// API request/response types
export interface AgentRequest {
  prompt: string;
  address: string;
  chainId?: string;
  kbId?: string;
  messages?: ConversationMessage[];
}

export interface KnowledgeRequest {
  prompt: string;
  kb?: string;
}

export interface TransactionRequest {
  prompt: string;
  address: string;
  chainId?: string;
}

export interface ParametersExtractionRequest {
  prompt: string;
  messages?: ConversationMessage[];
}

export interface SmartContractRequest {
  prompt: string;
  compile?: boolean;
  messages?: ConversationMessage[];
}

export interface SpeechRequest {
  base64: string;
  address: string;
}

export interface CompileRequest {
  code: string;
  contractName?: string;
}

export interface ExplainRequest {
  code: string;
}

export interface SignInRequest {
  signature: string;
  message: {
    address: string;
    chainId: number;
    domain: string;
    issuedAt: string;
    nonce: string;
    statement: string;
    uri: string;
    version: string;
  };
}

// API response types
export interface ApiResponse<T> {
  result: T;
}

export interface ApiError {
  error: string;
}

export interface ParametersExtractionResult {
  prompt: string;
  completion: {
    action: string;
  };
}

export interface SmartContractResult {
  result: string;
  abi?: any;
  bytecode: string;
}
