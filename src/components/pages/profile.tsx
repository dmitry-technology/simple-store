/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, TextField, Typography } from '@mui/material';
import { FC, Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DeliveryAddress, UserData } from '../../models/user-data';
import { setUserData, updateProfile } from '../../redux/actions';
import { userDataSelector } from '../../redux/store';
import { isEmailValid, isPhoneNumberValid } from '../../utils/common/validation-utils';
import AddressForm from '../UI/common/address-form';

// Styles
const fieldStyle = { width: { xs: '100%', md: '33%' }};

const Profile: FC = () => {

    const dispatch = useDispatch();
    const userData: UserData = useSelector(userDataSelector);
    const [profileError, setProfileError] = useState({name: '', email: '', phone: ''});
    const [isValid, setValid] = useState<boolean>(false);
    const [newUserData, setNewUserData] = useState<UserData>(userData)

    // Save data to Firestore if this is the first user login
    useEffect(() => { if (userData.isFirstLogin) dispatch(updateProfile(userData)) }, [dispatch, userData] )

    // Validate changes
    useEffect(() => validate(), [newUserData]);

    // Validation
    function validate() {
        const userNameValid: boolean = !!newUserData.name;
        const emailValid: boolean = isEmailValid(newUserData.email);
        const phoneValid: boolean = isPhoneNumberValid(newUserData.phoneNumber);
        const addressValid: boolean =  (!!newUserData.deliveryAddress?.street && !!newUserData.deliveryAddress?.house);
        const isFormValid = userNameValid && emailValid && phoneValid && addressValid;
        setValid(isFormValid && (JSON.stringify(userData) !== JSON.stringify(newUserData)) );
        setProfileError({
            name: userNameValid ? '' : 'Enter your name',
            email: emailValid ? '' : 'Incorrect email',
            phone: phoneValid ? '' : 'Invalid phone number'
        })
    }
    
    // Handlers (saving data to tmp object)
    function fieldHandler(field: string, event: any) {
        setProfileError({...profileError, [field]: ''});
        setNewUserData({...newUserData, [field]: event.target.value});
    }

    function addressHandler(address: DeliveryAddress) {
        setNewUserData({...newUserData, deliveryAddress: address});
    }

    // Update user profile
    function onSubmit(event: any) {
        event.preventDefault();
        dispatch(updateProfile(newUserData)); // Save data to Firestore
        dispatch(setUserData(newUserData)); // Update local UserData
        setValid(false); // Disable the Update button
    }

    return  <Fragment>
                <Box component="form" onSubmit={onSubmit} sx={{width: '100%'}}>
                        <Typography variant='h5' sx={{marginLeft: '20px;'}}>
                            Contact information
                        </Typography>
                        <Box sx={{margin: '0 20px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between'}}>
                            <TextField label="Name"
                                value={newUserData.name}
                                placeholder={`Enter your name`}
                                type={"text"}
                                error={!!profileError.name}
                                required
                                margin='normal'
                                onChange={ event => fieldHandler('name', event) }
                                sx={fieldStyle}
                                helperText={profileError.name}>
                            </TextField>
                            <TextField label="Email"
                                value={newUserData.email}
                                placeholder={`Enter your email-address`}
                                type={"email"}
                                error={!!profileError.email}
                                required
                                disabled
                                margin='normal'
                                onChange={ event => fieldHandler('email', event) }
                                sx={fieldStyle}
                                helperText={profileError.email}>
                            </TextField>
                            <TextField label="Phone"
                                value={newUserData.phoneNumber}
                                placeholder={`Enter your phone number`}
                                type={"text"}
                                error={!!profileError.phone}
                                required
                                margin='normal'
                                onChange={ event => fieldHandler('phoneNumber', event) }
                                sx={fieldStyle}
                                helperText={profileError.phone}>
                            </TextField>
                        </Box>
                    <Box sx={{ width: '100%' }}>
                        <Typography variant='h5' sx={{ marginLeft: '20px;' }}>
                            Delivery address
                        </Typography>
                        <AddressForm userData={userData} callBack={addressHandler} />
                    </Box>
                    <Box sx={{display: 'flex', justifyContent: 'right', margin: '0 20px'}}>
                        <Button type="submit" 
                                variant='contained'
                                color='warning'
                                sx={{width: {xs: '100%', md: '200px'}}} 
                                disabled={!isValid}>
                            Update
                        </Button>
                    </Box>
                </Box>
                
        </Fragment>;
}
 
export default Profile;