import { Box, Card, CardActions, CardContent, CardMedia, IconButton, Typography } from '@mui/material';
import { FC } from 'react';
import { ProductOptions } from '../models/product-options';
import TuneIcon from '@mui/icons-material/Tune';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

type ProductCardProps = {
    title: string,
    basePrice: number,
    description?: string,
    pictureUrl?: string
    options?: ProductOptions
}
export type { ProductCardProps };

const ProductCard: FC<ProductCardProps> = props => {

    const { title, basePrice, description, pictureUrl, options } = props;

    return <Card sx={{ width: 270, height: 400, display: 'inline-block', m: 1 }}>
        <CardMedia component="img" height="240"
            image={!!pictureUrl ? pictureUrl
                : 'https://avatars.mds.yandex.net/i?id=49d5c7a497611ddd9621e9d43f7513a9-4304165-images-thumbs&n=13'}
            alt={title} />
        <CardContent sx={{height: 75}}>
            <Typography gutterBottom variant="h5">
                {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
                {description}
            </Typography>
        </CardContent>
        <CardActions>
            <Typography variant="h5">
                {basePrice} ₪
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