import { useContext, FormEvent, useState } from 'react';
import { toast } from 'react-toastify'
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import styles from '../styles/home.module.scss';
import logoImg from '../../public/nigiri.svg';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { AuthContext } from '../contexts/AuthContext';
import { validateGuest } from '../utils/validateGuest';

export default function Home() {

  const {signIn} = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: FormEvent) {
    event.preventDefault();

    if(email === '' || password === '') {
      toast.warning('Empty credential field!');
      return;
    }

    setLoading(true);
    await signIn({ email, password });
    setLoading(false);

  }

  return (
    <div>

      <div>
        <Head>
          <title>Sushi Now | Login</title>
        </Head>
      </div>

      <div className={styles.centralContainer}>

        <div className={styles.logo}>
          <Image src={logoImg} alt='Sushi Now' width={80} height={80} />
          <h1>Sushi<b>Now</b></h1>
        </div>

        <div className={styles.login}>
          <form onSubmit={handleLogin}>
            <Input placeholder='Enter your email...' type='text' value={email} onChange={ e => setEmail(e.target.value) } />
            <Input placeholder='Enter your password...' type='password' value={password} onChange={ e => setPassword(e.target.value) } />
            <Button type='submit' loading={loading}>Login</Button>
          </form>
          <Link href='/signup'>
            <a className={styles.text}>Don't have an account? Sign up now!</a>
          </Link>
        </div>

      </div>

    </div>
  );
}

export const getServerSideProps = validateGuest(async(ctx) => {
  return {
    props: {}
  }
});

