import { Platform } from 'react-native';

const configuredBaseUrl = process.env.EXPO_PUBLIC_API_URL?.trim();
const defaultHost = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
const API_BASE_URL = (
  configuredBaseUrl || `http://${defaultHost}:3001`
).replace(/\/+$/, '');

export async function apiRequest(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
  } catch (error) {
    throw new Error(
      `Não foi possível conectar ao servidor. Confira se o backend está rodando em ${API_BASE_URL}.`,
      { cause: error },
    );
  }

  let data;
  try {
    data = await response.json();
  } catch (error) {
    throw new Error('O servidor retornou uma resposta inválida.', {
      cause: error,
    });
  }

  if (!response.ok) {
    throw new Error(data.erro || 'Não foi possível concluir a solicitação.');
  }

  return data;
}
