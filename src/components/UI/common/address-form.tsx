import { Box, TextField } from "@mui/material";
import React, { useEffect } from "react";
import { FC, useState } from "react";
import { DeliveryAddress, UserData } from "../../../models/user-data";

// Styles
const longfieldStyle = { width: '100%'};
const fieldStyle = { width: { xs: '100%', md: '33%'} };

const AddressForm: FC<{userData: UserData, callBack: Function}> = (props) => {

    const [address, setAddress] = useState<DeliveryAddress>({...props.userData.deliveryAddress!});
    const [addressError, setAddressError] = useState({street: '', house: ''});

    useEffect( () => {
        fillCheck();
        props.callBack(address);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [address] );

    function fillCheck() {
        const error = {...addressError};
        error.street = !!address.street ? '' : 'Specify the street';
        error.house  = !!address.house  ? '' : 'Specify the house number';
        setAddressError(error);
    }

    function fieldHandler(field: string, event: any) {
        setAddress({...address, [field]: event.target.value});
    }

    return (
        <React.Fragment>
            <Box sx={{margin: '0 20px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between'}}>

                {/* required fields */}
                <TextField label="Street"
                    value={address.street}
                    placeholder={`Specify the street`}
                    type={"text"}
                    error={!!addressError.street}
                    required
                    onChange={ event => fieldHandler('street', event) }
                    margin='normal'
                    sx={longfieldStyle}
                    helperText={addressError.street}>
                </TextField>
                <TextField label="House"
                    value={address.house}
                    placeholder={`Specify the house number`}
                    type={"text"}
                    error={!!addressError.house}
                    required
                    onChange={ event => fieldHandler('house', event) }
                    margin='normal'
                    sx={fieldStyle}
                    helperText={addressError.house}>
                </TextField>

                {/* additional fields */}
                <TextField label="Flat"
                    value={address.flat}
                    placeholder={`Enter the flat number`}
                    type={"text"}
                    margin='normal'
                    sx={fieldStyle}
                    onChange={ event => fieldHandler('flat', event) }>
                </TextField>
                <TextField label="Floor"
                    value={address.floor}
                    placeholder={`Enter the floor number`}
                    type={"text"}
                    sx={fieldStyle}
                    margin='normal'
                    onChange={ event => fieldHandler('floor', event) }>
                </TextField>
                <TextField label="Comment"
                    value={address.comment}
                    placeholder={`Leave a comment for the courier`}
                    helperText={'Leave a comment for the courier'}
                    type={"text"}
                    margin='normal'
                    sx={longfieldStyle}
                    onChange={ event => fieldHandler('comment', event) }>
                </TextField>
            </Box>
        </React.Fragment>
    );
}

export default AddressForm;