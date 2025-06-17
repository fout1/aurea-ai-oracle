
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

const BASE_URL = 'https://api.brianknows.org';

class AureaAPIService {
  private apiKey: string | null = null;

  constructor() {
    // Try to get API key from localStorage
    this.apiKey = localStorage.getItem('aurea-api-key');
  }

  setApiKey(key: string) {
    this.apiKey = key;
    localStorage.setItem('aurea-api-key', key);
  }

  getApiKey(): string | null {
    return this.apiKey;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.apiKey) {
      headers['x-brian-api-key'] = this.apiKey;
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
    return this.makeRequest<string>('/api/v0/utils/ping');
  }

  async compile(request: CompileRequest): Promise<ApiResponse<any> | ApiError> {
    return this.makeRequest<any>('/api/v0/utils/compile', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async explain(request: ExplainRequest): Promise<ApiResponse<string> | ApiError> {
    return this.makeRequest<string>('/api/v0/utils/explain', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async getNetworks(): Promise<ApiResponse<Network[]> | ApiError> {
    return this.makeRequest<Network[]>('/api/v0/utils/networks');
  }

  async getActions(): Promise<ApiResponse<Action[]> | ApiError> {
    return this.makeRequest<Action[]>('/api/v0/utils/actions');
  }

  // Agent endpoints
  async chat(request: AgentRequest): Promise<ApiResponse<TransactionResult | KnowledgeResult> | ApiError> {
    return this.makeRequest<TransactionResult | KnowledgeResult>('/api/v0/agent', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async knowledge(request: KnowledgeRequest): Promise<ApiResponse<KnowledgeResult> | ApiError> {
    return this.makeRequest<KnowledgeResult>('/api/v0/agent/knowledge', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async transaction(request: TransactionRequest): Promise<ApiResponse<TransactionResult> | ApiError> {
    return this.makeRequest<TransactionResult>('/api/v0/agent/transaction', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async extractParameters(request: ParametersExtractionRequest): Promise<ApiResponse<ParametersExtractionResult> | ApiError> {
    return this.makeRequest<ParametersExtractionResult>('/api/v0/agent/parameters-extraction', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async generateSmartContract(request: SmartContractRequest): Promise<SmartContractResult | ApiError> {
    return this.makeRequest<SmartContractResult>('/api/v0/agent/smart-contract', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async speechToAction(request: SpeechRequest): Promise<ApiResponse<TransactionResult> | ApiError> {
    return this.makeRequest<TransactionResult>('/api/v0/agent/speech', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // Auth endpoints
  async getNonce(): Promise<ApiResponse<string> | ApiError> {
    return this.makeRequest<string>('/api/v0/auth/nonce');
  }

  async signIn(request: SignInRequest): Promise<ApiResponse<string> | ApiError> {
    return this.makeRequest<string>('/api/v0/auth/sign-in', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async generateApiKey(): Promise<ApiResponse<string> | ApiError> {
    return this.makeRequest<string>('/api/v0/auth/api-keys', {
      method: 'POST',
    });
  }

  async getUsage(apiKey: string): Promise<ApiResponse<number> | ApiError> {
    return this.makeRequest<number>(`/api/v0/auth/usage?apiKey=${apiKey}`);
  }
}

export const aureaAPI = new AureaAPIService();
