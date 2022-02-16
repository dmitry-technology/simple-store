import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import {FC} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DeliveryAddress, UserData } from '../../../models/user-data';
import { setUserData } from '../../../redux/actions';
import { userDataSelector } from '../../../redux/store';
import AddressForm from '../common/address-form';

type AddressConfirmationProps = {
    visible: boolean,
    onClose: (status: boolean) => void,
}

const AddressConfirmation: FC<AddressConfirmationProps> = props => {

    const {visible, onClose} = props;
    const userData: UserData = useSelector(userDataSelector);
    const dispatch = useDispatch();

    function changeAddressHandler(address: DeliveryAddress): void {
        const newUserData: UserData = {...userData, deliveryAddress: address};
        dispatch(setUserData(newUserData));
    }

    return <Dialog
    open={visible}
    onClose={()=>onClose(false)}
    aria-labelledby="responsive-dialog-title"
>
    <DialogTitle id="responsive-dialog-title">
        Address Confirmation
    </DialogTitle>
    <DialogContent>
        <AddressForm userData={userData} callBack={changeAddressHandler} />
    </DialogContent>
    <DialogActions>
        <Button color='warning' onClick={() => onClose(false)}>
            Back to Cart
        </Button>
        <Button color='warning' onClick={() => onClose(true)} autoFocus>
            Confirm
        </Button>
    </DialogActions>
</Dialog>
}

export default AddressConfirmation;