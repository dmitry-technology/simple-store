import { Box, Button, IconButton, TextField } from '@mui/material';
import { FC, useEffect, useRef, useState } from 'react';
import { EditOptionData, ProductOption } from '../../models/product-options';
import { Delete } from '@mui/icons-material';

type FormOptionProductProps = {
    addOption: (option: EditOptionData) => void;
    onClose: () => void;
    optionData: EditOptionData;
}

const FormOptionProduct: FC<FormOptionProductProps> = (props) => {

    const { addOption, onClose, optionData } = props;

    const [optionEdit, setOptionEdit] = useState<ProductOption>(optionData.option);
    const [buttonSubmitName, setButtonSubmitName] = useState<string>('Add');

    useEffect(() => {
        if (optionData.index! >= 0) {
            setButtonSubmitName('Edit');
        }
    }, []);

    const [flValidate, setFlValidate] = useState<boolean>(false);

    function validate() {
        const emptyItem = optionEdit.optionData.find(o => o.name === '' || o.extraPay < 0);
        const isValid = (optionEdit.optionTitle && !emptyItem) as boolean;
        setFlValidate(isValid);
        return isValid;
    }

    useEffect(() => {
        validate();
    }, [optionEdit]);

    function addItemOption() {
        optionEdit!.optionData.push({ name: '', extraPay: 0 });
        renderEditableOption();
    }

    function deleteItemOption(itemIndex: number) {
        optionEdit!.optionData.splice(itemIndex, 1);
        renderEditableOption();
    }

    function optionNameHandle(event: any) {
        optionEdit!.optionTitle = event.target.value;
        renderEditableOption();
    }

    function optionItemNameHandle(event: any, index: number) {
        optionEdit!.optionData[index].name = event.target.value;
        renderEditableOption();
    }

    function optionItemValueHandle(event: any, index: number) {
        optionEdit!.optionData[index].extraPay = +event.target.value;
        renderEditableOption();
    }

    function renderEditableOption() {
        setOptionEdit({ ...optionEdit } as ProductOption);
    }

    function addOptionHandle() {
        if (validate()) {
            optionData.option = optionEdit;
            addOption(optionData);
            onClose();
        }
    }

    return (
        <Box
            sx={{ border: '1px solid', padding: '10px', marginTop: '10px' }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                    value={optionEdit.optionTitle}
                    label="Option name"
                    variant="outlined"
                    type="text"
                    onChange={optionNameHandle}
                    sx={{ flex: '1 0 auto' }}
                    margin='dense'
                    required
                />
            </Box>
            {optionEdit.optionData.map((item, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', width: '95%', justifyContent: 'space-between' }}>
                        <TextField
                            value={item.name}
                            label="Option item name"
                            variant="outlined"
                            type="text"
                            onChange={e => optionItemNameHandle(e, index)}
                            sx={{ width: '45%' }}
                            margin='dense'
                            required
                        />
                        <TextField
                            value={item.extraPay}
                            label="Extra pay value"
                            variant="outlined"
                            type="number"
                            onChange={e => optionItemValueHandle(e, index)}
                            sx={{ width: '45%' }}
                            margin='dense'
                            required
                        />
                    </Box>
                    {index > 1 && <IconButton onClick={() => deleteItemOption(index)}>
                        <Delete />
                    </IconButton>}
                </Box>
            ))}
            <Box sx={{ margin: '10px 0' }}>
                <Button variant='outlined' sx={{ width: '100%' }} onClick={addItemOption}>
                    Add item
                </Button>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button onClick={addOptionHandle} variant='contained' disabled={!flValidate} sx={{ width: '45%' }}>
                    {buttonSubmitName}
                </Button>
                <Button variant='outlined' sx={{ width: '45%' }} onClick={onClose}>
                    Cancel
                </Button>
            </Box>
        </Box>
    );
};

export default FormOptionProduct;