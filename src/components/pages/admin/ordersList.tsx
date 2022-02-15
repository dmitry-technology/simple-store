import { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Order } from '../../../models/order-type';
import { Subscription } from 'rxjs';
import { clientStore, orderStore } from '../../../config/servicesConfig';
import { setClients, setOrders } from '../../../redux/actions';
import _ from 'lodash';

import OrdersListGrid from '../../UI/orders/orders-list-grid';
import { UserData } from '../../../models/user-data';

const OrdersList: FC = () => {

  const dispatch = useDispatch();


  //subscriber orders
  useEffect(() => {
    const subscription = subscribeToOrders();
    return () => subscription.unsubscribe();
  }, [])

  function subscribeToOrders(): Subscription {
    return orderStore.getAll().subscribe({
      next(orders: Order[]) {
        dispatch(setOrders(orders));
      }
    })
  }

    //subscriber clients
  useEffect(() => {
    const subscription = subscribeToClients();
    return () => subscription.unsubscribe();
  }, [])

  function subscribeToClients(): Subscription {
    return clientStore.getAll().subscribe({
      next(clients: UserData[]) {
        dispatch(setClients(clients));
      }
    })
  }

  return <OrdersListGrid />
}

export default OrdersList;
