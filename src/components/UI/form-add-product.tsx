import { Box, Button, FormControl, FormGroup, InputLabel, Select, TextField, SxProps, Theme, MenuItem, RadioGroup, FormControlLabel, Radio, FormLabel, Typography, TextareaAutosize } from '@mui/material';
import { CSSProperties, FC, useEffect, useState } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import fireApp from '../../config/firebase-config';
import { Product } from '../../models/product';
import { Category } from '../../models/category-type';
import { useDispatch } from 'react-redux';

type FormAddProductProps = {
    uploadProductData: (product: Product, picture: File) => void;
    categories: Category[];
    defaultPicture: string;
    existId: (id: string) => Promise<boolean>;
}

const FormAddProduct: FC<FormAddProductProps> = (props) => {

    const { uploadProductData, categories, defaultPicture, existId } = props;

    const [id, setId] = useState<string>("0");
    const [title, setTitle] = useState<string>('');
    const [category, setCategory] = useState<number>(categories[0].id);
    const [basePrice, setBasePrice] = useState<number>(0);
    const [active, setActive] = useState<boolean>(true);
    const [previewPath, setPreviewPath] = useState<string>(defaultPicture);
    const [picture, setPicture] = useState<File>();
    const [description, setDescription] = useState<string>('');

    const [idError, setIdError] = useState<string>('');
    const [priceError, setPriceError] = useState<string>('');

    const [flValid, setFlValid] = useState<boolean>(false);

    useEffect(() => {
        validateData();
    }, [id, title, category, basePrice, picture, description]);

    function idHandle(event: any) {
        const id = event.target.value;
        setId(id);
        setIdError(id < 1 ? 'id must be greater than 0' : '');
    }

    function priceHandle(event: any) {
        const price = event.target.value;
        setBasePrice(price);
        setPriceError(price < 1 ? 'price must be greater than 0' : '');
    }

    function pictureHandle(event: any) {
        const pictureFile = event.target.files[0];
        if (pictureFile) {
            const reader = new FileReader();
            reader.onloadend = function () {
                setPreviewPath(reader.result as string);
            }
            reader.readAsDataURL(pictureFile);
            setPicture(pictureFile);
        }
    }

    function validateData() {
        const isValid = id && !idError &&
            title &&
            category &&
            basePrice && !priceError;
        setFlValid(!!isValid);
    }

    async function onSubmit(event: any) {
        event.preventDefault();
        const idIsExist = await existId(id);
        if (!idIsExist) {
            const product: Product = { id, title, category, description, basePrice, active };
            await uploadProductData(product, picture as File);
            onReset();
        } else {
            setIdError('such id alredy exist');
        }
    }

    function onReset() {
        setId("0");
        setTitle('');
        setCategory(categories[0].id);
        setBasePrice(0);
        setActive(true);
        setPreviewPath(defaultPicture);
        setPicture(undefined);
        setDescription('');
    }

    // Styles of form items
    const inputStyle: SxProps<Theme> = {
        width: { md: '28vw' }
    }

    const boxRowStyle: SxProps<Theme> = {
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: 'stretch',
        justifyContent: 'space-between',
        width: { xs: '95vw', md: '58vw' }
    }

    const boxPreviewStyle: SxProps<Theme> = {
        marginTop: '18px',
        marginBottom: '8px',
        display: 'flex',
        justifyContent: 'center',
        width: { md: '28vw' }
    }

    const textAreaStyle: CSSProperties = {
        width: '100%',
        fontSize: '1.1rem'
    }

    const boxButtonStyle: SxProps<Theme> = {
        display: 'flex',
        justifyContent: 'space-between',
        width: { xs: '95vw', md: '58vw' },
        marginTop: '20px'
    }

    const buttonStyle: SxProps<Theme> = {
        border: '1px solid',
        width: '45%'
    }

    return (
        <Box
            component='form'
            onSubmit={onSubmit}
            onReset={onReset}
        >
            <FormGroup>
                <Box sx={boxRowStyle as any}>
                    <TextField
                        value={id}
                        label="Id"
                        variant="outlined"
                        type="number"
                        error={!!idError}
                        helperText={idError}
                        onChange={idHandle}
                        sx={inputStyle}
                        margin='normal'
                        required
                    />
                    <TextField
                        value={title}
                        label="Name"
                        variant="outlined"
                        type="text"
                        onChange={e => setTitle(e.target.value)}
                        sx={inputStyle}
                        margin='normal'
                        required
                    />
                </Box>
                <Box sx={boxRowStyle as any}>
                    <FormControl sx={inputStyle} margin='normal'>
                        <InputLabel>Category</InputLabel>
                        <Select
                            value={category}
                            label="Category"
                            onChange={e => setCategory(+e.target.value)}
                            required
                        >
                            {categories.map(cat => (
                                <MenuItem value={cat.id} key={cat.id}>{cat.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        value={basePrice}
                        label="Price"
                        variant="outlined"
                        type="number"
                        error={!!priceError}
                        helperText={priceError}
                        onChange={priceHandle}
                        sx={inputStyle}
                        margin='normal'
                        required
                    />
                </Box>
                <Box sx={boxRowStyle as any}>
                    <Box sx={boxPreviewStyle}>
                        <img
                            style={{ width: '300px', height: '300px' }}
                            src={previewPath}
                        />
                    </Box>
                    <TextField
                        variant="outlined"
                        type="file"
                        onChange={pictureHandle}
                        sx={inputStyle}
                        margin='normal'
                    />
                </Box>
                <Box sx={boxRowStyle as any}>
                    <TextareaAutosize
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        aria-label="Description"
                        minRows={4}
                        placeholder="Description (not necessary)"
                        style={textAreaStyle}
                    />
                </Box>
                <Box sx={boxButtonStyle}>
                    <FormControl component="fieldset" fullWidth>
                        <FormLabel component="legend">Active:</FormLabel>
                        <RadioGroup
                            row
                            aria-label="active"
                            value={+active}
                            onChange={e => setActive(!!+e.target.value)}
                        >
                            <FormControlLabel value={1} control={<Radio />} label={'yes'} key={1} />
                            <FormControlLabel value={0} control={<Radio />} label={'no'} key={0} />
                        </RadioGroup>
                    </FormControl>
                </Box>
                <Box sx={boxButtonStyle}>
                    <Button type='submit' variant='contained' disabled={!flValid} sx={buttonStyle}>
                        Submit
                    </Button>
                    <Button type='reset' sx={buttonStyle}>
                        Reset
                    </Button>
                </Box>
            </FormGroup>
        </Box>
    );
};

export default FormAddProduct;