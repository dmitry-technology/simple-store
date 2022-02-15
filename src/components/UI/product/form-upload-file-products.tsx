import { Box, Button, FormControl, InputLabel, MenuItem, Select, SxProps, TextField, Theme } from '@mui/material';
import { FC, useState } from 'react';
import { productStore } from '../../../config/servicesConfig';
import { Category } from '../../../models/category-type';
import { Product } from '../../../models/product';

type Props = {
    categories: Category[];
    uploadFn: (file: File) => void;
    onClose: () => void;
}

const FormUploadFileProducts: FC<Props> = (props) => {

    const { categories, uploadFn, onClose } = props;

    const [category, setCategory] = useState<string>(categories[0].id);
    const [file, setFile] = useState<File>();

    const [flValid, setFlValid] = useState<boolean>(true);

    function fileHandle(event: any) {
        const file = event.target.files[0];
        if (file) {
            setFile(file);
        }
    }

    async function onSubmit(event: any) {
        event.preventDefault();
        const strArr = await getStrArrFromFile(file!);
        const headers = strArr[0].split(';');

        const rawProducts: any[] = [];

        const corruptedLines: number[] = [];

        for (let i = 1; i < strArr.length; i++) {
            const prodFieldsArr = strArr[i].split(';');
            if (prodFieldsArr.length === headers.length) {
                const rawProd: any = {};
                for (let j = 0; j < prodFieldsArr.length; j++) {
                    rawProd[headers[j]] = prodFieldsArr[j];
                }
                rawProd.basePrice = +rawProd.basePrice;
                rawProd.active = rawProd.active === 'true' ? true : false;
                rawProducts.push(rawProd);
            } else {
                corruptedLines.push(i + 1);
            }
        }

        console.log(rawProducts);
        console.log(corruptedLines);

    }

    function getStrArrFromFile(file: File): Promise<string[]> {
        return new Promise((resolve, reject) => {
            let reader = new FileReader();
            reader.readAsText(file);
            reader.onload = function () {
                if (reader.result) {
                    const rawStr = reader.result.toString();
                    const clearStr = rawStr.replaceAll(/[\r"]/g, '');
                    const strArr = clearStr.split('\n').filter(s => s.length > 0);
                    if (strArr.length < 2) {
                        reject('empty file');
                    }
                    resolve(strArr);
                } else {
                    reject('error reading file')
                }
            }
        });
    }

    // function getProductsFromCSV(file):Product[] {

    // }

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
        <Box
            component='form'
            onSubmit={onSubmit}
            sx={{ width: '100%' }}
        >
            <FormControl margin='normal' fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                    value={category}
                    label="Category"
                    onChange={e => setCategory(e.target.value)}
                    required
                >
                    {categories.map(cat => (
                        <MenuItem value={cat.id} key={cat.id}>{cat.name}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <TextField
                variant="outlined"
                type="file"
                onChange={fileHandle}
                margin='normal'
                fullWidth
            />
            <Box sx={boxButtonStyle}>
                <Button type='submit' variant='contained' disabled={!flValid} sx={buttonStyle}>
                    Upload
                </Button>
                <Button type='reset' sx={buttonStyle} onClick={onClose}>
                    Cancel
                </Button>
            </Box>
        </Box>
    );
};

export default FormUploadFileProducts;

const labelsInclude = true;
const withQuote = true;

function JSON2CSV(objArray: any) {
    let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    // console.log(array);

    let str = '';
    let line = '';

    // if (labelsInclude) {        
    //     if (withQuote) {
    //         for (let index in array[0]) {
    //             let value = index + "";
    //             line += '"' + value.replace(/"/g, '""') + '",';
    //         }
    //     } else {
    //         for (let index in array[0]) {
    //             line += index + ',';
    //         }
    //     }

    //     line = line.slice(0, -1);
    //     str += line + '\r\n';
    // }

    for (let i = 0; i < array.length; i++) {
        line = '';
        if (withQuote) {
            for (let index in array[i]) {
                let value = array[i][index] + "";
                line += '"' + value.replace(/"/g, '""') + '",';
            }
        } else {
            for (let index in array[i]) {
                line += array[i][index] + ',';
            }
        }

        line = line.slice(0, -1);
        str += line + '\r\n';
    }
    return str;
}