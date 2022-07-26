import { createContext, ReactNode, useState, useEffect } from 'react';
import { destroyCookie, setCookie, parseCookies } from 'nookies';
import Router from 'next/router';
import { toast } from 'react-toastify';
import { api } from '../services/apiClient';

type AuthContextData = {
  user: UserProps,
  isAuthenticated: boolean,
  signIn: (credential: SignInProps) => Promise<void>,
  signOut: () => void,
  signUp: (credential: SignUpProps) => Promise<void>
}

type UserProps = {
  id: string,
  name: string,
  email: string
}

type SignInProps = {
  email: string,
  password: string
}

type SignUpProps = {
  name: string,
  email: string,
  password: string
}

type AuthProviderProps = {
  children: ReactNode
}

export const AuthContext = createContext({} as AuthContextData);

export function signOut() {
  try {
    destroyCookie(undefined, '@sushinow.token');
    Router.push('/');
  } catch(err) {
    console.log(err);
  }
}

export function AuthProvider({ children }: AuthProviderProps) {

  const [user, setUser] = useState<UserProps>();
  const isAuthenticated = !!user;
  
  useEffect(() => {
    
  const { '@sushinow.token': token } = parseCookies();

  if(token) {
    api.get('/me').then(res => {
      const { id, name, email } = res.data;
      setUser({ id, name, email });
    }).catch((err) => {
      console.log(err);
      signOut();
    });
  }

  }, []);

  async function signIn({ email, password }: SignInProps) {
    try {

      const res = await api.post('/auth', { email, password });
      const { id, name, token } = res.data;

      setCookie(undefined, '@sushinow.token', token, {
        maxAge: 60 * 60 * 12,
        path: '/'      
      });

      setUser({ id, name, email });

      api.defaults.headers['Authorization'] = `Bearer ${token}`;
      
      toast.success(`Logged as ${name}`);
      Router.push('/dashboard');

    } catch(err) {
      toast.error('Login failed!');
      console.log(err);
    }
  }

  async function signUp({ name, email, password }: SignUpProps) {
    try {
      const res = api.post('/users', { name, email, password });
      toast.success('User successfully registered!');
      Router.push('/');
    } catch(err) {
      console.log(err);
    }
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, signIn, signOut, signUp }}>
      {children}
    </AuthContext.Provider>
  );
}