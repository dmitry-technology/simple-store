import { Box, Button, FormControl, FormGroup, InputLabel, Select, TextField, SxProps, Theme, MenuItem, RadioGroup, FormControlLabel, Radio, FormLabel, Typography, TextareaAutosize } from '@mui/material';
import { CSSProperties, FC, useEffect, useState } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import fireApp from '../../config/firebase-config';
import { Product } from '../../models/product';
import { Category } from '../../models/category-type';
import { useDispatch } from 'react-redux';
import { uploadImageAction } from '../../redux/actions';

type FormAddProductProps = {
    uploadProductData: (product: Product) => void;
    categories: Category[];
}

const FormAddProduct: FC<FormAddProductProps> = (props) => {

    const { uploadProductData, categories } = props;

    const [id, setId] = useState<number>();
    const [name, setName] = useState<string>('');
    const [category, setCategory] = useState<string>('');
    const [price, setPrice] = useState<number>();
    const [active, setActive] = useState<number>(1);
    const [previewPath, setPreviewPath] = useState<string>('');
    const [picture, setPicture] = useState<string>('');
    const [description, setDescription] = useState<string>('');

    const [idError, setIdError] = useState<string>('');

    const [flValid, setFlValid] = useState<boolean>(false);

    useEffect(() => {
        const flValid = id && id > 0 &&
            name &&
            category &&
            price && price > 0 &&
            picture &&
            description;
        setFlValid(!!flValid);
    }, [id, name, category, price, picture, description]);

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

    async function onSubmit(event: any) {
        event.preventDefault();
    }

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
        >
            <FormGroup>
                <Box sx={boxRowStyle as any}>
                    <TextField
                        value={id}
                        label="Id"
                        variant="outlined"
                        type="number"
                        // error={!!hoursError}
                        // helperText={hoursError}
                        onChange={e => setId(+e.target.value)}
                        sx={inputStyle}
                        margin='normal'
                        required
                    />
                    <TextField
                        value={name}
                        label="Name"
                        variant="outlined"
                        type="text"
                        // error={!!hoursError}
                        // helperText={hoursError}
                        onChange={e => setName(e.target.value)}
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
                            onChange={e => setCategory(e.target.value)}
                            required
                        >
                            {categories.map(cat => (
                                <MenuItem value={cat.name} key={cat.name}>{cat.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        value={price}
                        label="Price"
                        variant="outlined"
                        type="number"
                        // error={!!hoursError}
                        // helperText={hoursError}
                        onChange={e => setPrice(+e.target.value)}
                        sx={inputStyle}
                        margin='normal'
                        required
                    />
                </Box>
                <Box sx={boxRowStyle as any}>
                    <Box sx={boxPreviewStyle}>
                        {/* <Typography>
                            Picture:
                        </Typography> */}
                        <img
                            style={{ width: '300px', height: '300px' }}
                            src={previewPath || 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e'}
                        />
                    </Box>
                    <TextField
                        // value={picture}
                        variant="outlined"
                        type="file"
                        // error={!!hoursError}
                        // helperText={hoursError}
                        onChange={pictureHandle}
                        sx={inputStyle}
                        margin='normal'
                        required
                    />
                </Box>
                <Box sx={boxRowStyle as any}>
                    <TextareaAutosize
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        aria-label="Description"
                        minRows={4}
                        placeholder="Description"
                        style={textAreaStyle}
                        required
                    />
                </Box>
                <Box sx={boxButtonStyle}>
                    <FormControl component="fieldset" fullWidth>
                        <FormLabel component="legend">Active:</FormLabel>
                        <RadioGroup
                            row
                            aria-label="active"
                            value={active}
                            onChange={e => setActive(+e.target.value)}
                        >
                            <FormControlLabel value={1} control={<Radio />} label={'yes'} key={1} />
                            <FormControlLabel value={0} control={<Radio />} label={'no'} key={0} />
                        </RadioGroup>
                    </FormControl>
                </Box>
                <Box sx={boxButtonStyle}>
                    <Button type='submit' variant='contained' sx={buttonStyle}>
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