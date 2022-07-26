/* This file will allow only authenticated people to access the designated page */

import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { parseCookies, destroyCookie } from 'nookies';
import { AuthTokenError } from '../services/errors/AuthTokenError';

export function validateAuthUser<P>(fn: GetServerSideProps<P>) {
  return async(ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
    
    const cookies = parseCookies(ctx);
    const token = cookies['@sushinow.token'];
    
    if(!token) {
      return {
        redirect: {
          destination: '/',
          permanent: false
        }
      }
    }

    try {
      return await fn(ctx);
    } catch(err) {
      if(err instanceof AuthTokenError) {
        destroyCookie(ctx, '@sushinow.token');
        return {
          redirect: {
            destination: '/',
            permanent: false
          }
        }
      }
    }

  }
}