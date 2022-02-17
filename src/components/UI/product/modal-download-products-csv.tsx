import {
    FormControl, Modal, Paper, InputLabel, Select,
    MenuItem, Box, Button, SxProps, Theme
} from '@mui/material';
import { FC, useState } from 'react';
import { Category } from '../../../models/category-type';
import { emptyProduct, Product } from '../../../models/product';
import { ProductOption } from '../../../models/product-options';
import { downloadProductsCsv } from '../../../utils/product-utils';

type Props = {
    visible: boolean;
    products: Product[];
    categories: Category[];
    onClose: () => void;
}

const ModalDownloadProductsCsv: FC<Props> = (props) => {

    const { visible, products, categories, onClose } = props;

    const [curCatId, setCurCatId] = useState<string>('-1');

    function download() {
        let productsCsv = [ ...products ];
        if (curCatId !== '-1') {
            productsCsv = productsCsv.filter(p => p.category === curCatId);
        }
        const fileName = getCatName(curCatId);
        downloadProductsCsv(fileName || 'Allproducts', productsCsv);
    }

    function getCatName(id: string) {
        return categories.find(c => c.id === id)?.name;
    }

    const boxButtonStyle: SxProps<Theme> = {
        display: 'flex',
        justifyContent: 'space-between',
        margin: '20px 0'
    }

    const buttonStyle: SxProps<Theme> = {
        border: '1px solid',
        width: '47%'
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
                    width: { xs: '90vw', sm: '30vw' },
                    padding: '0 20px',
                    height: 'fit-content',
                    maxHeight: '100%',
                    alignSelf: 'center',
                    overflow: 'auto'
                }}
            >

                <FormControl margin='normal' fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                        value={curCatId}
                        label="Category"
                        onChange={e => setCurCatId(e.target.value)}
                        required
                    >
                        <MenuItem value={'-1'} key={'-1'}>{'All products'}</MenuItem>
                        {categories.map(cat => (
                            <MenuItem value={cat.id} key={cat.id}>{cat.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Box sx={boxButtonStyle}>
                    <Button type='submit' variant='contained' sx={buttonStyle} onClick={download}>
                        Download
                    </Button>
                    <Button type='reset' sx={buttonStyle} onClick={onClose}>
                        Cancel
                    </Button>
                </Box>
            </Paper>
        </Modal >
    );
};

export default ModalDownloadProductsCsv;