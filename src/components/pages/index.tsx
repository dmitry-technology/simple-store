import { Box, Link, Typography } from '@mui/material';
import { FC } from 'react';
import {ProductCategory} from '../../models/product-category';
import ProductCard, {ProductCardProps} from '../../components/product-card';
import { useSelector } from 'react-redux';
import { UserData } from '../../models/user-data';
import { userDataSelector } from '../../redux/store';

const categories: ProductCategory[] = [
    {title: 'Meat Pizza', order: 1},
    {title: 'Kosher Pizza', order: 2}
]

const products: ProductCardProps[] = [
    {title: 'Margarita', basePrice: 40, description: 'Cheese, tomatos, souce',
        pictureUrl: 'https://media-cdn.tripadvisor.com/media/photo-s/06/0d/20/ac/pizza-italia.jpg'},
    {title: 'Italiano', basePrice: 55, description: 'Cheese, pepper, cherry tomatos, bazilique, souce', 
        pictureUrl: 'https://media-cdn.tripadvisor.com/media/photo-s/06/0d/20/ac/pizza-italia.jpg',
        options: {size: [{title: "S", extraPay: 0}, {title: "M", extraPay: 10}, {title: "L", extraPay: 15}],
            dough: [{title: "Traditional", extraPay: 0}, {title: "Thin", extraPay: 5}]}},
    {title: 'Fresh Juice', basePrice: 15},
    {title: 'Bubble Gum', basePrice: 5}
]

const Index: FC = () => {

    const userData: UserData = useSelector(userDataSelector);

    return  <Box>
                {"user:" + userData.displayName}
                {<Link href='/logout'> (logout)</Link>}
                {categories.map(cat => <Box key={cat.title} component="div">
                    <Typography sx={{ m:1, fontFamily: 'Cooper'}} variant='h3'>
                        {cat.title}
                    </Typography>
                    {products.map(prod => <ProductCard key={prod.title} {...prod}/>)}
                    </Box>)}
            </Box>;
}
 
export default Index;