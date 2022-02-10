import { TextField } from "@mui/material";
import React from "react";
import { FC, useState } from "react";
import { DeliveryAddress, UserData } from "../../../models/user-data";

const AddressForm: FC<{userData: UserData, callBack: Function}> = (props) => {

    const [address, setAddress] = useState<DeliveryAddress>({...props.userData.deliveryAddress!});
    const [addressError, setAddressError] = useState({street: '', house: ''});

    function streetHandler(event: any) {
        address.street = event.target.value;
        setAddress({...address});
        !!address.street 
            ? setAddressError({...addressError, street: 'Specify the street'})
            : setAddressError({...addressError, street: ''})
    }

    function housetHandler(event: any) {
        address.house = event.target.value;
        setAddress({...address});
        !!address.house 
            ? setAddressError({...addressError, house: 'Specify the house number'})
            : setAddressError({...addressError, house: ''})
    }

    function flatHandler(event: any) {
        address.flat = event.target.value;
        setAddress({...address});
    }

    function floorHandler(event: any) {
        address.floor = event.target.value;
        setAddress({...address});
    }

    function commentHandler(event: any) {
        address.comment = event.target.value;
        setAddress({...address});
    }

    return (
        <React.Fragment>

            {/* required fields */}
            <TextField  label="Street" 
                        value={address.street} 
                        placeholder={`Specify the street`} 
                        type={"text"} 
                        error={!!addressError.street} 
                        required 
                        onChange={streetHandler} 
                        helperText={addressError.street}>
            </TextField>
            <TextField  label="House" 
                        value={address.house} 
                        placeholder={`Specify the house number`} 
                        type={"text"} 
                        error={!!addressError.house} 
                        required 
                        onChange={housetHandler} 
                        helperText={addressError.house}>
            </TextField>

            {/* additional fields */}
            <TextField  label="Flat" 
                        value={address.flat} 
                        placeholder={`Enter the flat number`} 
                        type={"text"} 
                        onChange={flatHandler}>
            </TextField>
            <TextField  label="Floor" 
                        value={address.floor} 
                        placeholder={`Enter the floor number`} 
                        type={"text"} 
                        onChange={floorHandler}>
            </TextField>
            <TextField  label="Comment" 
                        value={address.comment} 
                        placeholder={`Leave a comment for the courier`} 
                        type={"text"} 
                        onChange={commentHandler}>
            </TextField>
        </React.Fragment>
    );
}

export default AddressForm;