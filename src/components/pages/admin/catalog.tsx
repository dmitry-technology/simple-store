import { Box, Button, Paper } from "@mui/material";
import { FC, useState } from "react";
import { useDispatch } from 'react-redux';
import { UploadProductData } from '../../../models/product';
import { addProductAction } from "../../../redux/actions";
import ModalFormProduct from "../../UI/modal-form-product";
import ProductListGrid from "../../UI/product-list-grid";

const Catalog: FC = () => {

    const [modalFormVisible, setModaFormlVisible] = useState(false);

    const dispatch = useDispatch();

    async function addProductFn(uploadProductData: UploadProductData) {
        await dispatch(addProductAction(uploadProductData));
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '1 0 auto' }}>
            <Paper sx={{ margin: '10px 0' }}>
                <Button variant="outlined" onClick={() => setModaFormlVisible(true)}>
                    Create new product
                </Button>
            </Paper>
            <ProductListGrid />
            <ModalFormProduct
                visible={modalFormVisible}
                uploadProductFn={addProductFn}
                onClose={() => setModaFormlVisible(false)}
            />
        </Box>
    )
}

export default Catalog;