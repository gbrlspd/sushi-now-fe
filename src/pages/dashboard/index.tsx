import { useState } from 'react';
import Modal from 'react-modal';
import Head from 'next/head';
import { OrderModal } from '../../components/OrderModal';
import { Header } from '../../components/Header';
import { FaSyncAlt } from 'react-icons/fa';
import { setupAPIClient } from '../../services/api';
import { validateAuthUser } from "../../utils/validateAuthUser";
import styles from './styles.module.scss';

type OrderProps = {
  id: string,
  table: string | number,
  status: boolean,
  draft: boolean,
  name: string | null
}

export type OrdemItemProps = {
  id: string,
  amount: number,
  order_id: string,
  product_id: string,
  product: {
    id: string,
    name: string,
    description: string,
    price: string,
    banner: string
  }
  order: {
    id: string,
    table: string,
    status: boolean,
    name: string | null
  }
}

interface IHomeProps {
  orders: OrderProps[]
}

export default function Dashboard({orders}: IHomeProps) {

  const [orderList, setOrderList] = useState(orders || []);
  const [modalItem, setModalItem] = useState<OrdemItemProps[]>();
  const [modalVisible, setModalVisible] = useState(false);

  function handleCloseModal() {
    setModalVisible(false);
  }

  async function handleOpenModal(id: string) {
    const api = setupAPIClient();
    const res = await api.get('/order', {
      params: {
        order_id: id
      }
    });
    setModalItem(res.data);
    setModalVisible(true);
  }

  async function handleCloseOrder(id: string) {
    const api = setupAPIClient();
    await api.put('/order', { order_id: id });
    const res = await api.get('/orders');
    setOrderList(res.data);
    setModalVisible(false);
  }

  async function handleRefresh() {
    const api = setupAPIClient();
    const res = await api.get('/orders');
    setOrderList(res.data);
  }

  Modal.setAppElement('#__next');

  return (
    <div>

      <Head>
        <title>Sushi Now | Dashboard</title>
      </Head>

      <div>
        <Header />
        <main className={styles.container}>
          <div className={styles.containerHeader}>
            <h1>Latest orders</h1>
            <button onClick={handleRefresh}><FaSyncAlt size={24} color='#3FFFA3' /></button>
          </div>

          <article className={styles.orderList}>

            {orderList.length === 0 && (
              <span className={styles.emptyList}>There are no open orders...</span>
            )}

            {orderList.map(order => (
              <section key={order.id} className={styles.orderItem}>
                <button onClick={ () => handleOpenModal(order.id) }>
                  <div className={styles.tag}></div>
                  <span>Table {order.table}</span>
                </button>
              </section>
            ))}


          </article>

        </main>

        {modalVisible && (
          <OrderModal isOpen={modalVisible} onRequestClose={handleCloseModal} order={modalItem} handleCloseOrder={handleCloseOrder} />
        )}

      </div>

    </div>
  );
}

export const getServerSideProps = validateAuthUser(async(ctx) => {

  const api = setupAPIClient(ctx);
  const res = await api.get('/orders');

  return {
    props: {orders: res.data}
  }

});