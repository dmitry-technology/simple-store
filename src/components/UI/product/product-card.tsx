import { Box, Card, CardActions, CardContent, CardMedia, IconButton, TextField, Typography } from '@mui/material';
import { FC, useEffect, useRef, useState } from 'react';
import { ProductOptionConfigured } from '../../../models/product-options';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import storeConfig from '../../../config/store-config.json';
import OptionButtons from './option-buttons';
import { shoppingCartService } from '../../../config/servicesConfig';
import { Product, ProductBatch } from '../../../models/product';
import { UserData } from '../../../models/user-data';
import { useDispatch, useSelector } from 'react-redux';
import { userDataSelector } from '../../../redux/store';
import { NotificationType } from '../../../models/user-notification';
import { setCartItemsCount, setNotificationMessage } from '../../../redux/actions';
import { getRandomInteger } from '../../../utils/common/random';

const ProductCard: FC<{ product: Product, productBatch?: ProductBatch, updateOrderFn?: (productBatch: ProductBatch) => void }> = props => {

    const { title, basePrice, description, picture, options } = { ...props.product };
    const [optionsConfigured, setOptionsConfigured] = useState<ProductOptionConfigured[]>([]);
    const [resultPrice, setResultPrice] = useState<number>(basePrice);
    const [count, setCount] = useState<number>(1);
    const userData: UserData = useSelector(userDataSelector);
    const dispatch = useDispatch();
    const batchId = useRef<string>(getRandomInteger(storeConfig.minId, storeConfig.maxId).toString());

    useEffect(() => {
        if (!!props.productBatch) {
            setCount(props.productBatch.count);
        }
    }, [])

    useEffect(() => {
        !!options && options.forEach(option =>
            optionsConfigured.push({
                optionTitle: option.optionTitle,
                optionData: option.optionData[0]
            }))
    }, [])

    function changeOptionHandler(optionTitle: string, optionValue: string) {
        let optionToChange = options?.find(option => option.optionTitle === optionTitle);
        const optionConfigured: ProductOptionConfigured = {
            optionTitle: optionTitle,
            optionData: {
                name: optionValue,
                extraPay: optionToChange?.optionData
                    .find(od => od.name === optionValue)?.extraPay as number
            }
        }
        const index = optionsConfigured.findIndex(option => option.optionTitle === optionTitle);
        optionsConfigured.splice(index, 1, optionConfigured);
        setOptionsConfigured(optionsConfigured);
        !!props.updateOrderFn && updateOrder(optionsConfigured);
        changeResultPrice();
    }

    function updateOrder(optionsConfigured: ProductOptionConfigured[]) {
        const batch: ProductBatch = {
            id: batchId.current,
            productConfigured: {
                base: { ...props.product },
                optionsConfigured: optionsConfigured
            },
            count: count
        }
        props.updateOrderFn!(batch);
    }

    function changeResultPrice() {
        let resPrice = basePrice;
        for (let option of optionsConfigured) {
            resPrice += option.optionData.extraPay;
        }
        setResultPrice(resPrice);
    }

    function addToCartHandler() {
        const batch: ProductBatch = {
            id: batchId.current,
            productConfigured: {
                base: { ...props.product },
                optionsConfigured: optionsConfigured
            },
            count: count
        }
        shoppingCartService.add(batch);
        dispatch(setCartItemsCount(shoppingCartService.getItemsCount()));
        dispatch(setNotificationMessage({
            message: "Added to shopping cart",
            type: NotificationType.SUCCESS
        }));
    }

    function changeCountHandler(event: any) {
        const count = event.target.value as number;
        setCount(count);
        !!props.updateOrderFn && !!props.productBatch && props!.updateOrderFn({ ...props.productBatch, count: count });
    }

    return <Card sx={{ width: 270, minHeight: 350, display: 'inline-block', m: 1 }}>
        <CardMedia component="img" height="240" alt={title}
            image={!!picture ? picture : `${window.location.origin}/${storeConfig.defaultPictureProductUrl}`}
        />
        <CardContent sx={{ paddingBottom: 0 }}>
            <Typography gutterBottom variant="h5">
                {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
                {description}
            </Typography>
        </CardContent>
        <CardActions sx={{ display: 'inline-block' }}>
            <Box>
                {!!options && options.map(option =>
                    <OptionButtons key={option.optionTitle} productOption={option}
                        optionChangeFn={changeOptionHandler} productBatch={props.productBatch} />)}
            </Box>
            <Box sx={{ display: 'inline-flex' }}>
                <Typography variant="h5" >
                    {resultPrice}{storeConfig.currencySign}
                </Typography>
                <Box sx={{ display: 'inline-flex', justifyContent: 'right' }}>
                    <TextField
                        id="outlined-number"
                        type="number"
                        size='small'
                        value={count}
                        required
                        sx={{ width: '40%', ml: 2 }}
                        onChange={changeCountHandler}
                    // disabled={userData.isAdmin}
                    />
                    <IconButton onClick={addToCartHandler} disabled={userData.isAdmin}>
                        <AddShoppingCartIcon />
                    </IconButton>
                </Box>
            </Box>
        </CardActions>
    </Card>
}

export default ProductCard;