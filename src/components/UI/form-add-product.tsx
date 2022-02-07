import { Box, Button, FormControl, FormGroup, InputLabel, Select, TextField, SxProps, Theme, MenuItem, RadioGroup, FormControlLabel, Radio, FormLabel, Typography, TextareaAutosize } from '@mui/material';
import { CSSProperties, FC, useEffect, useState } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import fireApp from '../../config/firebase-config';
import { Product } from '../../models/product';
import { Category } from '../../models/category-type';

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
    const [picturePath, setPicturePath] = useState<string>('');
    const [description, setDescription] = useState<string>('');

    const [flValid, setFlValid] = useState<boolean>(false);


    useEffect(() => {
        console.log(picturePath);
    }, [picturePath]);

    function pictureHandle(event: any) {
        const pictureFile = event.target.files[0];
        if (pictureFile) {
            const reader = new FileReader();
            reader.onloadend = function () {
                setPicturePath(reader.result as string);
            }
            reader.readAsDataURL(pictureFile);
        }
    }

    function onChange(event: any) {
        const storage = getStorage(fireApp);

        console.log(event.target.files[0]);
        const file = event.target.files[0];
        const metadata = {
            contentType: 'image/jpeg'
        };

        // Upload file and metadata to the object 'images/mountains.jpg'
        const storageRef = ref(storage, 'images/' + file.name);
        const uploadTask = uploadBytesResumable(storageRef, file, metadata);

        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on('state_changed',
            (snapshot) => {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                }
            },
            (error) => {
                switch (error.code) {
                    case 'storage/unauthorized':
                        console.log('unauthorized');
                        // User doesn't have permission to access the object
                        break;
                    case 'storage/canceled':
                        console.log('canceled');
                        // User canceled the upload
                        break;
                    case 'storage/unknown':
                        console.log('unknown');
                        // Unknown error occurred, inspect error.serverResponse
                        break;
                }
            },
            () => {
                // Upload completed successfully, now we can get the download URL
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log('File available at', downloadURL);
                });
            }
        );
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
                            src={picturePath || 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e'}
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