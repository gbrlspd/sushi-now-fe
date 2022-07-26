import { useState, ChangeEvent, FormEvent } from 'react';
import Head from 'next/head';
import { FaUpload } from 'react-icons/fa'
import { toast } from 'react-toastify';
import { setupAPIClient } from '../../services/api';
import styles from './styles.module.scss';
import { Header } from '../../components/Header';
import { validateAuthUser } from '../../utils/validateAuthUser';

type ItemProps = {
  id: string,
  name: string
}

interface ICategoryProps {
  categoryList: ItemProps[]
}

export default function newProduct({categoryList}: ICategoryProps) {

  const [avatarUrl, setAvatarUrl] = useState('');
  const [imageAvatar, setImageAvatar] = useState(null);
  const [categories, setCategories] = useState(categoryList || []);
  const [selectedCategory, setSelectedCategory] = useState(0)
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');

  function handleFile(event: ChangeEvent<HTMLInputElement>) {

    if(!event.target.files) {
      return;
    }

    const image = event.target.files[0];

    if(!image) {
      return;
    }

    if(image.type === 'image/png' || 'image/jpeg') {
      setImageAvatar(image);
      setAvatarUrl(URL.createObjectURL(event.target.files[0]));
    }

  }

  function handleCategoryChange(event) {
    setSelectedCategory(event.target.value);
  }

  async function handleRegister(event: FormEvent) {
    event.preventDefault();
    try {

      const data = new FormData();

      if(name === '' || price === '' || description === '' || imageAvatar === null) {
        toast.warning('Empty product field!');
      }

      data.append('name', name);
      data.append('price', price);
      data.append('description', description);
      data.append('category_id', categories[selectedCategory].id);
      data.append('file', imageAvatar);

      const api = setupAPIClient();
      await api.post('/products', data);
      toast.success(`${name} product succesfully registered!`);

    } catch(err) {
      console.log(err);
      toast.error('The product could not be registered!');
    }

    setName('');
    setPrice('');
    setDescription('');
    setImageAvatar(null);
    setAvatarUrl('');

  }

  return(
    <div>

      <Head>
        <title>Sushi Now | New product</title>
      </Head>

      <div>
        <Header />
        <main className={styles.container}>
          <h1>New product</h1>

          <form className={styles.form} onSubmit={handleRegister}>

            <label className={styles.labelAvatar}>
              <span><FaUpload size={32} color='#FFF' /></span>
              <input type="file" accept='image/png, image/jpeg' onChange={handleFile} />
              {avatarUrl && (
                <img src={avatarUrl} alt='Product image' width={260} height={260} className={styles.preview} />
              )}
            </label>

            <select value={selectedCategory} onChange={handleCategoryChange}>
              {categories.map((item, index) => {
                return(
                  <option key={item.id} value={index}>{item.name}</option>
                );
              })}
            </select>

            <input type='text' placeholder='Enter the product name...' className={styles.input} value={name} onChange={ e => setName(e.target.value) } />
            <input type='text' placeholder='Enter the product price...' className={styles.input} value={price} onChange={ e => setPrice(e.target.value) } />
            <textarea placeholder='Enter the product description...' className={styles.input} value={description} onChange={ e => setDescription(e.target.value) } />
            <button className={styles.button} type='submit'>Register</button>

          </form>

        </main>
      </div>

    </div>
  )
}

export const getServerSideProps = validateAuthUser(async(ctx) => {

  const api = setupAPIClient(ctx);
  const res = await api.get('/categories');

  return {
    props: {categoryList: res.data}
  }
  
});