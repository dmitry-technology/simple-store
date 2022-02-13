import { Box, Button } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { shoppingCartService } from '../../config/servicesConfig';
import { ProductBatch } from '../../models/product';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const ShoppingCart: FC = () => {

    const [shoppingCart, setShoppingCart] = useState<ProductBatch[]>([]);

    useEffect(() => {
        setShoppingCart(shoppingCartService.getAll());
    }, [])

    function deleteCartHandler() {
        shoppingCartService.removeAll();
        setShoppingCart(shoppingCartService.getAll());
    }

    return  <Box>
                {`You have ${shoppingCart.length} products in cart`}
                <Box>
                    <Button variant='contained'>
                        Checkout <DeliveryDiningIcon/>
                    </Button>
                    <Button variant='outlined' onClick={deleteCartHandler}>
                        Delete Cart <DeleteForeverIcon/>
                    </Button>
                </Box>
            </Box>;
}
 
export default ShoppingCart;