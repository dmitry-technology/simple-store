import { Box } from '@mui/material';
import { FC } from 'react';
import { useSelector } from 'react-redux';
import { Category } from '../../../models/category-type';
import { Product } from '../../../models/product';
import { categoriesSelector } from '../../../redux/store';
import FormAddProduct from '../../UI/form-add-product';
import config from "../../../config/store-config.json"
import { productPictureStore, productStore } from '../../../config/servicesConfig';

const Catalog: FC = () => {
    const categories: Category[] = useSelector(categoriesSelector);

    async function uploadProductData(product: Product, picture: File) {
        if (picture) {
            const pictureUrl = await productPictureStore.uploadFile(picture);
            product.picture = pictureUrl;
        }
        productStore.add(product);
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