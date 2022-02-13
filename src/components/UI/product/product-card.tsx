import { Box, Card, CardActions, CardContent, CardMedia, IconButton, TextField, Typography } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { ProductOption, ProductOptionConfigured } from '../../../models/product-options';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import storeConfig from '../../../config/store-config.json';
import OptionButtons from './option-buttons';
import { shoppingCartService } from '../../../config/servicesConfig';
import { Product, ProductBatch } from '../../../models/product';
import { UserData } from '../../../models/user-data';
import { useDispatch, useSelector } from 'react-redux';
import { userDataSelector } from '../../../redux/store';
import { NotificationType } from '../../../models/user-notification';
import { setNotificationMessage } from '../../../redux/actions';

const ProductCard: FC<Product> = props => {

    const { title, basePrice, description, picture, options } = props;
    const [optionsConfigured, setOptionsConfigured] = useState<ProductOptionConfigured[]>([]);
    const [resultPrice, setResultPrice] = useState<number>(basePrice);
    const [count, setCount] = useState<number>(1);
    const userData: UserData = useSelector(userDataSelector);
    const dispatch = useDispatch();

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
        changeResultPrice();
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
            productConfigured: {
                base: { ...props },
                optionsConfigured: optionsConfigured
            },
            count: count
        }
        shoppingCartService.add(batch);        
        dispatch(setNotificationMessage({
            message: "Added to shopping cart",
            type: NotificationType.SUCCESS
        }));
    }

    function changeCountHandler(event: any) {
        setCount(event.target.value as number);
    }

    return <Card sx={{ width: 270, minHeight: 350, display: 'inline-block', m: 1 }}>
        <CardMedia component="img" height="240" alt={title}
            image={!!picture ? picture : storeConfig.defaultPictureProductUrl}
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
                        optionChangeFn={changeOptionHandler} />)}
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
                        defaultValue='1'
                        required
                        sx={{ width: '40%', ml: 2 }}
                        onChange={changeCountHandler}
                        disabled={userData.isAdmin}
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