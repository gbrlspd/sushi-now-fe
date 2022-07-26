import Modal from 'react-modal';
import styles from './styles.module.scss';
import { FaTimes } from 'react-icons/fa';
import { OrdemItemProps } from '../../pages/dashboard';

interface OrderModalProps {
  isOpen: boolean,
  onRequestClose: () => void,
  order: OrdemItemProps[],
  handleCloseOrder: (id: string) => void
}

export function OrderModal({ isOpen, onRequestClose, order, handleCloseOrder }: OrderModalProps) {
  
  const customStyle = {
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    content: {
      top: '50%',
      left: '50%',
      bottom: 'auto',
      right: 'auto',
      padding: '2rem',
      transform: 'translate(-50%, -50%)',
      backgroundColor: '#1C2E4A',
      border: 'none',
      borderRadius: '0.5rem'
    }
  }
  
  return(
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={customStyle}>

      <button type='button' onClick={onRequestClose} className='react-modal-close' style={{ background: 'transparent', border: 0 }}>
        <FaTimes size={46} color='#FF3C00' />
      </button>

      <div className={styles.container}>
        <h2>Order details</h2>
        <span className={styles.table}>Table: <strong>{order[0].order.table}</strong></span>
        <hr className={styles.divider} />

        {order.map(item => (
          <section key={item.id} className={styles.itemContainer}>
            <span><strong>{item.amount}x</strong> - {item.product.name}</span>
            <span className={styles.description}>{item.product.description}</span>
          </section>
        ))}

        <button className={styles.button} onClick={ () => handleCloseOrder(order[0].order_id) }>Close table</button>

      </div>

    </Modal>
  );
}