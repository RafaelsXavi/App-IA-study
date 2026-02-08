
// A URL base da API. Usar um caminho relativo funciona perfeitamente no Render
// quando o frontend e o backend são servidos sob o mesmo domínio.
// Para desenvolvimento local, isso assume que o frontend (Vite/CRA) é servido
// com um proxy para o backend FastAPI rodando em localhost:8000.
// Se não usar proxy, mude para: 'http://localhost:8000/api/v1'
const API_BASE_URL = '/api/v1';

/**
 * Realiza uma requisição à API do backend.
 * @param endpoint O caminho do endpoint (ex: /generate-summary).
 * @param options As opções da requisição, como método, cabeçalhos e corpo.
 * @returns A resposta da API em formato JSON.
 * @throws Uma exceção se a requisição falhar.
 */
export async function apiClient<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const { method = 'GET', headers = {}, body = null } = options;

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (body) {
    config.body = body;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: response.statusText }));
      throw new Error(errorData.detail || 'Ocorreu um erro na comunicação com o servidor.');
    }

    // Retorna um objeto vazio se a resposta for 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    return await response.json() as T;

  } catch (error) {
    console.error(`API Client Error: ${error}`);
    // Re-throw para que o chamador possa tratar o erro (ex: exibir no UI)
    throw error;
  }
}
