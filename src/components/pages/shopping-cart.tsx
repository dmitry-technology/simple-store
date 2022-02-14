import { Box, Button } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { shoppingCartService } from '../../config/servicesConfig';
import { ProductBatch } from '../../models/product';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Navigate } from 'react-router-dom';
import { PATH_LOGIN, PATH_PROFILE } from '../../config/routing';
import { UserData } from '../../models/user-data';
import { useDispatch, useSelector } from 'react-redux';
import { userDataSelector } from '../../redux/store';
import { addOrderAction, setNotificationMessage } from '../../redux/actions';
import { NotificationType } from '../../models/user-notification';
import { isCustomerCanOrder } from '../../utils/common/validation-utils';
import { OrderStatus } from '../../models/order-type';
import CollapsibleTable from '../UI/common/collapsible-table';

const ShoppingCart: FC = () => {

    const [shoppingCart, setShoppingCart] = useState<ProductBatch[]>([]);
    const [needAuthFl, setNeedAuthFl] = useState<boolean>(false);
    const [needFillProfileFl, setNeedFillProfileFl] = useState<boolean>(false);
    const userData: UserData = useSelector(userDataSelector);
    const dispatch = useDispatch();

    useEffect(() => {
        setShoppingCart(shoppingCartService.getAll());
    }, [])

    function deleteCartHandler() {
        shoppingCartService.removeAll();
        setShoppingCart(shoppingCartService.getAll());
    }

    function checkoutHandler() {
        if (!userData.id) {
            setNeedAuthFl(true);
            dispatch(setNotificationMessage({
                message: "Please, sign in to continue",
                type: NotificationType.INFO
            }));
        }
        if (!!userData.id && !isCustomerCanOrder(userData)) {
            setNeedFillProfileFl(true);
            dispatch(setNotificationMessage({
                message: "Please, fill neccessary info to continue",
                type: NotificationType.INFO
            }));
        } else {
            dispatch(addOrderAction({
                client: userData,
                products: shoppingCart,
                date: new Date().toISOString(),
                status: OrderStatus.WAITING
            }))
            deleteCartHandler();
        }
    }

    return <Box sx={{ mt: 1 }}>
        {shoppingCart.length === 0 && `You have 0 products in cart`}
        {CollapsibleTable(shoppingCart)}
        <Box>
            <Button
                variant='contained'
                onClick={checkoutHandler}>
                Checkout <DeliveryDiningIcon />
            </Button>
            <Button
                variant='outlined'
                onClick={deleteCartHandler}>
                Delete Cart <DeleteForeverIcon />
            </Button>
        </Box>
        {needAuthFl && <Navigate to={PATH_LOGIN} />}
        {needFillProfileFl && <Navigate to={PATH_PROFILE} />}
    </Box>;
}

export default ShoppingCart;