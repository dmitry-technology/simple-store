import { Box, Button } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { shoppingCartService } from '../../config/servicesConfig';
import { ProductBatch } from '../../models/product';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Navigate } from 'react-router-dom';
import { PATH_LOGIN } from '../../config/routing';
import { UserData } from '../../models/user-data';
import { useDispatch, useSelector } from 'react-redux';
import { userDataSelector } from '../../redux/store';
import { setNotificationMessage } from '../../redux/actions';
import { NotificationType } from '../../models/user-notification';

const ShoppingCart: FC = () => {

    const [shoppingCart, setShoppingCart] = useState<ProductBatch[]>([]);
    const [needAuthFl, setNeedAuthFl] = useState<boolean>(false);
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
        !userData.id && setNeedAuthFl(true);
        dispatch(setNotificationMessage({message: "Please, sign in to continue",
            type: NotificationType.INFO}))
    }

    return  <Box>
                {`You have ${shoppingCart.length} products in cart`}
                <Box>
                    <Button variant='contained' onClick={checkoutHandler}>
                        Checkout <DeliveryDiningIcon/>
                    </Button>
                    <Button variant='outlined' onClick={deleteCartHandler}>
                        Delete Cart <DeleteForeverIcon/>
                    </Button>
                </Box>
                {needAuthFl && <Navigate to={PATH_LOGIN} />}
            </Box>;
}
 
export default ShoppingCart;