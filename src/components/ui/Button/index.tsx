import { ReactNode, ButtonHTMLAttributes, Children } from 'react';
import styles from './styles.module.scss';
import { FaCircleNotch } from 'react-icons/fa';

interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean,
  children: ReactNode
}

export function Button({ loading, children, ...rest }: IButtonProps) {
  return(
    <button className={styles.button} disabled={loading} {...rest}>
      { loading 
      ? ( <FaCircleNotch color='#FFF' size={16} /> ) 
      : <a className={styles.buttonText}>{children}</a> 
      }
    </button>
  )
}