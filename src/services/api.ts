import axios, { AxiosError } from 'axios';
import { parseCookies } from 'nookies';
import { AuthTokenError } from './errors/AuthTokenError';
import { signOut } from '../contexts/AuthContext';

export function setupAPIClient(ctx = undefined) {
  
  let cookies = parseCookies(ctx);

  const api = axios.create({
    baseURL: 'http://localhost:3001',
    headers: {
      Authorization: `Bearer ${cookies['@sushinow.token']}`
    }
  });

  api.interceptors.response.use(res => {
    return res;
  }, (err: AxiosError) => {
    if(err.response.status === 401) {
      if(typeof window !== undefined) {
        signOut();
      }
    } else {
      return Promise.reject(new AuthTokenError());
    }
    return Promise.reject(err);
  })

  return api;

}
