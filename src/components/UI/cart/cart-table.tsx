import * as React from 'react';
import { IconButton, Table, TableBody, TableCell, TableRow, TableContainer, TableHead, Paper, Avatar, Typography, Tooltip } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { ProductBatch, ProductConfigured } from '../../../models/product';
import storeConfig from '../../../config/store-config.json';
import CountSelector from '../product/count-selector';
import DialogConfirm from '../common/dialog';
import { ConfirmationData, emptyConfirmationData } from '../../../models/common/confirmation-type';
import { useDispatch, useSelector } from 'react-redux';
import { shoppingCartSelector } from '../../../redux/store';
import { removeBatchFromCartAction, updateBatchInCartAction } from '../../../redux/actions';
import { getBatchPrice } from '../../../utils/cart-utils';
import { useMediaQuery } from 'react-responsive';

function createData(batchId: string, product: ProductConfigured, count: number, price: number) {
    return {
        id: batchId,
        title: product.base.title,
        description: product.base.description,
        picture: product.base.picture,
        count: count,
        price: price,
        options: product.optionsConfigured
    };
}

type RowProps = {
    row: ReturnType<typeof createData>
}

const Row: React.FC<RowProps> = props => {

    const { row } = props;
    const confirmationData = React.useRef<ConfirmationData>(emptyConfirmationData);
    const [dialogVisible, setDialogVisible] = React.useState<boolean>(false);
    const shoppingCart: ProductBatch[] = useSelector(shoppingCartSelector);
    const dispatch = useDispatch();
    const isBigScreen = useMediaQuery({ query: "(min-width: 670px)" }, undefined, () => getRowData());

    function getRowData(): React.ReactFragment {

        return <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
            <TableCell sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <Tooltip title={row.title}>
                    <Avatar src={!!row.picture ? row.picture :
                        `${window.location.origin}/${storeConfig.defaultPictureProductUrl}`}
                        sx={{ width: 80, height: 80 }} />
                </Tooltip>
                {!isBigScreen && <Typography>{row.title}</Typography>}
            </TableCell>
            {isBigScreen && <TableCell align="center">
                <strong>{row.title}</strong><br />{row.description}<br />
                <i key={row.id}>{row.options
                    .map(o => `${o.optionTitle}: ${o.optionData.name}`)
                    .join('; ')}</i>
            </TableCell>}
            <TableCell align="center">
                <CountSelector handlerFunc={changeCountHandler.bind(undefined, row.id)}
                    value={row.count} />
            </TableCell>
            <TableCell align="center">{row.price}{storeConfig.currencySign}</TableCell>
            <TableCell>
                <Tooltip title='Remove'>
                    <IconButton onClick={event => removeItemHandler(event, row.id, row.title)}>
                        <ClearIcon />
                    </IconButton>
                </Tooltip>
            </TableCell>
        </TableRow>
    }

    function removeItemHandler(event: any, batchId: string, productName: string) {
        confirmationData.current.title = "Remove from Shopping Cart";
        confirmationData.current.message = `Remove '${productName}' from shopping cart?`;
        confirmationData.current.handle = removeBatchFn.bind(undefined, batchId);
        setDialogVisible(true);
    }

    function removeBatchFn(batchId: string, status: boolean) {
        if (status) {
            dispatch(removeBatchFromCartAction(batchId));
        }
        setDialogVisible(false);
    }

    function changeCountHandler(batchId: string, newCount: number) {
        const batch = shoppingCart.find(b => b.id === batchId);
        batch!.count = newCount;
        dispatch(updateBatchInCartAction(batchId, batch!));
    }

    return (
        <React.Fragment>
            <DialogConfirm visible={dialogVisible}
                title={confirmationData.current.title}
                message={confirmationData.current.message}
                onClose={confirmationData.current.handle} />
            {getRowData()}
        </React.Fragment>
    );
}

const CartTable: React.FC<{ batches: ProductBatch[] }> = props => {

    const { batches } = props;
    const isBigScreen = useMediaQuery({ query: "(min-width: 670px)" });

    return (
        <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
                <TableHead>
                    <TableRow>
                        <TableCell align='center'><strong>Product</strong></TableCell>
                        {isBigScreen && <TableCell align='center'><strong>Description</strong></TableCell>}
                        <TableCell align='center'><strong>Count</strong></TableCell>
                        <TableCell align='center'><strong>Price</strong></TableCell>
                        <TableCell />
                    </TableRow>
                </TableHead>
                <TableBody>
                    {batches.sort((a, b) => a.id.localeCompare(b.id)).map((batch, index) =>
                        <Row key={index}
                            row={createData(batch.id, batch.productConfigured, batch.count,
                                getBatchPrice(batch.id, batches))} />)}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default CartTable;