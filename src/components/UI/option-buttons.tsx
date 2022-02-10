import { FC, useState } from 'react';
import { Box, ToggleButtonGroup } from '@mui/material';
import { OptionData, ProductOption } from '../../models/product-options';

const OptionButtons: FC<ProductOption[]> = props => {

    const [value, setValue] = useState<OptionData>();

    function handleChange() {

    }

    return <Box>
        {props.map(prop => 
            <ToggleButtonGroup 
            value={value}
            exclusive
            onChange={handleChange}
            aria-label={prop.optionTitle}>

            </ToggleButtonGroup>)}
    </Box>
}

export default OptionButtons;