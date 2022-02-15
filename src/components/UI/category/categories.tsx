import { Button, FormControl, IconButton, InputLabel, ListItemText, MenuItem, Select } from '@mui/material';
import { FC, Fragment, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Category } from '../../../models/category-type';
import { ConfirmationData, emptyConfirmationData } from '../../../models/common/confirmation-type';
import { addCategoryAction, removeCategoryAction, updateCategoryAction } from '../../../redux/actions';
import { Delete } from "@mui/icons-material"
import EditIcon from '@mui/icons-material/Edit';
import ModalFormCategory from './modal-form-category';
import DialogConfirm from '../common/dialog';


type CategoriesProps = {
    categories: Category[];
    setCurCatId: (id: string) => void;
    activeCatId: string;
}

type FormCategoryData = {
    uploadCategoryFn: (category: Category) => void;
    category?: Category;
}

const Categories: FC<CategoriesProps> = (props) => {

    const { categories, setCurCatId, activeCatId } = props;

    const dispatch = useDispatch();

    //******************** form category ***********************//
    const [modalCategoryFormVisible, setModalCategoryFormVisible] = useState(false);
    const formCategoryData = useRef<FormCategoryData>({ uploadCategoryFn: (category) => { } });

    //**************** dialog confirmation ********************//
    const confirmationData = useRef<ConfirmationData>(emptyConfirmationData);
    const [dialogVisible, setDialogVisible] = useState(false);

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
            confirmationData.current.message = `Do you want remove category "${category.name}"?
            If there are products in this category, they will be deleted!`;
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
            if (category.id === activeCatId && categories.length > 1) {
                const otherCategory = categories.find(c => c.id !== category.id);
                setCurCatId(otherCategory?.id || '');
            }
            await dispatch(removeCategoryAction(category.id));
        }
        setDialogVisible(false);
    }

    //****************** util ******************//
    function getCategory(id: string) {
        return categories.find(c => c.id === id);
    }

    return (
        <Fragment>
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
                    value={activeCatId}
                    label="Category"
                    onChange={e => setCurCatId(e.target.value)}
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
            <ModalFormCategory
                visible={modalCategoryFormVisible}
                uploadCategoryFn={formCategoryData.current.uploadCategoryFn}
                category={formCategoryData.current.category}
                onClose={() => setModalCategoryFormVisible(false)}
            />
            <DialogConfirm
                visible={dialogVisible}
                title={confirmationData.current.title}
                message={confirmationData.current.message}
                onClose={confirmationData.current.handle}
            />
        </Fragment>
    );
};

export default Categories;