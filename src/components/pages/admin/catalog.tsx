import { Box, Button, FormControl, IconButton, InputLabel, ListItemText, MenuItem, Paper, Select } from "@mui/material";
import { FC, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Category } from "../../../models/category-type";
import { Product, UploadProductData } from '../../../models/product';
import { addCategoryAction, addProductAction, removeCategoryAction, updateCategoryAction } from "../../../redux/actions";
import { categoriesSelector, productsSelector } from "../../../redux/store";
import { Delete } from "@mui/icons-material"
import EditIcon from '@mui/icons-material/Edit';
import DialogConfirm from "../../UI/common/dialog";
import { ConfirmationData, emptyConfirmationData } from "../../../models/common/confirmation-type";
import ProductListGrid from "../../UI/product/product-list-grid";
import ModalFormProduct from "../../UI/product/modal-form-product";
import ModalFormCategory from "../../UI/category/modal-form-category";

type FormCategoryData = {
    uploadCategoryFn: (category: Category) => void;
    category?: Category;
}

const Catalog: FC = () => {

    const products: Product[] = useSelector(productsSelector);
    const categories: Category[] = useSelector(categoriesSelector);

    //******************** form product ***********************//
    const [modalProductFormVisible, setModalProductFormVisible] = useState(false);

    //******************** form category ***********************//
    const [modalCategoryFormVisible, setModalCategoryFormVisible] = useState(false);
    const formCategoryData = useRef<FormCategoryData>({ uploadCategoryFn: (category) => { } });

    //**************** dialog confirmation ********************//
    const confirmationData = useRef<ConfirmationData>(emptyConfirmationData);
    const [dialogVisible, setDialogVisible] = useState(false);

    //****************** selector categories ******************//
    const [curCategoryId, setCurCategoryId] = useState<string>(categories[0]?.id || '');

    const productsByCat = useMemo(() => getProductsByCat(curCategoryId), [curCategoryId, products]);

    const dispatch = useDispatch();

    async function addProductFn(uploadProductData: UploadProductData) {
        await dispatch(addProductAction(uploadProductData));
    }

    function onCategoryCreate() {
        formCategoryData.current.uploadCategoryFn = addCatHandle;
        formCategoryData.current.category = undefined;
        setModalCategoryFormVisible(true);
    }

    function onCategoryUpdate(event: any, id: string) {
        event.stopPropagation();
        formCategoryData.current.uploadCategoryFn = updateCatMiddleware;
        formCategoryData.current.category = getCategory(id);
        setModalCategoryFormVisible(true);
    }

    function onCategoryDelete(event: any, id: string) {
        event.stopPropagation();
        const category = getCategory(id);
        if (category) {
            confirmationData.current.title = `Remove category`;
            const productsByCat = getProductsByCat(category.id);
            confirmationData.current.message = `Do you want remove category "${category.name}"?`;
            if (productsByCat.length > 0) {
                confirmationData.current.message += ` There are products in this category, 
                if you delete this category, the products will also be deleted!`;
            }
            confirmationData.current.handle = deleteCatHandle.bind(undefined, category);
            setDialogVisible(true);
        }
    }

    function updateCatMiddleware(category: Category) {
        setModalCategoryFormVisible(false);
        confirmationData.current.title = `Update category`;
        confirmationData.current.message = `Do you want update category?`;
        confirmationData.current.handle = updateCatHandle.bind(undefined, category);
        setDialogVisible(true);
    }

    async function addCatHandle(category: Category) {
        await dispatch(addCategoryAction(category));
        setModalCategoryFormVisible(false);
    }

    async function updateCatHandle(category: Category, status: boolean) {
        if (status) {
            await dispatch(updateCategoryAction(category));
        }
        setDialogVisible(false);
    }

    async function deleteCatHandle(category: Category, status: boolean) {
        if (status) {
            if (category.id === curCategoryId && categories.length > 1) {
                const otherCategory = categories.find(c => c.id !== category.id);
                setCurCategoryId(otherCategory?.id || '');
            }
            const productsByCat = getProductsByCat(category.id);
            await dispatch(removeCategoryAction(category.id, productsByCat));
        }
        setDialogVisible(false);
    }

    //****************** util ******************//
    function getCategory(id: string) {
        return categories.find(c => c.id === id);
    }

    function getProductsByCat(id: string) {
        return products.filter(p => p.category === id);
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '1 0 auto', width: '100%' }}>
            <Paper sx={{ margin: '10px 0' }}>
                <Button variant="outlined" onClick={() => setModalProductFormVisible(true)}>
                    Create new product
                </Button>
            </Paper>
            <FormControl
                margin='dense'
                sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row'
                }}
            >
                <InputLabel>Category</InputLabel>
                <Select
                    value={curCategoryId}
                    label="Category"
                    onChange={e => setCurCategoryId(e.target.value)}
                    renderValue={curCatId => getCategory(curCatId)!.name}
                    sx={{ flex: '1 0 auto' }}
                >
                    {categories.map(cat => (
                        <MenuItem
                            value={cat.id}
                            key={cat.id}
                        >
                            <ListItemText primary={cat.name} />
                            <IconButton onClick={e => onCategoryUpdate(e, cat.id)}>
                                <EditIcon />
                            </IconButton>
                            <IconButton onClick={e => onCategoryDelete(e, cat.id)}>
                                <Delete />
                            </IconButton>
                        </MenuItem>
                    ))}
                </Select>
                <Button onClick={onCategoryCreate}>
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
                visible={modalProductFormVisible}
                uploadProductFn={addProductFn}
                onClose={() => setModalProductFormVisible(false)}
            />
            <ModalFormCategory
                visible={modalCategoryFormVisible}
                uploadCategoryFn={formCategoryData.current.uploadCategoryFn}
                category={formCategoryData.current.category}
                onClose={() => setModalCategoryFormVisible(false)}
            />
        </Box>
    )
}

export default Catalog;