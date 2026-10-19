import { useEffect, useState } from 'react';
import { apiRequest } from '../services/api';

export function useApiData(path, responseKey, token, enabled = true) {
  const [data, setData] = useState([]);
  const [completedKey, setCompletedKey] = useState('');
  const [errorState, setErrorState] = useState({ key: '', message: '' });
  const [attempt, setAttempt] = useState(0);
  const requestKey = `${path}:${responseKey}:${token ?? ''}:${attempt}`;

  useEffect(() => {
    let active = true;

    if (!enabled) {
      return () => {
        active = false;
      };
    }

    apiRequest(path, { token })
      .then((result) => {
        if (active) {
          setData(result[responseKey] ?? []);
        }
      })
      .catch((requestError) => {
        if (active) {
          setErrorState({ key: requestKey, message: requestError.message });
        }
      })
      .finally(() => {
        if (active) {
          setCompletedKey(requestKey);
        }
      });

    return () => {
      active = false;
    };
  }, [enabled, path, requestKey, responseKey, token]);

  return {
    data,
    error: enabled
      ? errorState.key === requestKey
        ? errorState.message
        : ''
      : 'Faça login novamente para carregar estas informações.',
    loading: enabled && completedKey !== requestKey,
    retry: () => setAttempt((current) => current + 1),
  };
}
