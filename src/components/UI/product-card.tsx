import { Box, Card, CardActions, CardContent, CardMedia, IconButton, Typography } from '@mui/material';
import { FC } from 'react';
import { ProductOption } from '../../models/product-options';
import TuneIcon from '@mui/icons-material/Tune';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import storeConfig from '../../config/store-config.json';

type ProductCardProps = {
    title: string,
    basePrice: number,
    description?: string,
    picture?: string
    options?: ProductOption[]
}

const ProductCard: FC<ProductCardProps> = props => {

    const { title, basePrice, description, picture, options } = props;

    return <Card sx={{ width: 270, minHeight: 350, display: 'inline-block', m: 1 }}>
        <CardMedia component="img" height="240" alt={title}
            image={!!picture ? picture : storeConfig.defaultPictureProductUrl}
        />
        <CardContent>
            <Typography gutterBottom variant="h5">
                {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
                {description}
            </Typography>
        </CardContent>
        <CardActions>
            <Typography variant="h5">
                {basePrice} {storeConfig.currencySign}
            </Typography>
            <Box>
                {!!options && <IconButton>
                    <TuneIcon />
                </IconButton>}
                <IconButton>
                    <AddShoppingCartIcon />
                </IconButton>
            </Box>
        </CardActions>
    </Card>
}

export default ProductCard;