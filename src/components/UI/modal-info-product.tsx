import { Box, List, ListItem, Modal, Paper, Typography } from '@mui/material';
import { FC } from 'react';
import { Product } from '../../models/product';
import ProductCard from './product-card';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

type ModalInfoProductProps = {
    product: Product,
    visible: boolean,
    onClose: () => void
}

const ModalInfoProduct: FC<ModalInfoProductProps> = (props) => {

    const { product, visible, onClose } = props;

    const { id, title, category, basePrice, description, picture, options, active } = product;

    return <Modal
        open={visible}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ display: 'flex', justifyContent: 'center' }}
    >
        <Paper sx={{ padding: '20px', width: 'fit-content', height: 'fit-content', alignSelf: 'center' }}>
            <ProductCard
                id={id}
                title={title}
                category={category}
                basePrice={basePrice}
                description={description}
                picture={picture}
                options={options}
                active={active}
            />
        </Paper>
    </Modal>
};

export default ModalInfoProduct;
