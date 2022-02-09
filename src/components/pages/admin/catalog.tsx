import { Box } from '@mui/material';
import { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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

    async function existId(id: number): Promise<boolean> {
        return await productStore.exists(id);
    }

    return (
        <Box>
            <FormAddProduct
                categories={categories}
                uploadProductData={uploadProductData}
                defaultPicture={config.defaultPictureProductUrl}
                existId={existId}
            />
        </Box>
    );
}

export default Catalog;