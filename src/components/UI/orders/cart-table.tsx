import * as React from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ClearIcon from '@mui/icons-material/Clear';
import { ProductBatch, ProductConfigured } from '../../../models/product';
import { Avatar, TextField } from '@mui/material';
import storeConfig from '../../../config/store-config.json';
import { shoppingCartService } from '../../../config/servicesConfig';

function createData(batchId: string, product: ProductConfigured, count: number) {
    return {
        id: batchId,
        title: product.base.title,
        description: product.base.description,
        picture: product.base.picture,
        count: count,
        price: product.optionsConfigured.reduce((sum, option) =>
            sum + option.optionData.extraPay, product.base.basePrice) * count,
        options: product.optionsConfigured
    };
}

type RowProps = {
    row: ReturnType<typeof createData>,
    updateCartFn: () => void
}

const Row: React.FC<RowProps> = props => {

    const { row, updateCartFn } = props;
    const [open, setOpen] = React.useState(false);

    function removeItemHandler(event: any, batchId: string) {
        shoppingCartService.remove(batchId);
        updateCartFn();
    }

    function changeCountHandler(event: any, batchId: string) {
        const newCount = event.target.value as number;
        const batch = shoppingCartService.get(batchId);
        batch!.count = newCount;
        shoppingCartService.update(batchId, batch!);
        updateCartFn();
    }

    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    {row.options.length > 0 && <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                        title='Show options'
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>}
                </TableCell>
                <TableCell component="th" scope="row">
                    <Avatar src={!!row.picture ? row.picture :
                        `${window.location.origin}/${storeConfig.defaultPictureProductUrl}`}
                        sx={{ width: 80, height: 80 }} />&nbsp;{row.title}
                </TableCell>
                <TableCell align="center">{row.description}</TableCell>
                <TableCell align="right"><TextField
                    type='number'
                    size='small'
                    value={row.count}
                    sx={{ width: 70 }}
                    onChange={event => changeCountHandler(event, row.id)}
                />
                </TableCell>
                <TableCell align="right">{row.price}{storeConfig.currencySign}</TableCell>
                <TableCell>
                    <IconButton onClick={event => removeItemHandler(event, row.id)} title='Remove'>
                        <ClearIcon />
                    </IconButton>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant='body2' gutterBottom component="div">
                                <strong>Options</strong>
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>{row.options.map(option =>
                                        <TableCell key={row.title}>{option.optionTitle}</TableCell>)}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>{row.options.map(option =>
                                        <TableCell key={row.id}>{option.optionData.name}</TableCell>)}
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

const CartTable: React.FC<{ batches: ProductBatch[], updateCartFn: () => void }> = props => {

    const { batches, updateCartFn } = props;

    return (
        <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
                <TableHead>
                    <TableRow>
                        <TableCell />
                        <TableCell align='center'><strong>Title</strong></TableCell>
                        <TableCell align='center'><strong>Description</strong></TableCell>
                        <TableCell align='center'><strong>Count</strong></TableCell>
                        <TableCell align='center'><strong>Price</strong></TableCell>
                        <TableCell />
                    </TableRow>
                </TableHead>
                <TableBody>
                    {batches.sort((a,b) => a.id.localeCompare(b.id)).map((batch, index) =>
                        <Row key={index}
                            row={createData(batch.id, batch.productConfigured, batch.count)}
                            updateCartFn={updateCartFn} />)}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default CartTable;