import { Box, Button, Checkbox, FormControl, IconButton, InputLabel, ListItem, ListItemText, MenuItem, OutlinedInput, Paper, Select } from "@mui/material";
import { FC, Fragment, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Category } from "../../../models/category-type";
import { Product, UploadProductData } from '../../../models/product';
import { addProductAction, removeCategoryAction } from "../../../redux/actions";
import { categoriesSelector, productsSelector } from "../../../redux/store";
import ModalFormProduct from "../../UI/modal-form-product";
import ProductListGrid from "../../UI/product-list-grid";
import { Delete } from "@mui/icons-material"
import EditIcon from '@mui/icons-material/Edit';
import DialogConfirm from "../../UI/common/dialog";
import { ConfirmationData, emptyConfirmationData } from "../../../models/common/confirmation-type";

const Catalog: FC = () => {

    const products: Product[] = useSelector(productsSelector);
    const categories: Category[] = useSelector(categoriesSelector);

    const [modalFormVisible, setModaFormlVisible] = useState(false);

    //**************** dialog confirmation ********************//
    const confirmationData = useRef<ConfirmationData>(emptyConfirmationData);
    const [dialogVisible, setDialogVisible] = useState(false);

    //****************** selector categories ******************//
    const [curCategory, setCurCategory] = useState<string>(categories[0].id);

    const productsByCat = useMemo(() => products.filter(p => p.category === curCategory), [curCategory, products]);

    const dispatch = useDispatch();

    async function addProductFn(uploadProductData: UploadProductData) {
        await dispatch(addProductAction(uploadProductData));
    }

    function onCategoryDelete(id: string) {
        const category = getCategory(id);
        if (category) {
            confirmationData.current.title = `Remove category`;
            confirmationData.current.message = `Do you want remove category "${category.name}"?`;
            confirmationData.current.handle = deleteHandle.bind(undefined, category);
            setDialogVisible(true);
        }
    }

    async function deleteHandle(category: Category, status: boolean) {
        if (status) {
            // await dispatch(removeCategoryAction(category.id));
        }
        setDialogVisible(false);
    }

    //****************** util ******************//
    function getCategory(id: string) {
        return categories.find(c => c.id === id);
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '1 0 auto' }}>
            <Paper sx={{ margin: '10px 0' }}>
                <Button variant="outlined" onClick={() => setModaFormlVisible(true)}>
                    Create new product
                </Button>
            </Paper>
            <FormControl
                margin='dense'
                sx={{
                    width: { xs: '100vw', sm: '95vw' },
                    display: 'flex',
                    flexDirection: 'row'
                }}
            >
                <InputLabel>Category</InputLabel>
                <Select
                    value={curCategory}
                    label="Category"
                    onChange={e => setCurCategory(e.target.value)}
                    renderValue={cur => getCategory(cur)!.name}
                    sx={{ flex: '1 0 auto' }}
                >
                    {categories.map(cat => (
                        <MenuItem
                            value={cat.id}
                            key={cat.id}
                        >
                            <ListItemText primary={cat.name} />
                            <IconButton>
                                <EditIcon />
                            </IconButton>
                            <IconButton onClick={() => onCategoryDelete(cat.id)}>
                                <Delete />
                            </IconButton>
                        </MenuItem>
                    ))}
                </Select>
                <Button>
                    Add new category
                </Button>
            </FormControl>
            <ProductListGrid products={productsByCat} />
            <DialogConfirm
                visible={dialogVisible}
                title={confirmationData.current.title}
                message={confirmationData.current.message}
                onClose={confirmationData.current.handle}
            />
            <ModalFormProduct
                visible={modalFormVisible}
                uploadProductFn={addProductFn}
                onClose={() => setModaFormlVisible(false)}
            />
        </Box>
    )
}

export default Catalog;