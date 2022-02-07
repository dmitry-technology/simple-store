import { Box } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { categoriesStore, productStore } from '../../../config/servicesConfig';
import { Category } from '../../../models/category-type';
import FormAddProduct from '../../UI/form-add-product';

const Catalog: FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        categoriesStore.getAll().subscribe(categories => setCategories(categories));
    }, []);


    return (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <FormAddProduct
                uploadProductData={product => { }}
                categories={categories}
            />
        </Box>
    )
}

export default Catalog;