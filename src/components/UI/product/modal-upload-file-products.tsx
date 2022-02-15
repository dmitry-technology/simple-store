import { Modal, Paper } from '@mui/material';
import { FC } from 'react';
import { Category } from '../../../models/category-type';
import FormUploadFileProducts from './form-upload-file-products';

type ModalFormProductProps = {
    visible: boolean;
    onClose: () => void;
    categories: Category[];
}

const ModalUploadFileProducts: FC<ModalFormProductProps> = (props) => {

    const { visible, onClose, categories } = props;

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
                    width: { xs: '90vw', sm: '30vw' },
                    padding: '0 20px',
                    height: 'fit-content',
                    maxHeight: '100%',
                    alignSelf: 'center',
                    overflow: 'auto'
                }}
            >
                <FormUploadFileProducts
                    categories={categories}
                    uploadFn={() => { }}
                    onClose={onClose}
                />
            </Paper>
        </Modal >
    );
};

export default ModalUploadFileProducts;