import { Box, Button, FormControl, IconButton, List, ListItem, Modal, Paper, Typography } from '@mui/material';
import React, { FC, Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Order } from '../../../models/order-type';
import { Product, ProductBatch } from '../../../models/product';
import { UserData } from '../../../models/user-data';
import { updateOrder } from '../../../redux/actions';
import { ordersSelector, clientsSelector, productsSelector } from '../../../redux/store';
import ProductCard from '../product/product-card';
import DeleteIcon from '@mui/icons-material/Delete';
import DialogConfirm from '../common/dialog';
import { ConfirmationData, emptyConfirmationData } from '../../../models/common/confirmation-type';
import SendIcon from '@mui/icons-material/Send';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import CloseIcon from '@mui/icons-material/Close';


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

const FormAddOrder: FC<{ order: Order, visible: boolean, callBack: () => void }> = (props) => {
    const { order, visible, callBack } = props;
    const dispatch = useDispatch();
    const [isValid, setIsValid] = useState(false);
    const [dialogVisible, setdialogVisible] = useState(false);
    const confirmationData = React.useRef<ConfirmationData>(emptyConfirmationData);
    const [orderEditable, setOrderEditable] = useState<Order>(JSON.parse(JSON.stringify(order)));

    // useEffect(() => order !== orderEditable ? setIsValid(true) : setIsValid(false));


    //handler form
    function onSumbitForm(event: any) {
        event.preventDefault();
        dispatch(updateOrder(orderEditable!.id as string, orderEditable));
        props.callBack();
    }

    function resetForm() {
        //TODO
        setOrderEditable(JSON.parse(JSON.stringify(order)));
        console.log("reset form");
    }

    //handler remove
    function btnRemove(prod: ProductBatch) {
        const index = orderEditable.products.findIndex(e => e === prod);
        if (index >= 0) {
            confirmationData.current.title = `remove product`;
            confirmationData.current.message = `Do you want remove product ${order.products[index].productConfigured.base.title} from order`;
            confirmationData.current.handle = handleRemove.bind(undefined, index);
            setdialogVisible(true);
        }
    }

    function handleRemove(index: number, status: boolean) {
        if (status) {
            orderEditable.products.splice(index, 1);
            setOrderEditable(JSON.parse(JSON.stringify(orderEditable)));
        }
        setdialogVisible(false);

    }

    function handlerUpdateOrder(productBatch: ProductBatch) {
        const index = orderEditable.products.findIndex(e => e.productConfigured.base.id === productBatch.productConfigured.base.id)
        if (index >= 0) {
            orderEditable.products.splice(index, 1, productBatch);
            setOrderEditable(JSON.parse(JSON.stringify(orderEditable)));
            setIsValid(true)
        }
    }
    const productCards = useMemo(() => {
        return getProductCards();
    }, [orderEditable]);

    function getProductCards() {
        // order !== orderEditable ? setIsValid(true) : setIsValid(false);

        // console.log(orderEditable);
        return orderEditable.products.map((prod, index) => {
            return <Box key={index} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'start' }}>
                <ProductCard
                    product={prod.productConfigured.base}
                    productBatch={prod}
                    updateOrderFn={handlerUpdateOrder}
                />
                <IconButton aria-label="delete" onClick={() => btnRemove(prod)}>
                    <DeleteIcon />
                </IconButton>

            </Box>
        }
        );
    }




    return (
        <Modal
            open={visible}
            onClose={callBack}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            sx={{ overflow: 'scroll' }}
        >
            <Paper sx={{ display: 'flex', flexDirection: 'column', p: 3 }}>
                <Box component='form' onSubmit={onSumbitForm} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' }} >
                    {productCards}
                </Box>
                {/* Control buttons */}
                <FormControl sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                    <Button type="submit" disabled={!isValid} variant="outlined" startIcon={<SendIcon />} onClick={onSumbitForm} sx={{ m: 1 }}>Submit</Button>
                    {/* <Button type="reset" variant="outlined" startIcon={<RestartAltIcon />} onClick={() => resetForm()} sx={{ m: 1 }}>Reset</Button> */}
                    <Button variant="outlined" startIcon={<CloseIcon />} onClick={callBack} sx={{ m: 1 }}>close</Button>
                </FormControl>
                <DialogConfirm visible={dialogVisible} title={confirmationData.current.title} message={confirmationData.current.message} onClose={confirmationData.current.handle} />
            </Paper>
        </Modal>
    )
};

export default FormAddOrder;
