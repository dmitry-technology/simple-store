import { FormControl, InputLabel, MenuItem, Paper, Select } from '@mui/material';
import { DataGrid, GridActionsCellItem, GridCellEditCommitParams, GridColDef, GridRowId, GridRowParams, GridRowsProp } from '@mui/x-data-grid';
import { FC, Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { getProductsListFields, ProductListFields } from '../../config/products-list-columns';
import { useMediaQuery } from "react-responsive";
import { Delete } from "@mui/icons-material"
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { emptyProduct, Product, UploadProductData } from '../../models/product';
import { useDispatch, useSelector } from 'react-redux';
import { Category } from '../../models/category-type';
import { categoriesSelector, productsSelector } from '../../redux/store';
import DialogConfirm from './common/dialog';
import { ConfirmationData, emptyConfirmationData } from '../../models/common/confirmation-type';
import { removeProductAction, updateProductAction } from '../../redux/actions';
import { ProductOption } from '../../models/product-options';
import ModalInfoProduct from './modal-info-product';
import ModalFormProduct from './modal-form-product';

const ProductListGrid: FC = () => {

    //**************** dialog confirmation ********************//
    const confirmationData = useRef<ConfirmationData>(emptyConfirmationData);
    const [dialogVisible, setDialogVisible] = useState(false);

    //******************** dialog modal ***********************//
    const productModal = useRef<Product>(emptyProduct);
    const [modalVisible, setModalVisible] = useState(false);

    //************************* redux *************************//
    const dispatch = useDispatch();
    const products: Product[] = useSelector(productsSelector);
    const categories: Category[] = useSelector(categoriesSelector);

    //****************** selector categories ******************//
    const [curCategory, setCurCategory] = useState<string>(categories[0].id.toString());


    //****************** dialog form update product ******************//
    const [modalFormVisible, setModaFormlVisible] = useState(false);
    const productEditable = useRef<Product>();

    //********************Mobile or desktop********************//
    const isMobile = useMediaQuery({ maxWidth: 600, orientation: 'portrait' });
    const isLaptop = useMediaQuery({ maxWidth: 900 });
    const mode = useMemo(() => getMode(), [isMobile, isLaptop]);

    function getMode(): string {
        if (isMobile) {
            return 'isMobile';
        }
        if (isLaptop) {
            return 'isLaptop'
        }
        return 'isDesktop';
    };

    //************************Data Grid*************************//
    //column data grid
    const [columns, setColumns] = useState<GridColDef[]>([]);

    useEffect(() => {
        setColumns(getFilteredColumns(getProductsListFields().get(mode) as ProductListFields[]));
    }, [mode, products]);

    function getFilteredColumns(fields: ProductListFields[]): any[] {
        return getColums().filter(column => fields.includes(column.field as any));
    }

    function getColums(): any[] {
        return [
            {
                field: "id",
                headerName: "ID",
                flex: 30, align: 'center',
                headerAlign: 'center'
            },
            {
                field: "title",
                headerName: "Product name",
                flex: 100,
                align: 'center',
                headerAlign: 'center',
                editable: true,
                preProcessEditCellProps: (params: any) => {
                    const title: string = params.props.value
                    const hasError = title.length < 1;
                    return { ...params.props, error: hasError };
                }
            },
            {
                field: "category",
                headerName: "Category",
                flex: 100, align: 'center',
                headerAlign: 'center'
            },
            {
                field: "basePrice",
                headerName: "Base price",
                flex: 30,
                align: 'center',
                headerAlign: 'center',
                editable: true,
                preProcessEditCellProps: (params: any) => {
                    const price: number = params.props.value
                    const hasError = price < 0;
                    return { ...params.props, error: hasError };
                }
            },
            {
                field: "options",
                headerName: "Options",
                flex: 200,
                align: 'center',
                headerAlign: 'center'
            },
            {
                field: "active",
                headerName: "Active",
                flex: 30,
                align: 'center',
                headerAlign: 'center',
                editable: true,
                type: 'boolean'
            },
            {
                field: "actions", type: 'actions', flex: 80, align: 'center', headerAlign: 'center',
                getActions: (params: GridRowParams) => {
                    return [
                        <GridActionsCellItem
                            icon={<VisibilityIcon />}
                            label="Show Details"
                            onClick={() => showProduct(params.id)}
                        />,
                        <GridActionsCellItem
                            icon={<EditIcon />}
                            label="Edit Product"
                            onClick={() => editProduct(params.id)}
                        />,
                        <GridActionsCellItem
                            icon={<Delete />}
                            label="Delete"
                            onClick={() => rmProduct(params.id)}
                        />
                    ]
                }
            }
        ];
    }

    //rows data gread
    const rows = useMemo(() => getRows(products), [products, curCategory, dialogVisible]);
    function getRows(products: Product[]): GridRowsProp {
        const filteredProducts = products.filter(p => p.category === curCategory);
        return filteredProducts.map(product => {
            return {
                ...product,
                options: getInfoOptions(product!.options as ProductOption[])
            }
        });
    }

    //**************************call back actions******************************//
    //remove
    function rmProduct(id: GridRowId) {
        confirmationData.current.title = `Remove product`;
        confirmationData.current.message = `Do you want remove product ID ${id}`;
        confirmationData.current.handle = handleRemove.bind(undefined, id.toString());
        setDialogVisible(true);
    }

    function handleRemove(id: string, status: boolean): void {
        if (status) {
            dispatch(removeProductAction(id));
        }
        setDialogVisible(false);
    }

    //show detail info
    async function showProduct(id: GridRowId) {
        const product = getProduct(id.toString());
        if (product) {
            productModal.current = product;
            setModalVisible(true);
        } else {
            console.log('product not find')
        }
    }

    //update
    function onCellEdit(params: GridCellEditCommitParams) {
        let { field, value, id } = params;
        const oldProduct = getProduct(id.toString());
        const oldValue = (oldProduct as any)[field];
        if (oldValue !== value) {
            const newProduct = { ...oldProduct, [field]: value };
            const uploadProductData: UploadProductData = { product: newProduct as Product };
            confirmationData.current.title = `Update product`;
            confirmationData.current.message = `Do you want update product with ID 
            ${oldProduct?.id}: old value ${oldValue} new value ${value}`;
            confirmationData.current.handle = handleUpdate.bind(undefined, uploadProductData);
            setDialogVisible(true);
        }
    }

    function onFormProductEdit(uploadProductData: UploadProductData) {
        const oldProductJson = JSON.stringify(getProduct(uploadProductData.product.id));
        const newProductJson = JSON.stringify(uploadProductData.product);
        if (oldProductJson !== newProductJson) {
            confirmationData.current.title = `Update product`;
            confirmationData.current.message = `Do you want update product with ID: ${uploadProductData.product.id}?`;
            confirmationData.current.handle = handleUpdate.bind(undefined, uploadProductData);
            setDialogVisible(true);
        }
    }

    function handleUpdate(uploadProductData: UploadProductData, status: boolean): void {
        if (status) {
            dispatch(updateProductAction(uploadProductData));
        }
        setDialogVisible(false);
    }

    function editProduct(id: GridRowId) {
        productEditable.current = getProduct(id.toString());
        setModaFormlVisible(true);
    }

    //*****************************Utils **********************************/

    function getInfoOptions(options: ProductOption[]): string {
        let res = '';
        if (options) {
            res = options.map((o, i) => `${i + 1}) ${o.optionTitle}:${o.optionData.reduce((r, v) => {
                r += ` "${v.name}" = ${v.extraPay};`
                return r;
            }, '')}`).join(' ');
        };
        return res;
    }

    function getProduct(id: string): Product | undefined {
        return products.find(product => product.id === id);
    }

    return (
        <Fragment>
            <FormControl margin='dense' sx={{ width: { xs: '100vw', sm: '95vw' } }}>
                <InputLabel>Category</InputLabel>
                <Select
                    value={curCategory}
                    label="Category"
                    onChange={e => setCurCategory(e.target.value)}
                    required
                >
                    {categories.map(cat => (
                        <MenuItem value={cat.id} key={cat.id}>{cat.name}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Paper
                sx={{
                    width: { xs: '100vw', sm: '95vw' },
                    flex: '1 0 auto',
                    '& .Mui-error': {
                        bgcolor: '#ff6262d4',
                        height: '100%'
                    }
                }}
            >
                <DataGrid columns={columns} rows={rows} onCellEditCommit={onCellEdit} />
            </Paper>
            <DialogConfirm
                visible={dialogVisible}
                title={confirmationData.current.title}
                message={confirmationData.current.message}
                onClose={confirmationData.current.handle}
            />
            <ModalInfoProduct
                product={productModal.current!}
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
            />
            <ModalFormProduct
                visible={modalFormVisible}
                uploadProductFn={onFormProductEdit}
                onClose={() => setModaFormlVisible(false)}
                product={productEditable.current}
            />
        </Fragment>
    );
};

export default ProductListGrid;