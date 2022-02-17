import { Box, Button, Paper, TextField, SxProps, Theme } from "@mui/material";
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

    //**************** search by products *********************//
    const [searchLine, setSearchLine] = useState<string>('');

    //******************** form product ***********************//
    const [modalProductFormVisible, setModalProductFormVisible] = useState(false);

    function existId(id: string): boolean {
        return !!products.find(p => p.id === id);
    }

    //************* modal upload file products ****************//
    const [modalUploadProductsFileVisible, setModalUploadProductsFileVisible] = useState(false);

    //****************** selector categories ******************//
    const [curCatId, setCurCatId] = useState<string>('-1');

    const productsByCat = useMemo(() => {
        let productsByCat = getProductsByCat(curCatId);
        if (searchLine) {
            productsByCat = productsByCat.filter(p => p.id.includes(searchLine) || p.title.includes(searchLine));
        }
        return productsByCat;
    }, [curCatId, products, searchLine]);

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
        if (id === '-1') {
            return products;
        }
        return products.filter(p => p.category === id);
    }

    const buttonStyle: SxProps<Theme> = {
        margin: { xs: '0 0 5px 0', sm: '0 5px' },

        width: { xs: '100%', sm: 'fit-content' }
    }

    function downloadProductsCsv() {
        const blob = new Blob(['asd']);
        const url = URL.createObjectURL(blob);
        

    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '1 0 auto', width: '100%' }}>
            <Paper
                sx={{
                    margin: '10px 0',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexDirection: { xs: 'column', sm: 'row' }
                }}
            >
                <Box>
                    <Button
                        sx={buttonStyle}
                        variant="outlined"
                        onClick={() => setModalProductFormVisible(true)}
                    >
                        Create new product
                    </Button>
                    <Button
                        sx={buttonStyle}
                        variant="outlined"
                        onClick={() => setModalUploadProductsFileVisible(true)}
                    >
                        Upload products from file
                    </Button>
                    <Button
                        sx={buttonStyle}
                        variant="outlined"
                        onClick={() => downloadProductsCsv()}
                    >
                        Download products as CSV
                    </Button>
                </Box>
                <TextField
                    value={searchLine}
                    label="Search"
                    variant="outlined"
                    type="text"
                    sx={{ width: { xs: '100%', sm: 'fit-content' } }}
                    onChange={e => setSearchLine(e.target.value)}
                />
            </Paper>
            <Categories
                categories={categories}
                activeCatId={curCatId}
                setCurCatId={setCurCatId}
            />
            <ProductListGrid
                products={productsByCat}
                existId={existId}
            />
            <ModalFormProduct
                visible={modalProductFormVisible}
                uploadProductFn={addProductFn}
                onClose={() => setModalProductFormVisible(false)}
                existId={existId}
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