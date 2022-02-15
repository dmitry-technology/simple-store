import { Box, Button, FormControl, InputLabel, MenuItem, Select, SxProps, TextField, Theme } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { productStore } from '../../../config/servicesConfig';
import { Category } from '../../../models/category-type';
import { Product } from '../../../models/product';
import { OptionData, ProductOption } from '../../../models/product-options';

type Props = {
    categories: Category[];
    uploadFn: (file: File, catId: string) => void;
    onClose: () => void;
}

const FormUploadFileProducts: FC<Props> = (props) => {

    const { categories, uploadFn, onClose } = props;

    const [curCatId, setCurCatId] = useState<string>(categories[0].id);
    const [file, setFile] = useState<File>();

    const [flValid, setFlValid] = useState<boolean>(false);

    useEffect(() => {
        validate();
    }, [curCatId, file])

    function validate(): boolean {
        const isValid: boolean = (file &&
            file.type === 'application/vnd.ms-excel' &&
            categories.findIndex(c => c.id === curCatId) > -1) as boolean;
        setFlValid(isValid);
        return isValid;
    }

    function fileHandle(event: any) {
        const file = event.target.files[0];
        if (file) {
            setFile(file);
        }
    }

    async function onSubmit(event: any) {
        event.preventDefault();
        if (validate()) {
            uploadFn(file!, curCatId);
        }
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
        <Box
            component='form'
            onSubmit={onSubmit}
            sx={{ width: '100%' }}
        >
            <FormControl margin='normal' fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                    value={curCatId}
                    label="Category"
                    onChange={e => setCurCatId(e.target.value)}
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