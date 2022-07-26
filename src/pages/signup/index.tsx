import { useState, FormEvent, useContext } from 'react';
import { toast } from 'react-toastify'
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import styles from '../../styles/home.module.scss';
import logoImg from '../../../public/nigiri.svg';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { AuthContext } from '../../contexts/AuthContext';
import { validateGuest } from '../../utils/validateGuest';

export default function SignUp() {

  const {signUp} = useContext(AuthContext);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignUp(event: FormEvent) {

    event.preventDefault();

    if(name === '' || email === '' || password === '') {
      toast.warning('Empty credential field!');
      return;
    }

    setLoading(true);
    await signUp({ name, email, password });
    setLoading(false);

  }

  return (
    <div>

      <div>
        <Head>
          <title>Sushi Now | Sign Up</title>
        </Head>
      </div>

      <div className={styles.centralContainer}>

        <div className={styles.logo}>
          <Image src={logoImg} alt='Sushi Now' width={80} height={80} />
          <h1>Sushi<b>Now</b></h1>
        </div>

        <div className={styles.login}>
          <form onSubmit={handleSignUp}>
            <Input placeholder='Enter your name...' type='text' value={name} onChange={ e => setName(e.target.value) } />
            <Input placeholder='Enter your email...' type='text' value={email} onChange={ e => setEmail(e.target.value) } />
            <Input placeholder='Enter your password...' type='password' value={password} onChange={ e => setPassword(e.target.value) } />
            <Button type='submit' loading={loading}>Sign Up</Button>
          </form>
          <Link href='/'>
            <a className={styles.text}>Already have an account? Login now!</a>
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