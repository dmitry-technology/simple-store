import { Box, Button, Card, CardActions, CardContent, CardMedia, Typography } from '@mui/material';
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
import CountSelector from './count-selector';

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
    },[])

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

    function changeCountHandler(count: number) {
        setCount(count);
        !!props.updateOrderFn && !!props.productBatch && props!.updateOrderFn({ ...props.productBatch, count: count });
    }

    return <Card sx={{ width: "90%", minHeight: "350px", display: 'inline-flex', flexDirection: 'column', m: 1 }}>
                <CardMedia  component="img"  
                            alt={title}
                            sx={{width: '100%', padding: '5px' }}
                            image={!!picture ? picture : `${window.location.origin}/${storeConfig.defaultPictureProductUrl}`}
                />
                <CardContent sx={{ flexGrow: 1, paddingBottom: 0 }}>
                    <Typography gutterBottom variant="h5" sx={{ fontFamily: 'Cooper Std Black' }}>
                        {title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {description}
                    </Typography>
                </CardContent>
                <CardActions sx={{ display: 'flex', flexDirection: 'column', width: '100%', p: 0, m: 0 }}>
                    <Box sx={{p: 2, width: '90%'}}>
                        <Box sx={{paddingBottom: 1}}>
                            {!!options && options.map(option =>
                                <OptionButtons key={option.optionTitle} productOption={option}
                                    optionChangeFn={changeOptionHandler} productBatch={props.productBatch} />)}
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center', m: 0 }}>
                            <Typography variant="h5" sx={{m: 0}} >
                                {resultPrice}{storeConfig.currencySign}
                            </Typography>
                            <Box sx={{ display: 'inline-flex', justifyContent: 'right', m: 0, width: '100%' }}>
                                <CountSelector handlerFunc={changeCountHandler} value={count} />
                            </Box>
                        </Box>
                        <Box sx={{mt: 1}}>
                                <Button 
                                    color='warning'
                                    variant="contained" 
                                    startIcon={<AddShoppingCartIcon />} 
                                    fullWidth
                                    onClick={addToCartHandler}
                                    disabled={userData.isAdmin || !!props.productBatch }
                                    >
                                Add to cart
                                </Button>
                            </Box>
                    </Box>
                </CardActions>
    </Card>
}

export default ProductCard;