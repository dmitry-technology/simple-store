import { Box, Button, FormControl, List, ListItem, Modal, Paper, Typography } from '@mui/material';
import React, { FC, Fragment, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Order } from '../../../models/order-type';
import { Product } from '../../../models/product';
import { UserData } from '../../../models/user-data';
import { ordersSelector, clientsSelector, productsSelector } from '../../../redux/store';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};
const formStyle = { m: 2, minWidth: '80vh' };

const FormAddOrder: FC<{ orders: Order, visible: boolean, callBack: () => void }> = (props) => {

    //init store
    const dispatch = useDispatch();
    const [isValid, setIsValid] = useState("false");


    //handler form
    function onSumbitForm(event: any) {
        event.preventDefault();
        //TODO
        console.log("onSmb form");
        props.callBack();
    }

    function resetForm() {
        console.log("reset form");
        //TODO
    }

    return (
        <Modal
            open={props.visible}
            onClose={props.callBack}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            sx={{ display: 'flex', justifyContent: 'center' }}
        >
            <Paper>
                <Box component='form' onSubmit={onSumbitForm}>

                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        TODO
                    </Typography>

                    {/* Control buttons */}
                    <FormControl sx={formStyle}>
                        <Button type="submit" disabled={!isValid}>Submit</Button>
                        <Button type="reset" onClick={() => resetForm()}>Reset</Button>
                    </FormControl>
                </Box>
                <Button onClick={props.callBack}>close</Button>
            </Paper>
        </Modal>
    )
};

export default FormAddOrder;
