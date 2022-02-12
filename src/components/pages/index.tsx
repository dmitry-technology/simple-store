import { Box, Grid, Typography } from '@mui/material';
import { FC } from 'react';
import ProductCard from '../UI/product-card';
import { useSelector } from 'react-redux';
import { categoriesSelector, productsSelector } from '../../redux/store';
import { Product } from '../../models/product';
import { Category } from '../../models/category-type';
import _ from 'lodash';

const Index: FC = () => {

    const products: Product[] = useSelector(productsSelector);
    const categories: Category[] = useSelector(categoriesSelector);
    const categoriesSorted = _.sortBy(categories, ['sortOrder']);

    function getActiveProductsByCategory(categoryId: string): Product[] {
        return products.filter(prod => prod.active && prod.category === categoryId);
    }

    return <Box>
        {categoriesSorted.map(cat =>
            getActiveProductsByCategory(cat.id).length > 0 &&
            <Box key={cat.name} component="div" sx={{m: 1}}>
                <Typography id={cat.id} sx={{ fontFamily: 'Cooper' }} variant='h3'>
                    {cat.name}
                </Typography>
                <Grid container alignItems="stretch" >
                    {getActiveProductsByCategory(cat.id).map((prod, index) =>
                        <ProductCard key={index + prod.title} {...prod} />)}
                </Grid>
            </Box>)}
    </Box>;
}

export default Index;