import { FC } from 'react';
import { Box, ToggleButtonGroup } from '@mui/material';
import { ProductOptions } from '../../models/product-options';

const OptionButtons: FC<ProductOptions[]> = props => {

    return <Box>
        {props.map(prop => 
            <ToggleButtonGroup>
                
            </ToggleButtonGroup>)}
    </Box>
}

export default OptionButtons;