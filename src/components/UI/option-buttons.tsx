import { FC, useState } from 'react';
import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { ProductOption } from '../../models/product-options';

type OptionButtonsProps = {
    productOption: ProductOption,
    optionChangeFn: (optionTitle: string, newValue: string) => void
}

const OptionButtons: FC<OptionButtonsProps> = props => {

    const { productOption, optionChangeFn } = props;
    const [value, setValue] = useState<string>(productOption.optionData[0].name);

    function handleChange(event: any, newValue: string) {
        optionChangeFn(productOption.optionTitle, newValue);
        setValue(newValue);
    }

    return <Box sx={{display: 'block', mb: 0.5}}>
        <ToggleButtonGroup
            value={value}
            exclusive
            onChange={handleChange}
            size={'small'}
            sx={{ width: 255 }}
            title={productOption.optionTitle}
        >
            {productOption.optionData.map(option => <ToggleButton key={option.name} value={option.name} 
            sx={{width: '100%'}}>
                {option.name}
            </ToggleButton>)}
        </ToggleButtonGroup>
    </Box>
}

export default OptionButtons;