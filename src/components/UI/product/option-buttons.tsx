import { FC, useEffect, useState } from 'react';
import { Box, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { ProductOption } from '../../../models/product-options';
import { ProductBatch } from '../../../models/product';
import storeConfig from "../../../config/store-config.json"

type OptionButtonsProps = {
    productOption: ProductOption,
    optionChangeFn: (optionTitle: string, newValue: string) => void,
    productBatch?: ProductBatch,
}

const OptionButtons: FC<OptionButtonsProps> = props => {

    const { productOption, optionChangeFn, productBatch } = props;
    const [value, setValue] = useState<string>(productOption.optionData[0].name);

    useEffect(() => {
        if (!!productBatch) {
            const optionConfiguration = productBatch?.productConfigured.optionsConfigured.find(opt => opt.optionTitle === productOption.optionTitle);
            if(!!optionConfiguration){
                setValue(optionConfiguration.optionData.name);
            }
        }
    }, [])

    function handleChange(_: any, newValue: string) {
        if (newValue !== null) {
            optionChangeFn(productOption.optionTitle, newValue);
            setValue(newValue);
        } 
    }

    return <Box sx={{ display: 'block', width: '100%', paddingBottom: 1}}>
        <Typography variant="inherit" sx={{mb: 0.5}} >{productOption.optionTitle}:</Typography>
        <ToggleButtonGroup
            color='warning'
            value={value}
            exclusive
            onChange={handleChange}
            size={'small'}
            sx={{ width: '100%', height: '30px', border: `0.5px solid ${storeConfig.primaryColor}`}}
            title={productOption.optionTitle}
        >
            {productOption.optionData.map(option => <ToggleButton key={option.name} value={option.name}
                sx={{ width: '100%' }}>
                {option.name}
            </ToggleButton>)}
        </ToggleButtonGroup>
    </Box>
}

export default OptionButtons;