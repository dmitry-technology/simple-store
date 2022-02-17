import { Box, Button, Typography } from '@mui/material';
import { FC, useMemo, useRef, useState } from 'react';
import { orderState } from '../../config/servicesConfig';
import { ProductBatch } from '../../models/product';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Navigate } from 'react-router-dom';
import { PATH_LOGIN, PATH_ORDERS, PATH_PROFILE } from '../../config/routing';
import { UserData } from '../../models/user-data';
import { useDispatch, useSelector } from 'react-redux';
import { shoppingCartSelector, userDataSelector } from '../../redux/store';
import { addOrderAction, clearShoppingCartAction, setNotificationMessage } from '../../redux/actions';
import { NotificationType } from '../../models/user-notification';
import { getProfileStatus, ProfileStatus } from '../../utils/common/validation-utils';
import CartTable from '../UI/cart/cart-table';
import DialogConfirm from '../UI/common/dialog';
import { ConfirmationData, emptyConfirmationData } from '../../models/common/confirmation-type';
import storeData from '../../config/store-config.json';
import AddressConfirmation from '../UI/cart/address-confirm';
import { getCartPrice } from '../../utils/cart-utils';

const arrStatus = Array.from(orderState.keys());

const ShoppingCart: FC = () => {

    const [needAuthFl, setNeedAuthFl] = useState<boolean>(false);
    const [needFillProfileFl, setNeedFillProfileFl] = useState<boolean>(false);
    const [showOrdersFl, setShowOrdersFl] = useState<boolean>(false);
    const userData: UserData = useSelector(userDataSelector);
    const confirmationData = useRef<ConfirmationData>(emptyConfirmationData);
    const [dialogVisible, setDialogVisible] = useState<boolean>(false);
    const [addressConfirmationFl, setAddressConfirmationFl] = useState<boolean>(false);
    const shoppingCart: ProductBatch[] = useSelector(shoppingCartSelector);
    const dispatch = useDispatch();
    const cartPrice = useMemo(() => {
        return getCartPrice(shoppingCart);
    }, [shoppingCart]);

    function deleteCartHandler(): void {
        confirmationData.current.title = "Clear Shopping Cart";
        confirmationData.current.message = "Do you want to remove all products from the shopping cart?";
        confirmationData.current.handle = deleteCartFn.bind(undefined);
        setDialogVisible(true);
    }

    function deleteCartFn(status: boolean): void {
        if (status) {
            dispatch(clearShoppingCartAction());
        }
        setDialogVisible(false);
    }

    function checkoutHandler(): void {
        if (!userData.id) {
            setNeedAuthFl(true);
            dispatch(setNotificationMessage({
                message: "Please, sign in to continue",
                type: NotificationType.INFO
            }));
        }
        if (!!userData.id && getProfileStatus(userData) === ProfileStatus.BAD_PROFILE) {
            setNeedFillProfileFl(true);
            dispatch(setNotificationMessage({
                message: "Please, fill neccessary info to continue",
                type: NotificationType.INFO
            }));
        }
        if (getProfileStatus(userData) !== ProfileStatus.BAD_PROFILE) {
            setAddressConfirmationFl(true);
        }
    }

    function sendOrderFn(addressConfirmed: boolean): void {
        if (addressConfirmed) {
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
            setShowOrdersFl(true);
        }
        setAddressConfirmationFl(false);
    }

    return <Box sx={{ mt: 1, width: '100%' }}>
        {shoppingCart.length === 0 && `You have 0 products in cart`}
        {showOrdersFl && <Navigate to={PATH_ORDERS} />}
        {shoppingCart.length > 0 && <Box>            
            <CartTable batches={shoppingCart} />
            <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', width: '100%', 
                alignItems: 'end' }}>
                <Typography>
                    Cost of goods: {cartPrice}{storeData.currencySign}                    
                </Typography>
                <Typography>
                    Cost of delivery: {storeData.deliveryCost}{storeData.currencySign}
                </Typography>
                <Typography>
                    <strong>Total price:</strong> {cartPrice + storeData.deliveryCost}{storeData.currencySign}
                </Typography>
            </Box>
            <Box sx={{ mt: 1, display: 'flex', width: '100%', justifyContent: 'end' }}>
                <Button
                    variant='outlined'
                    onClick={deleteCartHandler}
                    color='warning'
                    sx={{ mr: 2 }}>
                    Remove All <DeleteForeverIcon />
                </Button>
                <Button
                    variant='outlined'
                    onClick={checkoutHandler}
                    sx={{
                        color: '#ff6f04', borderColor: '#ff6f04', ':hover': {
                            borderColor: '#ff6f04',
                            backgroundColor: '#ff6f04',
                            color: '#FFFFFF'
                        }
                    }}>
                    Send Order &nbsp;<DeliveryDiningIcon />
                </Button>
            </Box>
            <AddressConfirmation visible={addressConfirmationFl} onClose={sendOrderFn} />
            <DialogConfirm visible={dialogVisible}
                title={confirmationData.current.title}
                message={confirmationData.current.message}
                onClose={confirmationData.current.handle} />
            {needAuthFl && <Navigate to={PATH_LOGIN} />}
            {needFillProfileFl && <Navigate to={PATH_PROFILE} />}            
        </Box>}
    </Box>;
}

export default ShoppingCart;