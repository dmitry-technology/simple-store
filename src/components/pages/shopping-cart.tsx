import { Box, Button } from '@mui/material';
import { FC, useEffect, useRef, useState } from 'react';
import { orderState, shoppingCartService } from '../../config/servicesConfig';
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
import CartTable from '../UI/orders/cart-table';
import DialogConfirm from '../UI/common/dialog';
import { ConfirmationData, emptyConfirmationData } from '../../models/common/confirmation-type';

const arrStatus = Array.from(orderState.keys());

const ShoppingCart: FC = () => {

    const [shoppingCart, setShoppingCart] = useState<ProductBatch[]>([]);
    const [needAuthFl, setNeedAuthFl] = useState<boolean>(false);
    const [needFillProfileFl, setNeedFillProfileFl] = useState<boolean>(false);
    const userData: UserData = useSelector(userDataSelector);
    const confirmationData = useRef<ConfirmationData>(emptyConfirmationData);
    const [dialogVisible, setDialogVisible] = useState<boolean>(false);
    const dispatch = useDispatch();

    useEffect(() => {
        setShoppingCart(shoppingCartService.getAll());
    }, [])

    function deleteCartHandler(): void {
        confirmationData.current.title = "Clear Shopping Cart";
        confirmationData.current.message = "Do you want to remove all products from the shopping cart?";
        confirmationData.current.handle = deleteCartFn.bind(undefined);
        setDialogVisible(true);
    }

    function deleteCartFn(status: boolean): void {
        if (status) {
            shoppingCartService.removeAll();
        updateCartFn();
        }
        setDialogVisible(false);
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
        }
        if (isCustomerCanOrder(userData)) {
            dispatch(addOrderAction({
                client: userData,
                products: shoppingCart,
                date: new Date().toISOString(),
                status: arrStatus[0]
            }))
            dispatch(setNotificationMessage({
                message: "Thank you for your order!",
                type: NotificationType.SUCCESS
            }));
            deleteCartFn(true);
        }
    }

    return <Box sx={{ mt: 1, width: '100%' }}>
        {shoppingCart.length === 0 && `You have 0 products in cart`}
        {shoppingCart.length > 0 && <Box>
            <DialogConfirm visible={dialogVisible}
                title={confirmationData.current.title}
                message={confirmationData.current.message}
                onClose={confirmationData.current.handle} />
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