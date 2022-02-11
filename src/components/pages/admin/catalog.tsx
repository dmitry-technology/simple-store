import { Box } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Category } from '../../../models/category-type';
import { Product } from '../../../models/product';
import { categoriesSelector } from '../../../redux/store';
import FormAddProduct from '../../UI/form-add-product';
import config from "../../../config/store-config.json"
import { productPictureStore, productStore } from '../../../config/servicesConfig';
import { ProductOptions } from '../../../models/product-options';

const Catalog: FC = () => {
    const categories: Category[] = useSelector(categoriesSelector);

    async function uploadProductData(product: Product, picture: File) {
        if (picture) {
            const pictureUrl = await productPictureStore.uploadFile(picture);
            product.picture = pictureUrl;
        }
        productStore.add(product);
    }

    async function existId(id: number): Promise<boolean> {
        return await productStore.exists(id.toString());
    }

    const [product, setProduct] = useState<Product>();

    useEffect(() => {
        productStore.get('999999').then(product => setProduct(product));
    }, []);


    return (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ width: '50vw' }}>
                {product && <FormAddProduct
                    categories={categories}
                    uploadProductData={uploadProductData}
                    defaultPicture={config.defaultPictureProductUrl}
                    existId={existId}
                    product={product}
                />}
            </Box>
        </Box>
    );
}

export default Catalog;