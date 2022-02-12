import { Box } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Category } from '../../../models/category-type';
import { Product } from '../../../models/product';
import { categoriesSelector } from '../../../redux/store';
import FormAddProduct from '../../UI/form-add-product';
import config from "../../../config/store-config.json"
import { productPictureStore, productStore } from '../../../config/servicesConfig';
import { ProductOption } from '../../../models/product-options';

const Catalog: FC = () => {
    const categories: Category[] = useSelector(categoriesSelector);
    const dispatch = useDispatch();

    function uploadProductData(product: Product, picture: File) {
        dispatch(uploadProductData(product, picture));
    }

    async function existId(id: string): Promise<boolean> {
        return await productStore.exists(id);
    }

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ width: '50vw' }}>
                <FormAddProduct
                    categories={categories}
                    uploadProductData={uploadProductData}
                    defaultPicture={config.defaultPictureProductUrl}
                    existId={existId}
                />
            </Box>
        </Box>
    );
}

export default Catalog;