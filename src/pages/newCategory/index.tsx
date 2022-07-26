import { useState, FormEvent } from 'react';
import Head from 'next/head';
import { toast } from 'react-toastify'
import { setupAPIClient } from '../../services/api';
import { validateAuthUser } from '../../utils/validateAuthUser';
import { Header } from '../../components/Header';
import styles from './styles.module.scss';

export default function newCategory() {

  const [name, setName] = useState('');

  async function handleRegister(event: FormEvent) {
    event.preventDefault();

    if(name === '') {
      toast.warning('Empty name field!');
      return;
    }

    const api = setupAPIClient();
    await api.post('/categories', {
      name: name
    });

    toast.success(`${name} category succesfully registered!`);
    setName('');

  }

  return(
    <div>

      <Head>
        <title>Sushi Now | New category</title>
      </Head>

      <div>
        <Header />
        <main className={styles.container}>
          <h1>New category</h1>
          <form className={styles.form} onSubmit={handleRegister}>
            <input type='text' placeholder='Enter the new category name...' className={styles.input} value={name} onChange={ e => setName(e.target.value) } />
            <button className={styles.button}>Register</button>
          </form>
        </main>
      </div>

    </div>
  )
}

export const getServerSideProps = validateAuthUser(async(ctx) => {
  return {
    props: {}
  }
});