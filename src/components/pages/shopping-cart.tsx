import { Box } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { shoppingCartService } from '../../config/servicesConfig';
import { ProductBatch } from '../../models/product';

const ShoppingCart: FC = () => {

    const [shoppingCart, setShoppingCart] = useState<ProductBatch[]>([]);

    useEffect(() => {
        setShoppingCart(shoppingCartService.getAll());
    }, [])

    return  <Box>
                {`You have ${shoppingCart.length} products in cart`}
            </Box>;
}
 
export default ShoppingCart;