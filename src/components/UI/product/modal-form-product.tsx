import { Box, IconButton, Modal, Paper } from '@mui/material';
import { FC } from 'react';
import { useSelector } from 'react-redux';
import { Category } from '../../../models/category-type';
import { categoriesSelector } from '../../../redux/store';
import FormAddProduct from './form-add-product';
import config from "../../../config/store-config.json"
import { Product, UploadProductData } from '../../../models/product';
import { productStore } from '../../../config/servicesConfig';
import CloseIcon from '@mui/icons-material/Close';

type ModalFormProductProps = {
    visible: boolean;
    uploadProductFn: (uploadProductData: UploadProductData) => void;
    product?: Product;
    onClose: () => void;
}

const ModalFormProduct: FC<ModalFormProductProps> = (props) => {

    const { visible, uploadProductFn, product, onClose } = props;

    const categories: Category[] = useSelector(categoriesSelector);

    async function uploadProduct(uploadProductData: UploadProductData) {
        await uploadProductFn(uploadProductData);
        onClose();
    }

    async function existId(id: string): Promise<boolean> {
        return await productStore.exists(id);
    }

    return (
        <Modal
            open={visible}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            sx={{ display: 'flex', justifyContent: 'center' }}
        >
            <Paper
                sx={{
                    width: { xs: '100vw', sm: '50vw' },
                    padding: '0 20px',
                    height: 'fit-content',
                    maxHeight: '100%',
                    alignSelf: 'center',
                    overflow: 'auto'
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'end', marginTop: '5px' }}>
                    <IconButton onClick={onClose}>
                        <CloseIcon sx={{ fontSize: '1.9rem' }} />
                    </IconButton>
                </Box>
                <FormAddProduct
                    categories={categories}
                    uploadProduct={uploadProduct}
                    defaultPicture={config.defaultPictureProductUrl}
                    existId={existId}
                    product={product}
                />
            </Paper>
        </Modal >
    );
};

export default ModalFormProduct;