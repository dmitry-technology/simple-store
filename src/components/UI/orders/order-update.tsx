import { Box, Button, FormControl, IconButton, Modal, Paper } from '@mui/material';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Order } from '../../../models/order-type';
import { ProductBatch } from '../../../models/product';
import { updateOrderAction } from '../../../redux/actions';
import ProductCard from '../product/product-card';
import DeleteIcon from '@mui/icons-material/Delete';
import DialogConfirm from '../common/dialog';
import { ConfirmationData, emptyConfirmationData } from '../../../models/common/confirmation-type';
import SendIcon from '@mui/icons-material/Send';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import CloseIcon from '@mui/icons-material/Close';
import _ from 'lodash';

const FormUpdateOrder: FC<{ order: Order, visible: boolean, callBack: () => void }> = (props) => {
    const { order, visible, callBack } = props;
    const dispatch = useDispatch();
    const [isValid, setIsValid] = useState(false);
    const [dialogVisible, setdialogVisible] = useState(false);
    const confirmationData = React.useRef<ConfirmationData>(emptyConfirmationData);
    const [orderEditable, setOrderEditable] = useState<Order>(JSON.parse(JSON.stringify(order)));

    //* handler form confirmation */
    function onSumbitForm(event: any) {
        event.preventDefault();
        confirmationData.current.title = `update order`;
        confirmationData.current.message = `Do you want update order ${orderEditable.id}`;
        confirmationData.current.handle = handleUpdate.bind(undefined, orderEditable.id as string);
        setdialogVisible(true);
    }

    useEffect(() => {
        _.isEqual(orderEditable, order) ? setIsValid(false) : setIsValid(true);
    }, [orderEditable]);

    //reset form
    function resetForm() {
        setOrderEditable(JSON.parse(JSON.stringify(order)));
    }

    //* handler remove */
    function btnRemove(prod: ProductBatch) {
        const index = orderEditable.products.findIndex(e => e.productConfigured.base.id === prod.productConfigured.base.id);
        if (index >= 0) {
            confirmationData.current.title = `remove product`;
            confirmationData.current.message = `Do you want remove product ${order.products[index].productConfigured.base.title} from order`;
            confirmationData.current.handle = handleRemove.bind(undefined, index);
            setdialogVisible(true);
        }
    }
    //* remove product from current order */
    function handleRemove(index: number, status: boolean) {
        if (status) {
            orderEditable.products.splice(index, 1);
            setOrderEditable(JSON.parse(JSON.stringify(orderEditable)));
        }
        setdialogVisible(false);
    }
    //update collection Orders to bd
    function handleUpdate(index: string, status: boolean) {
        if (status) {
            dispatch(updateOrderAction(index, orderEditable));
            props.callBack();
        }
        setdialogVisible(false);
    }
    //handle update options
    function handlerUpdateOptions(productBatch: ProductBatch) {
        const index = orderEditable.products.findIndex(e => e.productConfigured.base.id === productBatch.productConfigured.base.id)
        if (index >= 0) {
            orderEditable.products.splice(index, 1, productBatch);
            setOrderEditable(JSON.parse(JSON.stringify(orderEditable)));
        }
    }
    //get updating order
    const productCards = useMemo(() => {
        return getProductCards();
    }, [orderEditable]);

    function getProductCards() {
        return orderEditable.products.map((prod, index) => {
            return <Box key={index} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'start', width: '300px' }}>
                <ProductCard
                    product={prod.productConfigured.base}
                    productBatch={prod}
                    updateOrderFn={handlerUpdateOptions}
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
                    <Button type="submit" color='warning' variant="contained" disabled={!isValid} startIcon={<SendIcon />} onClick={onSumbitForm} sx={{ m: 1 }}>Update</Button>
                    <Button type="reset" variant="outlined" color='warning' startIcon={<RestartAltIcon />} onClick={() => resetForm()} sx={{ m: 1 }}>Reset</Button>
                    <Button variant="outlined" color='warning' startIcon={<CloseIcon />} onClick={callBack} sx={{ m: 1 }}>close</Button>
                </FormControl>
                <DialogConfirm visible={dialogVisible} title={confirmationData.current.title} message={confirmationData.current.message} onClose={confirmationData.current.handle} />
            </Paper>
        </Modal>
    )
};

export default FormUpdateOrder;
