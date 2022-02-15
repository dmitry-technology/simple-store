import { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Order } from '../../../models/order-type';
import { Subscription } from 'rxjs';
import { orderStore } from '../../../config/servicesConfig';
import { setOrders } from '../../../redux/actions';

import OrdersListGrid from '../../UI/orders/orders-list-grid';

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

  return <OrdersListGrid />
}

export default OrdersList;
