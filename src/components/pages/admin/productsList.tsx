import { Box, Paper, styled } from "@mui/material";
import { FC, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Delete } from "@mui/icons-material"
import { DataGrid, GridActionsCellItem, GridCellEditCommitParams, GridColDef, GridRowId, GridRowParams, GridRowsProp, GridValueFormatterParams } from "@mui/x-data-grid";
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useMediaQuery } from "react-responsive";
import { useDispatch, useSelector } from 'react-redux';
import { Product } from '../../../models/product';
import { productsSelector } from "../../../redux/store";
import { getProductsListFields, ProductListFields } from "../../../config/products-list-columns";
import { ConfirmationData, emptyConfirmationData } from "../../../models/common/confirmation-type";
import { Category } from '../../../models/category-type';
import { categoriesSelector } from '../../../redux/store';
import { ProductOption } from "../../../models/product-options";
import { productStore } from "../../../config/servicesConfig";
import DialogConfirm from "../../UI/common/dialog";
import ModalInfo from "../../UI/common/modal-info";
import { Subscription } from "rxjs";
import { setProducts } from "../../../redux/actions";


const ProductsList = () => {
    
    //*****************redux ****************************/
    const dispatch = useDispatch();
    const products: Product[] = useSelector(productsSelector);
    const categories: Category[] = useSelector(categoriesSelector);


    // /* dialog confirmation */
    const confirmationData = useRef<ConfirmationData>(emptyConfirmationData);
    const [dialogVisible, setdialogVisible] = useState(false);

    /* dialog modal */
    const textModal = useRef<string[]>(['']);
    const [modalVisible, setModalVisible] = useState(false);

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
    }, [mode]);

    function getFilteredColumns(fields: ProductListFields[]): any[] {
        return getColums().filter(column => fields.includes(column.field as any));
    }






    function getColums(): any[] {
        return [
            {
                field: "id", headerName: "Id order", flex: 30, align: 'center', headerAlign: 'center'
            },
            {
                field: "title", headerName: "Product", flex: 100, align: 'center', headerAlign: 'center'
            },
            {
                field: "category", headerName: "Category", flex: 100, align: 'center', headerAlign: 'center',
            },
            {
                field: "picture", headerName: "Picture", flex: 100, align: 'center', headerAlign: 'center'
            },
            {
                field: "basePrice", headerName: "Base price", flex: 30, align: 'center', headerAlign: 'center'
            },
            {
                field: "options", headerName: "options", flex: 200, align: 'center', headerAlign: 'center'
            },
            {
                field: "active", headerName: "active", flex: 30, align: 'center', headerAlign: 'center'
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
                        // <GridActionsCellItem
                        //   icon={<EditIcon />}
                        //   label="Edit Order"
                        //   onClick={() => editOrder(params.id)}
                        // />,
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
    const rows = useMemo(() => getRows(products), [products, dialogVisible]);
    function getRows(products: Product[]): GridRowsProp {
        return products.map(product => {
            return { ...product, category: getCategory(product.category)!.name, options: getInfoOptions(product!.options as ProductOption[]) }
        });
    }

    //**************************call back actions******************************//
    //remove
    function rmProduct(id: GridRowId) {
        console.log("remove order " + id);
        console.log(products);
        const product = getProduct(id.toString());
        console.log(product);
        if (!!product) {
            confirmationData.current.title = `remove product`;
            confirmationData.current.message = `Do you want remove product ID ${product?.id}`;
            confirmationData.current.handle = handleRemove.bind(undefined, id.toString());
            setdialogVisible(true);
        }
    }

    function handleRemove(id: string, status: boolean): void {
        if (status) {
            try {
                dispatch(productStore.remove(id));
            } catch (err) {
            }
        }
        setdialogVisible(false);
    }
    //show detail info
    async function showProduct(id: GridRowId) {
        const product = products.find(e => e.id === id);
        if (!!product) {
            textModal.current = getInfoProduct(product);
        } else {
            textModal.current = ["Not found"];
        }
        setModalVisible(true);
    }

    //update order
    function onCellEdit(params: GridCellEditCommitParams) {
        const id: string = params.id.toString();
        const oldProduct = getProduct(id);
        const newProduct = { ...oldProduct, [params.field]: params.value };
        if (oldProduct !== newProduct) {
            confirmationData.current.title = `update product`;
            confirmationData.current.message = `Do you want update product ID ${oldProduct?.id} old value ${(oldProduct as any)[params.field]} new value ${params.value}`;
            confirmationData.current.handle = handleUpdate.bind(undefined, newProduct as Product, id);
            setdialogVisible(true);
        }
    }

    function handleUpdate(product: Product, id: string, status: boolean): void {
        if (status) {
            try {
                dispatch(productStore.update(id, product));
            } catch (err) {

            }
        }
        setdialogVisible(false);
    }

    function editProduct(id: GridRowId) {
        console.log("edit order " + id);
        //TODO
    }
    //******************************************************************* */

    //*****************************Utils **********************************/

    function getInfoProduct(product: Product) {
        const title = !!product?.title ? `title: ${product?.title}. ` : ``;
        const category = !!product?.category ? `category: ${product?.category}. ` : ``;
        const picture = !!product?.picture ? `picture: ${product?.picture.substring(0, 20)}. ` : ``;
        const description = !!product?.description ? `description: ${product?.description}. ` : ``;
        const basePrice = !!product?.basePrice ? `base price: ${product?.basePrice}. ` : ``;
        const options = !!product?.options ? `options: ${product?.options}. ` : ``;
        const active = !!product?.active ? `active: ${product?.active}. ` : ``;

        return (title + category + picture + description + basePrice + options + active).split(".");
    }

    function getCategory(id: string): Category | undefined {
        return categories[categories.findIndex(categories => categories.id === id)];
    }
    function getInfoOptions(options: ProductOption[]): string | undefined {
        let res = ''
        options?.forEach(option => {
            res += `${option.optionTitle}=`;
            option.optionData.forEach(optionData => {
                res += `${optionData.name} `;
            });
        })
        return res;
    }

    function getProduct(id: string): Product | undefined {
        return products[products.findIndex(product => product.id === id)];
    }


    //******************************************************************* */

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Paper sx={{ width: { xs: '100vw', sm: '80vw' }, height: '80vh', marginTop: '2vh' }}>
                <DataGrid columns={columns} rows={rows} onCellEditCommit={onCellEdit} />
            </Paper>
            <DialogConfirm visible={dialogVisible} title={confirmationData.current.title} message={confirmationData.current.message} onClose={confirmationData.current.handle} />
            <ModalInfo title={"Detailed information about the product"} message={textModal.current} visible={modalVisible} callBack={() => setModalVisible(false)} />
        </Box>
    )
}

export default ProductsList