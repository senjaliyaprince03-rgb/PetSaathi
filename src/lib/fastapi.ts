/**
 * Utility client for communicating with the Python FastAPI microservice.
 * Use this for heavy AI, Data Processing, or blocking operations.
 */
const FASTAPI_URL = process.env.FASTAPI_URL || 'http://127.0.0.1:8000';

export async function fetchFastAPI(endpoint: string, options: RequestInit = {}) {
  try {
    const response = await fetch(`${FASTAPI_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      throw new Error(`FastAPI Error: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('FastAPI Communication Error:', error);
    throw error;
  }
}
