import { Box, FormGroup, TextField } from '@mui/material';
import { FC, useState } from 'react';

const FormAddCategory: FC = () => {

    const [name, setName] = useState<string>('');
    const [order, setOrder] = useState<number>(10);
    const [active, setActive] = useState<string>('');

    function onSubmit(event: any) {
        event.preventDefault();
    }

    return (
        <Box
            component={'form'}
            onSubmit={onSubmit}
        >
            <FormGroup>
                <TextField
                    value={name}
                    label="Name"
                    variant="outlined"
                    type="text"
                    // error={!!idError}
                    // helperText={idError}
                    onChange={e=>setName(e.target.value)}
                    // sx={inputStyle}
                    margin='normal'
                    required
                />
                <TextField
                    value={order}
                    label="Order"
                    variant="outlined"
                    type="number"
                    // error={!!idError}
                    // helperText={idError}
                    onChange={e=>setOrder(+e.target.value)}
                    // sx={inputStyle}
                    margin='normal'
                    required
                />
                <TextField
                    value={order}
                    label="Order"
                    variant="outlined"
                    type="number"
                    // error={!!idError}
                    // helperText={idError}
                    onChange={e=>setOrder(+e.target.value)}
                    // sx={inputStyle}
                    margin='normal'
                    required
                />
            </FormGroup>
        </Box>
    );
};

export default FormAddCategory;