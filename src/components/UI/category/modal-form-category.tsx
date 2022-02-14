import { Modal, Paper } from '@mui/material';
import { FC } from 'react';
import { Category } from '../../../models/category-type';
import FormAddCategory from './form-add-category';

type ModalFormCategoryProps = {
    visible: boolean;
    uploadCategoryFn: (category: Category) => void;
    category?: Category;
    onClose: () => void;
}

const ModalFormCategory: FC<ModalFormCategoryProps> = (props) => {

    const { visible, uploadCategoryFn, category, onClose } = props;

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
                    width: { xs: '100vw', sm: '30vw' },
                    padding: '0 20px',
                    height: 'fit-content',
                    maxHeight: '100%',
                    alignSelf: 'center',
                    overflow: 'auto'
                }}
            >
                <FormAddCategory 
                    uploadCategoryFn={uploadCategoryFn}
                    category={category}
                    onClose={onClose}
                />
            </Paper>
        </Modal >
    );
};

export default ModalFormCategory;