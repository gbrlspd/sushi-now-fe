import { useContext } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './styles.module.scss';
import logoImg from '../../../public/nigiri.svg';
import { FaSignOutAlt } from 'react-icons/fa';
import { AuthContext } from '../../contexts/AuthContext';

export function Header() {

  const {signOut} = useContext(AuthContext);

  return(
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>

        <Link href='/dashboard'>
          <div className={styles.logo}>
            <Image src={logoImg} alt='Sushi Now' width={65} height={65} />
            <h1>Sushi<b>Now</b></h1>
          </div>
        </Link>

        <nav className={styles.menuNav}>
          <Link href='/newCategory'>
            <a>New category</a>
          </Link>
          <Link href='/newProduct'>
            <a>New product</a>
          </Link>
          <button onClick={signOut}>
            <FaSignOutAlt color='#FFF' size={24} />
          </button>
        </nav>

      </div>
    </header>
  );
}