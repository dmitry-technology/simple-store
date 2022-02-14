import { Box, FormControl, FormGroup, TextField, FormLabel, RadioGroup, FormControlLabel, Radio, Button, SxProps, Theme } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { Category } from '../../../models/category-type';

type FormAddCategoryProps = {
    uploadCategoryFn: (category: Category) => void;
    category?: Category;
}


const FormAddCategory: FC<FormAddCategoryProps> = (props) => {

    const { uploadCategoryFn, category } = props;

    const [name, setName] = useState<string>('');
    const [sortOrder, setSortOrder] = useState<number>(10);
    const [active, setActive] = useState<boolean>(false);

    const [flValid, setFlValid] = useState<boolean>(false);

    const [buttonSubmitName, setButtonSubmitName] = useState<string>('Add');

    useEffect(() => {
        if (category) {
            const { name, sortOrder, active } = category;
            setName(name);
            setSortOrder(sortOrder);
            setActive(active);
            setButtonSubmitName('Edit');
        }
    }, []);

    useEffect(() => {
        validateData();
    }, [name, sortOrder]);

    function validateData() {
        const isValid = name &&
            !!sortOrder || sortOrder === 0;
        setFlValid(!!isValid);
        return isValid;
    }

    function onSubmit(event: any) {
        event.preventDefault();
        if (validateData()) {
            const newCategory = { name, sortOrder, active } as Category;
            if (category) {
                newCategory.id = category.id;
            }
            uploadCategoryFn(newCategory);
        }
    }

    function onReset() {
        setName('');
        setSortOrder(10);
        setActive(false);
    }

    const boxButtonStyle: SxProps<Theme> = {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '20px'
    }

    const buttonStyle: SxProps<Theme> = {
        border: '1px solid',
        width: '47%'
    }

    return (
        <Box
            component={'form'}
            onSubmit={onSubmit}
            onReset={onReset}
        >
            <FormGroup>
                <TextField
                    value={name}
                    label="Name"
                    variant="outlined"
                    type="text"
                    onChange={e => setName(e.target.value)}
                    margin='normal'
                    required
                />
                <TextField
                    value={sortOrder}
                    label="Order"
                    variant="outlined"
                    type="number"
                    onChange={e => setSortOrder(+e.target.value)}
                    margin='normal'
                    required
                />
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

export default FormAddCategory;