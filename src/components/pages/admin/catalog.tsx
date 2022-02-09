import { Box } from '@mui/material';
import { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Category } from '../../../models/category-type';
import { Product } from '../../../models/product';
import { categoriesSelector } from '../../../redux/store';
import FormAddProduct from '../../UI/form-add-product';

const Catalog: FC = () => {
    const categories: Category[] = useSelector(categoriesSelector);

    function uploadProductData(product: Product) {

    }

    return (
        <Box>
            <FormAddProduct categories={categories} uploadProductData={() => { }} />
        </Box>
    );
}

export default Catalog;