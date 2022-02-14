import { FC, useEffect, useState } from 'react';
import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { ProductOption } from '../../../models/product-options';
import { UserData } from '../../../models/user-data';
import { useSelector } from 'react-redux';
import { userDataSelector } from '../../../redux/store';
import { ProductBatch } from '../../../models/product';

type OptionButtonsProps = {
    productOption: ProductOption,
    optionChangeFn: (optionTitle: string, newValue: string) => void,
    productBatch?: ProductBatch,
}

const OptionButtons: FC<OptionButtonsProps> = props => {

    const { productOption, optionChangeFn, productBatch } = props;
    const [value, setValue] = useState<string>(productOption.optionData[0].name);
    const userData: UserData = useSelector(userDataSelector);

    useEffect(() => {
        if (!!productBatch) {
            const optionConfiguration = productBatch?.productConfigured.optionsConfigured.find(opt => opt.optionTitle === productOption.optionTitle);
            if(!!optionConfiguration){
                setValue(optionConfiguration.optionData.name);
            }
        }
    }, [])

    function handleChange(event: any, newValue: string) {
        optionChangeFn(productOption.optionTitle, newValue);
        setValue(newValue);
    }

    return <Box sx={{ display: 'block', mb: 0.5 }}>
        <ToggleButtonGroup
            value={value}
            exclusive
            onChange={handleChange}
            size={'small'}
            sx={{ width: 255 }}
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