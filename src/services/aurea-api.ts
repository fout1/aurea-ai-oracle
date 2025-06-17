
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
import { mockAureaAPI } from './mock-aurea-api';

const BASE_URL = 'https://api.aurea.ai';
const USE_MOCK_API = true; // Set to false when real Aurea API is available

class AureaAPIService {
  private apiKey: string | null = null;

  constructor() {
    // Try to get API key from localStorage
    this.apiKey = localStorage.getItem('aurea-api-key');
  }

  setApiKey(key: string) {
    this.apiKey = key;
    localStorage.setItem('aurea-api-key', key);
    if (USE_MOCK_API) {
      mockAureaAPI.setApiKey(key);
    }
  }

  getApiKey(): string | null {
    return this.apiKey;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.apiKey) {
      headers['x-aurea-api-key'] = this.apiKey;
    }

    return headers;
  }

  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T> | ApiError> {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.error || `HTTP ${response.status}` };
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      return { error: 'Network error or service unavailable' };
    }
  }

  // Utils endpoints
  async ping(): Promise<ApiResponse<string> | ApiError> {
    if (USE_MOCK_API) return mockAureaAPI.ping();
    return this.makeRequest<string>('/api/v0/utils/ping');
  }

  async compile(request: CompileRequest): Promise<ApiResponse<any> | ApiError> {
    if (USE_MOCK_API) return mockAureaAPI.compile(request);
    return this.makeRequest<any>('/api/v0/utils/compile', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async explain(request: ExplainRequest): Promise<ApiResponse<string> | ApiError> {
    if (USE_MOCK_API) return mockAureaAPI.explain(request);
    return this.makeRequest<string>('/api/v0/utils/explain', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async getNetworks(): Promise<ApiResponse<Network[]> | ApiError> {
    if (USE_MOCK_API) return mockAureaAPI.getNetworks();
    return this.makeRequest<Network[]>('/api/v0/utils/networks');
  }

  async getActions(): Promise<ApiResponse<Action[]> | ApiError> {
    if (USE_MOCK_API) return mockAureaAPI.getActions();
    return this.makeRequest<Action[]>('/api/v0/utils/actions');
  }

  // Agent endpoints
  async chat(request: AgentRequest): Promise<ApiResponse<TransactionResult | KnowledgeResult> | ApiError> {
    if (USE_MOCK_API) return mockAureaAPI.chat(request);
    return this.makeRequest<TransactionResult | KnowledgeResult>('/api/v0/agent', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async knowledge(request: KnowledgeRequest): Promise<ApiResponse<KnowledgeResult> | ApiError> {
    if (USE_MOCK_API) return mockAureaAPI.knowledge(request);
    return this.makeRequest<KnowledgeResult>('/api/v0/agent/knowledge', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async transaction(request: TransactionRequest): Promise<ApiResponse<TransactionResult> | ApiError> {
    if (USE_MOCK_API) return mockAureaAPI.transaction(request);
    return this.makeRequest<TransactionResult>('/api/v0/agent/transaction', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async extractParameters(request: ParametersExtractionRequest): Promise<ApiResponse<ParametersExtractionResult> | ApiError> {
    if (USE_MOCK_API) return mockAureaAPI.extractParameters(request);
    return this.makeRequest<ParametersExtractionResult>('/api/v0/agent/parameters-extraction', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async generateSmartContract(request: SmartContractRequest): Promise<SmartContractResult | ApiError> {
    if (USE_MOCK_API) return mockAureaAPI.generateSmartContract(request);
    
    const response = await this.makeRequest<SmartContractResult>('/api/v0/agent/smart-contract', {
      method: 'POST',
      body: JSON.stringify(request),
    });

    if ('error' in response) {
      return response;
    }

    // Extract the result from the ApiResponse wrapper
    return response.result;
  }

  async speechToAction(request: SpeechRequest): Promise<ApiResponse<TransactionResult> | ApiError> {
    if (USE_MOCK_API) return mockAureaAPI.speechToAction(request);
    return this.makeRequest<TransactionResult>('/api/v0/agent/speech', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // Auth endpoints
  async getNonce(): Promise<ApiResponse<string> | ApiError> {
    if (USE_MOCK_API) return mockAureaAPI.getNonce();
    return this.makeRequest<string>('/api/v0/auth/nonce');
  }

  async signIn(request: SignInRequest): Promise<ApiResponse<string> | ApiError> {
    if (USE_MOCK_API) return mockAureaAPI.signIn(request);
    return this.makeRequest<string>('/api/v0/auth/sign-in', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async generateApiKey(): Promise<ApiResponse<string> | ApiError> {
    if (USE_MOCK_API) return mockAureaAPI.generateApiKey();
    return this.makeRequest<string>('/api/v0/auth/api-keys', {
      method: 'POST',
    });
  }

  async getUsage(apiKey: string): Promise<ApiResponse<number> | ApiError> {
    if (USE_MOCK_API) return mockAureaAPI.getUsage(apiKey);
    return this.makeRequest<number>(`/api/v0/auth/usage?apiKey=${apiKey}`);
  }
}

export const aureaAPI = new AureaAPIService();
