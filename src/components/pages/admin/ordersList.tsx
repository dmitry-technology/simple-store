import * as React from 'react';
import { Popper, Box, IconButton, ListItem, Paper, Typography, Button } from '@mui/material';
import { FC, useMemo, useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Order,  orderSimple } from '../../../models/order-type';
import { clientsSelector, ordersSelector, productsSelector } from '../../../redux/store';
import { useMediaQuery } from "react-responsive";
import { DataGrid, GridActionsCellItem, GridCellEditCommitParams, GridColDef, GridRenderCellParams, GridRowHeightParams, GridRowId, GridRowParams, GridRowsProp, GridValueFormatterParams } from '@mui/x-data-grid';
import { getOrdersListFields, OrderListFields } from '../../../config/orders-list-columns';
import { Delete } from '@mui/icons-material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import { Product } from '../../../models/product';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import CommentIcon from '@mui/icons-material/Comment';
import { Subscription } from 'rxjs';
import { clientStore, orderStore } from '../../../config/servicesConfig';
import { setClients, setOrders } from '../../../redux/actions';
import { DeliveryAddress, UserData } from '../../../models/user-data';
import storeConfig from "../../../config/store-config.json"
import _ from 'lodash';
import { ConfirmationData, emptyConfirmationData } from '../../../models/common/confirmation-type';
import DialogConfirm from '../../UI/common/dialog';
import { getRandomInteger } from '../../../utils/common/random';
import ModalInfo from '../../UI/common/modal-info';
import { ProductOptionConfigured } from '../../../models/product-options';
import FormAddOrder from '../../UI/form-add-order';
import OrdersListGrid from '../../UI/orders-list-grid';

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

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <OrdersListGrid />
    </Box>
  )
}

export default OrdersList;
