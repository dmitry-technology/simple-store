import { Box, Typography } from '@mui/material';
import { FC } from 'react';
import ProductCard from '../../components/product-card';
import { useSelector } from 'react-redux';
import { categoriesSelector, productsSelector } from '../../redux/store';
import { Product } from '../../models/product';
import { Category } from '../../models/category-type';
import _ from 'lodash';

const Index: FC = () => {

    const products: Product[] = useSelector(productsSelector);
    const categories: Category[] = useSelector(categoriesSelector);
    const categoriesSorted = _.sortBy(categories, ['sortOrder']);

    return  <Box>
                {categoriesSorted.map(cat => <Box key={cat.name} component="div">
                    <Typography sx={{ m:1, fontFamily: 'Cooper'}} variant='h3'>
                        {cat.name}
                    </Typography>
                    {products.filter(prod => prod.active && prod.category === cat.id)
                        .map((prod, index) => <ProductCard key={index + prod.title} {...prod}/>)}
                    </Box>)}
            </Box>;
}
 
export default Index;