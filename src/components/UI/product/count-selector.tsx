import { Box, IconButton, Typography } from '@mui/material';
import React, { FC, useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

enum SelectorType {INCREASE, DECREASE}

const CountSelector: FC<{handlerFunc: Function}> = (props) => {

    const [count, setCount] = useState<number>(1);

    useEffect( () => {
        props.handlerFunc(count);
    }, [count, props] )

    function handleChanges(_: any, type: SelectorType) {
        const newValue = type === SelectorType.INCREASE ? count + 1 : count - 1;
        if (newValue >= 1) { 
            setCount(newValue);
            props.handlerFunc(count)
        }
    }

    return (
        <React.Fragment>
            <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                <IconButton onClick={ _ => handleChanges(_, SelectorType.DECREASE)}><RemoveIcon /></IconButton>
                <Typography variant='h6' sx={{m: '0 5px 0 5px'}}>{count}</Typography>
                <IconButton onClick={ _ => handleChanges(_, SelectorType.INCREASE)}><AddIcon /></IconButton>
            </Box>
        </React.Fragment>
    );
};

export default CountSelector;