import { Box, Button, Paper } from "@mui/material";
import { FC, useMemo, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Category } from "../../../models/category-type";
import { Product, UploadProductData } from '../../../models/product';
import { addProductAction, uploadProductsCsvAction } from "../../../redux/actions";
import { categoriesSelector, productsSelector } from "../../../redux/store";
import ProductListGrid from "../../UI/product/product-list-grid";
import ModalFormProduct from "../../UI/product/modal-form-product";
import Categories from "../../UI/category/categories";
import ModalUploadFileProducts from "../../UI/product/modal-upload-file-products";

const Catalog: FC = () => {

    const products: Product[] = useSelector(productsSelector);
    const categories: Category[] = useSelector(categoriesSelector);

    //******************** form product ***********************//
    const [modalProductFormVisible, setModalProductFormVisible] = useState(false);

    //************* modal upload file products ****************//
    const [modalUploadProductsFileVisible, setModalUploadProductsFileVisible] = useState(false);

    //****************** selector categories ******************//
    const [curCatId, setCurCatId] = useState<string>(categories[0]?.id || '');

    const productsByCat = useMemo(() => getProductsByCat(curCatId), [curCatId, products]);

    const dispatch = useDispatch();

    async function addProductFn(uploadProductData: UploadProductData) {
        await dispatch(addProductAction(uploadProductData));
    }

    //******************* upload products from csv  ***********//
    async function uploadProductsFromCSV(file: File, catId: string) {
        await dispatch(uploadProductsCsvAction(file, catId));
        setModalUploadProductsFileVisible(false);
    }

    //*********************** utils **************************//
    function getProductsByCat(id: string) {
        return products.filter(p => p.category === id);
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '1 0 auto', width: '100%' }}>
            <Paper sx={{ margin: '10px 0', width: '100%' }}>
                <Button sx={{ margin: '10px' }} variant="outlined" onClick={() => setModalProductFormVisible(true)}>
                    Create new product
                </Button>
                <Button variant="outlined" onClick={() => setModalUploadProductsFileVisible(true)}>
                    Upload products from file
                </Button>
            </Paper>
            <Categories
                categories={categories}
                activeCatId={curCatId}
                setCurCatId={setCurCatId}
            />
            <ProductListGrid products={productsByCat} />
            <ModalFormProduct
                visible={modalProductFormVisible}
                uploadProductFn={addProductFn}
                onClose={() => setModalProductFormVisible(false)}
            />
            <ModalUploadFileProducts
                visible={modalUploadProductsFileVisible}
                onClose={() => setModalUploadProductsFileVisible(false)}
                uploadProductsFromCSV={uploadProductsFromCSV}
                categories={categories}
            />
        </Box>
    )
}

export default Catalog;