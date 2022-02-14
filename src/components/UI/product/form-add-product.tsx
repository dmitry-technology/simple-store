import { Box, Button, FormControl, FormGroup, InputLabel, Select, TextField, SxProps, Theme, MenuItem, RadioGroup, FormControlLabel, Radio, FormLabel, Typography, TextareaAutosize, IconButton, List, ListItem, ListItemText, ListSubheader } from '@mui/material';
import { CSSProperties, FC, Fragment, useEffect, useRef, useState } from 'react';
import { Product, UploadProductData } from '../../../models/product';
import { Category } from '../../../models/category-type';
import { EditOptionData, ProductOption } from '../../../models/product-options';
import { Delete } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import FormOptionProduct from './form-option-product';

type FormAddProductProps = {
    uploadProduct: (uploadProductData: UploadProductData) => void;
    categories: Category[];
    defaultPicture: string;
    existId: (id: string) => Promise<boolean>;
    product?: Product;
}

const FormAddProduct: FC<FormAddProductProps> = (props) => {

    const { uploadProduct, categories, defaultPicture, existId, product } = props;

    const [id, setId] = useState<string>('');
    const [idEditable, setIdEditable] = useState<boolean>(true);
    const [title, setTitle] = useState<string>('');
    const [category, setCategory] = useState<string>(categories[0].id);
    const [basePrice, setBasePrice] = useState<number>(0);
    const [active, setActive] = useState<boolean>(true);
    const [previewPath, setPreviewPath] = useState<string>(defaultPicture);
    const [picture, setPicture] = useState<File>();
    const [description, setDescription] = useState<string>('');
    const [options, setOptions] = useState<ProductOption[]>([]);

    const [displayOptionForm, setDisplayOptionForm] = useState<boolean>(false);
    const optionEdit = useRef<EditOptionData>({ option: getClearOption() });

    const [idError, setIdError] = useState<string>('');
    const [priceError, setPriceError] = useState<string>('');

    const [flValid, setFlValid] = useState<boolean>(false);

    const [buttonSubmitName, setButtonSubmitName] = useState<string>('Add');

    useEffect(() => {
        if (product) {
            const newProduct = JSON.parse(JSON.stringify(product));
            setButtonSubmitName('Edit');
            const {id, title, category, basePrice, active, picture, description, options} = newProduct;
            setId(id);
            setIdEditable(false);
            setTitle(title);
            setCategory(category);
            setBasePrice(+basePrice);
            setActive(active);
            picture && setPreviewPath(picture);
            description && setDescription(description);
            options && setOptions(options);
        }
    }, []);

    useEffect(() => {
        validateData();
    }, [id, title, category, basePrice, picture, description, displayOptionForm]);

    function validateData() {
        const isValid = id && !idError &&
            title &&
            category &&
            basePrice && !priceError &&
            !displayOptionForm;
        setFlValid(!!isValid);
    }

    function idHandle(event: any) {
        const id = event.target.value;
        setId(id);
        setIdError(id < 1 ? 'id must be greater than 0' : '');
    }

    function priceHandle(event: any) {
        const price = +event.target.value;
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

    function createOption() {
        optionEdit.current = { option: getClearOption() };
        setDisplayOptionForm(true);
    }

    function addOption(optionData: EditOptionData) {
        if (optionData.index! >= 0) {
            options[optionData.index!] = optionData.option;
        } else {
            options.push(optionData.option);
        }
        setOptions([...options]);
    }

    function editOption(index: number) {
        optionEdit.current = { option: options[index], index: index };
        setDisplayOptionForm(true);
    }

    function removeOption(index: number) {
        options.splice(index, 1);
        setOptions([...options]);
    }

    async function onSubmit(event: any) {
        event.preventDefault();
        if (!product){
            const idIsExist = await existId(id.toString());
            if (idIsExist){
                setIdError('such id alredy exist');
                return;
            }
        }
        const newProduct: Product = { id: id.toString(), title, category, description, basePrice, active, options };
        if (product && product.picture) {
            newProduct.picture = product.picture;
        }
        await uploadProduct({product: newProduct, picture: picture as File});
    }

    function onReset() {
        setId('');
        setTitle('');
        setCategory(categories[0].id);
        setBasePrice(0);
        setActive(true);
        setPreviewPath(defaultPicture);
        setPicture(undefined);
        setDescription('');
        setOptions([]);
    }

    // Styles of form items

    const boxRowStyle: SxProps<Theme> = {
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: 'stretch',
        justifyContent: 'space-between'
    }

    const inputStyle: SxProps<Theme> = {
        width: { md: '47%' }
    }

    const boxPreviewStyle: SxProps<Theme> = {
        marginTop: '18px',
        marginBottom: '8px',
        display: 'flex',
        justifyContent: 'center',
        width: { md: '47%' }
    }

    const textAreaStyle: CSSProperties = {
        width: '100%',
        fontSize: '1.1rem'
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
            onReset={onReset}
            sx={{ width: '100%' }}
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
                        disabled={!idEditable}
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
                            onChange={e => setCategory(e.target.value)}
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
                <Box>
                    {!displayOptionForm
                        ? <Button
                            sx={{ width: '100%', margin: '10px 0' }}
                            variant='contained'
                            onClick={createOption}
                        >
                            Add option
                        </Button>
                        : <FormOptionProduct
                            addOption={addOption}
                            onClose={() => setDisplayOptionForm(false)}
                            optionData={optionEdit.current}
                        />
                    }
                </Box>
                {options.length > 0 && !displayOptionForm &&
                    <List subheader={<ListSubheader component="div" sx={{ fontSize: '1.2rem' }}>Options:</ListSubheader>}>
                        {options.map((option, index) => (
                            <ListItem
                                key={index}
                                secondaryAction={
                                    <Fragment>
                                        <IconButton edge="end" aria-label="edit" onClick={() => editOption(index)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton edge="end" aria-label="delete" onClick={() => removeOption(index)}>
                                            <Delete />
                                        </IconButton>
                                    </Fragment>
                                }
                            >
                                <ListItemText primary={optionToString(option)} />
                            </ListItem>
                        ))}
                    </List>}
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
                        {buttonSubmitName}
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

function getClearOption(): ProductOption {
    return {
        optionTitle: '',
        optionData: [{ name: '', extraPay: 0 }, { name: '', extraPay: 0 }]
    }
}

function optionToString(option: ProductOption) {
    return `${option.optionTitle}: ${option.optionData.reduce((r, v) => {
        r += ` "${v.name}" = ${v.extraPay};`;
        return r;
    }, '')}`
}