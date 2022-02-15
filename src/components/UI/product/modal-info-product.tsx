import { Modal, Paper } from '@mui/material';
import { FC } from 'react';
import { Product } from '../../../models/product';
import ProductCard from './product-card';

type ModalInfoProductProps = {
    product: Product,
    visible: boolean,
    onClose: () => void
}

const ModalInfoProduct: FC<ModalInfoProductProps> = (props) => {

    const { product, visible, onClose } = props;

    return <Modal
        open={visible}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ display: 'flex', justifyContent: 'center' }}
    >
        <Paper sx={{ padding: '20px', width: {xs: '80%', sm: '50%', md: '30%', lg: '20%'}, height: 'fit-content', alignSelf: 'center' }}>
            <ProductCard
                product={product}
            />
        </Paper>
    </Modal>
};

export default ModalInfoProduct;
