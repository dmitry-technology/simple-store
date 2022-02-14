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
import { addOrderAction, setCartItemsCount, setNotificationMessage } from '../../redux/actions';
import { NotificationType } from '../../models/user-notification';
import { isCustomerCanOrder } from '../../utils/common/validation-utils';
import { OrderStatus } from '../../models/order-type';
import CartTable from '../UI/orders/cart-table';

const ShoppingCart: FC = () => {

    const [shoppingCart, setShoppingCart] = useState<ProductBatch[]>([]);
    const [needAuthFl, setNeedAuthFl] = useState<boolean>(false);
    const [needFillProfileFl, setNeedFillProfileFl] = useState<boolean>(false);
    const userData: UserData = useSelector(userDataSelector);
    const dispatch = useDispatch();

    useEffect(() => {
        setShoppingCart(shoppingCartService.getAll());
    }, [])

    function deleteCartHandler(): void {
        shoppingCartService.removeAll();
        updateCartFn();
    }

    function updateCartFn(): void {
        dispatch(setCartItemsCount(shoppingCartService.getItemsCount()));
        setShoppingCart(shoppingCartService.getAll());
    }

    function checkoutHandler(): void {
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
            dispatch(setNotificationMessage({
                message: "Thank you for your order!",
                type: NotificationType.SUCCESS
            }));
            deleteCartHandler();
        }
    }

    return <Box sx={{ mt: 1, width: '100%' }}>
        {shoppingCart.length === 0 && `You have 0 products in cart`}
        {shoppingCart.length > 0 && <Box>
            <CartTable batches={shoppingCart} updateCartFn={updateCartFn} />
            <Box sx={{mt: 1, display: 'flex', width: '100%', justifyContent: 'end'}}>                
                <Button
                    variant='outlined'
                    onClick={deleteCartHandler} 
                    color='warning'
                    sx={{mr: 2}}>
                    Delete Cart <DeleteForeverIcon />
                </Button>
                <Button
                    variant='outlined'
                    onClick={checkoutHandler}
                    sx={{color: '#ff6f04', borderColor: '#ff6f04', ':hover': {
                        borderColor: '#ff6f04',
                        backgroundColor: '#ff6f04',
                        color: '#FFFFFF'
                    }}}>                    
                    Send Order &nbsp;<DeliveryDiningIcon />
                </Button>
            </Box>
            {needAuthFl && <Navigate to={PATH_LOGIN} />}
            {needFillProfileFl && <Navigate to={PATH_PROFILE} />}
        </Box>}
    </Box>;
}

export default ShoppingCart;