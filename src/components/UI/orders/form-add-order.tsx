import { Box, Button, FormControl, List, ListItem, Modal, Paper, Typography } from '@mui/material';
import React, { FC, Fragment, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Order } from '../../../models/order-type';
import { Product, ProductBatch } from '../../../models/product';
import { UserData } from '../../../models/user-data';
import { updateOrder } from '../../../redux/actions';
import { ordersSelector, clientsSelector, productsSelector } from '../../../redux/store';
import ProductCard from '../product/product-card';

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

    //handler form
    function onSumbitForm(event: any) {
        event.preventDefault();
        dispatch(updateOrder(order!.id as string, order));
        props.callBack();
    }

    function resetForm() {
        //TODO
        console.log("reset form");
    }

    function handlerUpdateOrder(productBatch: ProductBatch) {
        const index = order.products.findIndex(e => e.productConfigured.base.id === productBatch.productConfigured.base.id)
        if (index >= 0) {
            order.products.splice(index, 1, productBatch);
            setIsValid(true);
        }
    }

    function getProductCarts(order: Order) {
        return order.products.map((prod, index) => <ProductCard
            key={index}
            product={prod.productConfigured.base}
            productBatch={prod}
            updateOrderFn={handlerUpdateOrder}
        />);
    }

    return (
        <Modal
            open={visible}
            onClose={callBack}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}
        >
            <Paper>
                <Box component='form' onSubmit={onSumbitForm} >
                    {getProductCarts(order)}
                </Box>
                {/* Control buttons */}
                <FormControl sx={{ display: 'flex', flexDirection: 'row' }}>
                    <Button type="submit" disabled={!isValid} onClick={onSumbitForm}>Submit</Button>
                    <Button type="reset" onClick={() => resetForm()}>Reset</Button>
                    <Button onClick={callBack}>close</Button>
                </FormControl>


            </Paper>
        </Modal>
    )
};

export default FormAddOrder;
