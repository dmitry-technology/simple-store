import { Modal, Paper } from '@mui/material';
import { FC } from 'react';

type ModalFormProductProps = {
    visible: boolean;
    onClose: () => void;
}

const ModalUploadFileProducts:FC<ModalFormProductProps> = (props) => {

    const { visible, onClose } = props;

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
                {/* <FormAddProduct
                    categories={categories}
                    uploadProduct={uploadProduct}
                    defaultPicture={config.defaultPictureProductUrl}
                    existId={existId}
                    product={product}
                /> */}
            </Paper>
        </Modal >
    );
};

export default ModalUploadFileProducts;